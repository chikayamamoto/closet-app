'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HomeIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
export default function Sidebar() {
    return (
        <aside
            className="
    w-60
    min-h-screen
    bg-[#FFF1DF]
    text-[#68483f]
    flex flex-col
  "
        >
            {/* ロゴ */}
            <div
                className="
      h-[150px]
      flex items-center justify-center
      p-5
    "
            >
                <img src="/images/Closelle_logo.png" width={160} />
            </div>

            {/* アイテム追加 */}
            <div className="flex justify-center mt-2">
                <Link
                    href="/clothes/new"
                    className="
        inline-flex items-center justify-center
        px-5 py-3
        rounded-full
        bg-[#F7C2AB]
        text-[#68483f]
        w-[200px]
        hover:bg-[#F4B8A0]
        transition-colors
      "
                >
                    ＋ アイテムを追加
                </Link>
            </div>

            {/* メニュー */}
            <nav className="mt-6 flex flex-col">
                <Link
                    href="/closet"
                    className="
        flex items-center gap-3
        h-11 px-8
        hover:bg-[#FFE0D2]
        rounded-md
      "
                >
                    <HomeIcon className="w-5 h-5" />
                    クローゼット
                </Link>

                <Link
                    href="/history"
                    className="
        flex items-center gap-3
        h-11 px-8
        hover:bg-[#FFE0D2]
        rounded-md
      "
                >
                    <ClockIcon className="w-5 h-5" />
                    着用履歴
                </Link>

                <Link
                    href="/outfits"
                    className="
        flex items-center gap-3
        h-11 px-8
        hover:bg-[#FFE0D2]
        rounded-md
      "
                >
                    <SparklesIcon className="w-5 h-5" />
                    コーディネート
                </Link>
            </nav>
        </aside>

    );
}
