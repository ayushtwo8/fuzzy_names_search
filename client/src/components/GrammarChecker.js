import React, { useState } from 'react';
import TextAreaInput from './TextAreaInput';
import CorrectedText from './CorrectedText';
import axios from 'axios';

const GrammarChecker = () => {
    const [text, setText] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleCheckGrammar = async () => {
        setLoading(true);
        setResponse(null);
        setError(null);

        try {
            const result = await axios.post('http://localhost:5000/api/grammar-check', { text });
            setResponse(result.data);
        } catch (err) {
            setError('Failed to correct text. Please try again.');
        } finally { 
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Grammar Checker</h1>
            <TextAreaInput value={text} onChange={handleInputChange} />
            <button
                onClick={handleCheckGrammar}
                style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
                disabled={loading}
            >
                {loading ? 'Checking...' : 'Check Grammar'}
            </button>

            {response && <CorrectedText response={response} />}
            {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
        </div>
    );
};

export default GrammarChecker;
