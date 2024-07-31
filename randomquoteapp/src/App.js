import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState('');
  const [quotelist, setQuoteList] = useState([]);
  const [quotesViewed, setQuotesViewed] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [selectedMode, setMode] = useState("quotes");
  const [imageSrc, setImageSrc] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (quotelist.length === 0) {
      fetchBlockQuotes(); // get list of quotes first.
    }
  }, []);

  useEffect(() => {
    if (requestCount === 5) {
      const timer = setTimeout(() => {
        setRequestCount(0);
      }, 30000); // reset after 30 seconds

      return () => clearTimeout(timer); // cleanup timeout
    }
  }, [requestCount]);

  // random quote and block
  const fetchBlockQuotes = async () => {
    console.log("block quote trigger");

    try {
      const response = await fetch(`http://localhost:5000/quotes/quotes`);
      const data = await response.json();
      setQuoteList(data);
      setQuote(data[0]);
    } catch (error) {
      console.log(error.message);
      setQuote({ q: "Oops. Looks like the quote didn't come back. Sorry about that. Please try again." });
    }

    setShowQuote(true);
  };

  // todays quote
  const fetchTodaysQuotes = async (mode) => {
    try {
      const response = await fetch(`http://localhost:5000/quotes/${mode}`);
      const data = await response.json();
      setQuote(data[0]);
    } catch (error) {
      console.log(error.message);
      setQuote({ q: "Quote couldn't be found. Don't lose hope. Try again in a minute." });
    }

    setShowQuote(true);
  };

  // random quote and block
  const fetchRandomQuote = async () => {
    // check for quotelist data.
    console.log(quotesViewed, quotelist.length);
    if (quotesViewed < 50) {
      // pick random from list.
      const index = Math.floor(Math.random() * quotelist.length);
      setQuote(quotelist[index]);

      // remove quote from the list:
      const updatedQuoteList = [...quotelist];
      updatedQuoteList.splice(index, 1);
      setQuoteList(updatedQuoteList);

      // update quotesViewed
      setQuotesViewed(quotesViewed + 1);

      // finally show the quote
      setShowQuote(true); // show the quote on screen.
      return;
    }

    try {
      fetchBlockQuotes();
      setQuotesViewed(0);
    } catch (error) {
      console.log(error.message);
      setQuote({ q: "Quote couldn't be found. Don't lose hope. Try again in a minute." });
    }
  };

  const fetchImageQuote = async (mode) => {
    try {
      const response = await fetch(`http://localhost:5000/quotes/${mode}`);
      const blob = await response.blob();
      if (blob.type === "application/json") {
        setQuote({ q: "Quote with image couldn't be found. Don't lose hope. Try again in a minute." });
        setImageSrc(null);
      } else {
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      }
    } catch (error) {
      console.log(error.message);
      setQuote({ q: "Quote with image couldn't be found. Don't lose hope. Try again in a minute." });
      setImageSrc(null);
    }

    setShowQuote(true);
  };

  const handleModeChange = (mode) => {
    setShowQuote(false); // remove quote view
    setMode(mode); // update mode for api

    if (mode === "today") {
      if (handleRequest(mode)) fetchTodaysQuotes(mode);
      return;
    }

    if (mode === "random") {
      fetchRandomQuote();
      return;
    }
    if (handleRequest(mode)) fetchImageQuote(mode);
  };

  const handleRequest = (mode) => {
    if (quotesViewed < 50 && mode === "random") {
      return true; // don't want to increment count as no request has been done.
    }
    if (requestCount < 5) {
      setRequestCount(requestCount + 1);
      return true;
    } else {
      alert('Please wait 30 seconds before making more requests.');
      return false;
    }
  };

  // Calculate progress bar color
  const progressBarClass = requestCount >= 4 ? 'danger' : (requestCount >= 3 ? 'warning' : '');

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
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${progressBarClass}`}
            style={{ width: `${requestCount * 20}%` }}
          />
        </div>
      </div>
      <div className="quote-container">
        {selectedMode === 'image' && imageSrc ? (
          <img
            className={`quote-image ${showQuote ? 'show' : 'hide'}`}
            src={imageSrc} // Assuming the API returns an `imageURL` property for images
            alt="Random Quote"
          />
        ) : (
          <p className={`quote-text ${showQuote ? 'show' : 'hide'}`}>
            {quote.q || "Oops. Looks like the quote didn't come back. Sorry about that. Please try again."}
          </p>
        )}
      </div>
      <small className='text-center'>
        API attribution to https://zenquotes.io/
      </small>
    </div>
  );
}

export default App;
