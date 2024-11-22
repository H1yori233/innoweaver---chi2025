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
    <div className='flex flex-col justify-center items-center h-screen bg-black text-white;
  font-family: "Inter", sans-serif'>
      <h2>注册</h2>
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
          type="name"
          placeholder="用户名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='text-base border text-[black] p-2.5 rounded-[5px] border-solid border-[#ccc]'
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='flex justify-between gap-2.5'>
          <button
            className="text-base flex-1 bg-[#888888] text-white cursor-pointer transition-[background-color] duration-[0.3s] ease-[ease] px-5 py-2.5 rounded-[5px] border-[none] hover:'bg-[#0056b3]'"
            style={{
              backgroundColor: userType === 'designer' ? '#006AEE' : '#f0f0f0',
              color: userType === 'designer' ? 'white' : 'black',
            }}
            onClick={() => setUserType('designer')}
          >
            Designer
          </button>
          <button
            className="text-base flex-1 bg-[#888888] text-white cursor-pointer transition-[background-color] duration-[0.3s] ease-[ease] px-5 py-2.5 rounded-[5px] border-[none] hover:'bg-[#0056b3]'"
            style={{
              backgroundColor: userType === 'researcher' ? '#006AEE' : '#f0f0f0',
              color: userType === 'researcher' ? 'white' : 'black',
            }}
            onClick={() => setUserType('researcher')}
          >
            Researcher
          </button>
        </div>
        <button className="text-base flex-1 bg-[#888888] text-white cursor-pointer transition-[background-color] duration-[0.3s] ease-[ease] px-5 py-2.5 rounded-[5px] border-[none] hover:'bg-[#0056b3]'" onClick={handleRegister}>
          注册
        </button>
      </div>

    </div>
  );
}
