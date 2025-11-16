import os
import base64
import io
import re
from flask import Flask, render_template, request, jsonify, Response, send_file
from dotenv import load_dotenv
from PIL import Image

import google.generativeai as genai

import settings

load_dotenv()

app = Flask(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable not set.")
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Error configuring Google AI: {e}")

LATEST_IMAGE_CACHE = {
    "bytes": None,
    "mime_type": "image/png"
}

try:
    model = genai.GenerativeModel(settings.MODEL_NAME)
    print(f"Successfully loaded model: {settings.MODEL_NAME}")
except Exception as e:
    print(f"Error initializing GenerativeModel: {e}")
    print("Please ensure the model name in settings.py is correct and you have access.")
    model = None


def call_gemini_api(captured_bytes, uploaded_bytes, final_prompt):
    global LATEST_IMAGE_CACHE
    if not model:
        return {"success": False, "error": "Model is not initialized. Check server logs."}
    
    print(f"--- Calling Gemini API (Model: {settings.MODEL_NAME}) ---")
    print(f"Prompt: {final_prompt}")

    try:

        request_content = []
        
        request_content.append(final_prompt)

        if captured_bytes:
            request_content.append("clicked iamge:")
            request_content.append({
                "mime_type": "image/jpeg",
                "data": captured_bytes
            })

        if uploaded_bytes:
            request_content.append("uploaded image:")
            request_content.append({
                "mime_type": "image/jpeg",
                "data": uploaded_bytes
            })

        print(f"Sending request with {len(request_content)} parts...")
        response = model.generate_content(request_content)

        if not response.candidates:
            return {"success": False, "error": "The model did not return any candidates."}

        if response.candidates[0].finish_reason != 1:
            return {"success": False, "error": f"Model finished with non-STOP reason: {response.candidates[0].finish_reason}"}

        generated_image_bytes = None
        generated_mime_type = "image/png"  
        
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                generated_image_bytes = part.inline_data.data
                generated_mime_type = part.inline_data.mime_type
                break
        
        if not generated_image_bytes:
            if response.candidates[0].content.parts and response.candidates[0].content.parts[0].text:
                return {"success": False, "error": f"Model returned text instead of an image: {response.candidates[0].content.parts[0].text}"}
            return {"success": False, "error": "No image data was found in the model's response."}

        LATEST_IMAGE_CACHE["bytes"] = generated_image_bytes
        LATEST_IMAGE_CACHE["mime_type"] = generated_mime_type

        img_base64 = base64.b64encode(generated_image_bytes).decode('utf-8')
        
        return {
            "success": True,
            "image_data": f"data:{generated_mime_type};base64,{img_base64}",
            "description": "Nano Banana has processed your request!"
        }

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {"success": False, "error": str(e)}


@app.route('/')
def index():
    return render_template(
        'index.html', 
        fun_prompts=settings.FUN_PROMPTS,
        top_left_icon=settings.TOP_LEFT_ICON,
        top_right_icon=settings.TOP_RIGHT_ICON
    )


@app.route('/api/process_image', methods=['POST'])
def process_image_api():
    if not model:
        return jsonify({"error": "Server model is not configured or failed to load. Check logs."}), 500

    try:
        data = request.get_json()
        
        captured_data_url = data.get('captured_image')
        uploaded_data_url = data.get('uploaded_image')
        user_prompt = data.get('prompt', '').strip()

        if not user_prompt:
             return jsonify({"error": "Prompt cannot be empty."}), 400

        def decode_image(data_url):
            try:
                header, encoded_data = data_url.split(',', 1)
                return base64.b64decode(encoded_data)
            except Exception as e:
                print(f"Error decoding image: {e}")
                return None

        captured_bytes = None
        uploaded_bytes = None

        if captured_data_url:
            captured_bytes = decode_image(captured_data_url)
            
        if uploaded_data_url:
            uploaded_bytes = decode_image(uploaded_data_url)

        if not captured_bytes and not uploaded_bytes:
            return jsonify({"error": "No valid images provided."}), 400

        final_prompt = f"{settings.PROMPT_PREFIX}{user_prompt}"

        result = call_gemini_api(captured_bytes, uploaded_bytes, final_prompt)

        if result["success"]:
            return jsonify({
                "processed_image": result["image_data"],
                "description": result["description"]
            })
        else:
            return jsonify({"error": f"Model processing failed: {result.get('error', 'Unknown error')}"}), 500

    except Exception as e:
        print(f"Unhandled error in /api/process_image: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500



@app.route('/mobile')
def mobile_view():
    return render_template('mobile_view.html')

@app.route('/serve_image')
def serve_image():
    if LATEST_IMAGE_CACHE["bytes"]:
        return send_file(
            io.BytesIO(LATEST_IMAGE_CACHE["bytes"]),
            mimetype=LATEST_IMAGE_CACHE["mime_type"],
            as_attachment=False
        )
    return "No image found in cache.", 404

@app.route('/download_image')
def download_image():
    if LATEST_IMAGE_CACHE["bytes"]:
        return send_file(
            io.BytesIO(LATEST_IMAGE_CACHE["bytes"]),
            mimetype=LATEST_IMAGE_CACHE["mime_type"],
            as_attachment=True,
            download_name="generated_image.png"
        )
    return "No image found in cache.", 404


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))