from datetime import datetime
import os
import threading
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import dotenv
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

# Load environment variables
dotenv.load_dotenv()

# API key and textbook paths
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
BACKEND_API_KEY = os.getenv("BACKEND_API_KEY")  
TEXTBOOKS = {
    "205": "/Users/umair/help-bot/backend/textbooks/textbook_205.pdf",
}

genai.configure(api_key=GEMINI_API_KEY)

# Store uploaded file IDs
uploaded_textbooks = {}


def upload_textbooks():
    """
    Uploads all textbooks to Gemini and updates the `uploaded_textbooks` dictionary.
    """
    global uploaded_textbooks
    for course, path in TEXTBOOKS.items():
        try:
            textbook = genai.upload_file(path)
            uploaded_textbooks[course] = textbook
            print(f"Uploaded textbook for course {course}: {textbook}")
        except Exception as e:
            print(f"Failed to upload textbook for course {course}: {e}")


# Schedule textbook uploads every 1.5 days
def schedule_uploads():
    scheduler = BackgroundScheduler()

    # Set next_run_time to the current time
    next_run_time = datetime.now()  # Current time as datetime

    # Add the upload job to the scheduler
    scheduler.add_job(upload_textbooks, "interval", days=1.5, next_run_time=next_run_time)

    scheduler.start()


# Prepare configuration
generation_config = {
    "temperature": 0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 32000,
    "response_mime_type": "text/plain",
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]


@app.route("/submit-prompt", methods=["POST"])
def submit_prompt():
    # Validate API key
    api_key = request.headers.get("x-api-key")
    if api_key != BACKEND_API_KEY:
        return jsonify({"error": "Invalid API key"}), 403

    data = request.json
    prompt = data.get("prompt")
    course = data.get("course")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    if course not in uploaded_textbooks:
        return jsonify({"error": "Textbook not available for the selected course"}), 404

    # Generate the response
    textbook = uploaded_textbooks[course]
    response = model.generate_content([textbook, prompt])

    return jsonify({"response": response.text, "course": course}), 200


if __name__ == "__main__":
    # Initial textbook upload
    upload_textbooks()
    # Schedule uploads
    threading.Thread(target=schedule_uploads, daemon=True).start()
    # Prepare Gemini model
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        safety_settings=safety_settings,
        generation_config=generation_config,
        system_instruction=(
            "You are an expert tutor. You know the knowledge in the textbook "
            "provided perfectly and teach effectively."
        ),
    )
    # Start Flask app
    app.run(debug=True, port=8000)
