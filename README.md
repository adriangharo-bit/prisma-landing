# PRISMA — Registro + Sorteo

App de registro para el sorteo del zapato PRISMA (Acopa Outdoors). Next.js 14 (App Router) + TypeScript + Tailwind CSS. Shopify es el almacenamiento (no hay base de datos propia); Vercel KV persiste el resultado del sorteo.

## Setup

### 1. Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena los valores:

```
cp .env.local.example .env.local
```

### 2. Private App en Shopify

1. Shopify Admin → **Settings → Apps and sales channels → Develop apps**
2. Crear app "PRISMA Sorteo"
3. Admin API scopes: habilitar `write_customers` y `read_customers`
4. Instalar la app → copiar el **Admin API access token** → `SHOPIFY_ADMIN_TOKEN`
5. `SHOPIFY_STORE` es el dominio `.myshopify.com` de la tienda

### 3. Resend (emails transaccionales)

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar el dominio `acopaoutdoors.com` (o el subdominio que uses para `FROM_EMAIL`)
3. Generar un API key → `RESEND_API_KEY`

### 4. Vercel KV

1. En el proyecto de Vercel: **Storage → Create Database → KV** (o conectar una integración de Redis desde el Marketplace)
2. Al conectar el store al proyecto, Vercel inyecta `KV_REST_API_URL` y `KV_REST_API_TOKEN` automáticamente
3. En desarrollo local sin KV configurado, el proyecto usa un fallback en memoria (no persiste entre reinicios — solo para probar el flujo, no usar así en producción)

### 5. Desarrollo local

```
npm install
npm run dev
```

Abre `http://localhost:3000`. Para probar el auto-llenado de código: `http://localhost:3000/?code=PR4X9K`.

### 6. Deploy

```
vercel deploy
```

Configura el dominio `prisma.acopaoutdoors.com` en el proyecto de Vercel y agrega ahí las mismas variables de entorno de `.env.local`.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Formulario de registro público |
| `/ganadores` | Página pública de ganadores (countdown antes del sorteo) |
| `/admin` | Panel protegido por contraseña para ejecutar el sorteo |
| `/api/register` | POST — valida código + crea/actualiza cliente en Shopify + email de confirmación |
| `/api/raffle` | POST (admin) — ejecuta el sorteo |
| `/api/winners` | GET (público) — estado y ganadores |
| `/api/admin/login` | POST — valida `ADMIN_PASSWORD` |
| `/api/admin/status` | GET (admin) — estadísticas para el panel |
| `/api/admin/registrants` | GET (admin) — exporta CSV de registrados |

## Notas

- Rate limiting en `/api/register`: máximo 3 intentos por IP por hora (vía Vercel KV).
- El sorteo puede forzarse antes de `RAFFLE_DATE` con `POST /api/raffle?force=true` para pruebas.
- Los ganadores quedan tageados en Shopify como `prisma-ganador`, además del tag `prisma-sorteo` de todos los registrados.
