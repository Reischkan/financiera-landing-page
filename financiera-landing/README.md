# FinBank - Landing Page de Productos Financieros

Este proyecto es una landing page para una institución financiera ficticia llamada FinBank, que muestra un catálogo de productos financieros con detalles, filtros por categoría y páginas de detalle individuales.

## 🚀 Características principales

- **Catálogo de productos financieros** con filtro por categorías
- **Página de detalle** para cada producto financiero
- **Diseño responsive** (Mobile First)
- **Interfaces accesibles** con buen contraste y etiquetas aria
- **Diseño moderno** y profesional para generar confianza

## 🛠️ Tecnologías utilizadas

- **Next.js 14** con App Router
- **TypeScript** para tipado estricto
- **TailwindCSS** para layout y estructuras base
- **Styled Components** para componentes visuales reutilizables
- **Accesibilidad** siguiendo buenas prácticas

## 📋 Requisitos previos

- Node.js 18.17.0 o superior
- npm o yarn

## 🔧 Instalación y ejecución local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Reischkan/financiera-landing.git
   cd financiera-landing
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

> ⚠️ **Nota**: Actualmente hay algunos problemas de tipos en el build que están relacionados con la integración de Next.js App Router y TypeScript. Estos no afectan el funcionamiento en modo de desarrollo, pero podrían generar errores al intentar construir la aplicación. Una solución provisional es ejecutar la aplicación en modo de desarrollo para propósitos de demostración.

## 🏗️ Estructura del proyecto

```
financiera-landing/
├── public/             # Archivos estáticos (imágenes, favicon, etc)
├── src/
│   ├── app/            # Rutas de Next.js App Router
│   │   ├── page.tsx    # Página principal
│   │   └── product/[id]/page.tsx  # Página de detalle de producto
│   ├── components/     # Componentes reutilizables
│   ├── data/           # Datos mockeados de productos
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilidades y configuraciones
│   └── types/          # Definiciones de tipos TypeScript
└── ...
```

## 🚀 Despliegue

Este proyecto puede ser fácilmente desplegado en Vercel:

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una.
2. Conecta tu repositorio de GitHub.
3. Configura un nuevo proyecto y despliégalo.

Alternativamente, puedes desplegar manualmente:

```bash
npm run build
# o
yarn build

# Luego despliega la carpeta .next a tu proveedor preferido
```

## 🔍 Respuestas a las preguntas complementarias

### 1. ¿Qué criterios seguiste para diseñar la UI de productos financieros?

Para diseñar la UI de productos financieros, seguí estos criterios principales:

- **Confianza y profesionalismo**: Utilicé colores sobrios y una tipografía clara con buen contraste, ya que en el sector financiero la confianza es fundamental. Los tonos azules predominan por su asociación con seguridad y estabilidad.

- **Claridad en la información**: Los productos financieros suelen ser complejos, por lo que organicé la información de manera jerárquica, destacando en primer lugar la categoría y nombre del producto, seguido de una descripción concisa y finalmente los atributos técnicos (tasas, condiciones, etc.).

- **Consistencia visual**: Mantuve un sistema de diseño coherente en toda la aplicación, con componentes visuales que siguen el mismo patrón (tarjetas, badges, botones) para facilitar la comprensión del usuario.

- **Accesibilidad**: Implementé etiquetas ARIA, aseguré buen contraste de colores y creé componentes navegables por teclado para garantizar que todo tipo de usuarios puedan acceder a la información.

- **Visualización del riesgo**: Para productos de inversión, añadí una representación visual del nivel de riesgo mediante un gráfico simple que permite al usuario entender rápidamente el perfil de riesgo del producto.

### 2. ¿Cómo decidiste cuándo usar Tailwind y cuándo Styled Components?

La decisión de cuándo utilizar cada tecnología se basó en estos criterios:

- **Tailwind CSS**: Lo utilicé principalmente para:
  - Estructuras de layout (grids, flexbox)
  - Espaciados y márgenes generales
  - Responsive design base
  - Utilidades rápidas no relacionadas con interactividad

- **Styled Components**: Lo apliqué para:
  - Componentes específicos con estilos que dependen del estado (hover, focus, active)
  - Componentes que requieren estilos dinámicos basados en props
  - Crear sistemas de componentes reutilizables con estilos encapsulados
  - Elementos que necesitan animaciones o transiciones personalizadas
  - Sobrescribir o extender estilos de componentes existentes

Esta combinación permite aprovechar la eficiencia de Tailwind para layouts y estructuras básicas, mientras que Styled Components proporciona la flexibilidad necesaria para componentes más complejos y específicos con lógica de estilado.

### 3. ¿Qué harías para escalar este proyecto en una aplicación real de banca digital?

Para escalar este proyecto a una aplicación real de banca digital, implementaría:

- **Arquitectura de microservicios**: Separar el frontend en componentes independientes que puedan ser desarrollados y desplegados de forma autónoma.

- **API REST o GraphQL**: Implementar una API robusta para la comunicación con los servicios backend, con versionado y documentación detallada.

- **Autenticación y autorización**: Integrar sistemas seguros de login y control de acceso a información sensible (OAuth 2.0, JWT).

- **Monitoreo y analítica**: Implementar herramientas como Sentry para errores, Google Analytics para comportamiento de usuario y Lighthouse para rendimiento.

- **Testing automatizado**: Añadir pruebas unitarias, de integración y e2e con Jest, React Testing Library y Cypress.

- **Internacionalización (i18n)**: Permitir múltiples idiomas para atender a usuarios diversos.

- **PWA y capacidades offline**: Convertir la aplicación en una Progressive Web App para mejor experiencia en dispositivos móviles.

- **Optimización de rendimiento**: Code splitting, lazy loading, optimización de imágenes y Server Side Rendering (SSR) para páginas críticas.

- **Integración con servicios financieros**: Conectar con servicios de banca abierta (Open Banking APIs), pasarelas de pago y sistemas de verificación de identidad.

- **Gestión de estado avanzada**: Implementar Redux o React Query para manejar estado global y caché de datos.

### 4. ¿Qué herramientas usarías para mejorar el rendimiento y monitoreo en producción?

Para mejorar el rendimiento y monitoreo en una aplicación de producción utilizaría:

- **Análisis de rendimiento**:
  - Lighthouse y PageSpeed Insights para auditorías periódicas
  - Web Vitals para métricas core de rendimiento
  - Next.js Analytics para métricas específicas del framework

- **Monitoreo de errores y excepciones**:
  - Sentry para captura y análisis de errores en tiempo real
  - LogRocket para reproducción de sesiones de usuario y debugging

- **Monitoring de disponibilidad**:
  - Uptime Robot o Pingdom para alertas de disponibilidad
  - New Relic para monitoreo del rendimiento del servidor

- **Analítica de usuario**:
  - Google Analytics o Plausible para comportamiento general
  - Hotjar para mapas de calor y grabaciones de sesión
  - Mixpanel para análisis de embudos de conversión

- **Optimización de assets**:
  - Compression-webpack-plugin para minificación
  - next/image para optimización automática de imágenes
  - Service workers para caching inteligente
  - CDN para distribución global de contenido estático

- **Testing de carga**:
  - JMeter o k6 para simular carga alta de usuarios
  - Gatling para pruebas de estrés

Estas herramientas permitirían un ciclo constante de medición, análisis y mejora tanto del rendimiento técnico como de la experiencia del usuario en la aplicación financiera.

