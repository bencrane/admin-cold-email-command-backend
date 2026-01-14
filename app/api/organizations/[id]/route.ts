import { customersDb, authDb } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Fetch organization info
  const { data: organization, error: orgError } = await customersDb
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 500 })
  }

  // Fetch users from auth-db
  const { data: users, error: usersError } = await authDb
    .from('user')
    .select('id, name, email, createdAt')
    .eq('organizationId', id)

  // Fetch email accounts
  const { data: emailAccounts, error: emailError } = await customersDb
    .schema('product')
    .from('email_accounts')
    .select('id, email, sender_name, daily_limit, status, created_at')
    .eq('org_id', id)

  // Fetch lead count
  const { count: leadCount, error: leadError } = await customersDb
    .schema('product')
    .from('org_leads')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', id)

  // Fetch campaign count
  const { count: campaignCount, error: campaignError } = await customersDb
    .schema('product')
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', id)

  return NextResponse.json({
    organization,
    users: users || [],
    emailAccounts: emailAccounts || [],
    leadCount: leadCount || 0,
    campaignCount: campaignCount || 0,
    errors: {
      users: usersError?.message,
      emailAccounts: emailError?.message,
      leads: leadError?.message,
      campaigns: campaignError?.message,
    }
  })
}
