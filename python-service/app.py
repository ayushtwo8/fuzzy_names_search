from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from indicnlp.transliterate.unicode_transliterate import UnicodeIndicTransliterator
from rapidfuzz import fuzz
import jellyfish
from symspellpy import SymSpell
import re
from indic_transliteration import sanscript
from indic_transliteration.sanscript import SchemeMap, SCHEMES, transliterate
import speech_recognition as sr
from pydub import AudioSegment
import io
import tempfile
import os

app = Flask(__name__)
CORS(app)

nltk.download('punkt')

def is_devanagari(text):
    """Check if text contains Devanagari characters."""
    devanagari_pattern = re.compile(r'[\u0900-\u097F]+')
    return bool(devanagari_pattern.search(text))

def get_name_variations(name):
    """Generate variations of the name in both scripts and fuzzy variations."""
    variations = set()
    
    # Add original name
    variations.add(name)
    
    try:
        if is_devanagari(name):
            # If name is in Devanagari, add Roman transliteration
            roman = transliterate(name, sanscript.DEVANAGARI, sanscript.ITRANS)
            variations.add(roman)
            
            # Add HK and IAST transliterations
            variations.add(transliterate(name, sanscript.DEVANAGARI, sanscript.HK))
            variations.add(transliterate(name, sanscript.DEVANAGARI, sanscript.IAST))
            
            # Generate fuzzy variations for the Roman transliteration
            variations.update(generate_fuzzy_variations(roman))
        else:
            # If name is in Roman, add Devanagari transliteration
            devanagari = transliterate(name, sanscript.ITRANS, sanscript.DEVANAGARI)
            variations.add(devanagari)
            
            # Add other Roman script variations
            variations.add(transliterate(name, sanscript.ITRANS, sanscript.HK))
            variations.add(transliterate(name, sanscript.ITRANS, sanscript.IAST))
            
            # Generate fuzzy variations for the Roman input
            variations.update(generate_fuzzy_variations(name))
    except Exception as e:
        print(f"Error in transliteration: {e}")
    
    return list(variations)

def generate_fuzzy_variations(text):
    """Generate fuzzy variations of the input text."""
    variations = set()
    
    # Common character substitutions
    substitutions = {
        'a': ['e'],
        'i': ['e', 'y'],
        'e': ['i', 'a'],
        'o': ['u'],
        'u': ['o'],
        'v': ['w'],
        'w': ['v'],
        'ph': ['f'],
        'f': ['ph'],
        'k': ['c'],
        'c': ['k'],
        'sh': ['s'],
        's': ['sh'],
        'z': ['s'],
        'ee': ['i'],
        'oo': ['u']
    }
    
    # Generate variations with common substitutions
    for i in range(len(text)):
        char = text[i:i+2] if i < len(text)-1 else text[i]
        if char in substitutions:
            for substitute in substitutions[char]:
                variation = text[:i] + substitute + text[i+len(char):]
                if fuzz.ratio(text, variation) > 70:  # Only add if similarity is above 70%
                    variations.add(variation)
        
        # Single character substitutions
        if char[0] in substitutions:
            for substitute in substitutions[char[0]]:
                variation = text[:i] + substitute + text[i+1:]
                if fuzz.ratio(text, variation) > 70:
                    variations.add(variation)
    
    # Add variations with doubled consonants
    consonants = 'bcdfghjklmnpqrstvwxyz'
    for i in range(len(text)-1):
        if text[i] in consonants:
            variation = text[:i] + text[i] + text[i:]
            if fuzz.ratio(text, variation) > 70:
                variations.add(variation)
    
    # Add variations with removed double consonants
    for i in range(len(text)-1):
        if text[i] == text[i+1] and text[i] in consonants:
            variation = text[:i] + text[i+1:]
            if fuzz.ratio(text, variation) > 70:
                variations.add(variation)
    
    return variations

def generate_phonetic_codes(name):
    """Generate multiple phonetic codes for the name."""
    codes = set()
    
    # Generate variations first
    variations = get_name_variations(name)
    
    for variant in variations:
        if not is_devanagari(variant):
            # Add Metaphone code
            try:
                codes.add(jellyfish.metaphone(variant))
            except:
                pass
            
            # Add Soundex code
            try:
                codes.add(jellyfish.soundex(variant))
            except:
                pass
            
            # Add NYSIIS code
            try:
                codes.add(jellyfish.nysiis(variant))
            except:
                pass
    
    return list(codes)

def process_query_text(query):
    """Process a query text and return variations and phonetic codes."""
    try:
        variations = get_name_variations(query)        
        phonetic_codes = generate_phonetic_codes(query)
        
        if is_devanagari(query):
            devanagari_query = query
            romanized_query = variations[1] if len(variations) > 1 else query
        else:
            romanized_query = query
            devanagari_query = variations[1] if len(variations) > 1 else query

        return {
            'processedQuery': romanized_query,
            'devanagariQuery': devanagari_query,
            'phoneticCodes': phonetic_codes,
            'variations': variations
        }
    except Exception as e:
        raise Exception(f'Error processing query: {str(e)}')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/process_name', methods=['POST'])
def process_name():
    data = request.json
    name = data.get('name', '')

    try:
        variations = get_name_variations(name)
        
        if is_devanagari(name):
            devanagari_name = name
            romanized_name = variations[1] if len(variations) > 1 else ''
        else:
            romanized_name = name
            devanagari_name = variations[1] if len(variations) > 1 else ''
        
        phonetic_codes = generate_phonetic_codes(name)

        return jsonify({
            'romanizedName': romanized_name,
            'devanagariName': devanagari_name,
            'phoneticCodes': phonetic_codes,
            'variations': variations
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process_query', methods=['POST'])
def process_query():
    data = request.json
    query = data.get('query', '')
    try:
        result = process_query_text(query)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process_voice', methods=['POST'])
def process_voice():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        language = request.form.get('language', 'hi-IN') #default
        
        temp_dir = tempfile.mkdtemp()
        temp_input = os.path.join(temp_dir, 'input.webm')
        temp_wav = os.path.join(temp_dir, 'output.wav')
        
        try:
            audio_file.save(temp_input)
            audio = AudioSegment.from_file(temp_input)
            audio.export(temp_wav, format="wav")
            
            recognizer = sr.Recognizer()
            
            with sr.AudioFile(temp_wav) as source:
                recognizer.adjust_for_ambient_noise(source)
                audio_data = recognizer.record(source)
                text = recognizer.recognize_google(audio_data, language=language)
                processed_result = process_query_text(text)
                
                return jsonify({
                    'recognized_text': text,
                    'processed_result': processed_result
                })
                
        finally:
            try:
                os.remove(temp_input)
                os.remove(temp_wav)
                os.rmdir(temp_dir)
            except:
                pass
                
    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand audio'}), 400
    except sr.RequestError as e:
        return jsonify({'error': f'Speech recognition error: {str(e)}'}), 500
    except Exception as e:
        print(f"Error processing voice: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
