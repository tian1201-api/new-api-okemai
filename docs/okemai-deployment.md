# OKEMAI skin deployment on New API

This repository keeps New API as the functional base. The okemai work is a frontend skin and storefront adaptation only. Registration, login, wallet, recharge, redemption, payment callbacks, token management, channels, admin permissions, and usage statistics remain New API native flows.

## What was migrated

- Homepage brand direction: OKEMAI, "One Key, Every Model AI", dark panels, teal action buttons, compact 8px cards, plan cards, and console-oriented CTAs.
- Auth page shell: okemai background, logo treatment, and feature panels around the original New API sign-in/sign-up forms.
- Plan cards: visual storefront cards that route into New API wallet, pricing, sign-in, and sign-up routes. They do not create a second payment system.

## Native New API routes used

- Register: `/sign-up`
- Login: `/sign-in`
- User dashboard: `/dashboard`
- Token management: `/keys`
- Wallet, recharge, redemption, and payment entry: `/wallet`
- Public top-up compatibility route: `/console/topup`
- Model pricing: `/pricing`
- Usage and API call statistics: `/usage-logs`
- Channel management: `/channels`
- Admin/system settings: `/system-settings`

## Ubuntu deployment

1. Install Docker and Compose.

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg nginx
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

2. Clone the project and checkout the okemai branch.

```bash
git clone https://github.com/tian1201-api/new-api-okemai.git
cd new-api-okemai
git checkout codex/okemai-ui-skin
```

3. Create `.env`.

```env
TZ=Asia/Shanghai
SESSION_SECRET=replace-with-a-long-random-string
SQL_DSN=postgresql://newapi:replace-db-password@postgres:5432/new-api
REDIS_CONN_STRING=redis://:replace-redis-password@redis:6379
ERROR_LOG_ENABLED=true
BATCH_UPDATE_ENABLED=true
NODE_NAME=okemai-new-api-1

# Optional analytics
# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
```

4. Use Docker Compose.

```yaml
services:
  new-api:
    build: .
    container_name: okemai-new-api
    restart: always
    command: --log-dir /app/logs
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
      - ./logs:/app/logs
    env_file:
      - .env
    depends_on:
      - redis
      - postgres
    networks:
      - okemai-new-api

  redis:
    image: redis:7-alpine
    container_name: okemai-redis
    restart: always
    command: ["redis-server", "--requirepass", "replace-redis-password"]
    networks:
      - okemai-new-api

  postgres:
    image: postgres:15
    container_name: okemai-postgres
    restart: always
    environment:
      POSTGRES_USER: newapi
      POSTGRES_PASSWORD: replace-db-password
      POSTGRES_DB: new-api
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - okemai-new-api

volumes:
  pg_data:

networks:
  okemai-new-api:
    driver: bridge
```

Start it:

```bash
docker compose up -d --build
```

5. Configure Nginx.

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Add HTTPS with Certbot if needed:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

## First-run checks

- Open `/setup` if this is a fresh New API database and create the first admin account.
- Open `/sign-up` and verify registration follows the New API registration settings.
- Open `/sign-in` and verify login reaches `/dashboard`.
- As a user, create a token at `/keys` and make an OpenAI-compatible API call.
- Check `/usage-logs` after the API call.
- Check `/wallet`, redemption, recharge, and payment settings according to the payment provider configured in New API admin settings.
- As admin, open `/channels` and `/system-settings` to verify channel and permission management still work.

## Notes

- The okemai plan cards are presentation and routing only. Actual package, quota, price, recharge, and payment rules should be configured in New API admin settings and database-backed New API flows.
- Do not deploy the old `okemai` Node MVP together with this app on the same domain. This project is the New API app with an okemai frontend skin.
