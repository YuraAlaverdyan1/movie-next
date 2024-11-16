'use client';
import React, {useState} from 'react';
import {Button, Input} from '@/components/ui';

import styles from '../auth.module.scss';
import {useRouter} from 'next/navigation';
import {isValidEmail} from '@/utils';

const SignIn: React.FC = () => {
  const router = useRouter();

  const [error, setError] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    const {email, password} = signUpData;

    if (!isValidEmail(email)) {
      setError({...error, email: 'Email is invalid'});
      return;
    }

    if (!password || password.length < 8) {
      setError({...error, password: 'Password is invalid'});
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        setError({...error, email: 'The email already in use'});
      }
      if (res.status === 200) {
        setError({email: '', password: ''});
        router.push('/signin');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.container_title}>Sign Up</p>
      <div className={styles.container_form}>
        <Input
          placeholder="Email"
          errorMessage={error.email}
          value={signUpData.email}
          onChange={e => setSignUpData({...signUpData, email: e.target.value})}
        />
        <Input
          placeholder="Password"
          errorMessage={error.password}
          value={signUpData.password}
          onChange={e =>
            setSignUpData({...signUpData, password: e.target.value})
          }
        />
        <Button onClick={handleSubmit}>Sign Up</Button>
      </div>
    </div>
  );
};

export default SignIn;
