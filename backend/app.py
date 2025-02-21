from flask import Flask, request, jsonify
from spotify import get_artist_id, sp  # Import Spotify functions

app = Flask(__name__)

@app.route("/artist", methods=["GET"])
def artist():
    artist_name = request.args.get("name")
    if not artist_name:
        return jsonify({"error": "Missing artist name"}), 400

    artist_id = get_artist_id(artist_name)
    if not artist_id:
        return jsonify({"error": "Artist not found"}), 404

    return jsonify({"artist_id": artist_id})

if __name__ == "__main__":
    app.run(debug=True)
