import { NextResponse } from 'next/server'

const SCALEDMAIL_BASE_URL = 'https://server.scaledmail.com/api/v1'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ domainId: string }> }
) {
  const { domainId } = await params
  const apiKey = process.env.SCALEDMAIL_API_KEY
  const orgId = process.env.SCALEDMAIL_ORGANIZATION_ID

  if (!apiKey || !orgId) {
    return NextResponse.json(
      { error: 'ScaledMail API key or organization ID not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `${SCALEDMAIL_BASE_URL}/mailboxes/${domainId}?organization_id=${orgId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `ScaledMail API error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch mailboxes: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
