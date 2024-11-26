"use client";

import { useState, useCallback } from 'react';
import { fetchRegister } from '@/lib/actions'
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('designer');
  const router = useRouter();

  const handleRegister = useCallback(async () => {
    const result = await fetchRegister(email, name, password, userType);
    console.log(result);
    router.push('/user/login');
  }, [email, name, password, userType, router]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary font-sans text-text-primary">
      <h2 className="text-xl font-bold mb-4">注册</h2>
      <div className="flex flex-col gap-3 w-[300px]">
        <input
          className="p-3 text-base border border-border-secondary rounded-md text-text-secondary bg-primary outline-none focus:ring-2 focus:ring-border-secondary transition-all"
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-3 text-base border border-border-secondary rounded-md text-text-secondary bg-primary outline-none focus:ring-2 focus:ring-border-secondary transition-all"
          type="text"
          placeholder="用户名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="p-3 text-base border border-border-secondary rounded-md text-text-secondary bg-primary outline-none focus:ring-2 focus:ring-border-secondary transition-all"
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-between gap-3">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 ${userType === "designer"
                ? "bg-blue-600 text-white"
                : "bg-secondary text-text-primary hover:bg-border-secondary"
              }`}
            onClick={() => setUserType("designer")}
          >
            Designer
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 ${userType === "researcher"
                ? "bg-blue-600 text-white"
                : "bg-secondary text-text-primary hover:bg-border-secondary"
              }`}
            onClick={() => setUserType("researcher")}
          >
            Researcher
          </button>
        </div>
        <button
          className="w-full bg-secondary text-text-primary rounded-md py-2 px-4 mt-4 transition-colors duration-300 hover:bg-border-secondary"
          onClick={handleRegister}
        >
          注册
        </button>
      </div>
    </div>
  );
}
