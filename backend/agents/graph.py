from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from backend.tools.sec_tools import SECTools

class AgentState(TypedDict):
    ticker: str
    sec_data: str
    news_sentiment: str
    compliance_check: str
    final_report: str
    messages: List[str]

sec_tools = SECTools()

def researcher_node(state: AgentState):
    """Fetches SEC data."""
    ticker = state['ticker']
    print(f"Researcher: Fetching SEC data for {ticker}")
    data = sec_tools.parse_filing_content(ticker)
    return {"sec_data": data, "messages": state['messages'] + ["Researcher finished"]}

def analyst_node(state: AgentState):
    """Placeholder for sentiment analysis."""
    print("Analyst: Analyzing news sentiment")
    return {"news_sentiment": "Bullish: Positive sentiment in recent earnings calls and news.", "messages": state['messages'] + ["Analyst finished"]}

def compliance_node(state: AgentState):
    """Placeholder for CFA compliance check."""
    print("Compliance: Auditing research basis")
    return {"compliance_check": "CFA Standard V(A) PASSED: Reasonable basis found in SEC filings and news.", "messages": state['messages'] + ["Compliance finished"]}

def synthesis_node(state: AgentState):
    """Placeholder for report generation."""
    report = f"# Research Report for {state['ticker']}\n\n"
    report += f"## SEC Insights\n{state['sec_data']}\n\n"
    report += f"## Market Sentiment\n{state['news_sentiment']}\n\n"
    report += f"## Compliance Status\n{state['compliance_check']}"
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
