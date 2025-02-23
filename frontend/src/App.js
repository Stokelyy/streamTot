import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [input, setInput] = useState(""); // For the input field
  const [suggestions, setSuggestions] = useState([]); // For the suggestions
  const [artistStreams, setArtistStreams] = useState(null); // To hold the streams data
  const [isFocused, setIsFocused] = useState(false);
  // Handle input changes and fetch artist suggestions
  const handleInputChange = async (event) => {
    const searchQuery = event.target.value;
    setInput(searchQuery);
  
    if (searchQuery) {
      try {
        // Make sure this request matches the backend route and gets the correct response
        const response = await fetch(`http://localhost:5000/search-artists?query=${searchQuery}`);
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

    try {
      const response = await fetch(`http://localhost:5000/get-artist-streams?artist=${artistName}`);
      const data = await response.json();
      setArtistStreams(data); // Assuming the response returns the streams data
    } catch (error) {
      console.error("Error fetching artist streams:", error);
    }
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
      <button className="search-button" onClick={() => handleGetStreams(input)}>
        Get Streams
      </button>

      {/* Display Artist Stream Data */}
      {artistStreams && (
        <div className="stream-info">
          <h3>Artist Streams</h3>
          <p>Total Streams: {artistStreams.totalStreams?.totalStreams}</p>
        </div>
      )}
    </div>
  );
};

export default App;
