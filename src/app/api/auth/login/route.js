// src/app/api/auth/login/route.js
import { signIn } from '@/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    await signIn('credentials', { email, password });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      return new Response(JSON.stringify({ error: 'Invalid credentials.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
