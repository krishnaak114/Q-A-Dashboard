/**
 * Individual Question Item Component
 * Shows question details, status, and allows admins to manage
 */
'use client';

import { useState } from 'react';
import { questionApi } from '@/utils/api';
import type { Question, Answer } from './QuestionList';
import styles from './QuestionItem.module.css';

interface QuestionItemProps {
  question: Question;
}

export default function QuestionItem({ question }: QuestionItemProps) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check if user is admin
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') === 'true' : false;

  const handleStatusChange = async (newStatus: string) => {
    if (!token) return;

    setError('');
    const response = await questionApi.updateStatus(question.question_id, newStatus, token);

    if (response.error) {
      setError(response.error);
    }
  };

  const handleAnswerSubmit = async (e: any) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setIsSubmitting(true);
    setError('');

    const username = localStorage.getItem('username') || 'Guest';
    const response = await questionApi.addAnswer(
      question.question_id,
      answerText,
      username,
      token || undefined
    );

    if (response.error) {
      setError(response.error);
    } else {
      setAnswerText('');
      setShowAnswerForm(false);
    }

    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColors = {
    Pending: styles.statusPending,
    Escalated: styles.statusEscalated,
    Answered: styles.statusAnswered,
  };

  return (
    <div className={`${styles.questionCard} ${question.status === 'Escalated' ? styles.escalated : ''}`}>
      <div className={styles.questionHeader}>
        <div className={styles.questionMeta}>
          <span className={styles.username}>{question.username}</span>
          <span className={styles.timestamp}>{formatDate(question.timestamp)}</span>
        </div>
        <span className={`${styles.status} ${statusColors[question.status]}`}>
          {question.status}
        </span>
      </div>

      <div className={styles.questionBody}>
        <p className={styles.message}>{question.message}</p>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className={styles.adminControls}>
          <span className={styles.adminLabel}>Admin Actions:</span>
          <div className={styles.statusButtons}>
            <button
              onClick={() => handleStatusChange('Pending')}
              className={`${styles.statusButton} ${styles.btnPending}`}
              disabled={question.status === 'Pending'}
            >
              Mark Pending
            </button>
            <button
              onClick={() => handleStatusChange('Escalated')}
              className={`${styles.statusButton} ${styles.btnEscalated}`}
              disabled={question.status === 'Escalated'}
            >
              Escalate
            </button>
            <button
              onClick={() => handleStatusChange('Answered')}
              className={`${styles.statusButton} ${styles.btnAnswered}`}
              disabled={question.status === 'Answered'}
            >
              Mark Answered
            </button>
          </div>
        </div>
      )}

      {/* Answers Section */}
      {question.answers && question.answers.length > 0 && (
        <div className={styles.answersSection}>
          <h4 className={styles.answersTitle}>Answers ({question.answers.length})</h4>
          {question.answers.map((answer: Answer) => (
            <div key={answer.answer_id} className={styles.answer}>
              <div className={styles.answerHeader}>
                <span className={styles.answerUsername}>{answer.username}</span>
                <span className={styles.answerTimestamp}>{formatDate(answer.timestamp)}</span>
              </div>
              <p className={styles.answerMessage}>{answer.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Answer Form */}
      <div className={styles.answerFormSection}>
        {!showAnswerForm ? (
          <button
            onClick={() => setShowAnswerForm(true)}
            className={styles.answerButton}
          >
            + Add Answer
          </button>
        ) : (
          <form onSubmit={handleAnswerSubmit} className={styles.answerForm}>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Write your answer..."
              className={styles.answerInput}
              rows={3}
              maxLength={1000}
            />
            <div className={styles.answerFormButtons}>
              <button type="submit" disabled={isSubmitting} className={styles.submitAnswer}>
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAnswerForm(false);
                  setAnswerText('');
                  setError('');
                }}
                className={styles.cancelAnswer}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
