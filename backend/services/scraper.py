from recipe_scrapers import scrape_me


def scrape_url(url: str):
    try:
        scraper = scrape_me(url)

        return {
            "title": scraper.title(),
            "ingredients": scraper.ingredients(),
            "steps": scraper.instructions_list(),
            "image": scraper.image(),
            # "servings": scraper.servings(), # not supported by all sites need manual testing later
        }
    except Exception as e:
        print(f"Scraper error: {e}")
        return None
