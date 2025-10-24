
import React from 'react';
import type { Message } from '../types';
import { LoveMasterIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.sender === 'ai';
  const bubbleClasses = isAI
    ? 'bg-slate-800/80 text-slate-200'
    : 'bg-pink-500/90 text-white';

  const wrapperClasses = isAI ? 'justify-start' : 'justify-end';

  // Basic markdown-like formatting for newlines
  const formattedText = message.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={`flex items-end gap-2 ${wrapperClasses}`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center self-start">
          <LoveMasterIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md ${bubbleClasses}`}>
        <p className="text-sm whitespace-pre-wrap">{formattedText}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
