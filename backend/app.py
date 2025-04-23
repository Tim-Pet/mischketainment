from flask import Flask, request
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin if frontend served separately
# UPLOAD_DIR = "/home/pi/uploads"
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    print("Request.files:", request.files)
    
    files = request.files.getlist("files")  # ✅ collect all uploaded files
    
    if not files or files[0].filename == '':
        return "No selected files", 400

    for file in files:
        path = os.path.join(UPLOAD_DIR, file.filename)
        file.save(path)

    return f"{len(files)} file(s) uploaded successfully", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3111)