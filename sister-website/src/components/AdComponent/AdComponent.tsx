import React from 'react';
import { motion } from 'framer-motion';

interface AdProps {
  ad: any;
  handleAdClick: (id: string) => void;
}

const AdComponent: React.FC<AdProps> = ({ ad, handleAdClick }) => {
  // 💡 如果廣告數據不完整，則不渲染，避免畫面出現空白框
  if (!ad || !ad.isActive) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-16 p-8 md:p-12 bg-neutral-50 rounded-[3rem] text-center border border-neutral-100 shadow-sm"
    >
      <p className="text-[9px] text-neutral-400 tracking-[0.4em] mb-8 uppercase font-bold">Partner Content</p>
      <a 
        href={ad.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="group block"
        onClick={() => handleAdClick(ad.id)}
      >
        {ad.imageUrl && (
          <div className="overflow-hidden rounded-2xl mb-8 shadow-lg max-w-2xl mx-auto">
            <img 
              src={ad.imageUrl} 
              className="w-full max-h-80 object-cover group-hover:scale-105 transition-transform duration-1000" 
              alt="Advertisement" 
            />
          </div>
        )}
        <h4 className="text-2xl font-serif text-secondary group-hover:text-primary transition-colors underline decoration-primary/20 underline-offset-8">
          {ad.title}
        </h4>
        {ad.description && (
           <p className="mt-4 text-sm text-neutral-400 font-serif italic">{ad.description}</p>
        )}
      </a>
    </motion.div>
  );
};

export default AdComponent;