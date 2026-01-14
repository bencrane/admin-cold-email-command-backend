# ScaledMail API Reference

## Overview

Base URL: `https://server.scaledmail.com/api/v1`

### Authentication

All API requests must include a Bearer token in the `Authorization` header.

```
Authorization: Bearer YOUR_API_KEY
```

### Required Parameter

All endpoints require an `organization_id` query parameter.

### Rate Limits

| Limit | Note |
|-------|------|
| 5 requests per second | Exceeding the limit may result in temporary blocks |

---

## Organizations

### Get Organizations

Retrieve all organizations associated with your account.

```
GET /organizations
```

---

## Pre-Warm Inboxes

### Get Pre-Warm Inboxes

Returns all available pre-warmed inboxes for Google and Outlook, including pricing and warm-up age.

```
GET /pre-warm-inboxes?organization_id={org_id}
```

#### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | Total number of pre-warmed inboxes |
| `google` | array | List of Google pre-warmed inboxes |
| `outlook` | array | List of Outlook pre-warmed inboxes |

**Inbox Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique inbox identifier |
| `domain` | string | Domain name |
| `warmup_age` | integer | Warm-up age in months |
| `emailMailboxCount` | integer | Number of mailboxes on domain |
| `pricing.oneTimePrice` | number | One-time setup price |
| `pricing.monthlyPrice` | number | Monthly recurring price |
| `emailMailbox` | array | List of mailboxes (optional) |

**Email Mailbox Object:**

| Field | Type | Description |
|-------|------|-------------|
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `alias` | string | Email alias |

#### Response Example

```json
{
  "total": 4,
  "google": [
    {
      "warmup_age": 1,
      "id": "recLuIthqG59R4nmZ",
      "domain": "1apitestgoogle.com",
      "emailMailboxCount": 2,
      "pricing": {
        "oneTimePrice": 23,
        "monthlyPrice": 8
      },
      "emailMailbox": [
        {
          "first_name": "James",
          "last_name": "Smith",
          "alias": "james.smith"
        }
      ]
    }
  ],
  "outlook": [
    {
      "warmup_age": 2,
      "id": "rec0tZOQtwjJwYutj",
      "domain": "forgepathbase.com",
      "emailMailboxCount": 25,
      "pricing": {
        "oneTimePrice": 30,
        "monthlyPrice": 50
      }
    }
  ]
}
```

### Buy Pre-Warm Inboxes

Purchase pre-warmed inboxes and automatically assign them to domains.

```
POST /buy-pre-warm-inboxes?organization_id={org_id}
```

> Requires a connected payment method. A subscription and pre-warm inboxes will be created automatically if available.

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | string | No | Custom tag for internal tracking |
| `domains` | array | Yes | Array of domain objects |
| `sequencer` | object | No | Sequencer configuration |

**Domain Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Internal domain record ID |
| `domain` | string | Yes | Domain name |
| `redirect` | string | No | Redirect URL for the domain |

**Sequencer Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | Yes | Sequencer provider (e.g. `Instantly`) |
| `username` | string | Yes | Sequencer account username |
| `password` | string | Yes | Sequencer account password |
| `link` | string | Yes | Sequencer dashboard URL |
| `workspace` | string | No | Workspace or account name |
| `tag` | string | No | Tag to apply inside the sequencer |

#### Request Example

```json
{
  "tag": "client1",
  "domains": [
    {
      "id": "recscFIvHSqKwxfyp",
      "domain": "1apitestoutlook.com",
      "redirect": "bello.com"
    },
    {
      "id": "recLuIthqG59R4nmZ",
      "domain": "1apitestgoogle.com"
    }
  ]
}
```

---

## Domains

### Get Domains

Retrieve all domains for an organization.

```
GET /domains?organization_id={org_id}
```

### Get Purchased Domains

Retrieve all purchased domains for an organization.

```
GET /purchased-domains?organization_id={org_id}&available={boolean}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `organization_id` | string | Yes | - | Organization ID |
| `available` | boolean | No | `false` | Filter for domains available for new orders |

---

## Mailboxes

### Get Mailboxes by Domain ID

Retrieve all mailboxes for a specific domain.

```
GET /mailboxes/{domain_id}?organization_id={org_id}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain_id` | string | Yes | Domain ID |

---

## Support

For assistance or feature requests, contact: support@scaledmail.com
