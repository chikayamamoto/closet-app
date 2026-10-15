// 洋服情報型定義
export type ClothingItem= {
  id: number;
  user_id: number;
  category: string;
  image_path: string;
  season?: string | null;
  memo?: string | null;
  is_disposal_planned: boolean;
  created_at?: string;
  updated_at?: string;
};