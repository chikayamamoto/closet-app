'use client';

import { SidebarItem } from '@/components/SidebarItem';
import {
  HomeIcon,
  ClockIcon,
  SparklesIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

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
        <img src="/images/Closelle_logo.png" alt="Closelle" />
      </div>

      {/* アイテム追加 */}
      <div className="mt-2 flex justify-center">
        <Link
          href="/clothes/new"
          className="inline-flex items-center justify-center rounded-full bg-(--color-primary) px-5 py-3 text-[var(--text-main)] transition-colors hover:bg-[var(--color-secondary)]"
        >
          ＋ アイテムを追加
        </Link>
      </div>

      {/* メニュー */}
      <nav className="mt-6 flex flex-col grow">
        <ul>
          <SidebarItem href="/closet" icon={HomeIcon} label="クローゼット" />
          <SidebarItem href="/history" icon={ClockIcon} label="着用履歴" />
          <SidebarItem href="/outfits" icon={SparklesIcon} label="コーディネート" />
        </ul>
      </nav>

      {/* 下部リンク */}
      <nav aria-label="User menu" className="mt-auto mb-6 flex flex-col">
        <ul>
          <SidebarItem href="/mypage" icon={UserIcon} label="マイページ" />
          <SidebarItem
            href="/login"
            icon={ArrowRightStartOnRectangleIcon}
            label="ログアウト"
            onClick={handleLogout}
          />
        </ul>
      </nav>

    </aside>
  );
}
