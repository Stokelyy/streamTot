import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=".env")

# Fetch environment variables
client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")

# Check if values are loaded (for debugging)
if not client_id or not client_secret:
    raise ValueError("Spotify credentials not found. Check your .env file!")

# Set up Spotify authentication
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET")
))

def get_artist_id(artist_name):
    """Fetch the Spotify ID of an artist."""
    results = sp.search(q=artist_name, type="artist", limit=1)
    if results["artists"]["items"]:
        return results["artists"]["items"][0]["id"]
    return None
