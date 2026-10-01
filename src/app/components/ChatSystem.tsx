import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Participant {
  id: string;
  name: string;
  role: string;
}

interface ChatSystemProps {
  chatType: "group" | "private";
  chatName: string;
  participants: Participant[];
  currentUserId: string;
  onClose: () => void;
}

export function ChatSystem({
  chatName,
  participants,
  currentUserId,
  onClose,
}: ChatSystemProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const professionalReplies = [
  "Thank you for the update. I will review this and get back to you shortly.",
  "Noted. Let me check the details and confirm.",
  "Understood. We will proceed accordingly.",
  "Thanks for sharing this information.",
  "I appreciate the clarification. I'll take the necessary action.",
  "That looks good. Please keep me posted on further updates.",
];

const handleSend = () => {
  if (!newMessage.trim()) return;

  const message = {
    id: Date.now(),
    senderId: currentUserId,
    text: newMessage,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  setMessages((prev) => [...prev, message]);
  setNewMessage("");

  const otherParticipants = participants.filter(p => p.id !== currentUserId);

  if (otherParticipants.length > 0) {
    const randomUser =
      otherParticipants[Math.floor(Math.random() * otherParticipants.length)];

    const randomReply =
      professionalReplies[Math.floor(Math.random() * professionalReplies.length)];

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        senderId: randomUser.id,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, reply]);
    }, 1000 + Math.random() * 1000);
  }
};
  // populate initial dummy messages once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          senderId: participants[0]?.id || '1',
          text: 'Welcome to the group chat! Feel free to ask questions.',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-lg h-[80vh] rounded-2xl shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">{chatName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const sender = participants.find(p => p.id === msg.senderId);

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="flex gap-2 max-w-xs">
                  {!isMe && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {sender?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`px-3 py-2 rounded-xl text-sm ${
                      isMe
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {!isMe && (
                      <p className="text-xs font-semibold">
                        {sender?.name}
                      </p>
                    )}
                    <p>{msg.text}</p>
                    <p className="text-[10px] opacity-70 text-right">
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}