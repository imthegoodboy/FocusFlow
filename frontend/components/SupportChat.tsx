'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! Need help with focus or routines? Ask me anything.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/api/support/chat', { question });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Unable to send message right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-primary-500 text-white px-5 py-3 shadow-xl hover:bg-primary-600 transition"
      >
        Need help?
      </button>
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
          <div className="bg-primary-500 text-white px-4 py-3 flex items-center justify-between">
            <p className="font-semibold text-sm">FocusFlow Assistant</p>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-3 rounded-2xl ${
                  msg.role === 'assistant'
                    ? 'bg-primary-50 text-primary-900 self-start'
                    : 'bg-slate-100 text-slate-900 self-end'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a doubt..."
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

