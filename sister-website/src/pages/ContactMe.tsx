import { motion } from 'framer-motion';
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactMe = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);
    
    try {
      // 💡 實質功能：將留言存入 Firebase 'messages' 集合
      await addDoc(collection(db, "messages"), {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("提交失敗", error);
      setStatus('idle');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 💡 視覺優化 1：帶有滾動視差感的大氣 Header */}
      <div className="h-[60vh] bg-neutral-200 relative overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
          className="w-full h-full object-cover"
          alt="Contact"
        />
        <div className="absolute inset-0 bg-secondary/10 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] tracking-[0.6em] text-white uppercase mb-4"
          >
            Get In Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif italic text-white tracking-widest"
          >
            About & Contact
          </motion.h1>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-8 py-24">
        {/* 💡 視覺優化 2：文字排版的韻律感 */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-5 gap-12 mb-32 items-center"
        >
          <div className="md:col-span-2">
            <h2 className="text-3xl font-serif text-secondary italic leading-snug">
              讓美食與旅行，<br />成為妳的生活風格提案
            </h2>
          </div>
          <div className="md:col-span-3">
            <p className="text-neutral-500 leading-relaxed tracking-wide text-sm border-l border-primary/20 pl-8">
              我們在城市的角落尋找驚喜，在旅途中收藏故事。<br />
              這裡不只是食記，更是一個分享溫度的空間。
              無論是商業合作、媒體採訪，或是單純想聊聊妳的旅行靈感，我們都期待與妳相遇。
            </p>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-12 gap-20">
          {/* 聯繫資訊：更現代的左側資訊欄 */}
          <div className="md:col-span-4 space-y-12">
            <div>
              <h3 className="text-[10px] tracking-[0.4em] font-bold text-primary uppercase mb-6">Contact Details</h3>
              <div className="space-y-8">
                <div className="group cursor-pointer">
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-2 font-bold group-hover:text-primary transition-colors">Email Inquiry</p>
                  <a href="mailto:XUNGFOODIE@GMAIL.COM" className="text-xl font-serif text-secondary group-hover:underline underline-offset-8 decoration-primary/30">
                    XUNGFOODIE@GMAIL.COM
                  </a>
                </div>
                <div className="group cursor-pointer">
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-2 font-bold group-hover:text-primary transition-colors">Instagram DM</p>
                  <a href="https://instagram.com/XUN.G_FOODIE" target="_blank" className="text-xl font-serif text-secondary group-hover:underline underline-offset-8 decoration-primary/30">
                    @XUN.G_FOODIE
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-neutral-100">
              <p className="text-[10px] text-neutral-400 leading-loose uppercase tracking-tighter italic">
                Office Hours:<br />
                Monday — Friday<br />
                09:00 AM — 18:00 PM
              </p>
            </div>
          </div>

          {/* 💡 視覺優化 3：互動感強的懸浮表單 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-neutral-50 p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow duration-700"
          >
            <h3 className="text-[10px] tracking-[0.4em] font-bold text-secondary uppercase mb-10">Send a Message</h3>
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="relative group">
                  <input name="name" required type="text" placeholder="Name" className="w-full bg-transparent border-b border-neutral-200 py-3 focus:border-primary outline-none text-sm transition-colors peer" />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 peer-focus:w-full" />
                </div>
                <div className="relative group">
                  <input name="email" required type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-neutral-200 py-3 focus:border-primary outline-none text-sm transition-colors peer" />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 peer-focus:w-full" />
                </div>
              </div>
              <div className="relative group">
                <textarea name="message" required placeholder="Tell us about your project or inquiry..." rows={5} className="w-full bg-transparent border-b border-neutral-200 py-3 focus:border-primary outline-none text-sm transition-colors peer resize-none" />
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 peer-focus:w-full" />
              </div>
              
              <button 
                disabled={status !== 'idle'}
                className="w-full md:w-auto bg-secondary text-white text-[10px] tracking-[0.4em] uppercase px-14 py-5 rounded-full hover:bg-primary transition-all duration-700 shadow-lg disabled:bg-neutral-300"
              >
                {status === 'idle' && 'Submit Inquiry'}
                {status === 'sending' && 'Sending...'}
                {status === 'success' && 'Message Sent! ✨'}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ContactMe;