MODEL_NAME = "gemini_model"

PROMPT_PREFIX = "Generate the image based on following prompt while making sure Not to change the face of the person, and write 'Google Cloud' as watermark at the top left corner of the generated image: "

FUN_PROMPTS = [
    "Put both of us on football stadium pitch ready for kick-off",
    "Show both of us as playing football on the surface of Mars",
    "I am Receiving a trophy from the football player"
]

TOP_LEFT_ICON = {
    "filename": "images/Nano-banana.png",
    "alt_text": "Top Left Logo"
}
TOP_RIGHT_ICON = {
    "filename": "images/gcp.png",
    "alt_text": "Top Right Logo"
}