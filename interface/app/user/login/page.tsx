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
    <div className='flex flex-col justify-center items-center h-screen bg-black text-white;
  font-family: "Inter", sans-serif'>
      <h2>登录</h2>
      <div className='flex flex-col gap-2.5 w-[300px] mt-[5px]'>
        <input
          className='text-base border text-[black] p-2.5 rounded-[5px] border-solid border-[#ccc]'
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='text-base border text-[black] p-2.5 rounded-[5px] border-solid border-[#ccc]'
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='text-base flex-1 bg-[#888888] text-white cursor-pointer transition-[background-color] duration-[0.3s] ease-[ease] px-5 py-2.5 rounded-[5px] border-[none] hover:"bg-[#0056b3]"' onClick={handleLogin}>
          登录
        </button>
      </div>

    </div>
  );
}
