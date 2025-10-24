
import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import { SendIcon } from './Icons';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="h-full flex flex-col p-2 md:p-4">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col space-y-4 p-2">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.sender === 'user' && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                 <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75"></div>
                 <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
           )}
          <div ref={scrollRef} />
        </div>
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded-xl border border-slate-700/50 focus-within:ring-2 focus-within:ring-pink-500 transition-shadow">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            placeholder="メッセージを入力..."
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none max-h-32 p-2 custom-scrollbar"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-full bg-pink-500 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-pink-600 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
