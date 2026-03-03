import yfinance as yf
from textblob import TextBlob

class NewsTools:
    def get_company_news(self, ticker):
        """Fetch recent news for a company."""
        company = yf.Ticker(ticker)
        news = company.news
        return news

    def analyze_sentiment(self, news_items):
        """Perform basic sentiment analysis on news headlines."""
        if not news_items:
            return "No news found for sentiment analysis."
        
        scores = []
        for item in news_items:
            text = item.get('title', '') + " " + item.get('publisher', '')
            blob = TextBlob(text)
            scores.append(blob.sentiment.polarity)
        
        avg_score = sum(scores) / len(scores) if scores else 0
        sentiment = "Bullish" if avg_score > 0.05 else "Bearish" if avg_score < -0.05 else "Neutral"
        
        return {
            "sentiment": sentiment,
            "average_polarity": round(avg_score, 3),
            "news_count": len(news_items)
        }

    def get_sentiment_report(self, ticker):
        """Combine news fetching and sentiment analysis."""
        news = self.get_company_news(ticker)
        analysis = self.analyze_sentiment(news)
        if isinstance(analysis, str):
            return analysis
        return f"Sentiment: {analysis['sentiment']} (Polarity: {analysis['average_polarity']}, based on {analysis['news_count']} articles)"
