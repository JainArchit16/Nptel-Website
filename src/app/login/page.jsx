'use client';  // Mark this component as a client component

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './login.module.css';  // Import the CSS module

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('token', result.token); // Store JWT token
      router.push('/dashboard');
    } else {
      const result = await response.json();
      setError(result.error || 'Login failed. Please try again.');
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Log In</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
