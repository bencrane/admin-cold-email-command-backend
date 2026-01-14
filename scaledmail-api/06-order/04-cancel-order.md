# ScaledMail API - Orders

## Cancel Order

Cancel an existing order and its associated subscription.

**Endpoint**

```
DELETE https://server.scaledmail.com/api/v1/orders/{order_id}
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
   method: 'DELETE',
   headers: myHeaders,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/orders/<order_id>?organization_id=<org_id>", requestOptions)
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
| `success` | boolean | Whether the cancellation was successful |
| `message` | string | Status message |

### Response Example

```json
{
    "success": true,
    "message": "Subscription canceled successfully."
}
```