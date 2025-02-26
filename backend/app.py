from flask import Flask, jsonify, request
from spotify import get_total_streams_for_artist, get_artist_id, search_artists
from flask_cors import CORS  # Import CORS
import time
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Route for searching artists
@app.route("/search-artists", methods=["GET"])
def search_artists_route():
    query = request.args.get("query", "")
    if query:
        try:
            # Call the search_artists function from spotify.py
            results = search_artists(query)  # This will handle the search and return sorted results
            return jsonify(results)  # Return the results as JSON
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "No query parameter provided"}), 400

# Route for getting artist's total streams
@app.route("/get-artist-streams")
def get_artist_streams():
    artist_name = request.args.get("artist", "")
    if artist_name:
        try:
            # Use the function from spotify.py to get total streams
            total_streams = get_total_streams_for_artist(artist_name)
            if total_streams is None:
                return jsonify({"error": "Artist not found or no streams available"}), 404
            
            return jsonify({
                "totalStreams": total_streams["totalStreams"],
                "totalSongs": total_streams["totalSongs"]
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "No artist parameter provided"}), 400


# Simple route to check if the backend is working
@app.route("/")
def home():
    return "Backend is working!"

if __name__ == "__main__":
     app.run(debug=True, host="0.0.0.0", port=5000)