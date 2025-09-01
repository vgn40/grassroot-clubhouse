import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatDrawer } from '../Chat/ChatDrawer';
import { useChat } from '@/hooks/useChat';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const { unreadCount } = useChat();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with chat bubble */}
      <header className="fixed top-0 right-0 z-50 p-4">
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full size-10 p-0 shadow-lg"
            onClick={handleChatClick}
            aria-label="Open chat"
            data-testid="chat-icon-button"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          {unreadCount && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              data-testid="chat-unread-badge"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </header>
      
      {children}
      <ChatDrawer isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
}