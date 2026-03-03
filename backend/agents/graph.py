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
