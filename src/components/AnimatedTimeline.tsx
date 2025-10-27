import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TimelineItem {
  period: string;
  title: string;
  description: string;
  details: string[];
  image: string;
}

interface AnimatedTimelineProps {
  items: TimelineItem[];
}

function TimelineSection({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasBeenInView(true);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="relative min-h-screen flex items-center">
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: isInView ? 1 : 1.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <ImageWithFallback
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Period indicator and title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : -50 
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={index % 2 === 0 ? "lg:order-1" : "lg:order-2"}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isInView ? 1 : 0,
                scale: isInView ? 1 : 0.8 
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-full mb-4"
            >
              {item.period}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 20 
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl text-white mb-6"
            >
              {item.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 20 
              }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-gray-200 leading-relaxed"
            >
              {item.description}
            </motion.p>
          </motion.div>

          {/* Right side - Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : 50 
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={index % 2 === 0 ? "lg:order-2" : "lg:order-1"}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <h3 className="text-2xl text-white mb-6">Key Highlights</h3>
              <ul className="space-y-4">
                {item.details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: isInView ? 1 : 0,
                      x: isInView ? 0 : 20 
                    }}
                    transition={{ duration: 0.6, delay: 0.6 + (i * 0.1) }}
                    className="flex items-start gap-3 text-gray-100"
                  >
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                    <span>{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm"
        >
          <div className="flex flex-col items-center gap-2">
            <span>Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-bounce">
              <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function AnimatedTimeline({ items }: AnimatedTimelineProps) {
  return (
    <div className="relative bg-black">
      {items.map((item, index) => (
        <TimelineSection key={index} item={item} index={index} />
      ))}
    </div>
  );
}
