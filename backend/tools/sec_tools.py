import requests
from bs4 import BeautifulSoup
import pandas as pd
import os

class SECTools:
    def __init__(self):
        self.headers = {
            "User-Agent": "WealthManagementResearch (researcher@example.com)"
        }

    def get_cik(self, ticker):
        """Get CIK for a ticker."""
        ticker = ticker.upper()
        url = f"https://www.sec.gov/files/company_tickers.json"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = response.json()
            for key, val in data.items():
                if val['ticker'] == ticker:
                    return str(val['cik_str']).zfill(10)
        return None

    def get_recent_filings(self, ticker, filing_type="10-K"):
        """Get recent filing metadata for a ticker."""
        cik = self.get_cik(ticker)
        if not cik:
            return f"CIK not found for ticker {ticker}"
        
        url = f"https://data.sec.gov/submissions/CIK{cik}.json"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = response.json()
            recent_filings = data.get('filings', {}).get('recent', {})
            df = pd.DataFrame(recent_filings)
            filtered = df[df['form'] == filing_type].head(1)
            if not filtered.empty:
                accession_number = filtered.iloc[0]['accessionNumber'].replace('-', '')
                primary_doc = filtered.iloc[0]['primaryDocument']
                return {
                    "accessionNumber": accession_number,
                    "primaryDocument": primary_doc,
                    "reportDate": filtered.iloc[0]['reportDate']
                }
        return f"No recent {filing_type} found for {ticker}"

    def parse_filing_content(self, ticker, filing_type="10-K"):
        """Placeholder for actual HTML parsing of SEC filing."""
        meta = self.get_recent_filings(ticker, filing_type)
        if isinstance(meta, str):
            return meta
        return f"Successfully retrieved metadata for {ticker} {filing_type}. Accession: {meta['accessionNumber']}. reportDate: {meta['reportDate']}"
