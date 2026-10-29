'use client';

import UserForm from '@/components/UserForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserRegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  // フォーム送信時の処理
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // 入力チェック
    if (
      !name?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !confirmPassword?.trim()
    ) {
      setErrorMessage('すべての項目を入力してください。');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('パスワードが一致しません。');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/?registered=1');
      } else {
        const data = await res.json();
        setErrorMessage(data.message || '登録に失敗しました。');
      }
    } catch (error) {
      console.error('会員登録通信エラー:', error);
      setErrorMessage('通信エラーが発生しました。');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-base) px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-(--color-secondary) bg-white p-8 shadow-sm sm:p-10">
        {/* タイトル */}
        <h1 className="mb-2 text-center text-2xl font-semibold text-(--text-main)">
          会員登録
        </h1>

        {/* エラーメッセージ */}
        {errorMessage && (
          <p
            role="alert"
            className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600"
          >
            {errorMessage}
          </p>
        )}

        {/* 登録フォーム */}
        <UserForm
          onSubmit={handleSubmit}
          withPassword={true}
          submitLabel="登録"
        />
      </div>
    </main>
  );
}
