# ScaledMail API - Domains

## Buy Domains

Purchase domains through ScaledMail.

**Endpoint**

```
POST https://server.scaledmail.com/api/v1/buy-domains
```

> ⚠️ **Requires a connected payment method.** This endpoint will automatically charge the connected method upon successful domain purchase.

**Limits & Restrictions:**

- Maximum of 10 domains per request
- All domains must be available for purchase — if any domain is unavailable, the entire request will fail
- Rate-limited to 15 requests per minute

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | string | Yes | Organization ID |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domains` | array | Yes | Array of domain names to purchase (max 10) |

### Request Example

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");
myHeaders.append("Content-Type", "text/plain");

var raw = JSON.stringify({
    "domains": ["scaledmail.com", "beanstalk.com"]
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/buy-domains?organization_id", requestOptions)
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