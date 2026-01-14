# ScaledMail API - Orders

## Get Orders

Retrieve all orders for an organization.

**Endpoint**

```
GET https://server.scaledmail.com/api/v1/orders
```

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

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

fetch("https://server.scaledmail.com/api/v1/orders?organization_id", requestOptions)
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
| `total` | integer | Total number of orders |
| `payments` | array | List of payment/order objects |

**Payment Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Order ID |
| `amount` | number | Order amount |
| `created_at` | string | Order creation timestamp (ISO 8601) |
| `status` | string | Order status (e.g. `Active`, `Cancelled`) |
| `description` | string | Order description |

### Response Example

```json
{
    "total": 2,
    "payments": [
        {
            "id": "rec0LZaZRIFUx2o1",
            "amount": 120,
            "created_at": "2025-08-06T19:19:49.000Z",
            "status": "Active",
            "description": "SM - Microsoft"
        },
        {
            "id": "rec0LZaZRIFUx2o1",
            "amount": 234,
            "created_at": "2025-10-28T07:27:23.000Z",
            "status": "Cancelled",
            "description": "SM MS 70% - SM Google 30%"
        }
    ]
}
```