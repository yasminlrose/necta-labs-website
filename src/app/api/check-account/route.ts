import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// Returns { exists: boolean } for a given email
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ exists: false });

  const { data, error } = await adminClient().auth.admin.listUsers();
  if (error) return NextResponse.json({ exists: false });

  const exists = data.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  return NextResponse.json({ exists });
}
