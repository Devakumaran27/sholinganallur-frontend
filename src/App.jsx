import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import BusStops from './pages/BusStops';
import JourneyPlanner from './pages/JourneyPlanner';
import AIChat from './pages/AIChat';
import VoiceAssistant from './pages/VoiceAssistant';
import CrowdAdvisor from './pages/CrowdAdvisor';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stops" element={<BusStops />} />
        <Route path="/journey" element={<JourneyPlanner />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/voice" element={<VoiceAssistant />} />
        <Route path="/crowd-advisor" element={<CrowdAdvisor />} />
      </Routes>
    </AppLayout>
  );
}
