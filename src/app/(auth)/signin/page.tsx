'use client';
import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import styles from '../auth.module.scss';
import { isValidEmail } from '@/utils';
import { signIn } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Checkbox from "@/components/Checkbox/Checkbox";

const SignIn: React.FC = () => {
  const router = useRouter();

  const [error, setError] = useState({
    email: '',
    password: '',
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  // State for remember me checkbox
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    const { email, password } = signInData;

    if (!isValidEmail(email)) {
      setError({ ...error, email: 'Email is invalid' });
      return;
    }

    if (!password || password.length < 8) {
      setError({ ...error, password: 'Password is invalid' });
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      rememberMe,
    });

    if (res?.error) {
      setError({ email: '', password: 'Invalid email or password' });
      if (res?.url) router.replace('/');
    } else {
      redirect('/');
      setError({ email: '', password: '' });
    }
  };

  return (
      <div className={styles.container}>
        <p className={styles.container_title}>Sign in</p>
        <div className={styles.container_form}>
          <Input
              placeholder="Email"
              errorMessage={error.email}
              value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
          />
          <Input
              placeholder="Password"
              type="password"
              errorMessage={error.password}
              value={signInData.password}
              onChange={(e) =>
                  setSignInData({ ...signInData, password: e.target.value })
              }
          />
          {/* Replace "Remember me" text with the CustomCheckbox */}
          <div className={styles.checkboxContainer}>
            <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={setRememberMe} // Update the state when checkbox is toggled
            />
          </div>
          <Button onClick={handleSubmit}>Login</Button>
        </div>
      </div>
  );
};

export default SignIn;
