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
    <div className='user_container'>
      <h2>注册</h2>
      <div className='input_field_container'>
        <input
          className='input_field'
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='input_field'
          type="name"
          placeholder="用户名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='input_field'
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='user_type_button_container'>
          <button
            className="user_type_button"
            style={{
              backgroundColor: userType === 'designer' ? '#006AEE' : '#f0f0f0',
              color: userType === 'designer' ? 'white' : 'black',
            }}
            onClick={() => setUserType('designer')}
          >
            Designer
          </button>
          <button
            className="user_type_button"
            style={{
              backgroundColor: userType === 'researcher' ? '#006AEE' : '#f0f0f0',
              color: userType === 'researcher' ? 'white' : 'black',
            }}
            onClick={() => setUserType('researcher')}
          >
            Researcher
          </button>
        </div>
        <button className="user_type_button" onClick={handleRegister}>
          注册
        </button>
      </div>

    </div>
  );
}
