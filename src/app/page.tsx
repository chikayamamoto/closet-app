'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ClothesButton } from '@/components/ClothesButton';
import type { ClothingItem } from '@/types/clothes';

// カテゴリ一覧
const categories = [
  { label: 'すべて', value: 'all' },
  { label: 'トップス', value: 'トップス' },
  { label: 'ボトムス', value: 'ボトムス' },
  { label: 'シューズ', value: 'シューズ' },
  { label: 'ワンピース', value: 'ワンピース' },
  { label: 'アウター', value: 'アウター' },
  { label: '小物', value: '小物' },
];

export default function Home() {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');


  // DBから洋服一覧を取得する
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
        console.error('洋服の取得エラー:', error);
      }
    };

    // 最初に一覧を取得する
    fetchClothes();

    // アイテム追加後の通知を受け取る
    const handleClothesUpdated = () => {
      fetchClothes();
    };

    window.addEventListener(
      'clothes-updated',
      handleClothesUpdated
    );

    // ページを離れるときに通知を解除する
    return () => {
      window.removeEventListener(
        'clothes-updated',
        handleClothesUpdated
      );
    };
  }, []);

  // 選択したカテゴリの洋服だけを表示する
  const filteredClothes =
    selectedCategory === 'all'
      ? clothes
      : clothes.filter(
        (clothing) => clothing.category === selectedCategory
      );

  return (
    <div className="flex min-h-screen">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <main className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold">
          クローゼット
        </h1>

        {/* カテゴリボタン */}
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

        {/* 洋服一覧 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredClothes.map((clothing) => (
            <div
              key={clothing.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              {/* 洋服の画像 */}
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

        {/* 洋服がない場合 */}
        {filteredClothes.length === 0 && (
          <p className="mt-8 text-gray-500">
            このカテゴリには洋服がありません。
          </p>
        )}
      </main>
    </div>
  );
}
