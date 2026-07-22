import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, ShieldCheck, Loader2, Mic, Volume2, VolumeX, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { Message } from '../types';

interface ChatProps {
  onBack: () => void;
}

export default function Chat({ onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh.\n\nThank you for sharing your concerns. I will carefully listen to everything you describe and assess your situation using only the Qur\'an, authentic Hadith, and recognized scholarly guidance. If there is insufficient evidence for a conclusion, I will tell you honestly.\n\nPlease tell me what you are experiencing.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const plainText = text.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceMode = () => {
    if (isVoiceMode) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    setIsVoiceMode(!isVoiceMode);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setInput(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: messages.map(m => ({ role: m.role, content: m.content })),
          message: userMessage.content 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) throw new Error('No reader available');

      let done = false;
      let fullResponse = '';
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.replace('data: ', '');
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullResponse += parsed.text;
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: msg.content + parsed.text }
                      : msg
                  ));
                }
              } catch (err) {
                console.error("Error parsing chunk", err);
              }
            }
          }
        }
      }

      if (isVoiceMode) {
        speakText(fullResponse);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I apologize, but I am currently unable to process your request due to a technical issue. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(m => {
      const role = m.role === 'user' ? 'You' : 'Al Shafi Agent';
      return `${role} [${m.timestamp.toLocaleTimeString()}]:\n${m.content}\n\n`;
    }).join('---\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `al-shafi-session-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full max-h-[85vh] glass-panel rounded-xl overflow-hidden shadow-2xl border border-white/10"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 card-gradient shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#C5A059] flex items-center justify-center rotate-45 bg-black/20">
              <ShieldCheck className="w-5 h-5 text-[#C5A059] -rotate-45" />
            </div>
            <div>
              <h2 className="serif text-slate-200 text-lg">Assessment Agent</h2>
              <p className="sans text-[10px] uppercase tracking-widest text-[#C5A059]">Evidence-based Guidance</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportChat}
            className="p-2 rounded transition-colors text-slate-400 hover:text-slate-200 hover:bg-white/10"
            title="Download Chat History"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={toggleVoiceMode}
            className={`p-2 rounded transition-colors ${isVoiceMode ? 'text-[#C5A059] bg-[#C5A059]/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'}`}
            title={isVoiceMode ? "Mute Voice" : "Enable Voice"}
          >
            {isVoiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0A0B0D]/50 scroll-smooth">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-5 sm:p-6 ${
                message.role === 'user' 
                  ? 'bg-[#C5A059] text-black rounded-br-sm' 
                  : 'glass rounded-bl-sm text-slate-200'
              }`}
            >
              <div className={`sans max-w-none ${
                message.role === 'user'
                  ? 'text-sm leading-relaxed space-y-4'
                  : 'text-base leading-loose space-y-5'
              }`}>
                <Markdown
                  components={{
                    p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                    strong: ({ ...props }) => <strong className={`font-semibold ${message.role === 'user' ? 'text-black' : 'text-white'}`} {...props} />,
                    em: ({ ...props }) => <em className="italic opacity-90" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-5 space-y-2 mb-3" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-5 space-y-2 mb-3" {...props} />,
                    li: ({ ...props }) => <li className="pl-1" {...props} />,
                    h1: ({ ...props }) => <h1 className={`serif text-2xl font-bold mb-3 mt-6 ${message.role === 'user' ? 'text-black' : 'text-[#C5A059]'}`} {...props} />,
                    h2: ({ ...props }) => <h2 className={`serif text-xl font-bold mb-3 mt-5 ${message.role === 'user' ? 'text-black' : 'text-[#C5A059]'}`} {...props} />,
                    h3: ({ ...props }) => <h3 className={`serif text-lg font-bold mb-2 mt-4 ${message.role === 'user' ? 'text-black' : 'text-[#C5A059]'}`} {...props} />,
                    blockquote: ({ ...props }) => <blockquote className={`border-l-2 pl-4 py-1 my-3 italic rounded-r-lg ${message.role === 'user' ? 'border-black/50 bg-black/10' : 'border-[#C5A059]/50 bg-[#0F1115]/50'}`} {...props} />,
                  }}
                >
                  {message.content}
                </Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass rounded-lg rounded-bl-sm p-4 flex items-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
              <span className="sans text-xs uppercase tracking-widest">Assessing...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 card-gradient border-t border-white/10 shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your situation..."
            disabled={isLoading}
            className="w-full bg-black/20 border border-white/10 rounded-sm pl-4 pr-24 py-4 sans text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/50 transition-all disabled:opacity-50"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-sm transition-colors ${
                isListening 
                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                  : 'text-slate-400 hover:text-[#C5A059] hover:bg-white/5'
              }`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-[#C5A059] text-black rounded-sm hover:bg-[#b59049] disabled:opacity-50 disabled:hover:bg-[#C5A059] transition-colors"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
