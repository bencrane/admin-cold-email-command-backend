# ScaledMail API - Orders

## Get Order Details

Retrieve details for a specific order.

**Endpoint**

```
GET https://server.scaledmail.com/api/v1/orders/{order_id}
```

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order_id` | string | Yes | Order ID |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | string | Yes | Organization ID |

### Request Example

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/orders/rec1x2bxelbC9T?organization_id=<org_id>", requestOptions)
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
| `id` | string | Order ID |
| `created_at` | string | Order creation timestamp (ISO 8601) |
| `amount` | number | Order amount |
| `tag` | string | Custom tag |
| `status` | string | Order status (e.g. `Active`) |
| `description` | string | Order description |
| `invoices` | array | List of invoices |
| `total_domains` | integer | Total number of domains |
| `packages` | array | List of package objects |
| `addons` | array | List of addons |
| `current_items` | array | List of current items |

**Package Object:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Package type (e.g. `Google`) |
| `id` | string | Package ID |
| `note` | string | Package note |
| `payment_id` | string | Associated payment ID |
| `created_at` | string | Package creation timestamp |
| `total_domains` | integer | Number of domains in package |
| `status` | string | Package status |
| `domains` | array | List of domain objects |

**Domain Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Domain ID |
| `name` | string | Domain name |
| `status` | string | Domain status |

### Response Example

```json
{
  "id": "rec1x2bxelbC9T",
  "created_at": "2025-10-31T18:49:50.000Z",
  "amount": 80,
  "tag": "",
  "status": "Active",
  "description": "SM - Google",
  "invoices": [],
  "total_domains": 80,
  "packages": [
    {
      "type": "Google",
      "id": "recFxLhtiT4sd",
      "note": "",
      "payment_id": "rec1x2bxelbC9T",
      "created_at": "2025-10-31T18:55:38.000Z",
      "total_domains": 10,
      "status": "Active",
      "domains": [
        {
          "id": "recABX2a0THx0",
          "name": "domain0.com",
          "status": ""
        },
        {
          "id": "recABX2a0THx1",
          "name": "domain1.com",
          "status": ""
        }
      ]
    }
  ],
  "addons": [],
  "current_items": []
}
```