# 🌙 Nano Banana Demo - Google Cloud Kuwait Events Edition ☁️

This is a customized version of the [Nano Banana Demo](https://github.com/pradeesi/nano-banana-demo), specifically tailored for a Google Cloud Kuwait customer events. 

## 📸 About the Project
This application is an AI-powered Photo Booth. Users snap a photo of themselves, select a customized prompt, and the AI alters their surroundings to match beautiful Kuwaiti themes while keeping the subjects perfectly intact. Powered by the modern `google.genai` SDK and Gemini 3.1 Flash Image Preview!

## ✨ Custom Features for this Event
* **Event Themed Prompts:** Specially crafted background-focused prompts to place users in settings that match the event theme.
* **Hardware Camera Toggle:** Added support to seamlessly switch between a Chromebook's built-in webcam and an external high-quality USB camera directly from the UI.
* **Mobile & Print Ready:** Users can scan a QR code to view their generated image on their phones or print it out as a keepsake.

## 💻 Local Development
To run this application locally for testing:
1. Clone this repository to your machine.
2. Create a virtual environment and install the dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
