"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chats } from "@/app/constants";

interface ChatContextType {
    history: Chats[];
    setHistory:React.Dispatch<React.SetStateAction<Chats[]>>
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({children})=>{
    const [history, setHistory] = useState<Chats[]>([{text:'How can i help you?',prompt:false}]);

    return (
        <ChatContext.Provider value={{ history, setHistory}}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context)  throw new Error('useChatContext must be used within a ChatProvider');
    return context;
};
