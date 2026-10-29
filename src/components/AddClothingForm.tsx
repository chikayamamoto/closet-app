
'use client';

import { useState } from 'react';
import { upload } from '@imagekit/next';

interface AddClothingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SEASON_OPTIONS = [
  { value: 'spring', label: '春' },
  { value: 'summer', label: '夏' },
  { value: 'autumn', label: '秋' },
  { value: 'winter', label: '冬' },
  { value: 'all', label: 'オールシーズン' },
];

const CATEGORY_OPTIONS = [
  { value: 'トップス', label: 'トップス' },
  { value: 'ボトムス', label: 'ボトムス' },
  { value: 'シューズ', label: 'シューズ' },
  { value: 'ワンピース', label: 'ワンピース' },
  { value: 'アウター', label: 'アウター' },
  { value: '小物', label: '小物' },
];

export default function AddClothingForm({
  onSuccess,
  onCancel,
}: AddClothingFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [category, setCategory] = useState('トップス');
  const [seasons, setSeasons] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [isDisposalPlanned, setIsDisposalPlanned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 画像を選択する
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('JPEG・PNG・WebP形式の画像を選択してください。');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('画像サイズは5MB以下にしてください。');
      return;
    }

    setError('');
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 季節を複数選択する
  const handleSeasonChange = (season: string) => {
    setSeasons((prev) => {
      // オールシーズンを選んだら、ほかの季節を解除する
      if (season === 'all') {
        return prev.includes('all') ? [] : ['all'];
      }

      // ほかの季節を選んだら、オールシーズンを解除する
      const selectedSeasons = prev.filter((item) => item !== 'all');

      // 選択済みなら解除、未選択なら追加
      return selectedSeasons.includes(season)
        ? selectedSeasons.filter((item) => item !== season)
        : [...selectedSeasons, season];
    });
  };

  // APIレスポンスを安全にJSONとして読み込む
  const readJsonResponse = async (response: Response) => {
    const responseText = await response.text();

    console.log('APIステータス:', response.status);
    console.log('APIレスポンス:', responseText);

    if (!responseText) {
      throw new Error(
        `APIから空のレスポンスが返されました（${response.status}）。`
      );
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(
        `APIから正しいJSONが返されませんでした（${response.status}）。`
      );
    }
  };

  // 洋服を登録する
  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');

    if (!image) {
      setError('洋服の画像を選択してください。');
      return;
    }

    setIsSubmitting(true);

    try {
      // ImageKitの認証情報を取得
      const authResponse = await fetch('/api/auth/imagekit');

      console.log('ImageKit認証ステータス:', authResponse.status);

      const auth = await readJsonResponse(authResponse);

      if (!authResponse.ok) {
        throw new Error(
          auth.message || '画像アップロードの認証に失敗しました。'
        );
      }

      // ImageKitに画像をアップロード
      const uploadedImage = await upload({
        ...auth,
        file: image,
        fileName: image.name,
        folder: '/closet',
        useUniqueFileName: true,
      });

      if (!uploadedImage.url) {
        throw new Error('アップロードした画像のURLを取得できませんでした。');
      }

      // 3. 洋服情報をAPIに送信
      const response = await fetch('/api/clothes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          image_path: uploadedImage.url,
          season: seasons.length > 0 ? seasons : null,
          memo: memo.trim() || null,
          is_disposal_planned: isDisposalPlanned,
        }),
      });

      const result = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message || '洋服の登録に失敗しました。'
        );
      }

      // 登録成功
      onSuccess();
    } catch (err) {
      console.error('洋服の登録エラー:', err);

      setError(
        err instanceof Error
          ? err.message
          : '予期しないエラーが発生しました。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 画像 */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          洋服の画像（必須）
        </label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          disabled={isSubmitting}
          className="w-full text-sm"
        />

        {preview && (
          <img
            src={preview}
            alt="洋服のプレビュー"
            className="mt-3 h-40 w-40 rounded-lg object-cover"
          />
        )}
      </div>

      {/* カテゴリ */}
      <div>
        <label
          htmlFor="clothing-category"
          className="mb-1 block text-sm font-medium"
        >
          カテゴリ
        </label>

        <select
          id="clothing-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          disabled={isSubmitting}
          className="w-full rounded-lg border p-2"
        >
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* 季節：複数選択 */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          季節（複数選択可・任意）
        </legend>

        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map((item) => (
            <label
              key={item.value}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={seasons.includes(item.value)}
                onChange={() => handleSeasonChange(item.value)}
                disabled={isSubmitting}
              />

              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* メモ */}
      <div>
        <label
          htmlFor="clothing-memo"
          className="mb-1 block text-sm font-medium"
        >
          メモ（任意）
        </label>

        <textarea
          id="clothing-memo"
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          maxLength={1000}
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border p-2"
          placeholder="コーディネートや着用時のメモ"
        />
      </div>

      {/* 処分予定 */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isDisposalPlanned}
          onChange={(event) =>
            setIsDisposalPlanned(event.target.checked)
          }
          disabled={isSubmitting}
        />

        処分予定にする
      </label>

      {/* エラー表示 */}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* ボタン */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
        >
          キャンセル
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-(--color-primary) px-4 py-2 disabled:opacity-50"
        >
          {isSubmitting ? '登録中...' : '登録する'}
        </button>
      </div>
    </form>
  );
}
