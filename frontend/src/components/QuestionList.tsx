/**
 * Question List Component
 * Displays questions with real-time updates
 */
'use client';

import { useEffect, useState } from 'react';
import { questionApi } from '@/utils/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import QuestionItem from './QuestionItem';
import styles from './QuestionList.module.css';

export interface Question {
  question_id: number;
  username: string;
  message: string;
  status: 'Pending' | 'Escalated' | 'Answered';
  timestamp: string;
  updated_at: string;
  answers: Answer[];
}

export interface Answer {
  answer_id: number;
  question_id: number;
  username: string;
  message: string;
  timestamp: string;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { isConnected, lastMessage } = useWebSocket(token || undefined);

  // Load initial questions
  useEffect(() => {
    loadQuestions();
  }, []);

  // Handle real-time WebSocket updates
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'new_question':
        setQuestions((prev) => [lastMessage.data, ...prev]);
        break;

      case 'question_updated':
        setQuestions((prev) =>
          prev.map((q) =>
            q.question_id === lastMessage.data.question_id
              ? lastMessage.data
              : q
          )
        );
        break;

      case 'new_answer':
        setQuestions((prev) =>
          prev.map((q) =>
            q.question_id === lastMessage.data.question_id
              ? {
                  ...q,
                  answers: [...q.answers, lastMessage.data],
                }
              : q
          )
        );
        break;

      case 'admin_notification':
        // Handle admin notifications (could show a toast)
        console.log('Admin notification:', lastMessage.data);
        break;
    }
  }, [lastMessage]);

  const loadQuestions = async () => {
    setLoading(true);
    setError('');

    const response = await questionApi.getAll();

    if (response.error) {
      setError(response.error);
    } else {
      setQuestions((response.data as any) || []);
    }

    setLoading(false);
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    // Escalated first
    if (a.status === 'Escalated' && b.status !== 'Escalated') return -1;
    if (a.status !== 'Escalated' && b.status === 'Escalated') return 1;
    
    // Then by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  if (loading) {
    return <div className={styles.loading}>Loading questions...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading questions: {error}</p>
        <button onClick={loadQuestions} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Questions</h2>
        <div className={styles.statusIndicator}>
          <span className={isConnected ? styles.connected : styles.disconnected}>
            {isConnected ? '● Live' : '○ Disconnected'}
          </span>
        </div>
      </div>

      {sortedQuestions.length === 0 ? (
        <div className={styles.empty}>
          <p>No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className={styles.questionList}>
          {sortedQuestions.map((question) => (
            <QuestionItem key={question.question_id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
