# Mal de Muchos

Aplicación Next.js (App Router) para publicar quejas anónimas y generar analítica.

## Requisitos

- Node.js 20+
- PostgreSQL (Railway recomendado)

## Variables de entorno

Copiá `.env.example` y completá:

- `DATABASE_URL` (PostgreSQL, obligatorio)
- `IP_HASH_SALT` (obligatorio)
- `CHALLENGE_HMAC_SECRET` (obligatorio)
- `ANALYTICS_API_SECRET` (obligatorio para proteger `/api/analytics`)
- `ANTHROPIC_API_KEY` (si moderación IA está activa)

## Desarrollo local

```bash
npm install
npm run dev
```

## Base de datos

```bash
npm run db:migrate
```

No hay datos mock precargados por defecto.

## Deploy en Railway

Este repo incluye `railway.json` y usa:

- Build: `npm run build`
- Start: `npm run start:railway` (ejecuta migraciones y levanta Next)

Configurar en Railway las variables:

- `DATABASE_URL`
- `IP_HASH_SALT`
- `CHALLENGE_HMAC_SECRET`
- `ANALYTICS_API_SECRET`
- `ANTHROPIC_API_KEY` (opcional)

## Calidad

```bash
npm run lint
npm run build
```
