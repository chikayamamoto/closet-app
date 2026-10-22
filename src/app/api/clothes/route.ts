
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import type { ClothingItem } from '@/types/clothes';
import { AUTH_TOKEN } from '@/lib/auth';

export async function GET() {
    try {
        // JWTを取得
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_TOKEN)?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        // JWTからuserIdを取得
        const payload = await verifyToken(token);
        const userID = Number(payload?.userId);

        if (!Number.isInteger(userID) || userID <= 0) {
            return NextResponse.json(
                { message: '認証情報が不正です。' },
                { status: 401 }
            );
        }

        // 会員IDに対応する洋服を取得
        const clothes = await executeQuery<ClothingItem[]>(
            'SELECT * FROM clothes WHERE user_id = ?',
            [userID]
        );

        return NextResponse.json(clothes);
    } catch (err) {
        console.error('洋服の取得エラー:', err);

        return NextResponse.json(
            { message: 'サーバーエラーが発生しました。' },
            { status: 500 }
        );
    }
}
