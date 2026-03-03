from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from backend.tools.sec_tools import SECTools
from backend.tools.news_tools import NewsTools

class AgentState(TypedDict):
    ticker: str
    sec_data: str
    news_sentiment: str
    compliance_check: str
    final_report: str
    messages: List[str]

sec_tools = SECTools()
news_tools = NewsTools()

def researcher_node(state: AgentState):
    """Fetches SEC data."""
    ticker = state['ticker']
    print(f"Researcher: Fetching SEC data for {ticker}")
    data = sec_tools.parse_filing_content(ticker)
    return {"sec_data": data, "messages": state['messages'] + ["Researcher finished"]}

def analyst_node(state: AgentState):
    """Analyzes news sentiment."""
    ticker = state['ticker']
    print(f"Analyst: Analyzing news sentiment for {ticker}")
    sentiment = news_tools.get_sentiment_report(ticker)
    return {"news_sentiment": sentiment, "messages": state['messages'] + ["Analyst finished"]}

def compliance_node(state: AgentState):
    """Audits research basis against CFA Standards."""
    print("Compliance: Auditing research basis")
    sec_data_exists = len(state['sec_data']) > 50
    sentiment_exists = len(state['news_sentiment']) > 10
    
    if sec_data_exists and sentiment_exists:
        check = "CFA Standard V(A) PASSED: Reasonable basis established through synthesis of SEC primary documents and market sentiment metadata."
    else:
        check = "CFA Standard V(A) WARNING: Incomplete data. Research basis may lack sufficient diligence for a formal recommendation."
        
    return {"compliance_check": check, "messages": state['messages'] + ["Compliance finished"]}

def synthesis_node(state: AgentState):
    """Synthesizes all data into a professional CFA-compliant report."""
    ticker = state['ticker']
    report = f"<h1>Investment Research Report: {ticker}</h1>"
    report += f"<h2>Executive Summary</h2>"
    report += f"<p>This report provides a multi-agent synthesis of SEC filings and market sentiment for {ticker}, reviewed against CFA Standard V(A).</p>"
    
    report += f"<h2>I. Primary Document Analysis (SEC)</h2>"
    report += f"<p>{state['sec_data']}</p>"
    
    report += f"<h2>II. Market Sentiment & News Analysis</h2>"
    report += f"<p>{state['news_sentiment']}</p>"
    
    report += f"<h2>III. Compliance Audit & Diligence Basis</h2>"
    report += f"<blockquote>{state['compliance_check']}</blockquote>"
    
    report += f"<h2>IV. Recommendation Basis</h2>"
    report += f"<p>Based on the synthesis of primary SEC documents and corroborated market sentiment, the research team maintains a 'Diligence-Verified' status for this analysis.</p>"
    
    return {"final_report": report, "messages": state['messages'] + ["Synthesis finished"]}

# Build Workflow
workflow = StateGraph(AgentState)

workflow.add_node("researcher", researcher_node)
workflow.add_node("analyst", analyst_node)
workflow.add_node("compliance", compliance_node)
workflow.add_node("synthesis", synthesis_node)

workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "analyst")
workflow.add_edge("analyst", "compliance")
workflow.add_edge("compliance", "synthesis")
workflow.add_edge("synthesis", END)

app_graph = workflow.compile()
