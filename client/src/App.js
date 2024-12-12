import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NameSearch from './components/NameSearch';
import NameEntry from './components/NameEntry';
import GrammarChecker from './components/GrammarChecker';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<NameSearch />} />
            <Route path="/entry" element={<NameEntry />} />
            <Route path="/grammar-checker" element={<GrammarChecker />} /> {/* New Route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
