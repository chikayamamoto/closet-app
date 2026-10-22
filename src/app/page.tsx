
'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ClothesButton } from '@/components/ClothesButton';
import type { ClothingItem } from '@/types/clothes';

const categories = [
  { label: 'すべて', value: 'all', href: '/clothes' },
  { label: 'トップス', value: 'tops', href: '/clothes/tops' },
  { label: 'ボトムス', value: 'bottoms', href: '/clothes/bottoms' },
  { label: 'シューズ', value: 'shoes', href: '/clothes/shoes' },
  { label: 'ワンピース', value: 'onepiece', href: '/clothes/onepiece' },
  { label: 'アウター', value: 'outwear', href: '/clothes/outwear' },
  { label: '小物', value: 'inner', href: '/clothes/inner' },
];

export default function Home() {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // 選択したカテゴリの洋服だけを表示
  const filteredClothes =
    selectedCategory === 'all'
      ? clothes
      : clothes.filter(
        (clothing) => clothing.category ===
          categories.find(
            (category) => category.value === selectedCategory
          )?.label
      );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold">
          クローゼット
        </h1>
        {/* カテゴリーボタン */}

        {/* カテゴリーボタン */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <ClothesButton
              key={category.value}
              label={category.label}
              selected={selectedCategory === category.value}
              onClick={() => setSelectedCategory(category.value)}
            />
          ))}
        </div>

        {/* 絞り込んだ洋服を表示 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredClothes.map((clothing) => (
            <div
              key={clothing.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <div className="flex h-44 items-center justify-center">
                <img
                  src={clothing.image_path}
                  alt={clothing.category}
                  className="h-40 w-full object-contain"
                />
              </div>

            </div>
          ))}
        </div>

        {filteredClothes.length === 0 && (
          <p className="mt-8 text-gray-500">
            このカテゴリには洋服がありません。
          </p>
        )}
      </main>
    </div>
  );
}
