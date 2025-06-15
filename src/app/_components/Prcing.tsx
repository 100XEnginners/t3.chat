"use client"
import React from 'react';
import { Check, Star } from '@phosphor-icons/react';
import ScrollReveal from '../components/ScrollReveal';
import PricingButton from '@/components/ui/pricing-button';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with AI aggregation',
      features: [
        '100 queries per month',
        'Access to 3 AI models',
        'Basic analytics',
        'Community support',
        'Standard response time'
      ],
      recommended: false,
    },
    {
      name: 'Pro',
      price: '$8',
      period: 'per month',
      description: 'Ideal for professionals and growing teams',
      features: [
        'Unlimited queries',
        'Access to all AI models',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'API access',
        'Team collaboration'
      ],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: '$0',
      period: 'contact us',
      description: 'Tailored solutions for large organizations',
      features: [
        'Everything in Pro',
        'Dedicated infrastructure',
        'SLA guarantees',
        'Custom model training',
        'On-premise deployment',
        'Dedicated support team',
        'Advanced security features'
      ],
      recommended: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Simple <span className="text-primary-400">Pricing</span>
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto text-white">
                Choose the perfect plan for your AI needs. Start free and scale as you grow.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
                <div className={`glass-card p-8 relative group bg-white/10 hover:bg-white/10 transition-all duration-300 ${
                plan.recommended ? 'ring-2 ring-primary-500/50' : ''
              }`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star size={16} weight="fill" />
                      <span>Recommended</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== '$0' && (
                      <span className="text-muted ml-1">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-muted text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check size={20} weight="bold" className="text-primary-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                  <PricingButton plan={plan.name} amount={Number(plan.price.split('$')[1])} />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <p className="text-muted">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PricingSection;