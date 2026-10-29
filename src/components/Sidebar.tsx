
'use client';

import { useState } from 'react';
import { SidebarItem } from '@/components/SidebarItem';
import AddButton from '@/components/AddButton';

import {
  HomeIcon,
  ClockIcon,
  SparklesIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { useRouter } from 'next/navigation';
import AddClothingForm from '@/components/AddClothingForm';

export default function Sidebar() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    router.push('/login');
  };

  return (
    <aside className="flex min-h-screen w-60 flex-col bg-(--color-base) text-(--text-main)">
      {/* ロゴ */}
      <div className="flex items-center justify-center p-5">
        <img
          src="/images/Closelle_logo.png"
          alt="Closelle"
        />
      </div>

      {/* アイテム追加 */}
      <div className="mt-2 flex justify-center">
        <AddButton
          label="アイテムを追加"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* メニュー */}
      <nav className="mt-6 flex grow flex-col">
        <ul>
          <SidebarItem
            href="/"
            icon={HomeIcon}
            label="クローゼット"
          />
          <SidebarItem
            href="/history"
            icon={ClockIcon}
            label="着用履歴"
          />
          <SidebarItem
            href="/outfits"
            icon={SparklesIcon}
            label="コーディネート"
          />
        </ul>
      </nav>

      {/* 下部リンク */}
      <nav
        aria-label="User menu"
        className="mb-6 mt-auto flex flex-col"
      >
        <ul>
          <SidebarItem
            href="/mypage"
            icon={UserIcon}
            label="マイページ"
          />
          <SidebarItem
            href="/login"
            icon={ArrowRightStartOnRectangleIcon}
            label="ログアウト"
            onClick={handleLogout}
          />
        </ul>
      </nav>

      {/* アイテム追加モーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-item-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-(--text-main) shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="add-item-title"
                className="text-xl font-semibold"
              >
                アイテムを追加
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="閉じる"
                className="rounded-full p-2 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <AddClothingForm
              onSuccess={() => {
                setIsModalOpen(false);

                window.dispatchEvent(new Event('clothes-updated'));

              }}
              onCancel={() => setIsModalOpen(false)}
            />

          </div>
        </div>
      )}
    </aside>
  );
}
