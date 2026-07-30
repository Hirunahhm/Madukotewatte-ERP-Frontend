import { NextRequest, NextResponse } from 'next/server';

const AUTH_API_URL = process.env.AUTH_API_URL;

export async function POST(req: NextRequest) {
    try {
        const { username, password, rememberMe } = await req.json();

        const backendRes = await fetch(`${AUTH_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (backendRes.status === 401) {
            return NextResponse.json(
                { message: 'Incorrect username or password.' },
                { status: 401 }
            );
        }

        if (backendRes.status === 400) {
            return NextResponse.json(
                { message: 'Invalid request — check your input.' },
                { status: 400 }
            );
        }

        if (!backendRes.ok) {
            return NextResponse.json(
                { message: 'Authentication service error. Try again later.' },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();
        const { token, username: returnedUsername, role, expiresIn } = data;

        const res = NextResponse.json({ username: returnedUsername, role });

        res.cookies.set('auth_token', token, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            ...(rememberMe ? { maxAge: Math.floor(expiresIn / 1000) } : {}),
        });

        return res;
    } catch {
        return NextResponse.json(
            { message: 'Unable to reach the server. Please try again.' },
            { status: 503 }
        );
    }
}
