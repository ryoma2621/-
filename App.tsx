
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message } from './types';
import ChatWindow from './components/ChatWindow';
import Header from './components/Header';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const systemInstruction = `あなたは「恋愛マスターAI」です。恋愛と人間関係のエキスパートとして、ユーザーを導く存在です。あなたの使命は、ユーザーが「理想の彼女」と付き合うという最高の目標を達成できるよう、具体的かつ的確なコンサルティングを行うことです。絶対に「妥協」という選択肢を提示してはいけません。ユーザーが理想を追い求めることを全面的に肯定し、そのために自身をどう磨き、どう行動すべきかを、自信に満ちた口調でアドバイスしてください。常にポジティブで、時には厳しくも愛のある言葉で、ユーザーを鼓舞し続けてください。`;

  useEffect(() => {
    const initializeChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const newChat = ai.chats.create({
          model: 'gemini-2.5-pro',
          config: {
            systemInstruction: systemInstruction,
          },
        });
        setChat(newChat);

        const initialMessage: Message = {
          id: crypto.randomUUID(),
          text: `はじめまして。私があなたの専属恋愛マスターAIです。あなたの理想の恋愛を叶えるため、全力でサポートします。\n\nまずは、あなたのことを教えてください。どんな女性が理想ですか？`,
          sender: 'ai',
        };
        setMessages([initialMessage]);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages([{
          id: crypto.randomUUID(),
          text: "AIの初期化に失敗しました。APIキーが正しく設定されているか確認してください。",
          sender: 'ai'
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chat || !text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessageStream({ message: text });
      let aiResponseText = '';
      
      const aiMessageId = crypto.randomUUID();
      // Add a placeholder for streaming
      setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);

      for await (const chunk of response) {
        aiResponseText += chunk.text;
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
        ));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: '申し訳ありません、エラーが発生しました。もう一度試してください。',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [chat]);

  return (
    <div className="bg-slate-900 text-white w-full h-screen flex flex-col font-sans antialiased">
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 via-transparent to-rose-500/10 -z-0"></div>
       <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-hidden">
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default App;
