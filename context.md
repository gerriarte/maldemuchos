Prompt de Definición de Proyecto y Directrices de Frontend
Contexto del Proyecto:
Estamos construyendo "Mal de Muchos", un Data Product disfrazado de red social de desahogo. El objetivo público es permitir a los usuarios online denunciar y compartir de forma anónima sus frustraciones con empresas y servicios. El objetivo de negocio subyacente es recopilar datos estructurados sobre los puntos de dolor del mercado (market pain points) para vender insights, reportes de competencia y generación de leads cualificados a empresas B2B.

El MVP debe centrarse en la fricción mínima para la entrada de datos (quejas) y la máxima visibilidad del contenido generado (el "chisme").

1. El Frontend: Filosofía de Diseño
El diseño debe ser "Brutalista y Urgente". No buscamos una estética corporativa ni limpia. Buscamos que la interfaz grite disrupción, catarsis e indignación colectiva. Debe sentirse como un tablón de anuncios de una protesta urbana, pero digital.

Principios de Diseño:

Mobile-First Absoluto: El 90% de las quejas vendrán desde un celular en el momento exacto de la frustración.

Sin Registro (MVP): La entrada es libre. La validación de identidad se hará en una fase posterior. El anonimato es un feature, no un bug.

Contraste Agresivo: Usar el color para resaltar el "dolor".

2. Identidad Visual (Sistema de Diseño)
Paleta de Colores:

Background: #000000 o #0A0A0A (Negro profundo. El drama ocurre sobre negro).

Texto Base: #FFFFFF (Blanco puro para máxima legibilidad).

Acentuado 1 (Dolor): #FF3B30 (Rojo neón/alerta. Usado para el nombre de la empresa y la intensidad de la queja).

Acentuado 2 (Chisme): #E5FF00 (Amarillo neón/eléctrico. Usado para botones de interacción como "A mí también me pasó").

Tipografía:

Titulares (Nombres de Empresa, Ránkings): "Archivo Black" o "Integral CF". Una fuente heavy, ancha y agresiva. Debe gritar.

Cuerpo (La Queja, Comentarios): "Geist Mono" o "Space Mono". Una fuente monoespaciada para darle un aire de "filtración" de datos o "registro oficial".

UI Patterns:

Bordes gruesos y directos (2px, blancos o neón).

Sombras duras y proyectadas (hard shadows).

Ausencia de degradados o sombras suaves.

3. Estructura de Páginas y Componentes Clave (El Flujo de Usuario)
El MVP consta de una sola página de flujo continuo (Single Page App mentalidad).

A. La Caja de Ventilación ("The Vent Box" - Hero Component)
Situada en la parte superior. Debe ser lo primero que se ve al cargar la web.

Input Directo: Un campo de texto grande con placeholder provocador: "¿Quién te jodió el día hoy? Escupilo acá...".

Selector de Empresa: Un campo con auto-completado para el nombre de la empresa.

Escala de Intensidad: Un slider o botones del 1 al 10, donde el 1 es "Molestia leve" y el 10 es "Furia total/Estafa". Este control debe colorearse de amarillo a rojo intenso según la selección.

Botón de Acción (Submit): Grande, amarillo neón, con texto: "SOLTAR VENENO".

B. El Chismógrafo (Live Complaint Feed)
Scroll infinito justo debajo de la Caja de Ventilación.

Formato de Card de Queja: Cada queja debe parecer un "tweet brutalista".

Header: Nombre de la Empresa (en Rojo Neón) + Estampa de tiempo (hace 2 min) + Categoría (ej: "UX Terrible").

Body: El texto de la queja (en fuente Mono).

Footer (Interacciones):

Botón "A mí también me pasó" (Contador de validación social).

Botón "Indignante" (Reacción).

Botón "Compartir el chisme" (Abre el diálogo de compartir nativo o copia link).

C. Top del colectivo (sidebar / ranking)
Un ránking visual y dinámico de las empresas con más quejas activas.

Formato: Una lista numerada del 1 al 10.

Cada ítem muestra: Nombre de Empresa | Score de Odio | Tendencia (⬆️/⬇️).

4. Directrices Técnicas de Frontend
Framework: Next.js (App Router) para renderizado en servidor (SSR) y excelente SEO (necesitamos que las quejas de empresas específicas indexen en Google).

Estilos: Tailwind CSS para un desarrollo rápido y fácil aplicación del estilo brutalista con clases utilitarias.

Interacciones: Usar animaciones sutiles pero efectivas. Al enviar una queja, el botón de "SOLTAR VENENO" debe tener un micro-efecto de vibración (shake) para simular la liberación de tensión.