import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Paperclip, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateResponse } from '../services/geminiService';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello. I am your clinical territory assistant running on Gemini 3 Pro. How can I help optimize your routing or analyze a report today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: attachedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const imageBase64 = userMsg.image ? userMsg.image.split(',')[1] : undefined;
      const responseText = await generateResponse(userMsg.text || "Analyze this image", imageBase64);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-pharma-navy p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-pharma-indigo" />
                <div>
                  <h3 className="font-display font-semibold">Gemini Assistant</h3>
                  <p className="text-[10px] text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Thinking Mode Active
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-pharma-indigo text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="Upload" className="mb-2 rounded-lg max-h-40 object-cover" />
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-pharma-indigo" />
                    <span className="text-xs text-slate-500 font-medium">Thinking deeply...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              {attachedImage && (
                <div className="mb-2 flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">Image attached</span>
                  <button onClick={() => setAttachedImage(null)} className="ml-auto text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-pharma-indigo hover:bg-slate-50 rounded-full transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about incentives or upload Rx..."
                  className="flex-1 bg-slate-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-pharma-indigo/20 outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || (!input && !attachedImage)}
                  className="p-2 bg-pharma-indigo text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-pharma-indigo text-white rounded-full shadow-glow flex items-center justify-center z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </>
  );
};