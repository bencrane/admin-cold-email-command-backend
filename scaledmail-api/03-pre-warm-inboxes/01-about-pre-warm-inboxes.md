# ScaledMail API - Inboxes

## About - Pre Warm Inboxes

Returns all available pre-warmed inboxes for Google and Outlook, including their pricing details and warm-up age (in months).

**Endpoint**

```
GET https://server.scaledmail.com/api/v1/pre-warm-inboxes
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

fetch("https://server.scaledmail.com/api/v1/pre-warm-inboxes?organization_id", requestOptions)
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
| `pricing` | object | Pricing details |
| `pricing.oneTimePrice` | number | One-time setup price |
| `pricing.monthlyPrice` | number | Monthly recurring price |
| `emailMailbox` | array | List of mailboxes (optional) |

**Email Mailbox Object:**

| Field | Type | Description |
|-------|------|-------------|
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `alias` | string | Email alias |

### Response Example

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
        },
        {
          "first_name": "James",
          "last_name": "Smith",
          "alias": "james"
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