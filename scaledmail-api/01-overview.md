# ScaledMail API Documentation

## Overview

Welcome to ScaledMail! Let's get you authenticated and ready to build.

## Finding Your API Key

Your API key is used to authenticate all incoming requests. Each key is unique to your ScaledMail account and has access to all organizations under that account.

To get your API key, go to: https://app.scaledmail.com/settings

## Authentication

All API requests must include a Bearer token in the `Authorization` header.

**Example:**

```bash
curl --location 'https://server.scaledmail.com/api/v1/organizations' \
--header 'Authorization: Bearer YOUR_API_KEY'
```

Replace `YOUR_API_KEY` with your actual token.

This ensures that requests are securely authenticated and authorized to access your ScaledMail account.

## Required Parameter: organization_id

All endpoints require an `organization_id`. Each organization is a separate environment within your account for managing domains, inboxes, and campaigns.

Be sure to include `organization_id` in every request.

## Rate Limits

| Limit | Note |
|-------|------|
| 5 requests per second | Exceeding the limit may result in temporary blocks |

## Support

For assistance or feature requests, contact: support@scaledmail.com