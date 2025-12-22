/**
 * Question Form Component
 * Includes AJAX XMLHttpRequest validation as per assignment requirements
 */
'use client';

import { useState, FormEvent } from 'react';
import { questionApi, validateQuestionInput } from '@/utils/api';
import styles from './QuestionForm.module.css';

interface QuestionFormProps {
  onQuestionSubmitted?: () => void;
}

export default function QuestionForm({ onQuestionSubmitted }: QuestionFormProps) {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // AJAX XMLHttpRequest validation (as per assignment requirement)
    const validation = await validateQuestionInput(message);
    if (!validation.valid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const displayName = username.trim() || 'Guest';
      
      const response = await questionApi.create(message, displayName, token || undefined);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Question submitted successfully!');
        setMessage('');
        setUsername('');
        
        if (onQuestionSubmitted) {
          onQuestionSubmitted();
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to submit question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Ask a Question</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Guest"
            className={styles.input}
            maxLength={50}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Question <span className={styles.required}>*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What would you like to know?"
            className={styles.textarea}
            rows={4}
            maxLength={1000}
            required
          />
          <div className={styles.charCount}>
            {message.length}/1000 characters
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
}
