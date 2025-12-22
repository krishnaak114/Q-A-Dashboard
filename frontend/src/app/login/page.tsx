/**
 * Login Page (Page 1)
 * Admin authentication
 */
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/api';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authApi.login(username, password);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Store token and fetch user info
        localStorage.setItem('token', response.data.access_token);
        
        // Get user details
        const userResponse = await authApi.me(response.data.access_token);
        if (userResponse.data) {
          const userData = userResponse.data as any;
          localStorage.setItem('username', userData.username);
          localStorage.setItem('isAdmin', String(userData.is_admin === 1));
        }

        // Redirect to dashboard
        router.push('/');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Access your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className={styles.link}
            >
              Register here
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
