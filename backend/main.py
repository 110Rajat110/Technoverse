from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="NetHeal AI - Clean Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A clean, simple state machine for the hackathon demo.
# States: Healthy, Warning (Predicted), Critical (Failed)
network_state = {
    "layers": {
        "RAN": [
            {"id": "enodeb-7", "name": "eNodeB Sector 7", "status": "Healthy", "kpi": "100%"},
        ],
        "Transport": [
            {"id": "mpls-ring", "name": "IP/MPLS Ring B", "status": "Healthy", "kpi": "100%"},
        ],
        "Core": [
            {"id": "upf-01", "name": "5G UPF Gateway", "status": "Healthy", "kpi": "100%"},
        ]
    }
}

# Active single-node demo tracking
current_demo_node = None

@app.get("/api/telemetry")
def get_telemetry():
    return network_state

@app.post("/api/demo/predict")
def predict_failure():
    """Step 1: ML Predicts an upcoming failure"""
    global current_demo_node
    current_demo_node = "mpls-ring" # Hardcoded for smooth demo flow
    
    for node in network_state["layers"]["Transport"]:
        if node["id"] == current_demo_node:
            node["status"] = "Warning"
            node["kpi"] = "85%"
            
    return {"message": "Predictive model triggered.", "node": current_demo_node}

@app.post("/api/demo/fail")
def fail_node():
    """Step 2: Time advances, and the node actually fails"""
    global current_demo_node
    if current_demo_node:
        for layer in network_state["layers"].values():
            for node in layer:
                if node["id"] == current_demo_node:
                    node["status"] = "Critical"
                    node["kpi"] = "20%"
    return {"message": "Node failed."}

@app.get("/api/demo/rca")
def generate_rca():
    """Step 3: English-readable RCA"""
    if not current_demo_node:
        return {"error": "No active predicting node"}
        
    rca_data = {
        "problem": "An unauthorized routing script accidentally modified the BGP prefix weights.",
        "business_impact": "This caused a routing loop, threatening to drop 80% of local enterprise packets and severely violating QoS SLAs.",
        "suggested_fix": "Rollback the BGP configuration to the stable 2:00 AM snapshot.",
    }
    
    return {"rca": rca_data}

@app.get("/api/demo/simulate")
def run_simulation():
    """Step 4a: The Digital Twin simulation result"""
    return {
        "confidence": 99.4,
        "impact_analysis": "Simulation sandbox confirms rollback clears the loop instantly with zero cross-layer impact.",
    }

@app.post("/api/demo/heal")
def auto_heal():
    """Step 4b: Auto Heal execution"""
    global current_demo_node
    for layer in network_state["layers"].values():
        for node in layer:
            if node["id"] == current_demo_node:
                node["status"] = "Healthy"
                node["kpi"] = "100%"
                
    current_demo_node = None
    return {"message": "Configuration successfully rolled back."}
