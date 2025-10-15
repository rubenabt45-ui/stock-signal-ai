# Frontend-Only Mode (Optional)

Este proyecto incluye un **sistema de datos mock** que permite ejecutarlo sin backend real.

⚠️ **NOTA**: Por defecto, el modo frontend-only está **DESACTIVADO** (`FRONTEND_ONLY = false`). La app usa el backend real de Supabase.

## Cómo Activar el Modo Frontend-Only

### Paso 1: Activar el Flag
Edita `/src/config/runtime.ts`:
```typescript
export const FRONTEND_ONLY = true; // Cambiar a true
```

### Paso 2: Actualizar Imports (Opcional)
Si quieres usar el sistema completo de auth mock, actualiza estos archivos:

**src/providers/AppProviders.tsx:**
```typescript
import { FakeAuthProvider } from "@/providers/FakeAuthProvider";
import { FeaturesProvider } from "@/providers/FeaturesProvider";

// Reemplazar AuthProvider con FakeAuthProvider
<FakeAuthProvider>
  <FeaturesProvider>
    {children}
  </FeaturesProvider>
</FakeAuthProvider>
```

## Qué Incluye

### Datos Mock (`/src/mocks/`)
- `userProfile.ts` - 2 usuarios: Founder (PRO) y Demo (Free)
- `tickers.ts` - 5 stocks: AAPL, GOOGL, MSFT, TSLA, AMZN
- `chartSeries.ts` - Datos históricos de precios
- `signals.ts` - Señales de trading (buy/sell/hold)
- `plans.ts` - Planes Free y PRO

### Fake Client (`/src/lib/fakeClient.ts`)
Cliente simulado que imita la API de Supabase:
- Auth: login, signup, logout
- Database: select, insert, update, delete
- Functions: invoke (check-subscription)
- Storage: upload, remove, getPublicUrl (no-op)
- Latencia simulada de 500ms

### Fake Auth (`/src/providers/FakeAuthProvider.tsx`)
- Usa localStorage para persistir sesión
- Hook `useFakeAuth()` compatible con `useAuth()`
- Soporta múltiples usuarios mock

### Features Provider (`/src/providers/FeaturesProvider.tsx`)
- Control de acceso PRO
- Hook `useFeatures()` con `isPro`, `hasFeature()`

## Uso

### Usuarios Mock
En localStorage:
- `mock_logged_in`: 'true' | 'false'
- `mock_user_id`: 'founder' | 'demo-user'

**Usuario Founder (PRO):**
- Email: `ruben_abt@hotmail.com`
- Acceso: PRO ilimitado
- ID: `570ebb74-74dd-424e-8191-3c7689c38ed2`

**Usuario Demo (Free):**
- Email: `demo@example.com`
- Acceso: Free (50 msgs/día)
- ID: `demo-user-123`

### Upgrade a PRO
En modo frontend-only, cualquier click en "Activate PRO" o "Upgrade" ejecuta:
```typescript
fakeMarketClient.upgradeToPro()
```
Esto actualiza el plan del usuario actual a PRO instantáneamente.

## Limitaciones del Modo Frontend-Only

❌ **No incluye encadenamiento completo de Supabase**
- Los métodos `.from().select().eq().single()` pueden fallar con TypeScript
- Solo implementa casos de uso básicos
- No soporta queries complejas

❌ **Componentes que pueden requerir ajustes:**
- `NotificationsSection.tsx`
- `ProfileSection.tsx` 
- `LanguageContext.tsx`
- `ThemeContext.tsx`
- Hooks que usan queries complejas

✅ **Funciona bien para:**
- Demos visuales
- Testing de UI
- Desarrollo offline
- Prototipos sin backend

## Volver al Backend Real

1. Cambia `FRONTEND_ONLY = false` en `/src/config/runtime.ts`
2. Asegúrate de tener `.env` configurado
3. Restaura `AuthProvider` en `AppProviders.tsx` si lo cambiaste

## Archivos Creados

### Core
- `/src/config/runtime.ts` - Flag FRONTEND_ONLY
- `/src/lib/fakeClient.ts` - Cliente mock

### Mocks
- `/src/mocks/userProfile.ts`
- `/src/mocks/tickers.ts`
- `/src/mocks/chartSeries.ts`
- `/src/mocks/signals.ts`
- `/src/mocks/plans.ts`

### Providers
- `/src/providers/FakeAuthProvider.tsx`
- `/src/providers/FeaturesProvider.tsx`

### Compatibility Layers (No usados por defecto)
- `/src/integrations/supabase/client-fake.ts`
- `/src/hooks/useSubscription-fake.ts`
- `/src/contexts/AuthContext-fake.tsx`
- `/src/services/auth.service-fake.ts`
- `/src/utils/stripeUtils-fake.ts`

## Notas

- El sistema mock está **desactivado por defecto**
- La app funciona normalmente con Supabase real
- Activa solo si necesitas un demo sin backend
- No apto para producción

## Desarrollo Futuro

Para hacer el fake client completamente compatible:
1. Implementar patrón de query builder correcto
2. Añadir todos los métodos de Supabase (`.gte()`, `.lte()`, `.in()`, etc.)
3. Refactorizar componentes para ser agnósticos del cliente
4. Considerar usar MSW (Mock Service Worker) en su lugar
