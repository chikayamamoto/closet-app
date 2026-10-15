import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

import { type ClothingItem } from '@/types/clothes';
type Clothing = ClothingItem;


export async function GET() {
  try { // DBから商品データを取得
    const clothes = await executeQuery<Clothing[]>('SELECT * FROM clothes;');
    return NextResponse.json(clothes);
  } catch (err) {
    console.error('取得エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}