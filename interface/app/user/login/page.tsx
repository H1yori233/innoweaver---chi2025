"use client";

import { useState, useCallback } from 'react';
import { fetchLogin } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = useCallback(async () => {
    console.log('Email:', email, 'Password:', password);
    const result = await fetchLogin(email, password);
    if (result.token) {
      router.push('/');
    }
  }, [email, password, router]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary font-sans text-text-primary">
      <h2 className="text-xl font-bold">登录</h2>
      <div className="flex flex-col gap-3 w-[300px] mt-2">
        <input
          className="p-3 text-base border border-border-secondary rounded-md text-text-secondary bg-primary outline-none focus:ring-2 focus:ring-border-secondary transition-all"
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-3 text-base border border-border-secondary rounded-md text-text-secondary bg-primary outline-none focus:ring-2 focus:ring-border-secondary transition-all"
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-secondary text-text-primary rounded-md py-2 px-4 transition-colors duration-300 hover:bg-border-secondary"
          onClick={handleLogin}
        >
          登录
        </button>
      </div>
    </div>
  );
}
