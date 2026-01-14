'use client'

import { useState } from 'react'
import Link from 'next/link'

type Organization = {
  id: string
  name: string
  slug: string
  domain: string
  industry: string
  company_size: string
  created_at: string
}

export default function AdminPage() {
  const [showClients, setShowClients] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrganizations = async () => {
    setLoading(true)
    const res = await fetch('/api/organizations')
    const data = await res.json()
    setOrganizations(data)
    setLoading(false)
    setShowClients(true)
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
            onClick={() => setShowClients(false)}
          >
            Admin
          </h1>
          {showClients && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>/</span>
              <span>Clients</span>
            </div>
          )}
        </div>

        {!showClients && (
          <div
            className="border border-gray-700 rounded-lg p-6 w-48 cursor-pointer hover:border-gray-500 transition-colors"
            onClick={fetchOrganizations}
          >
            <span className="text-white font-medium">Clients</span>
          </div>
        )}

        {showClients && (
          <div>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <div className="space-y-2">
                {organizations.map((org) => (
                  <Link
                    key={org.id}
                    href={`/admin/clients/${org.id}`}
                    className="border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors block"
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
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
