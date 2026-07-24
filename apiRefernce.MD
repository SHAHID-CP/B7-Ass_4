# RentNest — API Reference (Request Data & Parameters)

This document lists every endpoint along with the exact body, URL params, and query params required, plus what each parameter actually represents — useful for testing with Postman or Swagger.

---

## 🔑 Auth — `/api/auth`

### POST `/register`
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "TENANT"
}
```
- `name` — full name of the person registering
- `email` — must be unique, used for login
- `password` — plain text (will be hashed), used for login
- `role` — which type of account to create: `TENANT`, `LANDLORD`, or `ADMIN`

### POST `/login`
```json
{
  "email": "string",
  "password": "string"
}
```
- `email` — the registered user's email
- `password` — the registered user's password

Sets `accessToken` and `refreshToken` as httpOnly cookies on success.

### POST `/refresh-token`
No body required. Requires the `refreshToken` cookie (set automatically after login) to be present in the request.

### POST `/logout`
No body required. Clears the auth cookies.

### GET `/me`
No body/param required. Identifies the logged-in user from the `accessToken` cookie.

### PATCH `/me`
```json
{
  "name": "string (optional)",
  "phoneNumber": "string (optional)",
  "profileImage": "string (optional)"
}
```
- All fields belong to the **currently logged-in user** (identified via cookie, not passed manually) — update whichever fields you want changed.

---

## 🏷️ Categories — `/api/categories`

### GET `/`
No body/param/query required. Returns all categories.

### POST `/` (Admin)
```json
{ "name": "string" }
```
- `name` — the new category's name (e.g. "Apartment", "Studio")

### DELETE `/:id` (Admin)
- URL param `id` — the **category's own id** (the one to be deleted). Get it from a `GET /categories` response.

---

## 🏠 Landlord — `/api/landlord`

### GET `/requests` (Landlord)
No body/param required. Returns properties owned by the **logged-in landlord** (identified via cookie).

### POST `/properties` (Landlord)
```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "price": 0,
  "categoryId": "uuid"
}
```
- `title`, `description`, `location` — details of the property being listed
- `price` — rental price (number)
- `categoryId` — the **id of an existing category** (get this from `GET /categories`), not made up
- Landlord ownership (`landlordId`) is taken automatically from the logged-in user, not passed in the body.

### PUT `/properties/:id` (Landlord)
- URL param `id` — the **property's own id** you want to update. Must belong to the logged-in landlord, otherwise a 403 error is thrown.
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "location": "string (optional)",
  "price": 0,
  "categoryId": "uuid (optional)",
  "isAvailable": true
}
```
- Same fields as create, all optional — only send what you want to change.

### DELETE `/properties/:id` (Landlord)
- URL param `id` — the **property's own id** to delete. Must belong to the logged-in landlord.

### PATCH `/requests/:id` (Landlord)
- URL param `id` — the **rental request's own id** whose status is being updated (not the property id, not the tenant id). Must belong to a rental request on one of this landlord's properties.
```json
{ "status": "APPROVED" }
```
- `status` — new status value: `PENDING`, `APPROVED`, `REJECTED`, `PAID`, `ACTIVE`, `COMPLETED`, or `CANCELLED`

### GET `/tenant-history/:tenantId` (Landlord, Admin)
- URL param `tenantId` — the **id of the tenant (a User)** whose rental/review history you want to view. Get it from a rental request's `tenant.id`, not the logged-in user's own id.

---

## 💳 Payments — `/api/payments`

### POST `/create` (Tenant)
```json
{ "rentalRequestId": "uuid" }
```
- `rentalRequestId` — the **id of the rental request** you're paying for. Must belong to the logged-in tenant and must currently have status `APPROVED`.

### GET `/` (Tenant, Admin)
No body/param required. Tenant sees only their own payments; Admin sees all.

### GET `/:id` (Tenant, Admin)
- URL param `id` — the **payment's own id** (not the rental request id). Tenant can only fetch their own payment, Admin can fetch any.

---

## 🏘️ Properties (Public) — `/api/properties`

### GET `/`
Query params (all optional, used for filtering/pagination — not URL params):
- `page` — page number for pagination (number)
- `limit` — how many results per page (number)
- `location` — text to search within property location (partial match)
- `categoryId` — filter by a specific category's id
- `minPrice` — minimum price filter (number)
- `maxPrice` — maximum price filter (number)

Example: `/api/properties?page=1&limit=10&location=dhaka&categoryId=<uuid>&minPrice=500&maxPrice=5000`

### GET `/:id`
- URL param `id` — the **property's own id** you want details for.

---

## 📋 Rentals — `/api/rentals`

### POST `/` (Tenant)
```json
{ "propertyId": "uuid" }
```
- `propertyId` — the **id of the property** the tenant wants to rent. Tenant id is taken automatically from the logged-in user.

### GET `/` (Tenant)
No body/param required. Returns rental requests made by the **logged-in tenant**.

### GET `/:id` (Tenant, Landlord, Admin)
- URL param `id` — the **rental request's own id**. Tenant must own it, Landlord must own the related property, Admin can access any.

### PATCH `/:id/cancel` (Tenant)
- URL param `id` — the **rental request's own id** to cancel. Must belong to the logged-in tenant. No body required.

---

## ⭐ Reviews — `/api/reviews`

### POST `/` (Tenant)
```json
{
  "propertyId": "uuid",
  "rating": 5,
  "comment": "string"
}
```
- `propertyId` — the **id of the property** being reviewed. Tenant must have a rental request for this property with status `PAID`.
- `rating` — number rating (e.g. 1–5)
- `comment` — review text
- Tenant id is taken automatically from the logged-in user.

### GET `/property/:propertyId`
- URL param `propertyId` — the **property's own id** whose reviews you want to fetch.

### GET `/landlord` (Landlord)
No body/param required. Returns reviews on properties owned by the **logged-in landlord**.

### GET `/admin` (Admin)
No body/param required. Returns all reviews across the platform.

---

## 🛡️ Admin — `/api/admin`

### GET `/users`
No body/param required. Returns all users.

### PATCH `/users/:id`
- URL param `id` — the **id of the user (User model)** whose status is being changed. Cannot be an admin's own id (blocked by the service).
```json
{ "status": "BANNED" }
```
- `status` — new status: `ACTIVE`, `BANNED`, or `SUSPENDED`

### GET `/properties`
No body/param required. Returns all properties platform-wide.

### GET `/rentals`
No body/param required. Returns all rental requests platform-wide.