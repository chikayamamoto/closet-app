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
      // 以前のアイテムを消してから取得する
      setClothes([]);

      try {
        const response = await fetch('/api/clothes', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('洋服の取得に失敗しました');
        }

        const data: ClothingItem[] = await response.json();
        setClothes(data);
      } catch (error) {
        console.error('洋服の取得エラー:', error);
        setClothes([]);
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

      {/* メインエリア */}
      <main className="min-w-0 flex-1 p-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">

          <section className="min-w-0">
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
                  onClick={() =>
                    setSelectedCategory(category.value)
                  }
                />
              ))}
            </div>

            {/* 洋服一覧 */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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

            {/* 洋服がない場合 */}
            {filteredClothes.length === 0 && (
              <p className="mt-8 text-gray-500">
                このカテゴリにはアイテムがありません。
              </p>
            )}
          </section>
          <aside className="flex flex-col gap-6">
            {/* 天気情報 */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">
                今日の天気
              </h2>

              <p className="text-sm text-gray-500">
                天気情報
              </p>
            </section>

            {/* AIコーディネート */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">
                AIコーディネート
              </h2>

              <p className="text-sm text-gray-500">
                おすすめのコーディネート
              </p>
            </section>
          </aside>

        </div>
      </main>
    </div>
  );
}

