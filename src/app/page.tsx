
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import { ClothesButton } from '@/components/ClothesButton';
import type { ClothingItem } from '@/types/clothes';

export default function Home() {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await fetch('/api/clothes');

        if (!response.ok) {
          throw new Error('洋服の取得に失敗しました');
        }

        const data: ClothingItem[] = await response.json();
        setClothes(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClothes();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold">
          クローゼット
        </h1>

        {/* カテゴリーボタン */}
        <div className="mb-8 flex flex-wrap gap-3">
          <ClothesButton href="/clothes" label="すべて" />
          <ClothesButton href="/clothes/tops" label="トップス" />
          <ClothesButton href="/clothes/bottoms" label="ボトムス" />
          <ClothesButton href="/clothes/shoes" label="シューズ" />
          <ClothesButton href="/clothes/onepiece" label="ワンピース" />
          <ClothesButton href="/clothes/outwear" label="アウター" />
          <ClothesButton href="/clothes/inner" label="小物" />
        </div>

        {/* 洋服の画像一覧 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {clothes.map((clothing) => (
            <div
              key={clothing.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <img
                src={clothing.image_path}
                className="h-40 w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* 洋服が登録されていない場合 */}
        {clothes.length === 0 && (
          <p className="mt-8 text-gray-500">
            まだ洋服が登録されていません。
          </p>
        )}
      </main>
    </div>
  );
}
