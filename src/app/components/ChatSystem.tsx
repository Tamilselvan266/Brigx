import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  X, 
  Image as ImageIcon, 
  Paperclip, 
  Users,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Message {
  id: number;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface ChatSystemProps {
  chatType: '1-on-1' | 'group';
  chatName: string;
  participants: User[];
  currentUserId: string;
  onClose: () => void;
}

export function ChatSystem({ chatType, chatName, participants, currentUserId, onClose }: ChatSystemProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: participants[0]?.id || '2',
      senderName: participants[0]?.name || 'Amit Kumar',
      text: 'Hi, I just uploaded the latest progress photos.',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
      type: 'text',
    },
    {
      id: 2,
      senderId: currentUserId,
      senderName: 'You',
      text: 'Great! Let me check them.',
      timestamp: new Date(Date.now() - 3000000),
      status: 'read',
      type: 'text',
    },
    {
      id: 3,
      senderId: participants[1]?.id || '3',
      senderName: participants[1]?.name || 'Riya Sharma',
      text: 'The foundation looks solid. Good progress!',
      timestamp: new Date(Date.now() - 1800000),
      status: 'delivered',
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      senderId: currentUserId,
      senderName: 'You',
      text: inputText,
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        )
      );
    }, 500);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
        )
      );
    }, 2000);
  };

  const getStatusIcon = (status: Message['status']) => {
    if (status === 'sent') return <Check className="w-3 h-3" />;
    if (status === 'delivered' || status === 'read') return <CheckCheck className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarFallback className="bg-white text-orange-600 font-semibold">
                {chatType === 'group' ? <Users className="w-5 h-5" /> : chatName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{chatName}</h3>
              <div className="flex items-center gap-2">
                {chatType === 'group' ? (
                  <p className="text-xs text-white/80">{participants.length} participants</p>
                ) : (
                  <p className="text-xs text-white/80">
                    {isTyping ? 'typing...' : 'online'}
                  </p>
                )}
              </div>
            </div>
            {chatType === 'group' && (
              <Badge className="ml-2 bg-white/20 text-white border-white/30">
                Group
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <MoreVertical className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Participants (for group chat) */}
        {chatType === 'group' && (
          <div className="bg-gray-50 border-b border-gray-200 p-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{participant.name}</span>
                  <Badge variant="secondary" className="text-xs">{participant.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-gray-50">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === currentUserId;
                const showAvatar = !isOwnMessage && (
                  index === 0 || 
                  messages[index - 1]?.senderId !== message.senderId
                );

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    {!isOwnMessage && (
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                              {message.senderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8" />
                        )}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      {showAvatar && !isOwnMessage && (
                        <span className="text-xs font-medium text-gray-600 px-2">
                          {message.senderName}
                        </span>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-orange-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>

                      <div className={`flex items-center gap-1 px-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isOwnMessage && (
                          <span className={`${message.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`}>
                            {getStatusIcon(message.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                    {participants[0]?.name.split(' ').map(n => n[0]).join('') || 'AK'}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <ImageIcon className="w-5 h-5" />
            </Button>
            
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1"
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-orange-600 hover:bg-orange-700"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
