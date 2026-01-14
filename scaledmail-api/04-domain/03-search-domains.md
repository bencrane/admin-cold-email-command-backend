# ScaledMail API - Domains

## Search Domains

Search for domain availability and pricing.

**Endpoint**

```
POST https://server.scaledmail.com/api/v1/search-domains
```

> **Rate Limits:** Maximum of 10 domains per request. This endpoint is rate-limited to 15 requests per minute.

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
| `domains` | array | Yes | Array of domain names to search (max 10) |

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

fetch("https://server.scaledmail.com/api/v1/search-domains?organization_id", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
```

### Responses

| Status | Description |
|--------|-------------|
| 200 | Success |

**Response Format:** `application/json`

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `domain` | string | Domain name |
| `status` | string | Availability status (`available` or `taken`) |
| `price` | number \| null | Purchase price (null if taken) |
| `renewPrice` | number \| null | Renewal price (null if taken) |

### Response Example

```json
[
    {
        "domain": "utscaledmail.net",
        "status": "available",
        "price": 16.31,
        "renewPrice": 16.31
    },
    {
        "domain": "scaledmail.com",
        "status": "taken",
        "price": null,
        "renewPrice": null
    }
]
```