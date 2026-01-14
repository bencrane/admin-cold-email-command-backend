# ScaledMail API - Domains

## Get Purchased Domains

Retrieve all purchased domains for an organization.

**Endpoint**

```
GET https://server.scaledmail.com/api/v1/purchased-domains
```

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `organization_id` | string | Yes | - | Organization ID |
| `available` | boolean | No | `false` | Filter for domains which can be used for new orders |

### Request Example

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/purchased-domains?organization_id&available", requestOptions)
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