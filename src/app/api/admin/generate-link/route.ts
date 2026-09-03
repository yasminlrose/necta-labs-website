/**
 * TEMPORARY ADMIN ROUTE — DELETE AFTER USE
 *
 * POST /api/admin/generate-link
 * Body: { email: string, secret: string }
 *
 * Generates a Supabase magic-link URL and returns it as JSON
 * WITHOUT sending any email. Use this to get a link you can
 * paste into a manual email reply.
 *
 * Protected by a simple shared secret so it's not openly callable.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const { email, secret } = (await req.json()) as {
    email?: string;
    secret?: string;
  };

  // Gate behind service role key so only you can call it
  if (!secret || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const origin =
    process.env.VERCEL_ENV === 'production'
      ? 'https://www.nectalabs.com'
      : process.env.VERCEL_BRANCH_URL
        ? `https://${process.env.VERCEL_BRANCH_URL}`
        : 'https://nectalabs.com';

  const supabase = adminClient();

  // Ensure the user exists in auth (createUser is idempotent-ish)
  const { data: listData } = await supabase.auth.admin.listUsers();
  const exists = listData?.users?.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!exists) {
    const { error: createErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: '' },
    });
    if (createErr) {
      console.error('[generate-link] createUser failed:', createErr.message);
      return NextResponse.json({ error: createErr.message }, { status: 500 });
    }
  }

  // Generate the magic link
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${origin}/account` },
  });

  if (error || !data.properties?.action_link) {
    return NextResponse.json(
      { error: error?.message ?? 'no action_link returned' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    email,
    magicLink: data.properties.action_link,
    expiresIn: '1 hour',
    note: 'This link will create/sign-in the user. Do NOT share publicly.',
  });
}
