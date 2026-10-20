from flask import Flask, jsonify, request
from flask_cors import CORS
import yt_dlp


app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Hi, welcome to homepage"


@app.route("/api/searchVideo", methods=["GET"])
def search_video():
    videoUrl = request.args.get("videoUrl")
    if not videoUrl:
        return jsonify({
            "error": "Missing 'videoUrl' query parameter"
        }), 400

    browsers_to_try = [
        ('chrome', None, None, None),
        ('firefox', None, None, None),
        ('edge', None, None, None),
        ('brave', None, None, None)
    ]

    info = None

    for browser_tuple in browsers_to_try:
        try:
            ydl_opts = {
                "cookiesfrombrowser": browser_tuple,
                "skip_download": True
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.sanitize_info(ydl.extract_info(videoUrl, download=False))
                break
        except Exception:
            continue


    if not info:
        try: 
            ydl_opts = {"skip_download": True}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.sanitize_info(ydl.extract_info(videoUrl, download=False))
        except Exception as e:
            return jsonify({
                "error": f"Failed to fetch video: {str(e)}"
            }), 500

    print(info)

    return jsonify({
        "message": "Video details fetched successfully",
        "title": info.get("title"),
        "channelName": info.get("uploader"),
        "views": info.get("view_count"),
        "duration": info.get("duration"),
        "thumbnail": info.get("thumbnail"),
        "channelPhoto": info.get("channel_thumbnail") or info.get("uploader_thumbnail") 
    }), 200



if __name__ == "__main__":
    app.run(debug=True)

# click search btn
# fetch request to backend with video link in query params
# backend extract video url & returns video details
# Video details returned:
# 1. title
# 2. thumbnail
# 3. channel name
# 4. views
# 5. duration
