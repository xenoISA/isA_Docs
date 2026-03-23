import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'api.isa.io'];

export async function POST(request: NextRequest) {
  try {
    const { url, method = 'GET', headers = {}, body } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid url' }, { status: 400 });
    }

    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith('.isa.io'))) {
      return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 502 });
  }
}
