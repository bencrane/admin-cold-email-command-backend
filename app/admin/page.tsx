'use client'

import { useState, useEffect } from 'react'

type Organization = {
  id: string
  name: string
  slug: string
  domain: string
  industry: string
  company_size: string
  created_at: string
}

type OrganizationDetail = {
  organization: Organization & Record<string, unknown>
  users: Array<{ id: string; name: string; email: string; createdAt: string }>
  emailAccounts: Array<{ id: string; email: string; sender_name: string; daily_limit: number; status: string; created_at: string }>
  leadCount: number
  campaignCount: number
}

type View = 'home' | 'clients' | 'detail'

export default function AdminPage() {
  const [view, setView] = useState<View>('home')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDetail | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchOrganizations = async () => {
    setLoading(true)
    const res = await fetch('/api/organizations')
    const data = await res.json()
    setOrganizations(data)
    setLoading(false)
    setView('clients')
  }

  const fetchOrgDetail = async (id: string) => {
    setLoading(true)
    const res = await fetch(`/api/organizations/${id}`)
    const data = await res.json()
    setSelectedOrg(data)
    setLoading(false)
    setView('detail')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <h1
            className="text-xl font-semibold cursor-pointer hover:text-gray-300"
            onClick={() => setView('home')}
          >
            Admin
          </h1>
          {view !== 'home' && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>/</span>
              <span
                className={view === 'detail' ? 'cursor-pointer hover:text-white' : ''}
                onClick={() => view === 'detail' && setView('clients')}
              >
                Clients
              </span>
              {view === 'detail' && selectedOrg && (
                <>
                  <span>/</span>
                  <span>{selectedOrg.organization.name}</span>
                </>
              )}
            </div>
          )}
        </div>

        {view === 'home' && (
          <div
            className="border border-gray-700 rounded-lg p-6 w-48 cursor-pointer hover:border-gray-500 transition-colors"
            onClick={fetchOrganizations}
          >
            <span className="text-white font-medium">Clients</span>
          </div>
        )}

        {view === 'clients' && (
          <div>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <div className="space-y-2">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors"
                    onClick={() => fetchOrgDetail(org.id)}
                  >
                    <div className="grid grid-cols-6 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Name</div>
                        <div className="font-medium">{org.name}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Slug</div>
                        <div>{org.slug}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Domain</div>
                        <div>{org.domain || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Industry</div>
                        <div>{org.industry || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Size</div>
                        <div>{org.company_size || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Created</div>
                        <div>{formatDate(org.created_at)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'detail' && selectedOrg && (
          <div className="space-y-6">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <>
                {/* Organization Info */}
                <div className="border border-gray-700 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Organization Info</h2>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Name</div>
                      <div>{selectedOrg.organization.name}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Slug</div>
                      <div>{selectedOrg.organization.slug}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Domain</div>
                      <div>{selectedOrg.organization.domain || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Industry</div>
                      <div>{selectedOrg.organization.industry || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Company Size</div>
                      <div>{selectedOrg.organization.company_size || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Created</div>
                      <div>{formatDate(selectedOrg.organization.created_at)}</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-700 rounded-lg p-6">
                    <div className="text-gray-500 text-xs mb-1">Lead Count</div>
                    <div className="text-2xl font-semibold">{selectedOrg.leadCount.toLocaleString()}</div>
                  </div>
                  <div className="border border-gray-700 rounded-lg p-6">
                    <div className="text-gray-500 text-xs mb-1">Campaign Count</div>
                    <div className="text-2xl font-semibold">{selectedOrg.campaignCount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Users */}
                <div className="border border-gray-700 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Users ({selectedOrg.users.length})</h2>
                  {selectedOrg.users.length === 0 ? (
                    <p className="text-gray-500 text-sm">No users found</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedOrg.users.map((user) => (
                        <div key={user.id} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-800 last:border-0">
                          <div>{user.name || '—'}</div>
                          <div>{user.email}</div>
                          <div className="text-gray-500">{formatDate(user.createdAt)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Email Accounts */}
                <div className="border border-gray-700 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Email Accounts ({selectedOrg.emailAccounts.length})</h2>
                  {selectedOrg.emailAccounts.length === 0 ? (
                    <p className="text-gray-500 text-sm">No email accounts found</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedOrg.emailAccounts.map((account) => (
                        <div key={account.id} className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-800 last:border-0">
                          <div>{account.email}</div>
                          <div>{account.sender_name || '—'}</div>
                          <div>{account.daily_limit}/day</div>
                          <div className={account.status === 'active' ? 'text-green-400' : 'text-gray-500'}>
                            {account.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
