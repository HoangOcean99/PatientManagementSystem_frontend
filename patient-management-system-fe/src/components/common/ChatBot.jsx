import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { sendChatMessage } from '../../api/chatbotApi';
import toast from 'react-hot-toast';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Xin chào! Tôi là trợ lý ảo MedSchedule. Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await sendChatMessage(userMessage);
      const aiResponse = result.data.response;
      
      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Không thể kết nối với AI. Vui lòng thử lại.");
      setMessages(prev => [...prev, { role: 'assistant', text: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu. Vui lòng thử lại sau ít phút." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.9 }
  };

  const windowVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.9 }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={windowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mb-4 w-[380px] h-[550px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">MedSchedule AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Đang hoạt động</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Đóng Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs
                      ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-100 text-blue-600 shadow-sm'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 p-2 rounded-xl transition-all
                    ${!input.trim() || isLoading ? 'text-gray-300' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'}`}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                Sử dụng Google Gemini AI và MedSchedule
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Toggle Button */}
      {!isOpen && (
        <motion.button
          variants={bubbleVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-blue-200/50 transition-shadow relative group"
          aria-label="Mở Chatbot"
        >
          <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
          {/* Subtle notification dot */}
          <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 border-4 border-white rounded-full" />
        </motion.button>
      )}
    </div>
  );
};

export default ChatBot;
