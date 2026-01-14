import { NextResponse } from 'next/server'
import { customersDb } from '@/lib/supabase'

const SCALEDMAIL_BASE_URL = 'https://server.scaledmail.com/api/v1'

type DomainPurchase = {
  id: string
  domain: string
  redirect?: string
  emailMailbox?: Array<{
    first_name: string
    last_name: string
    alias: string
  }>
}

type PurchaseRequest = {
  domains: DomainPurchase[]
  orgId: string
  tag?: string
}

export async function POST(request: Request) {
  const apiKey = process.env.SCALEDMAIL_API_KEY
  const scaledMailOrgId = process.env.SCALEDMAIL_ORGANIZATION_ID

  if (!apiKey || !scaledMailOrgId) {
    return NextResponse.json(
      { error: 'ScaledMail API key or organization ID not configured' },
      { status: 500 }
    )
  }

  let body: PurchaseRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { domains, orgId, tag } = body

  if (!domains || !Array.isArray(domains) || domains.length === 0) {
    return NextResponse.json({ error: 'domains array is required' }, { status: 400 })
  }

  if (!orgId) {
    return NextResponse.json({ error: 'orgId is required' }, { status: 400 })
  }

  try {
    // Call ScaledMail API to purchase
    const purchasePayload = {
      tag: tag || `org-${orgId}`,
      domains: domains.map(d => ({
        id: d.id,
        domain: d.domain,
        redirect: d.redirect,
      })),
    }

    const response = await fetch(
      `${SCALEDMAIL_BASE_URL}/buy-pre-warm-inboxes?organization_id=${scaledMailOrgId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchasePayload),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `ScaledMail purchase failed: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    // On success, create records in product.email_accounts for each mailbox
    const emailAccountRecords: Array<{
      org_id: string
      email: string
      sender_name: string
      daily_limit: number
      status: string
    }> = []

    for (const domain of domains) {
      if (domain.emailMailbox && domain.emailMailbox.length > 0) {
        for (const mailbox of domain.emailMailbox) {
          emailAccountRecords.push({
            org_id: orgId,
            email: `${mailbox.alias}@${domain.domain}`,
            sender_name: `${mailbox.first_name} ${mailbox.last_name}`,
            daily_limit: 50, // Default daily limit
            status: 'warming',
          })
        }
      }
    }

    if (emailAccountRecords.length > 0) {
      const { error: insertError } = await customersDb
        .schema('product')
        .from('email_accounts')
        .insert(emailAccountRecords)

      if (insertError) {
        console.error('Failed to insert email accounts:', insertError)
        // Don't fail the whole request, purchase was successful
        return NextResponse.json({
          success: true,
          purchaseComplete: true,
          emailAccountsCreated: false,
          error: `Purchase successful but failed to create email account records: ${insertError.message}`,
        })
      }
    }

    return NextResponse.json({
      success: true,
      purchaseComplete: true,
      emailAccountsCreated: emailAccountRecords.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Purchase failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
