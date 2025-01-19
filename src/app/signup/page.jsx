'use client';  // Mark this component as a client component

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './signup.module.css';  // Import the CSS module

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name,email, password }),
    });

    if (response.ok) {
      router.push('/welcome');
    } else {
      setError('Signup failed. Please try again.');
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input type="name" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit">Sign Up</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
