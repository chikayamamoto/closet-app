'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  // ログイン処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 入力チェック
    if (!email?.trim() || !password?.trim()) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
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
    <main className="flex min-h-screen items-center justify-center bg-(--color-base) px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-(--color-secondary) bg-white p-8 shadow-sm sm:p-10">
        {/* タイトル */}
        <h1 className="mb-2 text-center text-2xl font-semibold text-(--text-main)">
          ログイン
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

        {/* ログインフォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メールアドレス */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-(--text-main)"
            >
              メールアドレス
              <span className="ml-2 rounded-md bg-(--color-secondary) px-2 py-1 text-xs font-normal text-(--text-main)">
                必須
              </span>
            </label>

            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-[#E8D5C8] bg-white px-4 py-3 text-(--text-main) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-secondary)"
              placeholder="メールアドレスを入力"
            />
          </div>

          {/* パスワード */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-(--text-main)"
            >
              パスワード
              <span className="ml-2 rounded-md bg-(--color-secondary) px-2 py-1 text-xs font-normal text-(--text-main)">
                必須
              </span>
            </label>

            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-[#E8D5C8] bg-white px-4 py-3 text-(--text-main) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-secondary)"
              placeholder="パスワードを入力"
            />
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            className="w-full rounded-xl bg-(--color-primary) px-4 py-3 font-semibold text-(--text-main) transition-colors hover:bg-(--hover-light)"
          >
            ログイン
          </button>

          {/* 会員登録へのリンク */}
          <div className="border-t border-(--color-secondary) pt-5 text-center">
            <p className="mb-2 text-sm text-(--text-main)/70">
              まだアカウントをお持ちでない方
            </p>

            <Link
              href="/register"
              className="text-sm font-semibold text-(--text-main) underline decoration-(--color-primary) underline-offset-4 transition-colors hover:text-(--color-primary)"
            >
              会員登録はこちら
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
