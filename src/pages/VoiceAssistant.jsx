import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw,
  Send,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Bot,
  HelpCircle,
  Radio,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import ChatMessage from '../components/ui/ChatMessage';
import { askTransitAssistant } from '../services/chatService';

const LANGUAGE_CONFIGS = [
  {
    id: 'ta-IN',
    label: 'தமிழ் (Tamil)',
    code: 'ta-IN',
    sample: 'சோழிங்கநல்லூருக்கு செல்லும் பேருந்துகள் எவை?',
    subtext: 'Tamil script speech recognition',
  },
  {
    id: 'en-IN',
    label: 'English (India)',
    code: 'en-IN',
    sample: 'Which direct buses connect Sholinganallur to T. Nagar?',
    subtext: 'Indian English accent model',
  },
  {
    id: 'tanglish',
    label: 'Tanglish (Colloquial)',
    code: 'ta-IN', // Uses ta-IN or en-IN with transliteration advisory
    sample: 'Sholinganallur to T. Nagar direct bus iruka?',
    subtext: 'Romanized / Colloquial Tamil (Edit transcript to refine)',
  },
];

const QUICK_VOICE_PROMPTS = [
  {
    lang: 'ta-IN',
    text: 'சோழிங்கநல்லூரில் இருந்து தி.நகர் செல்லும் நேரடி பேருந்துகள் எவை?',
    label: 'Direct buses to T. Nagar (Tamil)',
  },
  {
    lang: 'ta-IN',
    text: 'சோழிங்கநல்லூருக்கு செல்லும் முக்கிய வழித்தடங்கள் எவை?',
    label: 'Serving lines overview (Tamil)',
  },
  {
    lang: 'en-IN',
    text: 'Which direct buses connect Sholinganallur to T. Nagar?',
    label: 'Direct buses to T. Nagar (English)',
  },
  {
    lang: 'en-IN',
    text: 'What buses serve Sholinganallur Kumaran Nagar?',
    label: 'Kumaran Nagar stop lines (English)',
  },
];

