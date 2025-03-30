import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Clock, Check, X, RefreshCw, Archive, Brain, Sparkles, Zap } from 'lucide-react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query';
import { format } from 'date-fns';
import emailApi from './api/emailApi';
import type { Email, EmailResponse } from './types/email';

const queryClient = new QueryClient();

function EmailApp() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');

  const { data: unreadEmails, refetch: refetchEmails } = useQuery('unreadEmails', emailApi.getUnreadEmails);
  
  const generateResponseMutation = useMutation(
    (emailId: string) => emailApi.generateAIResponse(emailId),
    {
      onSuccess: (response: EmailResponse) => {
        setAiResponse(response.content);
      }
    }
  );

  const markAsReadMutation = useMutation(
    (emailId: string) => emailApi.markAsRead(emailId),
    {
      onSuccess: () => refetchEmails()
    }
  );

  const sendEmailMutation = useMutation(
    ({ emailId, response }: { emailId: string; response: string }) => 
      emailApi.sendEmail(emailId, response)
  );

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-sky-50 overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-effect border-b border-sky-500/10 p-4 sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center gap-3">
            <Brain className="w-6 h-6 text-sky-400 animate-pulse-slow" />
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 text-transparent bg-clip-text">
              Neural Email Assistant
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-1.5 neon-border rounded-full text-sm bg-sky-500/5 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              Lead: {unreadEmails?.filter(email => email.isLead).length || 0}
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-1.5 neon-border rounded-full text-sm bg-sky-500/5 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-sky-400" />
              Non letti: {unreadEmails?.length || 0}
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Email List */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="neon-border rounded-xl p-4 bg-[#0d0e23] relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-sky-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-400" />
                Email non lette
              </h2>
              <motion.button 
                onClick={() => refetchEmails()}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-2 hover:bg-sky-500/10 rounded-full transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 text-sky-400" />
              </motion.button>
            </div>
            
            {/* Email List */}
            <div className="space-y-3">
              {unreadEmails?.map((email, index) => (
                <motion.div 
                  key={email.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedEmail(email)}
                  className="glass-effect p-4 rounded-lg hover:bg-sky-500/5 cursor-pointer transition-all duration-300 border border-sky-500/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-sky-100">{email.subject}</span>
                    <span className="text-xs text-sky-400">
                      {format(new Date(email.timestamp), 'HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-xs text-sky-300/70 truncate">
                    {email.aiClassification}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Email Content & Response */}
        <div className="space-y-6">
          {/* Current Email */}
          {selectedEmail && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neon-border rounded-xl p-4 bg-[#0d0e23]"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sky-100 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-sky-400" />
                    Email corrente
                  </h3>
                  <span className="text-sm text-sky-400">{selectedEmail.sender}</span>
                </div>
                <div className="glass-effect rounded-lg p-4 border border-sky-500/10">
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.content }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Response */}
          {selectedEmail && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neon-border rounded-xl p-4 bg-[#0d0e23]"
            >
              <h3 className="font-medium mb-4 flex items-center gap-2 text-sky-100">
                <Sparkles className="w-5 h-5 text-sky-400" />
                Risposta AI
              </h3>
              <textarea 
                value={aiResponse}
                onChange={(e) => setAiResponse(e.target.value)}
                className="w-full h-32 glass-effect rounded-lg p-4 text-sm resize-none focus:ring-2 focus:ring-sky-500/50 outline-none border border-sky-500/10"
                placeholder="La risposta AI apparirà qui..."
              />
              
              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => generateResponseMutation.mutate(selectedEmail.id)}
                  className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Genera Risposta
                </motion.button>
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center justify-center gap-2 glass-effect border border-sky-500/20 text-sky-100 py-2 px-4 rounded-lg"
                >
                  <Clock className="w-4 h-4" />
                  Pianifica
                </motion.button>
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    if (selectedEmail && aiResponse) {
                      sendEmailMutation.mutate({ emailId: selectedEmail.id, response: aiResponse });
                    }
                  }}
                  className="flex items-center justify-center gap-2 bg-green-500/80 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Invia
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => selectedEmail && markAsReadMutation.mutate(selectedEmail.id)}
                  className="flex items-center justify-center gap-2 glass-effect border border-sky-500/20 text-sky-100 py-2 px-4 rounded-lg"
                >
                  <Check className="w-4 h-4" />
                  Marca come Letta
                </motion.button>
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center justify-center gap-2 glass-effect border border-sky-500/20 text-sky-100 py-2 px-4 rounded-lg"
                >
                  <X className="w-4 h-4" />
                  Ignora
                </motion.button>
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center justify-center gap-2 glass-effect border border-sky-500/20 text-sky-100 py-2 px-4 rounded-lg"
                >
                  <Archive className="w-4 h-4" />
                  Aggiorna
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EmailApp />
    </QueryClientProvider>
  );
}

export default App;