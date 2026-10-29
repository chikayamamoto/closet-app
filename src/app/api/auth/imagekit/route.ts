
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUploadAuthParams } from '@imagekit/next/server';
import { verifyToken } from '@/lib/jwt';
import { AUTH_TOKEN } from '@/lib/auth';

export async function GET() {
    try {
        // ログイン状態を確認
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_TOKEN)?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        const userID = Number(payload?.userId);

        if (!Number.isInteger(userID) || userID <= 0) {
            return NextResponse.json(
                { message: '認証情報が不正です。' },
                { status: 401 }
            );
        }

        // ImageKitの環境変数を確認
        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

        if (!publicKey || !privateKey) {
            console.error('ImageKitの環境変数が設定されていません。');

            return NextResponse.json(
                { message: '画像アップロードの設定がありません。' },
                { status: 500 }
            );
        }

        // アップロード用の認証情報を発行
        const { token: uploadToken, expire, signature } =
            getUploadAuthParams({
                publicKey,
                privateKey,
            });

        return NextResponse.json({
            token: uploadToken,
            expire,
            signature,
            publicKey,
        });
    } catch (error) {
        console.error('ImageKit認証エラー:', error);

        return NextResponse.json(
            { message: '画像アップロードの認証に失敗しました。' },
            { status: 500 }
        );
    }
}
