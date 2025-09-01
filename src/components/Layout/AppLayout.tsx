import React, { useState } from 'react';
import { ChatDrawer } from '../Chat/ChatDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {children}
      <ChatDrawer isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
}