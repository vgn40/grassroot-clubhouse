import React, { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'support';
  timestamp: Date;
  senderName?: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatDrawer({ isOpen, onToggle }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hi! How can I help you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 60000),
      senderName: 'Support Team'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Thanks for your message! Our team will get back to you shortly.',
        sender: 'support',
        timestamp: new Date(),
        senderName: 'Support Team'
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={onToggle}
        className="chat-fab flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute bottom-6 right-6 w-80 h-96 pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-floating border border-border h-full flex flex-col animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      CS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">Clubify Support</h3>
                    <p className="text-xs text-white/80">We're here to help</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {message.sender === 'support' && (
                          <p className="text-xs opacity-70 mb-1">{message.senderName}</p>
                        )}
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="px-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}