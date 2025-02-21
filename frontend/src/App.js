import React, { useState } from "react";
import "./App.css"; // Assuming the CSS is in the App.css file

const App = () => {
  const [input, setInput] = useState(""); // For the input field
  const [suggestions, setSuggestions] = useState([]); // For the suggestions
  const [artistStreams, setArtistStreams] = useState(null); // To hold the streams data

  // Handle input changes and fetch artist suggestions
  const handleInputChange = async (event) => {
    const searchQuery = event.target.value;
    setInput(searchQuery);

    if (searchQuery) {
      // Call your backend or Spotify API to get artist suggestions
      try {
        const response = await fetch(`/search-artists?query=${searchQuery}`);
        const data = await response.json();
        setSuggestions(data.artists.items); // Assuming the API returns a list of artists
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle selection of an artist from the dropdown
  const handleSelectArtist = (artist) => {
    setInput(artist.name);
    setSuggestions([]); // Clear suggestions after selecting an artist
  };

  // Function to get streams for the selected artist
  const handleGetStreams = async () => {
    if (!input) return;

    try {
      const response = await fetch(`/get-artist-streams?artist=${input}`);
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
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter artist name"
        className="input-field"
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((artist) => (
            <li key={artist.id} onClick={() => handleSelectArtist(artist)}>
              {artist.name}
            </li>
          ))}
        </ul>
      )}

      {/* Button to Get Artist Streams */}
      <button className="search-button" onClick={handleGetStreams}>
        Get Streams
      </button>

      {/* Display Artist Stream Data */}
      {artistStreams && (
        <div className="stream-info">
          <h3>Artist Streams</h3>
          <p>Total Streams: {artistStreams.totalStreams}</p>
          <p>Album Count: {artistStreams.albumCount}</p>
          {/* You can add more stream details here */}
        </div>
      )}
    </div>
  );
};

export default App;
