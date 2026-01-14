'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Organization = {
  id: string
  name: string
  slug: string
  domain: string
  industry: string
  company_size: string
  created_at: string
}

type EmailAccount = {
  id: string
  email: string
  sender_name: string
  daily_limit: number
  status: string
  smartlead_account_id: string | null
  created_at: string
}

type OrgStats = {
  organization: Organization
  userCount: number
  emailAccountCount: number
  campaignCount: number
  leadCount: number
  unconnectedEmailCount: number
  emailAccounts: EmailAccount[]
}

type PreWarmInbox = {
  id: string
  domain: string
  warmup_age: number
  emailMailboxCount: number
  pricing: {
    oneTimePrice: number
    monthlyPrice: number
  }
  emailMailbox?: Array<{
    first_name: string
    last_name: string
    alias: string
  }>
}

type PreWarmInboxes = {
  total: number
  google: PreWarmInbox[]
  outlook: PreWarmInbox[]
}

export default function ClientDetailPage() {
  const params = useParams()
  const orgId = params.orgId as string

  const [orgStats, setOrgStats] = useState<OrgStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Provisioning modal state
  const [showProvisioningModal, setShowProvisioningModal] = useState(false)
  const [preWarmInboxes, setPreWarmInboxes] = useState<PreWarmInboxes | null>(null)
  const [loadingInboxes, setLoadingInboxes] = useState(false)
  const [selectedInboxes, setSelectedInboxes] = useState<Set<string>>(new Set())
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)

  // Smartlead modal state
  const [showSmartleadModal, setShowSmartleadModal] = useState(false)

  const fetchOrgStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/organizations/${orgId}`)
      if (!res.ok) throw new Error('Failed to fetch organization')
      const data = await res.json()

      setOrgStats({
        organization: data.organization,
        userCount: data.users?.length || 0,
        emailAccountCount: data.emailAccounts?.length || 0,
        campaignCount: data.campaignCount || 0,
        leadCount: data.leadCount || 0,
        unconnectedEmailCount: data.emailAccounts?.filter((e: EmailAccount) => !e.smartlead_account_id).length || 0,
        emailAccounts: data.emailAccounts || [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    fetchOrgStats()
  }, [fetchOrgStats])

  const fetchPreWarmInboxes = async () => {
    setLoadingInboxes(true)
    setPurchaseError(null)
    try {
      const res = await fetch('/api/admin/scaledmail/pre-warm-inboxes')
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to fetch inboxes')
      }
      const data = await res.json()
      setPreWarmInboxes(data)
    } catch (err) {
      setPurchaseError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoadingInboxes(false)
    }
  }

  const openProvisioningModal = () => {
    setShowProvisioningModal(true)
    setSelectedInboxes(new Set())
    setPurchaseError(null)
    fetchPreWarmInboxes()
  }

  const toggleInboxSelection = (id: string) => {
    const newSelected = new Set(selectedInboxes)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedInboxes(newSelected)
  }

  const handlePurchase = async () => {
    if (selectedInboxes.size === 0) return

    setPurchasing(true)
    setPurchaseError(null)

    const allInboxes = [...(preWarmInboxes?.google || []), ...(preWarmInboxes?.outlook || [])]
    const selectedDomains = allInboxes
      .filter(inbox => selectedInboxes.has(inbox.id))
      .map(inbox => ({
        id: inbox.id,
        domain: inbox.domain,
        emailMailbox: inbox.emailMailbox,
      }))

    try {
      const res = await fetch('/api/admin/scaledmail/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domains: selectedDomains,
          orgId: orgId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Purchase failed')
      }

      // Success - close modal and refresh data
      setShowProvisioningModal(false)
      setSelectedInboxes(new Set())
      fetchOrgStats()
    } catch (err) {
      setPurchaseError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setPurchasing(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const calculateTotal = () => {
    if (!preWarmInboxes) return { oneTime: 0, monthly: 0 }
    const allInboxes = [...preWarmInboxes.google, ...preWarmInboxes.outlook]
    let oneTime = 0
    let monthly = 0
    for (const inbox of allInboxes) {
      if (selectedInboxes.has(inbox.id)) {
        oneTime += inbox.pricing.oneTimePrice
        monthly += inbox.pricing.monthlyPrice
      }
    }
    return { oneTime, monthly }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (error || !orgStats) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <p className="text-red-400">Error: {error || 'Organization not found'}</p>
        <Link href="/admin" className="text-gray-400 hover:text-white mt-4 inline-block">
          &larr; Back to Admin
        </Link>
      </div>
    )
  }

  const totals = calculateTotal()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/admin" className="text-xl font-semibold hover:text-gray-300">
            Admin
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/admin" className="text-gray-400 hover:text-white">
            Clients
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-white">{orgStats.organization.name}</span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Card 1: Overview */}
          <div className="border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span>{orgStats.organization.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Domain</span>
                <span>{orgStats.organization.domain || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Industry</span>
                <span>{orgStats.organization.industry || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size</span>
                <span>{orgStats.organization.company_size || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span>{formatDate(orgStats.organization.created_at)}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Users</span>
                  <span>{orgStats.userCount}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Email Accounts</span>
                  <span>{orgStats.emailAccountCount}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Campaigns</span>
                  <span>{orgStats.campaignCount}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Leads</span>
                  <span>{orgStats.leadCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Email Account Provisioning */}
          <div
            className="border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition-colors"
            onClick={openProvisioningModal}
          >
            <h2 className="text-lg font-semibold mb-2">Email Account Provisioning</h2>
            <p className="text-gray-400 text-sm mb-4">Purchase new email inboxes from ScaledMail</p>
            <div className="text-3xl font-bold text-blue-400">{orgStats.emailAccountCount}</div>
            <div className="text-gray-500 text-xs">email accounts</div>
          </div>

          {/* Card 3: Smartlead Inbox Configuration */}
          <div
            className="border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition-colors"
            onClick={() => setShowSmartleadModal(true)}
          >
            <h2 className="text-lg font-semibold mb-2">Smartlead Configuration</h2>
            <p className="text-gray-400 text-sm mb-4">Connect purchased inboxes to Smartlead</p>
            <div className="text-3xl font-bold text-yellow-400">{orgStats.unconnectedEmailCount}</div>
            <div className="text-gray-500 text-xs">unconnected accounts</div>
          </div>
        </div>

        {/* Email Accounts Table */}
        <div className="border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Email Accounts</h2>
          {orgStats.emailAccounts.length === 0 ? (
            <p className="text-gray-500 text-sm">No email accounts found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-700">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Sender Name</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Daily Limit</th>
                  <th className="pb-3">Smartlead</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {orgStats.emailAccounts.map((account) => (
                  <tr key={account.id} className="border-b border-gray-800">
                    <td className="py-3">{account.email}</td>
                    <td className="py-3">{account.sender_name || '—'}</td>
                    <td className="py-3">
                      <span className={
                        account.status === 'active' ? 'text-green-400' :
                        account.status === 'warming' ? 'text-yellow-400' :
                        'text-gray-400'
                      }>
                        {account.status}
                      </span>
                    </td>
                    <td className="py-3">{account.daily_limit}/day</td>
                    <td className="py-3">
                      {account.smartlead_account_id ? (
                        <span className="text-green-400">Connected</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-400">{formatDate(account.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Provisioning Modal */}
      {showProvisioningModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Purchase Pre-Warm Inboxes</h2>
              <button
                onClick={() => setShowProvisioningModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              {loadingInboxes ? (
                <p className="text-gray-400">Loading available inboxes...</p>
              ) : purchaseError && !preWarmInboxes ? (
                <p className="text-red-400">{purchaseError}</p>
              ) : preWarmInboxes ? (
                <div className="space-y-6">
                  {/* Google Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Google Inboxes ({preWarmInboxes.google.length})
                    </h3>
                    {preWarmInboxes.google.length === 0 ? (
                      <p className="text-gray-500 text-sm">No Google inboxes available</p>
                    ) : (
                      <div className="space-y-2">
                        {preWarmInboxes.google.map((inbox) => (
                          <div
                            key={inbox.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedInboxes.has(inbox.id)
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700 hover:border-gray-500'
                            }`}
                            onClick={() => toggleInboxSelection(inbox.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{inbox.domain}</div>
                                <div className="text-gray-400 text-sm mt-1">
                                  {inbox.emailMailboxCount} mailbox{inbox.emailMailboxCount !== 1 ? 'es' : ''} &bull; {inbox.warmup_age} month{inbox.warmup_age !== 1 ? 's' : ''} warm
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${inbox.pricing.oneTimePrice} setup</div>
                                <div className="text-gray-400 text-sm">${inbox.pricing.monthlyPrice}/mo</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Outlook Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
                      Outlook Inboxes ({preWarmInboxes.outlook.length})
                    </h3>
                    {preWarmInboxes.outlook.length === 0 ? (
                      <p className="text-gray-500 text-sm">No Outlook inboxes available</p>
                    ) : (
                      <div className="space-y-2">
                        {preWarmInboxes.outlook.map((inbox) => (
                          <div
                            key={inbox.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedInboxes.has(inbox.id)
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-gray-700 hover:border-gray-500'
                            }`}
                            onClick={() => toggleInboxSelection(inbox.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{inbox.domain}</div>
                                <div className="text-gray-400 text-sm mt-1">
                                  {inbox.emailMailboxCount} mailbox{inbox.emailMailboxCount !== 1 ? 'es' : ''} &bull; {inbox.warmup_age} month{inbox.warmup_age !== 1 ? 's' : ''} warm
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${inbox.pricing.oneTimePrice} setup</div>
                                <div className="text-gray-400 text-sm">${inbox.pricing.monthlyPrice}/mo</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
              <div>
                {selectedInboxes.size > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-400">Selected: </span>
                    <span className="font-medium">{selectedInboxes.size} domain{selectedInboxes.size !== 1 ? 's' : ''}</span>
                    <span className="text-gray-400 mx-2">|</span>
                    <span className="text-green-400">${totals.oneTime} setup + ${totals.monthly}/mo</span>
                  </div>
                )}
                {purchaseError && (
                  <div className="text-red-400 text-sm mt-2">{purchaseError}</div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProvisioningModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={selectedInboxes.size === 0 || purchasing}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedInboxes.size === 0 || purchasing
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {purchasing ? 'Purchasing...' : 'Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smartlead Modal (Placeholder) */}
      {showSmartleadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Smartlead Configuration</h2>
              <button
                onClick={() => setShowSmartleadModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-lg font-medium mb-2">Smartlead connection coming soon</h3>
              <p className="text-gray-400 text-sm">
                This feature will allow you to connect purchased email accounts to Smartlead for campaign automation.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSmartleadModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
