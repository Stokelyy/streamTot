from flask import Flask, request, jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = Flask(__name__)

# Set up Spotify client
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id='your_client_id', client_secret='your_client_secret'))

@app.route('/search-artists', methods=['GET'])
def search_artists():
    query = request.args.get('query')
    if query:
        try:
            # Search for artists based on the query
            result = sp.search(q=query, type='artist', limit=5)
            artists = result['artists']['items']
            
            # Extract only relevant fields for display
            artist_suggestions = [
                {
                    'id': artist['id'],
                    'name': artist['name'],
                    'image': artist['images'][0]['url'] if artist['images'] else None
                }
                for artist in artists
            ]
            return jsonify({'artists': {'items': artist_suggestions}})
        except Exception as e:
            return jsonify({'error': f"Error fetching artists: {str(e)}"}), 500
    return jsonify({'error': 'No query provided'}), 400

@app.route('/get-artist-streams', methods=['GET'])
def get_artist_streams():
    artist_name = request.args.get('artist')
    if artist_name:
        try:
            # Search for the artist based on the name provided
            result = sp.search(q=artist_name, type='artist', limit=1)
            if result['artists']['items']:
                artist = result['artists']['items'][0]
                
                # Example data - Replace with actual Spotify data or custom data retrieval
                total_streams = 123456789  # This is just a placeholder, replace it with actual stream data
                album_count = 10  # This is a placeholder for the number of albums, replace as needed

                # Returning dummy stream data for the artist
                return jsonify({
                    'name': artist['name'],
                    'totalStreams': total_streams,
                    'albumCount': album_count
                })
            else:
                return jsonify({'error': 'Artist not found'}), 404
        except Exception as e:
            return jsonify({'error': f"Error fetching artist streams: {str(e)}"}), 500
    return jsonify({'error': 'No artist name provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)
