'use client';

import React from 'react';

// ユーザーフォームのプロパティ 
interface UserFormProps {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  initialValues?: {
    name: string;
    email: string;
  };
  submitLabel: string;
  withPassword?: boolean;
}

// 入力欄の共通スタイル
const inputStyle =
  'w-full rounded-lg border border-[#E8D5C8] bg-white px-4 py-3 text-(--text-main) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-secondary)';

// ラベルの共通スタイル
const labelStyle =
  'mb-2 block text-sm font-medium text-(--text-main)';

// 必須バッジの共通スタイル
const badgeStyle =
  'ml-2 rounded-md bg-(--color-secondary) px-2 py-1 text-xs font-normal text-(--text-main)';

  // ユーザーフォーム
  export default function UserForm({
  onSubmit,
  initialValues = { name: '', email: '' },
  submitLabel,
  withPassword = false,
}: UserFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      {/* 氏名 */}
      <div>
        <label className={labelStyle} htmlFor="name">
          氏名
          <span className={badgeStyle}>必須</span>
        </label>

        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          required
          defaultValue={initialValues.name}
          className={inputStyle}
          placeholder="氏名を入力"
        />
      </div>

      {/* メールアドレス */}
      <div>
        <label className={labelStyle} htmlFor="email">
          メールアドレス
          <span className={badgeStyle}>必須</span>
        </label>

        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          defaultValue={initialValues.email}
          className={inputStyle}
          placeholder="メールアドレスを入力"
        />
      </div>

      {/* パスワード */}
      {withPassword && (
        <>
          <div>
            <label className={labelStyle} htmlFor="password">
              パスワード
              <span className={badgeStyle}>必須</span>
            </label>

            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              required
              className={inputStyle}
              placeholder="パスワードを入力"
            />
          </div>

          {/* パスワード確認 */}
          <div>
            <label className={labelStyle} htmlFor="confirmPassword">
              パスワード（確認用）
              <span className={badgeStyle}>必須</span>
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              className={inputStyle}
              placeholder="もう一度パスワードを入力"
            />
          </div>
        </>
      )}

      {/* 登録ボタン */}
      <button
        type="submit"
        className="w-full rounded-xl bg-(--color-primary) px-4 py-3 font-semibold text-(--text-main) transition-colors hover:bg-(--hover-light)"
      >
        {submitLabel}
      </button>
    </form>
  );
}
