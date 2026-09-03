import { useEffect, useRef, useState } from 'react';
import { X, Send, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { TypingIndicator } from './LoadingState';
import { askCompanion } from '../services/geminiService';

const DEFAULT_QUESTIONS = [
  'What should I see in 3 days?',
  "What's the best month to visit?",
  'What local food should I try?',
  'Is this good for first-time travellers?',
];

export default function TravelCompanion({ destination }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  async function send(question) {
    const text = question ?? input;
    if (!text.trim()) return;
    setError(false);
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const reply = await askCompanion({ destination, history: messages, question: text });
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-charcoal text-ivory pl-4 pr-5 py-3.5 shadow-lg hover:bg-charcoal-soft transition-colors"
        style={{ display: open ? 'none' : 'flex' }}
        whileHover={{ y: -2 }}
        aria-label="Open Travel Companion chat"
      >
        <Compass size={18} strokeWidth={1.75} />
        <span className="text-sm">Ask WANDER</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-charcoal/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="WANDER Travel Companion"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              className="fixed z-50 bg-ivory border border-line shadow-2xl flex flex-col
                inset-x-0 bottom-0 h-[80vh] rounded-t-2xl
                md:inset-auto md:bottom-6 md:right-6 md:w-[380px] md:h-[560px] md:rounded-none"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <div>
                  <p className="font-display text-lg text-charcoal leading-none">WANDER</p>
                  <p className="text-xs text-stone mt-1">Travel Companion</p>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-stone hover:text-charcoal">
                  <X size={20} />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {messages.length === 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-charcoal text-sm">
                      {destination ? `Not sure where to begin with ${destination.name}?` : 'Not sure where to begin?'}
                    </p>
                    <p className="text-stone text-xs">Ask WANDER, or try one of these:</p>
                    <div className="flex flex-col gap-2">
                      {DEFAULT_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="text-left text-sm px-3 py-2 border border-line hover:border-terracotta hover:text-terracotta transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <ChatMessage key={i} role={m.role} content={m.content} />
                ))}
                {loading && <TypingIndicator />}
                {error && (
                  <p className="text-terracotta text-xs">
                    Your travel companion is temporarily offline. <button onClick={() => send(messages[messages.length - 1]?.content)} className="underline">Try again</button>
                  </p>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 border-t border-line px-4 py-3"
              >
                <input
                  id="companion-chat-input"
                  name="companion-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your trip..."
                  aria-label="Message the travel companion"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-stone/60"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="text-charcoal hover:text-terracotta transition-colors disabled:opacity-40"
                  disabled={!input.trim() || loading}
                >
                  <Send size={18} strokeWidth={1.75} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
