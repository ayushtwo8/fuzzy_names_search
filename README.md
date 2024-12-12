# Police Records Name Matching System

A comprehensive system for handling Hindi name variations in police records using fuzzy matching and NLP techniques.

## Features

- Fuzzy name matching with support for Hindi (Devanagari) and English scripts
- Phonetic matching for similar-sounding names
- Advanced search capabilities with multiple matching criteria
- Modern, responsive UI built with React and Tailwind CSS
- Secure API endpoints with Express.js
- MongoDB database for efficient data storage and retrieval
- Python-based NLP service for advanced name processing

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB
- npm or yarn
- pip

## Setup Instructions

### 1. MongoDB Setup
- Install MongoDB if not already installed
- Start MongoDB service
- The database will be created automatically when the server starts

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Python Service Setup
```bash
cd python-service
pip install -r requirements.txt
python app.py
```

### 4. Frontend Setup
```bash
cd client
npm install
npm start
```

## Usage

1. Access the web application at `http://localhost:3000`
2. Use the "Add New Record" page to add new name records
3. Use the "Search Names" page to search for records using fuzzy matching

## API Endpoints

- POST `/api/names` - Add a new name record
- GET `/api/names/search` - Search for names with fuzzy matching
- GET `/api/names` - Get all name records

## Python Service Endpoints

- POST `/process_name` - Process and transliterate names
- POST `/process_query` - Process search queries for matching

## Technologies Used

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- NLP Service: Python, Flask
- Libraries: NLTK, IndicNLP, RapidFuzz, Jellyfish, SymSpell
