# ScaledMail API - Orders

## Create Order

Create a new order and subscription.

**Endpoint**

```
POST https://server.scaledmail.com/api/v1/create-order/{price_id}
```

> ⚠️ **Requires a connected payment method**
> 
> A subscription will be created automatically upon a successful request.

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `price_id` | string | Yes | The ID of the package to purchase. Retrieve from `/packages` endpoint. |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | string | Yes | Organization ID |
| `provider` | string | Yes | Domain provider source (`scaledmail` or `other`) |
| `coupon` | string | No | Valid coupon code |

**Provider Values:**

- `scaledmail` — Domains purchased through ScaledMail
- `other` — Domains from external providers like Porkbun, Namecheap, or DNSimple

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `quantity` | integer | No | Number of package units to purchase (default: `1`) |
| `domains` | array | Yes | Array of domain objects to assign to the package |
| `hosting` | object | Conditional | Required only when `provider = "other"` |
| `sequencer` | object | No | Sequencer configuration |

#### Domain Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `domain` | string | Yes | Domain name |
| `redirect` | string | No | Redirect URL for the domain |
| `first_name` | string | No | First name for auto-generated aliases |
| `last_name` | string | No | Last name for auto-generated aliases |
| `aliases` | array | No | Pre-generated aliases array |
| `profile_picture` | string | No | Profile picture URL (applies to all aliases on domain) |

> **Note:** The number of domains must exactly match the domain count required by the selected package. If any domain is already used or unavailable, the request will fail.

#### Aliases Handling

**Option 1: Auto-generate aliases**

Include `first_name` and `last_name` at the domain level, and the system will automatically generate aliases.

**Option 2: Provide custom aliases**

Pass an `aliases` array directly with pre-generated alias information:

```json
"aliases": [
  { 
    "first_name": "User1",
    "last_name": "Test",
    "alias": "alias1",
    "profile_picture": "link1.com"
  }
]
```

When the `aliases` array is provided, the system will not auto-generate aliases.

#### Hosting Object

Required only for third-party domains (`provider = "other"`). Must include SMTP/IMAP credentials, DNS configuration, account credentials, and any required verification details.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | Yes | Hosting provider name |
| `username` | string | Yes | Hosting account username |
| `password` | string | Yes | Hosting account password |

#### Sequencer Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | Yes | Sequencer provider name |
| `username` | string | Yes | Sequencer account username |
| `password` | string | Yes | Sequencer account password |

### Request Examples

#### Other Domain Provider

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");
myHeaders.append("Content-Type", "text/plain");

var raw = JSON.stringify({
  "hosting": {
    "provider": "Hosting Provider Name Here",
    "username": "username",
    "password": "password"
  },
  "sequencer": {
    "provider": "Sequencer Name Here",
    "username": "username",
    "password": "password"
  },
  "domains": [
    {
      "domain": "scaledmail.net",
      "first_name": "Dean",
      "last_name": "Fiacoo",
      "redirect": "scaledmail.com"
    },
    {
      "domain": "scaledmail.us",
      "first_name": "Dean",
      "last_name": "Fiacoo"
    }
  ]
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/create-order/<price_id>?organization_id=<org_id>&provider=other", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
```

#### ScaledMail Domain Provider

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");
myHeaders.append("Content-Type", "text/plain");

var raw = JSON.stringify({
  "domains": [
    {
      "domain": "scaledmail.net",
      "first_name": "Dean",
      "last_name": "Fiacoo",
      "redirect": "scaledmail.com"
    },
    {
      "domain": "scaledmail.us",
      "first_name": "Dean",
      "last_name": "Fiacoo"
    }
  ]
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/create-order/<price_id>?organization_id=<org_id>&provider=scaledmail", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
```

#### With Custom Aliases

```javascript
var raw = JSON.stringify({
  "domains": [
    {
      "domain": "scaledmail.net",
      "aliases": [
        {
          "first_name": "User1",
          "last_name": "Test",
          "alias": "user1.test",
          "profile_picture": "https://example.com/pic1.jpg"
        },
        {
          "first_name": "User2",
          "last_name": "Test",
          "alias": "user2.test"
        }
      ]
    }
  ]
});
```

#### With Profile Pictures

```javascript
var raw = JSON.stringify({
  "domains": [
    {
      "domain": "scaledmail.net",
      "first_name": "Dean",
      "last_name": "Fiacoo",
      "profile_picture": "https://example.com/dean.jpg"
    }
  ]
});
```

### Responses

| Status | Description |
|--------|-------------|
| 200 | Success |

**Response Format:** `application/json`

### Response Example

```json
{}
```