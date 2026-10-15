'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email?.trim() || !password?.trim()) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push('/?logged-in=1');
        router.refresh();
      } else {
        const data = await res.json();
        setErrorMessage(data.message || 'ログインに失敗しました。');
      }
    } catch (error) {
      console.error('ログイン通信エラー:', error);
      setErrorMessage('通信エラーが発生しました。');
    }
  };

  return (
<main className="min-h-screen flex items-center justify-center bg-[#FFF1DF]">
  <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 border border-[#FEE3D7]">
    <h1 className="text-center text-2xl font-semibold text-[#8B5E3C] mb-6">
      ログイン
    </h1>

    {errorMessage && (
      <p className="text-red-500 text-center mb-4">{errorMessage}</p>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block font-medium text-[#8B5E3C] mb-1">
          メールアドレス
          <span className="ml-2 px-2 py-0.5 bg-[#FEE3D7] text-[#8B5E3C] text-xs rounded-md">
            必須
          </span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full border border-[#F7C2AB] px-3 py-2 rounded-md bg-[#FFF1DF] focus:ring-2 focus:ring-[#F7C2AB]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-medium text-[#8B5E3C] mb-1">
          パスワード
          <span className="ml-2 px-2 py-0.5 bg-[#FEE3D7] text-[#8B5E3C] text-xs rounded-md">
            必須
          </span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full border border-[#F7C2AB] px-3 py-2 rounded-md bg-[#FFF1DF] focus:ring-2 focus:ring-[#F7C2AB]"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#F7C2AB] hover:bg-[#F4B8A0] text-white py-2 rounded-md font-semibold transition-colors"
      >
        ログイン
      </button>

      <div className="text-center mt-4">
        <Link href="/register" className="text-[#8B5E3C] hover:underline">
          会員登録はこちら
        </Link>
      </div>
    </form>
  </div>
</main>

  );
}
