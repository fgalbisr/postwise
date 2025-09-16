# 🚀 PostWise - Deployment Guide

## Opciones de Deployment

### 1. Vercel (Recomendado para Next.js)

#### Pasos:
1. **Crear cuenta en Vercel**: https://vercel.com
2. **Conectar con GitHub**: Importar el repositorio
3. **Configurar variables de entorno**:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   DATABASE_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   ```

4. **Deploy automático**: Vercel detectará Next.js y desplegará automáticamente

#### Comando manual:
```bash
npx vercel --prod
```

### 2. Netlify

#### Pasos:
1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Configurar variables de entorno** (mismas que Vercel)

### 3. Railway

#### Pasos:
1. **Crear cuenta en Railway**: https://railway.app
2. **Conectar GitHub**: Importar repositorio
3. **Configurar variables de entorno**
4. **Deploy automático**

## Variables de Entorno Requeridas

### Obligatorias:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `OPENAI_API_KEY`

### Opcionales (para integraciones futuras):
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `META_APP_ID`
- `META_APP_SECRET`
- `META_ACCESS_TOKEN`

## Base de Datos

### Opción 1: SQLite (Desarrollo)
```bash
npx prisma db push
npx prisma db seed
```

### Opción 2: PostgreSQL (Producción)
1. Crear base de datos en Railway/Supabase/PlanetScale
2. Actualizar `DATABASE_URL`
3. Ejecutar migraciones:
```bash
npx prisma db push
npx prisma db seed
```

## Comandos de Build

```bash
# Instalar dependencias
npm install

# Build para producción
npm run build

# Verificar build localmente
npm start
```

## URLs Importantes

- **Home**: `/`
- **Dashboard**: `/dashboard`
- **Sign In**: `/sign-in`
- **Sign Up**: `/sign-up`

## Notas de Deployment

1. **ESLint deshabilitado** temporalmente para el build
2. **TypeScript errors** ignorados temporalmente
3. **Imágenes optimizadas** pendientes (usar Next.js Image component)
4. **Base de datos** configurar antes del primer deploy

## Próximos Pasos

1. Configurar dominio personalizado
2. Configurar SSL/HTTPS
3. Configurar monitoreo (Sentry)
4. Configurar analytics (Google Analytics)
5. Optimizar imágenes y performance
