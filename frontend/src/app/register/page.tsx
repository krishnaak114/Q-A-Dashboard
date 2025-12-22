/**
 * Register Page (Page 2)
 * User registration with validation
 */
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/api';
import styles from '../login/login.module.css';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.register(username, email, password);

      if (response.error) {
        setError(response.error);
      } else {
        // Auto-login after successful registration
        const loginResponse = await authApi.login(username, password);
        
        if (loginResponse.data) {
          localStorage.setItem('token', loginResponse.data.access_token);
          
          // Get user details
          const userResponse = await authApi.me(loginResponse.data.access_token);
          if (userResponse.data) {
            const userData = userResponse.data as any;
            localStorage.setItem('username', userData.username);
            localStorage.setItem('isAdmin', String(userData.is_admin === 1));
          }

          router.push('/');
        }
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Register</h1>
          <p className={styles.subtitle}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
              minLength={3}
              maxLength={50}
              autoComplete="username"
            />
            <small style={{ fontSize: '12px', color: '#6b7280' }}>
              3-50 characters
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <small style={{ fontSize: '12px', color: '#6b7280' }}>
              Minimum 6 characters
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className={styles.link}
            >
              Login here
            </button>
          </p>
          <p>
            or{' '}
            <button
              onClick={() => router.push('/')}
              className={styles.link}
            >
              continue as guest
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
