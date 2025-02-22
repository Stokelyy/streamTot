import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.getcwd(), 'backend', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Fetch environment variables
client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")

# Check if values are loaded (for debugging)
if not client_id or not client_secret:
    raise ValueError("Spotify credentials not found. Check your .env file!")

# Set up Spotify authentication
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
))

def get_artist_id(artist_name):
    """Fetch the Spotify ID of an artist."""
    results = sp.search(q=artist_name, type="artist", limit=1)
    if results["artists"]["items"]:
        return results["artists"]["items"][0]["id"]
    return None

def get_total_streams_for_artist(artist_name):
    artist_id = get_artist_id(artist_name)
    if not artist_id:
        return None

    total_streams = 0
    # Get the artist's albums and tracks
    albums = sp.artist_albums(artist_id, album_type='album', limit=50)
    for album in albums['items']:
        tracks = sp.album_tracks(album['id'])
        for track in tracks['items']:
            track_data = sp.track(track['id'])
            total_streams += track_data['popularity']  # Assuming "popularity" correlates with streams

    return total_streams

def search_artists(query):
    """Fetch artist suggestions based on a search query."""
    results = sp.search(q=query, type="artist", limit=5)
    
    # Sorting the results by popularity in descending order
    sorted_results = sorted(results["artists"]["items"], key=lambda artist: artist.get("popularity", 0), reverse=True)
    
    # Only return the artist names and ids
    artists = [{"id": artist["id"], "name": artist["name"]} for artist in sorted_results]
    
    return {"artists": {"items": artists}}
