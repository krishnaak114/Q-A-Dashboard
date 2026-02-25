/**
 * Main Dashboard Page (Page 3: Forum/Q&A)
 * All users can view and answer questions
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';
import styles from './page.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    
    setUsername(storedUsername);
    setIsAdmin(storedIsAdmin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.logo}>Real-Time Q&A Dashboard</h1>
          <div className={styles.navRight}>
            {username ? (
              <>
                <span className={styles.welcome}>
                  Welcome, <strong>{username}</strong>
                  {isAdmin && <span className={styles.adminBadge}>Admin</span>}
                </span>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className={styles.guestLabel}>Browsing as Guest</span>
                <button
                  onClick={() => router.push('/login')}
                  className={styles.loginButton}
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className={styles.registerButton}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.content}>
          <QuestionForm />
          <QuestionList />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Real-Time Q&A Dashboard | Full-Stack Assessment Project</p>
        <p className={styles.features}>
          Features: FastAPI Backend | Next.js Frontend | WebSocket Real-time | 
          JWT Auth | AJAX Validation
        </p>
      </footer>
    </div>
  );
}
