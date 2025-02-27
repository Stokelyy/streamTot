import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [input, setInput] = useState(""); // For the input field
  const [suggestions, setSuggestions] = useState([]); // For the suggestions
  const [artistStreams, setArtistStreams] = useState(null); // To hold the streams data
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  // Handle input changes and fetch artist suggestions
  const handleInputChange = async (event) => {
    const searchQuery = event.target.value;
    setInput(searchQuery);
  
    if (searchQuery) {
      try {
        // Make sure this request matches the backend route and gets the correct response
        const response = await fetch(`http://3.133.127.141:5000/search-artists?query=${searchQuery}`);
        const data = await response.json();
  
        // Check if there are artist items in the response
        if (data.artists && data.artists.items) {
          setSuggestions(data.artists.items); // Update the suggestions state with the fetched artists
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions when input is empty
    }
  };
  

  // Handle selection of an artist from the dropdown
  const handleSelectArtist = (artist) => {
    setInput(artist.name); // Set the input to the artist's name
    setSuggestions([]); // Clear suggestions after selecting an artist
    handleGetStreams(artist.name); // Automatically fetch streams for the selected artist
  };

  // Handle when the input field loses focus
  const handleBlur = () => {
    if (!input) {
      setIsFocused(false); // Hide dropdown when input is empty
    }
  };

     // Handle focus event to show suggestions when input is focused
    const handleFocus = () => {
      setIsFocused(true);
    };

 // Function to get streams for the selected artist
 const handleGetStreams = async (artistName) => {
  if (!artistName) return;

  setLoading(true); // Start loading
  setError(null);
  setArtistStreams(null);

  try {
    const response = await fetch(`http://3.133.127.141:5000/get-artist-streams?artist=${artistName}`);
    const data = await response.json();

    if (response.ok) {
      setArtistStreams(data);
    } else {
      setError("Error fetching artist streams.");
    }
  } catch (error) {
    setError("Failed to fetch data. Please try again.");
    console.error("Error fetching artist streams:", error);
  }

  setLoading(false); // Stop loading
};

  return (
    <div className="app-container">
      <h1>Spotify Artist Stream Finder</h1>

      {/* Input Field */}
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onBlur={handleBlur}  // Detect when the input loses focus
          onFocus={handleFocus}  // Detect when the input gets focus
          placeholder="Enter artist name"
          className="input-field"
        />
      </div>

 {/* Suggestions Dropdown */}
{isFocused && suggestions.length > 0 && (
  <ul id="suggestions" className="suggestions-list">
    {suggestions.map((artist) => (
      <li
        key={artist.id}
        onClick={() => handleSelectArtist(artist)}
        className="suggestion-item" // Add a class here for individual list items if you need
      >
        {artist.name}
      </li>
    ))}
  </ul>
)}


      {/* Button to Get Artist Streams */}
      <button className="search-button" onClick={() => handleGetStreams(input)} disabled={loading}>
        {loading ? "Loading..." : "Get Popularity"}
      </button>

       {/* Loading Indicator */}
       {loading && <p className="loading-text">Fetching data... Please wait.</p>}

      {/* Error Message */}
      {error && <p className="error-text">{error}</p>}

      {/* Display Artist Stream Data */}
      {artistStreams && !loading && (
        <div className="stream-info">
          <h3>Artist Popularity</h3>
          <p>Total Artist Popularity: {artistStreams.totalStreams}</p>
          <p>Total Songs Considered: {artistStreams.totalSongs}</p> {/* Display total songs */}
        </div>
      )}

       {/* Loading Popup */}
       {loading && (
        <div className="loading-overlay">
          <div className="loading-popup">
            <div className="spinner"></div> {/* Spinner added here */}
              <p>Loading...</p>
            </div>
          </div>
        )}

    </div>
  );
};

export default App;
