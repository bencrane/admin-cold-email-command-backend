# ScaledMail API - Packages

## Get Packages

Retrieve all available packages.

**Endpoint**

```
GET https://server.scaledmail.com/api/v1/packages
```

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

### Request Example

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/packages", requestOptions)
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
| `total` | integer | Total number of packages |
| `packages` | array | List of package objects |

**Package Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique package identifier |
| `tier` | string | Package tier (e.g. `low-sending`, `medium-sending`, `high-sending`) |
| `name` | string | Package name |
| `mode` | string | Billing mode (e.g. `subscription`) |
| `price` | number | Package price |
| `domains` | integer | Number of domains included |
| `google` | object | Google mailbox configuration (optional) |
| `google.mailbox` | integer | Number of Google mailboxes |
| `microsoft` | object | Microsoft mailbox configuration (optional) |
| `microsoft.mailbox` | integer | Number of Microsoft mailboxes |
| `microsoft.domains` | integer | Number of Microsoft domains |
| `frequency` | string | Billing frequency (e.g. `/monthly`) |

### Response Example

```json
{
  "total": 3,
  "packages": [
    {
      "id": "price_1RwQijBUS24WVOL3fBhLhYPp",
      "tier": "low-sending",
      "name": "SM Google 70% - SM MS 30%",
      "mode": "subscription",
      "price": 199,
      "domains": 12,
      "google": {
        "mailbox": 20
      },
      "microsoft": {
        "mailbox": 100,
        "domains": 2
      },
      "frequency": "/monthly"
    },
    {
      "id": "price_1RwQoGBUS24WVOL3Py9UrJpq",
      "tier": "medium-sending",
      "mode": "subscription",
      "name": "SM - Google",
      "price": 245,
      "domains": 35,
      "google": {
        "mailbox": 70
      },
      "frequency": "/monthly"
    },
    {
      "id": "price_1QhZ1JBUS24WVOL3lBcDjtDw",
      "tier": "high-sending",
      "mode": "subscription",
      "name": "SM - Microsoft",
      "price": 597,
      "domains": 12,
      "microsoft": {
        "mailbox": 300,
        "domains": 12
      },
      "frequency": "/monthly"
    }
  ]
}
```