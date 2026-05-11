MODEL_NAME = "gemini-3.1-flash-image-preview"

PROMPT_PREFIX = "Generate the image based on following prompt while making sure Not to change the face of the person, and write 'Google Cloud' as watermark at the top left corner of the generated image: "

FUN_PROMPTS = [
    "5x7 vintage postcard style Kuwait with faded colors and cursive 'Greetings from Google' text.",
    "Watercolor painting style with soft edges, paper texture, and vibrant splatters. 5x7 ratio.",
    "Professional CV headshot in a bright modern office with soft bokeh background. 7x5 ratio.",
    "2x2 photo booth, 7x5 ratio. 4 panels. Distinct corporate portraits, white background. Subject holds slate with chalk 'Best of Next'26 Kuwait'.",
    "Photo of a 1/7 scale figure on a round base. The monitor displays realistic 3D modeling with the model. Beside it, a figure box is visible, clearly labeled with the original art and 'Best of Next ’26 Kuwait'. 7x5 ratio."
]

TOP_LEFT_ICON = {
    "filename": "images/Nano-banana.png",
    "alt_text": "Top Left Logo"
}
TOP_RIGHT_ICON = {
    "filename": "images/gcp.png",
    "alt_text": "Top Right Logo"
}
