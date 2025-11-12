from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import asyncio

sia = SentimentIntensityAnalyzer()

DISASTER_KEYWORDS = {
    "Flood": ["water", "flooding", "submerged", "drowning", "rain", "overflow", "swollen", "surge", "inundated", "deluge"],
    "Earthquake": ["shake", "tremor", "quake", "collapsed", "crack", "aftershock", "epicenter", "magnitude", "seismic"],
    "Fire": ["fire", "smoke", "burn", "flames", "evacuation", "blaze", "wildfire", "scorched", "inferno"],
    "Cyclone": ["wind", "storm", "cyclone", "gust", "uprooted", "damage", "hurricane", "typhoon", "tornado"],
    "Landslide": ["landslide", "mud", "rock", "avalanche", "debris", "slope", "erosion", "slippage"],
}

async def calculate_trust_score(
    reportId: str, 
    text: str, 
    photoUrl: str, 
    latitude: float, 
    longitude: float, 
    disasterType: str
) -> dict:
    """Calculate trust score combining multiple factors"""
    
    # 1. Sentiment Analysis (40%)
    sentiment_score = analyze_sentiment(text)
    
    # 2. Keyword Intensity (20%)
    keyword_score = calculate_keyword_intensity(text, disasterType)
    
    # 3. Location Proximity (25%)
    location_score = validate_location(latitude, longitude, disasterType)
    
    # 4. Image Authenticity (15%)
    image_score = 70 if photoUrl else 50
    
    # Calculate weighted average
    trust_score = int(
        (sentiment_score * 0.40) +
        (keyword_score * 0.20) +
        (location_score * 0.25) +
        (image_score * 0.15)
    )
    
    # Ensure score is within bounds
    trust_score = max(0, min(100, trust_score))
    
    # Determine trust tag
    if trust_score >= 75:
        trust_tag = "trusted"
    elif trust_score >= 50:
        trust_tag = "likely"
    elif trust_score >= 25:
        trust_tag = "suspicious"
    else:
        trust_tag = "fake"
    
    reasoning = (
        f"Sentiment: {sentiment_score}% | "
        f"Keywords: {keyword_score}% | "
        f"Location: {location_score}% | "
        f"Image: {image_score}%"
    )
    
    return {
        "reportId": reportId,
        "trustScore": trust_score,
        "trustTag": trust_tag,
        "scores": {
            "sentiment": sentiment_score,
            "keywordIntensity": keyword_score,
            "locationProximity": location_score,
            "imageAuthenticity": image_score
        },
        "reasoning": reasoning
    }

def analyze_sentiment(text: str) -> int:
    """VADER sentiment analysis: high negative = disaster language = higher score"""
    scores = sia.polarity_scores(text)
    compound = scores['compound']
    
    # Disaster reports typically have negative sentiment
    if compound < -0.3:
        # Strong negative sentiment (likely genuine disaster language)
        sentiment_score = 90 + (compound * 10)
    elif compound < -0.1:
        # Mild negative
        sentiment_score = 75
    elif compound > 0.1:
        # Positive sentiment is suspicious for disaster reports
        sentiment_score = 30
    else:
        # Neutral
        sentiment_score = 60
    
    return int(max(0, min(100, sentiment_score)))

def calculate_keyword_intensity(text: str, disaster_type: str) -> int:
    """Check for disaster-specific keywords"""
    keywords = DISASTER_KEYWORDS.get(disaster_type, [])
    text_lower = text.lower()
    
    if not keywords:
        return 50  # Default score if disaster type not recognized
    
    # Count keyword matches
    keyword_count = sum(1 for kw in keywords if kw in text_lower)
    
    # Calculate percentage of keywords found
    keyword_percentage = (keyword_count / len(keywords)) * 100
    
    # Boost score if multiple keywords found
    if keyword_count >= 3:
        keyword_score = min(100, keyword_percentage + 20)
    elif keyword_count >= 1:
        keyword_score = min(100, keyword_percentage + 10)
    else:
        keyword_score = 20  # Low score if no keywords
    
    return int(keyword_score)

def validate_location(latitude: float, longitude: float, disaster_type: str) -> int:
    """Check if location is near known disaster zone"""
    # For MVP: Return score based on coordinate validity
    
    # Check if coordinates are valid
    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        return 0
    
    # Check if coordinates are not 0,0 (common fake location)
    if latitude == 0 and longitude == 0:
        return 10
    
    # Mock proximity check (in production, query Supabase for active disaster zones)
    # For now, assume locations within India are more credible
    if 8.0 <= latitude <= 37.0 and 68.0 <= longitude <= 97.0:
        location_score = 85  # Within India
    else:
        location_score = 60  # Outside India but valid coords
    
    return location_score
