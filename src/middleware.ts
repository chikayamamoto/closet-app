
import { type NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { AUTH_TOKEN } from '@/lib/auth';

// リクエスト受信時に実行されるミドルウェア
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ログインページは認証チェックをしない
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // クッキーからトークンを取得
  const token = request.cookies.get(AUTH_TOKEN)?.value;

  // クッキーがなければログイン画面へ
  if (!token) {
    return redirectToLogin(request);
  }

  // トークンを検証
  const user = await verifyToken(token);

  // トークンが無効ならログイン画面へ
  if (!user) {
    return redirectToLogin(request);
  }

  // 認証成功：リクエストを許可
  return NextResponse.next();
}

// ログイン画面へリダイレクト
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);

  // ログイン後に元のページへ戻るためのURL
  loginUrl.searchParams.set(
    'redirect',
    request.nextUrl.pathname + request.nextUrl.search
  );

  return NextResponse.redirect(loginUrl);
}

// ミドルウェアを適用するURL
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
