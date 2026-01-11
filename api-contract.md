# API Contract — User & Authentication Service

## Base Url
```bash
/api/v1/users
```
## Common Response Shape (json)
```json
{
    "statusCode" : 201,
    "data" : {},
    "message" : "string",
    "success" : true
}
```
## Auth Header (where required)
```bash
Authorization: Bearer <ACCESS_TOKEN>
```

## Authentication Flow Summary

Access Token → short-lived (used in headers)

Refresh Token → long-lived (stored securely, often in HTTP-only cookie)

Logout invalidates refresh token

---

## Register User

### Endpoint
POST /register

### Auth Required
No

### Content-Type
multipart/form-data

### Body (Form Data)
| Field      | Type          | Required |
|------------|---------------|----------|
| fullName   | string        | true     |
| username   | string        | true     |
| email      | string        | true     |
| password   | string        | true     |
| department | string        | true     |
| year       | string        | true     |
| avatar     | file (image)  | false    |

### Success Response (201)
```json
{
  "statusCode": 201,
  "data": {
    "_id": "696379b43234f9f86caf08fc",
    "username": "jdeo",
    "email": "johndoe@vjti.com",
    "fullName": "john doe",
    "avatar": "",
    "department": "textile",
    "year": "last",
    "createdAt": "2026-01-11T10:21:40.510Z",
    "updatedAt": "2026-01-11T10:21:40.510Z",
    "__v": 0
  },
  "message": "User registered successfully!",
  "success": true
}
```

### Error Responses
400 → Missing fields

409 → User already exists

500 → Internal Error