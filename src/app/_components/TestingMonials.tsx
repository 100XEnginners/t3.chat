"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import ScrollReveal from '../components/ScrollReveal';

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'AI Researcher at Meta',
      content: 'T3Dotgg revolutionized how I interact with multiple AI models. The unified interface saves me hours every day.',
      result: '85% faster research iterations',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Senior Developer at Stripe',
      content: 'The ability to compare responses from different models side-by-side is game-changing for our development workflow.',
      result: '40% improvement in code quality',
      rating: 5,
      avatar: 'MR'
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager at Notion',
      content: 'Finally, an AI tool that understands enterprise needs. The reliability and speed are unmatched.',
      result: '60% reduction in response time',
      rating: 5,
      avatar: 'EW'
    },
    {
      name: 'David Kim',
      role: 'CTO at StartupXYZ',
      content: 'T3Dotgg became essential to our product development. The insights from multiple models are invaluable.',
      result: '3x faster product iterations',
      rating: 5,
      avatar: 'DK'
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
              Trusted by <span className="text-purple-500">Innovators</span>
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto text-white">
              See how leading companies and researchers are accelerating their work with t3Dotgg
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="relative glass-card p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Stars */}
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                <div className="flex justify-center mb-6 text-white">
                  {[...Array(testimonials[currentIndex]?.rating)].map((_, i) => (
                    <Star key={i} size={24} weight="fill" className="text-yellow-400 mx-1" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed max-w-4xl mx-auto">
                  {testimonials[currentIndex]?.content}
                </blockquote>

                {/* Result Badge */}
                <div className="inline-block glass-card px-6 py-3 mb-8 text-white">
                  <p className="text-purple-300 font-semibold">
                    {testimonials[currentIndex]?.result}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonials[currentIndex]?.avatar}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">
                        {testimonials[currentIndex]?.name}
                    </p>
                    <p className="text-muted text-sm">
                      {testimonials[currentIndex]?.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={prevTestimonial}
                className="p-3 glass-card hover:bg-white/10 transition-colors rounded-full group"
              >
                <ArrowLeft size={20} weight="light" className="text-white/70 group-hover:text-white" />
              </button>

              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary-500 w-8' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-3 glass-card hover:bg-white/10 transition-colors rounded-full group"
              >
                <ArrowRight size={20} weight="light" className="text-white/70 group-hover:text-white" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;