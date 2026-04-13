import React, { useState, useEffect } from 'react';
import { Network, Search, AlertTriangle, XCircle, CheckCircle2, Activity, Play, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [step, setStep] = useState(0); 
  /* Steps: 
     0: Baseline (Healthy)
     1: ML Predicted Warning
     2: Actual Failure occurs
     3: RCA Explained
     4: Digital Twin testing & Auto healing applied
     5: Restored 
  */
  const [rca, setRca] = useState(null);
  const [sim, setSim] = useState(null);

  const fetchTelemetry = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/telemetry`);
    const data = await res.json();
    setTelemetry(data);
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2000);
    return () => clearInterval(interval);
  }, []);

  const resetDemo = async () => {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/demo/heal`, { method: 'POST' });
    setStep(0);
    setRca(null); setSim(null);
    fetchTelemetry();
  };

  const handlePredict = async () => {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/demo/predict`, { method: 'POST' });
    setStep(1); fetchTelemetry();
  };

  const handleFail = async () => {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/demo/fail`, { method: 'POST' });
    setStep(2); fetchTelemetry();
  };

  const handleRca = async () => {
    setStep(3);
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/demo/rca`);
    const data = await res.json();
    setRca(data.rca);
  };

  const handleFix = async () => {
    setStep(4);
    const simRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/demo/simulate`);
    setSim(await simRes.json());
    
    // Simulate thinking/fixing time
    setTimeout(async () => {
       await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/demo/heal`, { method: 'POST' });
       fetchTelemetry();
       setStep(5);
    }, 2500);
  };

  if (!telemetry) return <div className="min-h-screen bg-black flex items-center justify-center"><Activity className="animate-spin text-white w-8 h-8"/></div>;

  return (
    <div className="min-h-screen p-8 lg:p-12 font-sans overflow-x-hidden">
      
      {/* Top Navigation */}
      <header className="flex justify-between items-center mb-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-white text-black p-2 rounded-lg">
             <Network className="w-5 h-5"/>
          </div>
          <h1 className="text-xl font-bold tracking-tight">NetHeal AI</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-[#888]">Autonomous Ops Demo</span>
          {step === 5 && (
            <button onClick={resetDemo} className="text-white bg-[#222] px-4 py-2 rounded-md hover:bg-[#333] transition-colors">
              Reset Demo
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: The "Product Story" Controls & Copilot */}
        <div className="flex flex-col">
           <h2 className="text-3xl font-bold mb-2">Network Intelligence</h2>
           <p className="text-[#888] mb-12 text-lg">Watch how NetHeal AI detects, explains, and resolves major telecommunication failures autonomously.</p>

           <div className="space-y-6 relative">
              {/* Stepper Line backdrop */}
              <div className="absolute left-[28px] top-6 bottom-6 w-px bg-[#222] z-0"></div>

              {/* Step 1 */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex relative z-10 gap-6">
                 <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-4 border-black ${step >= 0 ? 'bg-[#111] text-white' : 'bg-transparent text-[#444]'}`}>
                    1
                 </div>
                 <div className="flex-1 pt-3">
                    <h3 className={`text-xl font-semibold mb-2 ${step === 0 ? 'text-white' : 'text-[#888]'}`}>Predict Failure</h3>
                    {step === 0 ? (
                       <>
                         <p className="text-[#888] mb-4 text-sm">Run our ML model to scan the network for degrading KPIs before an outage occurs.</p>
                         <button onClick={handlePredict} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform">
                           <Search className="w-4 h-4"/> Run Predictive Scan
                         </button>
                       </>
                    ) : (
                       <p className="text-[#888] text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Scan complete. Warning triggered.</p>
                    )}
                 </div>
              </motion.div>

              {/* Step 2 */}
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex relative z-10 gap-6">
                   <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-4 border-black ${step >= 1 ? 'bg-[#111] text-white' : 'bg-transparent text-[#444]'}`}>
                      2
                   </div>
                   <div className="flex-1 pt-3">
                      <h3 className={`text-xl font-semibold mb-2 ${step === 1 ? 'text-white' : 'text-[#888]'}`}>Simulate Outage</h3>
                      {step === 1 ? (
                         <>
                           <p className="text-[#888] mb-4 text-sm">Advance time to allow the predicted routing issue to fully manifest into a critical outage.</p>
                           <button onClick={handleFail} className="flex items-center gap-2 bg-[#111] border border-[#333] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#222] transition-colors">
                             <Play className="w-4 h-4 text-[#888]"/> Advance 15 Minutes
                           </button>
                         </>
                      ) : (
                         <p className="text-red-400 text-sm flex items-center gap-2"><XCircle className="w-4 h-4"/> Outage manifested.</p>
                      )}
                   </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step >= 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex relative z-10 gap-6">
                   <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-4 border-black ${step >= 2 ? 'bg-[#111] text-white' : 'bg-transparent text-[#444]'}`}>
                      3
                   </div>
                   <div className="flex-1 pt-3">
                      <h3 className={`text-xl font-semibold mb-2 ${step === 2 ? 'text-white' : 'text-[#888]'}`}>GenAI Root Cause</h3>
                      {step === 2 ? (
                         <>
                           <p className="text-[#888] mb-4 text-sm">Ask the LLM to analyze the logs and output a clean, human-readable explanation.</p>
                           <button onClick={handleRca} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                             <Zap className="w-4 h-4 text-white"/> Determine Root Cause
                           </button>
                         </>
                      ) : (
                        rca && (
                          <div className="sub-panel p-5 mt-2 bg-[#111]">
                             <div className="space-y-4">
                                <div>
                                  <span className="text-xs uppercase text-[#888] font-semibold tracking-wider">The Problem</span>
                                  <p className="text-sm mt-1 text-white">{rca.problem}</p>
                                </div>
                                <div>
                                  <span className="text-xs uppercase text-[#888] font-semibold tracking-wider">Business Impact</span>
                                  <p className="text-sm mt-1 text-red-300">{rca.business_impact}</p>
                                </div>
                                <div>
                                  <span className="text-xs uppercase text-[#888] font-semibold tracking-wider">Proposed Fix</span>
                                  <p className="text-sm mt-1 text-green-400 bg-green-500/10 inline-block px-3 py-1 rounded-md border border-green-500/20">{rca.suggested_fix}</p>
                                </div>
                             </div>
                          </div>
                        )
                      )}
                   </div>
                </motion.div>
              )}

              {/* Step 4 */}
              {step >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex relative z-10 gap-6">
                   <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-4 border-black border-4 border-black ${step === 5 ? 'bg-green-500 text-black' : step >= 3 ? 'bg-[#111] text-white' : 'bg-transparent text-[#444]'}`}>
                      {step === 5 ? <CheckCircle2 className="w-6 h-6"/> : "4"}
                   </div>
                   <div className="flex-1 pt-3">
                      <h3 className={`text-xl font-semibold mb-2 ${step >= 3 && step < 5 ? 'text-white' : 'text-[#888]'}`}>Auto-Remediation</h3>
                      {step === 3 ? (
                         <>
                           <p className="text-[#888] mb-4 text-sm">Test the proposed fix securely in the Digital Twin sandbox before applying it everywhere.</p>
                           <button onClick={handleFix} className="flex items-center gap-2 bg-white text-black hover:bg-[#eee] px-5 py-2.5 rounded-full text-sm font-bold transition-colors">
                             <ShieldCheck className="w-4 h-4 text-black"/> Test & Apply Fix
                           </button>
                         </>
                      ) : step === 4 ? (
                         <div className="sub-panel p-5 animate-pulse border-indigo-500/50">
                            <p className="text-sm text-indigo-400 flex items-center gap-2"><Activity className="w-4 h-4"/> Validating in Digital Twin Sandbox...</p>
                            {sim && <p className="text-xs text-[#888] mt-2 block">Confidence Score: <span className="text-white font-bold">{sim.confidence}%</span></p>}
                         </div>
                      ) : (
                         <div className="sub-panel p-5 border-green-500/30">
                            <p className="text-sm text-green-400 flex items-center gap-2 mb-2"><CheckCircle2 className="w-5 h-5"/> Issue Resolving Loop Complete</p>
                            <p className="text-xs text-[#888]">Network restored to nominal states.</p>
                         </div>
                      )}
                   </div>
                </motion.div>
              )}
           </div>
        </div>

        {/* Right Side: The Map Viewer */}
        <div className="flex flex-col gap-6 sticky top-12 h-fit">
           <h2 className="text-sm uppercase tracking-widest text-[#666] font-semibold mb-2 flex items-center gap-2">
             <Activity className="w-4 h-4"/> Network Telemetry Map
           </h2>

           <AnimatePresence>
              {Object.entries(telemetry.layers).map(([layerName, nodes]) => (
                <div key={layerName} className="space-y-3">
                  {nodes.map(node => {
                    const isWarning = node.status === 'Warning';
                    const isCritical = node.status === 'Critical';
                    
                    return (
                        <motion.div 
                          key={node.id}
                          layout
                          className={`panel p-6 flex flex-col justify-between transition-all duration-300 ${isCritical ? 'border-red-500 border-2 bg-red-500/5' : isWarning ? 'border-amber-500 border-2 bg-amber-500/5' : ''}`}
                        >
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <h4 className="text-lg font-bold text-white leading-none">{node.name}</h4>
                                 <span className="text-xs text-[#666] uppercase tracking-wider font-semibold mt-2 block">{layerName} Layer</span>
                              </div>
                              <div className="flex flex-col items-end">
                                  {isCritical ? (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                      <XCircle className="w-3 h-3"/> Offline
                                    </span>
                                  ) : isWarning ? (
                                    <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3"/> Warning
                                    </span>
                                  ) : (
                                    <span className="bg-[#222] text-[#888] border border-[#333] px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3"/> Healthy
                                    </span>
                                  )}
                              </div>
                           </div>

                           <div className="flex justify-between items-center bg-[#111] border border-[#222] p-4 rounded-xl">
                              <span className="text-sm font-medium text-[#888]">Service KPI</span>
                              <span className={`font-mono text-xl font-bold ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-white'}`}>
                                 {node.kpi}
                              </span>
                           </div>
                           
                           {isWarning && step === 1 && (
                              <div className="absolute inset-0 border-2 border-amber-500 rounded-2xl animate-pulse pointer-events-none opacity-50"></div>
                           )}
                        </motion.div>
                    )
                  })}
                </div>
              ))}
           </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
