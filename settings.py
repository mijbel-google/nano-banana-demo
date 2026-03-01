MODEL_NAME = "gemini-3.1-flash-image-preview"

PROMPT_PREFIX = "Generate the image based on following prompt while making sure Not to change the face of the person, and write 'Google Cloud' as watermark at the top left corner of the generated image: "

FUN_PROMPTS = [
    "Professional full-body shot of a smiling person in current attire at a Google office. Hands on sides, standing centered on a red circular sadu rug before a white glowing Arabic archway with Google-colored geometric patterns and blue English text 'Ramadan Kareem'. Bright, airy, shallow DOF. 90% blurred Google reception on the left wall, partially visible. Props: palm, lanterns, moon.",
    "Ramadan Nighttime rooftop lounge selfie in the current attire, high-rise view overlooking the ocean and city skyline, bokeh background. In the distant sky, a soft-focus drone white light show forms a crescent moon and the English text 'Ramadan Kareem'. Festive ramadan crowd in the lounge taking photos of the drone show in soft blur, warm decorative lighting.",
    "Ramadan portrait of you in current attire, standing poised in a bustling Kuwaiti Souq. Blurred background shows an Iftar communal table with rice dishes. Above, a canopy weaves Google colors into star patterns. Post-sunset with lanterns, and a distant old-style English banner: 'Ramadan Kareem.'",
    "Caricature of the person in current attire, joyfully riding Google bike, holding a T-shaped sign with the right hand only. The sign reads 'Celebrating Ramadan with Google' in English gold text on white board. Aerial, top-down perspective of a city, mirroring a clean vector graphic, muted earth tones and blues, incorporating the signature marker colors with no text.",
    "Ramadan-themed 1/7 scale full-body miniature figurine of you with exact features and attire, holding a gift box. Set inside a 3D traditional old-style Ramadan-themed sadu tent with tiny moons, dates, and tea sets. Soft, spiritual lighting creates a collectible toy aesthetic. On the side, a Google-themed gift bag with english text 'Ramadan Kareem.' No Google logos.",
    "1970s-style hand sketched monochrome comic illustration. You are a caricature seated in an armchair, meticulously cleaning an intricate antique lantern. The lantern’s pane emits a muted grey glow, lighting the dim room. Background filled with blurred retro artifacts including a frame with 'Ramadan Kareem' text on family portrait."
]

TOP_LEFT_ICON = {
    "filename": "images/Nano-banana.png",
    "alt_text": "Top Left Logo"
}
TOP_RIGHT_ICON = {
    "filename": "images/gcp.png",
    "alt_text": "Top Right Logo"
}
