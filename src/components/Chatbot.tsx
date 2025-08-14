import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm Zach. Well, technically I'm an AI version of myself, but I can answer questions about my experience, skills, and background. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Skills related questions
    if (message.includes('skills') || message.includes('technology') || message.includes('tech')) {
      return "I'm a versatile full-stack developer with expertise across many areas:\n\n🖥️ **Frontend**: I work extensively with React, TypeScript, Vue.js, Next.js, and Tailwind CSS\n\n⚙️ **Backend**: I'm proficient in Node.js, Python, PHP, Laravel, and Express\n\n☁️ **Infrastructure**: I have strong experience with AWS, Docker, Kubernetes, and Terraform\n\n🔒 **Security**: I focus heavily on OAuth, JWT, SSL/TLS, and security auditing\n\nI'm passionate about creating secure, scalable applications with great user experiences!";
    }
    
    // Experience questions
    if (message.includes('experience') || message.includes('work') || message.includes('job')) {
      return "I have extensive experience as a Senior Full Stack Developer. My work focuses on:\n\n• **Enterprise Applications**: I build scalable web applications for large organizations\n• **Cloud Architecture**: I design and implement cloud-native solutions\n• **Team Leadership**: I enjoy mentoring developers and leading technical projects\n• **Security**: I implement robust security measures and compliance standards\n\nI'm passionate about writing clean, maintainable code and staying current with emerging technologies.";
    }
    
    // Education questions
    if (message.includes('education') || message.includes('learn') || message.includes('study')) {
      return "I'm a lifelong learner who stays current with technology trends through:\n\n• Continuous learning and professional development\n• Open source contributions\n• Technical conferences and workshops\n• Industry certifications and training\n\nI believe in sharing knowledge and helping others grow in their tech careers!";
    }
    
    // Contact questions
    if (message.includes('contact') || message.includes('reach') || message.includes('hire')) {
      return "You can reach me through several channels:\n\n• **LinkedIn**: For professional networking and career opportunities\n• **GitHub**: Check out my open source projects and contributions\n• **Email**: For direct professional inquiries\n\nI'm always interested in discussing new opportunities, collaborations, or just talking tech!";
    }
    
    // Projects questions
    if (message.includes('project') || message.includes('portfolio') || message.includes('build')) {
      return "I've worked on a variety of exciting projects:\n\n• **Enterprise Web Applications**: Large-scale React and Vue.js applications\n• **API Development**: RESTful and GraphQL APIs with Node.js and Python\n• **Cloud Infrastructure**: AWS and containerized deployments\n• **Security Solutions**: Authentication systems and security auditing tools\n\nThis very portfolio site is built with React, TypeScript, and Tailwind CSS - showcasing modern web development practices I love using!";
    }
    
    // Hobbies/personal questions
    if (message.includes('hobby') || message.includes('personal') || message.includes('fun') || message.includes('interest')) {
      return "When I'm not coding, I enjoy:\n\n• **Technology Exploration**: Experimenting with new frameworks and tools\n• **Community Involvement**: Contributing to open source projects\n• **Problem Solving**: Tackling complex technical challenges\n• **Continuous Learning**: Reading tech blogs and taking online courses\n\nI'm passionate about using technology to solve real-world problems and make a positive impact!";
    }
    
    // Location questions
    if (message.includes('location') || message.includes('where') || message.includes('based')) {
      return "I'm a remote-friendly developer who has experience working with distributed teams across different time zones. I'm adaptable to various working arrangements and enjoy collaborating with teams worldwide!";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Great to meet you! I'm here to answer any questions about my professional background, skills, or experience. What would you like to know?";
    }
    
    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! Feel free to ask me anything else about my background or experience. I'm here to help! 😊";
    }
    
    // Default responses for unmatched queries
    const defaultResponses = [
      "That's an interesting question! While I might not have specific information about that, I can tell you about my skills, experience, projects, or how to contact me. What would you like to know?",
      "I'd love to help! I'm most knowledgeable about my professional background, technical skills, and career experience. Try asking about my skills, projects, or experience!",
      "Great question! I can share information about my technical expertise, work experience, or professional background. What specific area interests you most?",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getResponse(inputText);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chat with Zach</h3>
                    <p className="text-sm opacity-90">Ask me anything!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isBot 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.isBot ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    }`}>
                      <div className="text-sm leading-relaxed">
                        {message.isBot ? (
                          <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-strong:text-gray-900 prose-p:text-gray-800 prose-li:text-gray-800">
                            <ReactMarkdown 
                              components={{
                                // Customize rendering to fit the chat bubble style
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 ml-2">{children}</ul>,
                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                h1: ({ children }) => <h1 className="font-bold text-base mb-1">{children}</h1>,
                                h2: ({ children }) => <h2 className="font-bold text-sm mb-1">{children}</h2>,
                                h3: ({ children }) => <h3 className="font-semibold text-sm mb-1">{children}</h3>,
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <span>{message.text}</span>
                        )}
                      </div>
                      <div className={`text-xs mt-1 opacity-70 ${
                        message.isBot ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about my experience..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
