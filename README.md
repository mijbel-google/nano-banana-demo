# 🌙 Nano Banana Demo - Google Cloud Kuwait Ramadan Edition ☁️

This is a customized version of the [Nano Banana Demo](https://github.com/pradeesi/nano-banana-demo), specifically tailored for a Google Cloud Kuwait customer event and Ghabga during the holy month of Ramadan. 

## 📸 About the Project
This application is an AI-powered Photo Booth. Users snap a photo of themselves, select a customized prompt, and the AI alters their surroundings to match beautiful Ramadan and Kuwaiti themes while keeping the subjects perfectly intact. Powered by the modern `google.genai` SDK and Gemini 2.5 Pro!

## ✨ Custom Features for this Event
* **Ramadan & Ghabga Themed Prompts:** Specially crafted background-focused prompts to place users in traditional Ghabga tents, Souq Al Mubarakiya, or modern Kuwaiti tech lounges.
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
