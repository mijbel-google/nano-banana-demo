MODEL_NAME = "gemini-2.5-flash-image"

PROMPT_PREFIX = "Generate the image based on following prompt while making sure Not to change the face of the person, and write 'Google Cloud' as watermark at the top left corner of the generated image: "

FUN_PROMPTS = [
    "Inside a modern Kuwaiti Ghabga tent with traditional red Sadu patterns, glowing lanterns.",
    "On a glamorous rooftop overlooking the illuminated Kuwait Towers at night.",
    "In the vibrant Souq Al Mubarakiya during a festive Ramadan night, surrounded by traditional stalls.",
    "In the serene Kuwaiti desert at twilight, next to a beautifully lit modern Iftar table."
]

TOP_LEFT_ICON = {
    "filename": "images/Nano-banana.png",
    "alt_text": "Top Left Logo"
}
TOP_RIGHT_ICON = {
    "filename": "images/gcp.png",
    "alt_text": "Top Right Logo"
}