export default function VoiceAssistant() {
  const [selectedLang, setSelectedLang] = useState('ta-IN');
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [recognitionError, setRecognitionError] = useState(null);

  // Conversational response state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const conversationEndRef = useRef(null);

  // Detect Web Speech API support on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setRecognitionError(
        'The Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari for voice recognition.'
      );
    }
  }, []);

  // Initialize and tear down SpeechRecognition instance
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang === 'tanglish' ? 'ta-IN' : selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
        setRecognitionError(null);
        setInterimText('');
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentFinal) {
          setTranscript((prev) =>
            prev ? `${prev} ${currentFinal.trim()}` : currentFinal.trim()
          );
          setInterimText('');
        } else {
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event);
        setIsListening(false);
        setInterimText('');

        if (event.error === 'not-allowed') {
          setRecognitionError(
            'Microphone access was denied. Please allow microphone permissions in your browser address bar and try again.'
          );
        } else if (event.error === 'no-speech') {
          setRecognitionError(
            'No speech was detected. Please click the microphone and speak closer to your mic.'
          );
        } else if (event.error === 'audio-capture') {
          setRecognitionError(
            'No microphone was found on this device. Please connect a microphone.'
          );
        } else if (event.error === 'network') {
          setRecognitionError(
            'Speech recognition network error. Please verify your internet connection.'
          );
        } else {
          setRecognitionError(`Recognition notice: ${event.error}. Please retry.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Failed to configure SpeechRecognition:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [selectedLang]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isSynthesizing]);

  // Start speech capture
  const handleStartListening = () => {
    if (!recognitionRef.current || !isSupported) return;
    setRecognitionError(null);
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Could not start recognition (already active or aborting):', err);
    }
  };

  // Stop speech capture manually
  const handleStopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (_) {}
    setIsListening(false);
  };

  // Confirm transcript and send to backend
  const handleConfirmAndSend = async () => {
    const query = transcript.trim();
    if (!query || query.length < 2 || isSynthesizing) return;

    const userEntry = {
      id: `voice-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, userEntry]);
    setTranscript('');
    setInterimText('');
    setIsSynthesizing(true);
    setRecognitionError(null);

    try {
      const response = await askTransitAssistant({
        question: query,
        top_k: 4,
      });

      const assistantEntry = {
        id: `voice-assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: response.grounding_sources || [],
        limitations: response.limitations || [],
      };

      setConversation((prev) => [...prev, assistantEntry]);

      // Automatically synthesize spoken speech if browser TTS is available
      speakText(response.answer, selectedLang === 'en-IN' ? 'en-IN' : 'ta-IN');
    } catch (err) {
      console.error('Voice assistant chat request failed:', err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to connect to RouteWise AI backend at http://127.0.0.1:8000';

      const errorEntry = {
        id: `voice-error-${Date.now()}`,
        role: 'assistant',
        content: `Error retrieving response: ${detail}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        onRetry: () => {
          setTranscript(query);
        },
      };

      setConversation((prev) => [...prev, errorEntry]);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Browser Text-to-Speech (TTS)
  const speakText = (text, langCode) => {
    if (!window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop any existing speech
      // Remove markdown asterisks, hashes, brackets for cleaner TTS speech
      const cleanedText = text
        .replace(/[*#_`>]/g, '')
        .replace(/\[.*?\]/g, '')
        .substring(0, 400); // Speak first 400 characters for concise speech summary

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = langCode || 'en-IN';
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback issue:', e);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleClearTranscript = () => {
    setTranscript('');
    setInterimText('');
    setRecognitionError(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Voice Assistant"
        description="Speak naturally in Tamil or English to discover bus routes, timetables, and stops across the Sholinganallur corridor using the Web Speech API."
        badge={
          <StatusBadge variant="teal">Web Speech API Live</StatusBadge>
        }
        actions={
          conversation.length > 0 && (
            <button
              onClick={() => {
                setConversation([]);
                stopSpeaking();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 text-xs font-semibold transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )
        }
      />

      {/* Language Selector Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-slate-800" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Select Spoken Language Model
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Browser Recognition Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGUAGE_CONFIGS.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  if (isListening) handleStopListening();
                  setSelectedLang(lang.id);
                  setRecognitionError(null);
                }}
                className={`p-4 rounded-2xl border text-left transition duration-150 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm mb-1 flex items-center justify-between">
                  <span>{lang.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                  )}
                </div>
                <div
                  className={`text-xs ${
                    isSelected ? 'text-teal-300' : 'text-slate-500'
                  }`}
                >
                  {lang.subtext}
                </div>
                <div
                  className={`text-[11px] mt-2 italic truncate ${
                    isSelected ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  "{lang.sample}"
                </div>
              </button>
            );
          })}
        </div>

        {selectedLang === 'tanglish' && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Tanglish Recognition Note:</strong> Browser recognition engines transcribe phonetic sounds. You can review and edit your transcribed words in the text box below before submitting to the Gemini transit model.
            </span>
          </div>
        )}
      </div>

      {/* Main Microphone Interaction Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center space-y-6">
        {/* Pulsing Visual Microphone Button */}
        <div className="relative inline-flex items-center justify-center">
          {/* Animated pulsing wave rings when listening */}
          {isListening && (
            <>
              <span className="absolute w-36 h-36 rounded-full bg-teal-500/20 animate-ping pointer-events-none" />
              <span className="absolute w-28 h-28 rounded-full bg-teal-500/30 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            type="button"
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={!isSupported}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              !isSupported
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : isListening
                ? 'bg-red-600 text-white ring-8 ring-red-100 hover:bg-red-700 scale-105'
                : 'bg-slate-900 text-teal-400 hover:bg-slate-800 hover:scale-105'
            }`}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 animate-bounce" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        {/* Listening Status & Instructions */}
        <div className="space-y-1.5 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <h4 className="text-base font-bold text-slate-900">
              {isListening
                ? 'Listening to speech...'
                : 'Tap microphone to speak'}
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            {isListening
              ? 'Speak clearly into your microphone in ' +
                (selectedLang === 'en-IN' ? 'English' : 'Tamil') +
                '. Click stop when finished.'
              : 'Web Speech API records in browser. You can inspect & edit recognized text before sending.'}
          </p>
        </div>

        {/* Error Notice */}
        {recognitionError && (
          <div className="p-3.5 max-w-lg mx-auto bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{recognitionError}</div>
          </div>
        )}

        {/* Live Interim Transcript Bubble (while speaking) */}
        {interimText && (
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 italic animate-pulse max-w-xl mx-auto">
            "{interimText}"
          </div>
        )}

        {/* Editable Recognized Transcript Card */}
        <div className="max-w-xl mx-auto text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
            <div className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Recognized Speech (Review & Edit before sending):</span>
            </div>
            {transcript && (
              <button
                type="button"
                onClick={handleClearTranscript}
                className="text-[11px] text-slate-400 hover:text-slate-700 transition"
              >
                Clear Text
              </button>
            )}
          </div>

          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your recognized speech will appear here. You can also type directly..."
            className="w-full p-3.5 text-sm bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition shadow-sm font-medium resize-none"
          />

          {/* Action confirmation button: User confirmation required */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleConfirmAndSend}
              disabled={!transcript.trim() || transcript.trim().length < 2 || isSynthesizing}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSynthesizing ? 'Querying Gemini...' : 'Confirm & Ask RouteWise AI'}</span>
            </button>
          </div>
        </div>

        {/* Quick Voice Prompts (Sample clickable audio briefers) */}
        <div className="pt-4 border-t border-slate-100 max-w-xl mx-auto text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Sample Voice Questions (Click to populate text):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_VOICE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTranscript(prompt.text);
                  setSelectedLang(prompt.lang);
                  setRecognitionError(null);
                }}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition font-medium text-left"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synthesizing Loading Card */}
      {isSynthesizing && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-slate-900">
              Querying Grounded Transit Knowledge...
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Matching Sholinganallur GTFS records via Google Gemini</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce delay-200" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Conversation & Spoken Output Log */}
      {conversation.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-slate-900">
              Voice Conversation Stream
            </h3>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200 transition"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio Voice</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {conversation.map((entry) => (
              <ChatMessage key={entry.id} {...entry} />
            ))}
          </div>
          <div ref={conversationEndRef} />
        </div>
      )}
    </div>
  );
}
