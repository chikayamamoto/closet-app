
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import type { ClothingItem } from '@/types/clothes';
import { AUTH_TOKEN } from '@/lib/auth';

const ALLOWED_CATEGORIES = [
    'トップス',
    'ボトムス',
    'シューズ',
    'ワンピース',
    'アウター',
    '小物',
];

// 選択できる季節
const ALLOWED_SEASONS = [
    'spring',
    'summer',
    'autumn',
    'winter',
    'all',
];

// ログイン中のユーザーIDを取得する
async function getAuthenticatedUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN)?.value;

    if (!token) {
        return null;
    }

    const payload = await verifyToken(token);
    const userID = Number(payload?.userId);

    if (!Number.isInteger(userID) || userID <= 0) {
        return null;
    }

    return userID;
}

// 洋服一覧を取得する
export async function GET() {
    try {
        const userID = await getAuthenticatedUserId();

        if (userID === null) {
            return NextResponse.json(
                { message: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        const clothes = await executeQuery<ClothingItem[]>(
            'SELECT * FROM clothes WHERE user_id = ?',
            [userID]
        );

        return NextResponse.json(clothes);
    } catch (error) {
        console.error('洋服の取得エラー:', error);

        return NextResponse.json(
            { message: '洋服の取得に失敗しました。' },
            { status: 500 }
        );
    }
}

// 洋服を登録する
export async function POST(request: NextRequest) {
    try {
        // 1. ログイン状態を確認
        const userID = await getAuthenticatedUserId();

        if (userID === null) {
            return NextResponse.json(
                { message: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        // リクエストデータを取得
        const body = await request.json();

        const {
            category,
            image_path,
            season,
            memo,
            is_disposal_planned,
        } = body;

        // カテゴリを検証
        if (
            typeof category !== 'string' ||
            !ALLOWED_CATEGORIES.includes(category)
        ) {
            return NextResponse.json(
                { message: 'カテゴリが正しくありません。' },
                { status: 400 }
            );
        }

        // 画像URLを検証
        if (
            typeof image_path !== 'string' ||
            !image_path.startsWith('https://')
        ) {
            return NextResponse.json(
                { message: '画像URLが正しくありません。' },
                { status: 400 }
            );
        }

        // 季節を検証し、JSON文字列に変換
        let seasonJson: string | null = null;

        if (season !== null && season !== undefined) {
            if (
                !Array.isArray(season) ||
                !season.every(
                    (item: unknown) =>
                        typeof item === 'string' &&
                        ALLOWED_SEASONS.includes(item)
                )
            ) {
                return NextResponse.json(
                    { message: '季節の指定が正しくありません。' },
                    { status: 400 }
                );
            }

            if (new Set(season).size !== season.length) {
                return NextResponse.json(
                    { message: '季節が重複しています。' },
                    { status: 400 }
                );
            }

            if (season.includes('all') && season.length > 1) {
                return NextResponse.json(
                    {
                        message:
                            'オールシーズンと他の季節は同時に選択できません。',
                    },
                    { status: 400 }
                );
            }

            seasonJson =
                season.length > 0 ? JSON.stringify(season) : null;
        }

        // 6. メモを検証
        if (
            memo !== null &&
            memo !== undefined &&
            (typeof memo !== 'string' || memo.length > 1000)
        ) {
            return NextResponse.json(
                { message: 'メモは1000文字以内で入力してください。' },
                { status: 400 }
            );
        }

        // 処分予定フラグを検証
        if (typeof is_disposal_planned !== 'boolean') {
            return NextResponse.json(
                { message: '処分予定の指定が正しくありません。' },
                { status: 400 }
            );
        }

        await executeQuery(
            `INSERT INTO clothes (
        user_id,
        category,
        image_path,
        season,
        memo,
        is_disposal_planned
      ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userID,
                category,
                image_path,
                seasonJson,
                memo || null,
                is_disposal_planned ? 1 : 0,
            ]
        );

        return NextResponse.json(
            { message: '洋服を登録しました。' },
            { status: 201 }
        );
    } catch (error) {
        console.error('洋服登録APIエラー:', error);

        return NextResponse.json(
            { message: '洋服の登録に失敗しました。' },
            { status: 500 }
        );
    }
}
