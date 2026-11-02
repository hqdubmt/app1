# App1 Frontend

React + Vite admin interface for the App1 Express API.

## Features
- Dashboard summary
- Users CRUD: GET, POST, PUT, DELETE `/users`
- Products CRUD: GET, POST, PUT, DELETE `/products`
- Search, form validation, delete confirmation, loading and error states
- Development proxy and production Nginx reverse proxy

## Expected API contract
- `GET /users` returns an array of `{ id, name, email }`
- `POST /users` accepts `{ name, email }`
- `PUT /users/:id` accepts `{ name, email }`
- `DELETE /users/:id`
- `GET /products` returns an array of `{ id, name, price }`
- `POST /products` accepts `{ name, price }`
- `PUT /products/:id` accepts `{ name, price }`
- `DELETE /products/:id`

If the API returns a different response shape or uses different field names, adjust `src/api.js` or the table/form fields in `src/App.jsx`.

## Run in development
From the `frontend` folder:
```bash
npm install
npm run dev
```
Vite proxies `/api/users` to `http://localhost:3003/users` and `/api/products` to `http://localhost:3003/products`.

## Build and Docker
```bash
docker build -t hqdu/app1-frontend:latest .
docker push hqdu/app1-frontend:latest
```

Add this service to the existing root `docker-compose.yml`:
```yaml
  frontend:
    image: hqdu/app1-frontend:latest
    container_name: app1-frontend
    restart: always
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - app-network
```
The provided Nginx config proxies `/api/` to the Compose service named `backend` on port `3003`. The backend and frontend must share `app-network`.

Then:
```bash
docker compose pull frontend
docker compose up -d
```
Open `http://SERVER_IP:8080`.

## Important backend requirements
- Express must listen on `0.0.0.0`, not only `localhost`.
- Backend port inside container must be `3003`.
- Existing backend Compose service must be named `backend`.
- Backend API paths must be `/users` and `/products`.
- `app.use(express.json())` must be enabled for JSON request bodies.
