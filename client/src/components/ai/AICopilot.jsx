import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sparkles, X, Send, Bot, User, Lightbulb, Loader2 } from 'lucide-react';

export const AICopilot = () => {
  const { isCopilotOpen, setIsCopilotOpen, queryCopilot } = useTelemetry();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am CAT FleetBrain AI Copilot, powered live by Cohere Command LLM. How can I assist your Caterpillar dealership operations today?',
      recommendation: 'Ask me about regional demand forecasts, equipment returns, or fleet health insights.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isCopilotOpen) return null;

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    try {
      setLoading(true);
      const res = await queryCopilot(query);
      const aiMsg = { sender: 'ai', text: res.answer, recommendation: res.recommendation };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error connecting to Cohere AI API. Please try again.', recommendation: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Recommend top Caterpillar excavators for highway excavation.',
    'Show idle excavators',
    'Show machines due this week',
    'Show revenue forecast',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-cat-dark border-l border-cat-borderDark h-full flex flex-col justify-between shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-cat-black border-b border-cat-borderDark flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cat-yellow text-cat-black flex items-center justify-center font-bold shadow-cat-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">CAT FleetBrain AI Copilot</h3>
              <p className="text-[10px] text-cat-yellow font-mono">Live Cohere Command LLM Active</p>
            </div>
          </div>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-cat-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.sender === 'user' ? 'bg-cat-yellow text-cat-black font-bold' : 'bg-cat-card text-cat-yellow border border-cat-borderDark'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-cat-yellow text-cat-black font-semibold'
                      : 'bg-cat-card border border-cat-borderDark text-gray-200 leading-relaxed'
                  }`}
                >
                  {m.text}
                </div>

                {m.recommendation && (
                  <div className="p-3 rounded-xl bg-cat-yellow/10 border border-cat-yellow/30 text-gray-200 space-y-1">
                    <div className="flex items-center space-x-1.5 text-cat-yellow font-extrabold text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Caterpillar AI Recommendation:</span>
                    </div>
                    <p className="text-[11px] text-gray-300 font-medium">{m.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-cat-yellow">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cohere Command LLM generating response...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-cat-black/50 border-t border-cat-borderDark overflow-x-auto flex items-center space-x-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-cat-card border border-cat-borderDark text-[10px] font-bold text-gray-300 hover:text-cat-yellow hover:border-cat-yellow whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-cat-black border-t border-cat-borderDark flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask Cohere AI Copilot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-3 py-2.5 text-xs rounded-xl bg-cat-card border border-cat-borderDark text-white placeholder-gray-400 focus:outline-none focus:border-cat-yellow"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 rounded-xl bg-cat-yellow text-cat-black font-extrabold hover:bg-cat-yellowHover transition-colors shadow-cat-glow flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
