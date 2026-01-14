# ScaledMail API - Sample Schemas

## Pet

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer (int64) | Yes | Pet ID (>= 1) |
| `category` | object (Category) | Yes | Category |
| `name` | string | Yes | Pet name (e.g. `doggie`) |
| `photoUrls` | array[string] | Yes | Image URLs |
| `tags` | array[object (Tag)] | Yes | Tags |
| `status` | enum (string) | Yes | Pet Sales Status. Allowed values: `available`, `pending`, `sold` |

### Example

```json
{
    "id": 1,
    "category": {
        "id": 1,
        "name": "string"
    },
    "name": "doggie",
    "photoUrls": [
        "string"
    ],
    "tags": [
        {
            "id": 1,
            "name": "string"
        }
    ],
    "status": "available"
}
```