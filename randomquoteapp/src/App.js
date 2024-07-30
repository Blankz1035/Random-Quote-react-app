import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [selectedMode, setMode] = useState("random")
  const [imageSrc, setImageSrc] = useState(null);

  
  useEffect(() => {
    if (selectedMode !== "image"){
       fetchRandomQuote(); 
    }
    else{
        fetchImageQuote();
    }
  }, [selectedMode]);

  const fetchRandomQuote = async () => {
    try {
        const response = await fetch(`http://localhost:5000/quotes/${selectedMode}`);
        const data = await response.json();
        setQuote(data[0]);
    } catch (error) {
        console.log(error.message);
        setQuote("Oops. Looks like the quote didnt come back. Sorry about that. Please try again.");
    }

    setShowQuote(true);
  };

  const fetchImageQuote = async () => {
    try {
        const response = await fetch(`http://localhost:5000/quotes/${selectedMode}`);
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
    } catch (error) {
        console.log(error.message);
        alert("Quote with image couldnt be found. Don't lose hope. Try again in a minute.")
    }
    
        setShowQuote(true);
    };

  const handleModeChange = (mode) => {
    setShowQuote(false);
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
            {selectedMode === 'image' ? (
                    <img
                        className={`quote-image ${showQuote ? 'show' : 'hide'}`}
                        src={imageSrc} // Assuming the API returns an `imageURL` property for images
                        alt="Random Quote"
                    />
            ) : (
                <p className={`quote-text ${showQuote ? 'show' : 'hide'}`}>{quote.q}</p>
            )}
        </div>
        <small className='text-center'>
            API attribution to https://zenquotes.io/
        </small>
    </div>
  );
}

export default App;
