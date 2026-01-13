import { motion } from 'framer-motion';

interface Props {
  category: string;
  title: string;
  date: string;
  image: string;
}

const ArticleCard = ({ category, title, date, image }: Props) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-5">
        <motion.img 
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          src={image || "https://via.placeholder.com/300x400?text=No+Image"} // 加入預設圖
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x400?text=Error";
          }}
        />
      </div>
      <p className="text-[10px] tracking-[0.2em] text-primary font-bold uppercase mb-2">
        {category}
      </p>
      <h3 className="text-lg font-serif text-secondary leading-snug group-hover:text-primary-dark transition-colors duration-500">
        {title}
      </h3>
      <p className="text-[9px] text-neutral-400 mt-3 tracking-tighter uppercase">
        {date}
      </p>
    </motion.div>
  );
};

export default ArticleCard;