import React, { createContext, useContext, useState, useEffect } from 'react';
import { Feedback } from '../types';

interface FeedbackContextType {
  feedbacks: Feedback[];
  getProductFeedbacks: (productId: string) => Feedback[];
  addFeedback: (productId: string, rating: number, comment: string, customerName?: string, customerId?: string) => void;
  deleteFeedback: (feedbackId: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

const FEEDBACK_STORAGE_KEY = 'harvesthub_feedbacks';

const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: 'fb-1',
    productId: 'prod-1',
    customerId: 'user-customer-1',
    customerName: 'Priya Sundaram',
    rating: 5,
    comment: 'Exceptional seed quality! Germination rate was over 96% in our trial plot. Highly recommended for Rabi season.',
    createdAt: '2026-02-25T11:00:00Z',
  },
  {
    id: 'fb-2',
    productId: 'prod-6',
    customerId: 'user-customer-1',
    customerName: 'Priya Sundaram',
    rating: 5,
    comment: 'Farm-fresh tomatoes arrived perfectly ripe and completely undamaged. The aroma and flavor are miles ahead of supermarket produce.',
    createdAt: '2026-03-03T16:20:00Z',
  },
  {
    id: 'fb-3',
    productId: 'prod-4',
    customerId: 'user-farmer-2',
    customerName: 'Gurpreet Singh',
    rating: 5,
    comment: 'Drip kit components are heavy duty and durable under high pump pressures. Cut water usage dramatically.',
    createdAt: '2026-02-28T09:10:00Z',
  }
];

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FEEDBACKS;
  });

  useEffect(() => {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  const getProductFeedbacks = (productId: string) => {
    return feedbacks.filter(f => f.productId === productId);
  };

  const addFeedback = (productId: string, rating: number, comment: string, customerName = 'Verified Buyer', customerId = 'user-customer-1') => {
    const newFeedback: Feedback = {
      id: `fb-${Date.now()}`,
      productId,
      customerId,
      customerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const deleteFeedback = (feedbackId: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        getProductFeedbacks,
        addFeedback,
        deleteFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
