import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [selectedMode, setMode] = useState("random")
  
  
  useEffect(() => {
      fetchRandomQuote();
  }, [selectedMode]);

  const fetchRandomQuote = async () => {
      const response = await fetch(`http://localhost:5000/quotes/${selectedMode}`);
      const data = await response.json();
      setQuote(data[0]);
      setShowQuote(true);
  };
  
  const handleModeChange = (mode) => {
    setMode(mode);
  };

  return (
    <div className="app-container">
            <div className="mode-container">
                <p className="mode-text">Set your Inspiration Mode</p>
                <div className="buttons-container">
                    <button
                        className={`mode-button ${selectedMode === 'random' ? 'selected' : ''}`}
                        onClick={() => handleModeChange('random')}
                    >
                        <span>Random</span>
                    </button>
                    <button
                        className={`mode-button ${selectedMode === 'today' ? 'selected' : ''}`}
                        onClick={() => handleModeChange('today')}
                    >
                        <span>Today's Quote</span>
                    </button>
                    <button
                        className={`mode-button ${selectedMode === 'image' ? 'selected' : ''}`}
                        onClick={() => handleModeChange('image')}
                    >
                        <span>Image and Quote</span>
                    </button>
                </div>
            </div>
            <div className="quote-container">
                <p className={`quote-text ${showQuote ? 'show' : ''}`}>{quote.q}</p>
            </div>
        </div>
  );
}

export default App;
