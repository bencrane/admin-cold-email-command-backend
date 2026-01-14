# ScaledMail API - Domains

## Swap Domain

Swap an existing domain with a new one.

**Endpoint**

```
POST https://server.scaledmail.com/api/v1/swap-domain/{domain}
```

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | string | Yes | The old domain name you want to swap out |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | string | Yes | Organization ID |
| `provider` | string | Yes | Domain provider source (`scaledmail` or `other`) |

**Provider Values:**

- `scaledmail` — Domain purchased through ScaledMail
- `other` — Domain from external providers like Porkbun, Namecheap, or DNSimple

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `new_domain` | string | Yes | The new domain name to assign |
| `hosting` | object | Conditional | Required only when `provider = "other"` |

#### Hosting Object

Required only for third-party domains (`provider = "other"`). Not required for ScaledMail domains as hosting is handled automatically.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | Yes | Hosting provider name |
| `username` | string | Yes | Hosting account username |
| `password` | string | Yes | Hosting account password |

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
  "new_domain": "scaledmailgo.com"
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/swap-domain/olddomain.com?organization_id=<org_id>&provider=other", requestOptions)
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
  "new_domain": "scaledmailgo.com"
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/swap-domain/olddomain.com?organization_id=<org_id>&provider=scaledmail", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
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