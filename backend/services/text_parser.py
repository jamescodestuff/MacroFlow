import re
from ingredient_parser import parse_ingredient


# Remove URLs, hashtags, @mentions, emojis, whitespace and normalize line breaks
def preprocess(text: str) -> str:
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[#@]\w+", "", text)
    text = re.sub(r"[^\x00-\x7F]+", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\r\n|\r", "\n", text)

    return text.strip()


INGREDIENT_HEADERS = re.compile(
    r"^(ingredients?|what you.?ll need|you.?ll need|shopping list)\s*:?\s*$",
    re.IGNORECASE,
)
STEP_HEADERS = re.compile(
    r"^(instructions?|directions?|steps?|method|how to make( it)?|preparation)\s*:?\s*$",
    re.IGNORECASE,
)


# split full text into ingredient and step
def detect_sections(lines: list[str]) -> dict | None:
    ingredient_start = None
    step_start = None

    for i, line in enumerate(lines):
        stripped = line.strip()
        if INGREDIENT_HEADERS.match(stripped):
            ingredient_start = i
        elif STEP_HEADERS.match(stripped):
            step_start = i

    if ingredient_start is None or step_start is None:
        return None

    if ingredient_start < step_start:
        ingredient_lines = lines[ingredient_start + 1 : step_start]
        step_lines = lines[step_start + 1 :]
    else:
        step_lines = lines[step_start + 1 : ingredient_start]
        ingredient_lines = lines[ingredient_start + 1 :]

    return {
        "ingredients": [l.strip() for l in ingredient_lines if l.strip()],
        "steps": [l.strip() for l in step_lines if l.strip()],
    }


# classifications
MEASUREMENT_PATTERN = re.compile(
    r"\b(\d+[\./]?\d*)\s*(cup|cups|tbsp|tsp|tablespoon|teaspoon|oz|ounce|lb|pound|g|gram|kg|ml|l|liter|litre|clove|cloves|slice|slices|can|cans|handful|pinch|bunch|piece|pieces)\b",
    re.IGNORECASE,
)
STEP_START_PATTERN = re.compile(
    r"^(step\s*\d+|^\d+[\.\)]\s)",
    re.IGNORECASE,
)


# When no section headers exist, classify each line as ingredient, step, or noise.
# Ingredients tend to be short lines with measurements.
# Steps tend to be longer sentences or start with a number/step keyword
def text_classify(lines: list[str]) -> dict:
    ingredients = []
    steps = []

    for line in lines:
        line = line.strip()
        if not line or len(line) < 3:
            continue

        word_count = len(line.split())

        if STEP_START_PATTERN.match(line):
            cleaned = re.sub(
                r"^(step\s*\d+[\.\:]?|\d+[\.\)])\s*", "", line, flags=re.IGNORECASE
            )
            steps.append(cleaned.strip())
        elif MEASUREMENT_PATTERN.search(line) and word_count <= 12:
            # Short line with a measurement → ingredient
            ingredients.append(line)
        elif word_count > 12:
            # Long line → likely a step
            steps.append(line)
        # else: noise, skip

    return {"ingredients": ingredients, "steps": steps}


# Run each ingredient through ingredient-parser-nlp and determine the average confidence score.
def confidence_scoring(ingredients: list[str]) -> tuple[list[str], float]:
    if not ingredients:
        return [], 0.0

    scores = []
    parsed_lines = []

    for line in ingredients:
        try:
            result = parse_ingredient(line)
            confidence = getattr(result, "confidence", None)
            if confidence is None:
                scores.append(0.5)  # neutral if unavailable
            else:
                if isinstance(confidence, dict):
                    scores.append(confidence.get("name", 0.5))
                else:
                    scores.append(float(confidence))
            parsed_lines.append(line)
        except Exception:
            scores.append(0.0)
            parsed_lines.append(line)

    avg = sum(scores) / len(scores) if scores else 0.0
    return parsed_lines, round(avg, 3)


# get Title, first non-empty line that isn't a section header.
def get_title(lines: list[str]) -> str:
    for line in lines:
        stripped = line.strip()
        if (
            stripped
            and not INGREDIENT_HEADERS.match(stripped)
            and not STEP_HEADERS.match(stripped)
        ):
            words = stripped.split()
            return "".join(words[:10])  #take first 10 words
    return "Untitled Recipe"


# must be above 70% threashold, can change if too strict
CONFIDENCE_THRESHOLD = 0.7


def parse_text(raw_text: str) -> dict:
    cleaned = preprocess(raw_text)
    lines = cleaned.split("\n")
    non_empty = [l for l in lines if l.strip()]

    title = get_title(non_empty)

    # Try section detection first, fall back to classifications if not work\
    sections = detect_sections(non_empty)
    if sections is None:
        sections = text_classify(non_empty)

    ingredients, confidence = confidence_scoring(sections["ingredients"])
    steps = sections["steps"]

    data = {
        "title": title,
        "ingredients": ingredients,
        "steps": steps,
        "image": None,
        "servings": None,
        "source_url": None,
    }

    if confidence >= CONFIDENCE_THRESHOLD:
        return {"source": "nlp", "data": data}
    else:
        return {
            "source": "nlp",
            "data": data,
            "low_confidence": True,
            "score": confidence,
        }
