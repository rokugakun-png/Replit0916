import { useState } from 'react';
import ChatInput from '../ChatInput';

export default function ChatInputExample() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
    console.log('Message sent:', message);
  };

  return (
    <div className="max-w-md mx-auto bg-background border rounded-lg overflow-hidden">
      <div className="p-4 min-h-[200px] max-h-[300px] overflow-y-auto space-y-2">
        <p className="text-sm text-muted-foreground mb-4">送信されたメッセージ:</p>
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground">まだメッセージがありません</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="p-2 bg-primary text-primary-foreground rounded text-sm">
              {msg}
            </div>
          ))
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}