'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: { error: string } | null, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const token = process.env.ADMIN_TOKEN;

  if (username === expectedUsername && password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token || 'secure_fallback_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    redirect('/admin');
  } else {
    return { error: 'Nieprawidłowy login lub hasło' };
  }
}
