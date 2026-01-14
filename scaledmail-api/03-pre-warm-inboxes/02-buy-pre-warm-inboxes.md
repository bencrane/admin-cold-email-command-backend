# ScaledMail API - Inboxes

## Buy Pre Warm Inboxes

Purchase pre-warmed inboxes and automatically assign them to domains.

**Endpoint**

```
POST https://server.scaledmail.com/api/v1/buy-pre-warm-inboxes
```

> ⚠️ **Requires a connected payment method**
> 
> A subscription and pre-warm inboxes will be created automatically if available once the request is successful. If pre-warm inboxes are available, the system will automatically purchase and assign them to the provided domains.

### Authorization

Provide your bearer token in the `Authorization` header when making requests to protected resources.

```
Authorization: Bearer ********************
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | string | Yes | Organization ID |

### Request Body Parameters

All parameters must be sent in the JSON body.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | string | No | Custom tag for internal tracking |
| `domains` | array | Yes | Array of domain objects for pre-warm inbox creation |
| `sequencer` | object | No | Sequencer configuration for automatic inbox connection |

#### Domain Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Internal domain record ID |
| `domain` | string | Yes | Domain name |
| `redirect` | string | No | Redirect URL for the domain |

#### Sequencer Object

Used to automatically connect purchased pre-warm inboxes to an email sequencer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | Yes | Sequencer provider (e.g. `Instantly`) |
| `username` | string | Yes | Sequencer account username |
| `password` | string | Yes | Sequencer account password |
| `link` | string | Yes | Sequencer dashboard URL |
| `workspace` | string | No | Workspace or account name |
| `tag` | string | No | Tag to apply inside the sequencer |

#### Sequencer Tag Behavior

If the sequencer `tag` is set to `"{{ID}}"`, the system will automatically replace it with the payment ID generated during checkout. That payment ID will then be used as the tag inside the sequencer.

### Behavior Summary

- `tag` → optional, used for tracking
- `domains` → required, request fails if any domain is invalid or unavailable
- `redirect` → optional per domain
- `sequencer` → optional
- If pre-warm inboxes are available → they will be automatically purchased and assigned
- If `sequencer.tag = "{{ID}}"` → payment ID will be injected automatically

### Request Example

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");
myHeaders.append("Content-Type", "text/plain");

var raw = JSON.stringify({
  "tag": "client1",
  "domains": [
    {
      "id": "recscFIvHSqKwxfyp",
      "domain": "1apitestoutlook.com",
      "redirect": "bello.com"
    },
    {
      "id": "recLuIthqG59R4nmZ",
      "domain": "1apitestgoogle.com"
    }
  ],
  "sequencer": {
    "provider": "Instantly",
    "username": "ross@instantly.ai",
    "password": "InstantlyRoss456!",
    "link": "https://app.instantly.ai",
    "workspace": "paleontology-outreach",
    "tag": "{{ID}}"
  }
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://server.scaledmail.com/api/v1/buy-pre-warm-inboxes?organization_id", requestOptions)
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