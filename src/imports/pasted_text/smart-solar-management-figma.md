🚀 PROMPT COMPLETO PARA MAQUETA EN FIGMA
Sistema Inteligente de Gestión de Energía Solar (Smart Solar Energy Management System)
📌 CONTEXTO GENERAL
Diseñar una interfaz web moderna y profesional para gestionar una microred eléctrica compuesta por 4 paneles solares y 4 viviendas inteligentes.

Concepto clave: Cada vivienda tiene asignado inicialmente un panel solar. Sin embargo, el consumo eléctrico de cada hogar varía durante el día. Cuando una vivienda necesita más energía de la que su panel puede suministrar, el sistema permite que el residente solicite energía adicional. El administrador recibe la solicitud, evalúa la disponibilidad energética y puede aprobar o rechazar el incremento. Si se aprueba, el sistema redistribuye energía desde paneles con excedente hacia la vivienda solicitante, y el costo adicional se registra automáticamente para facturación.

El administrador debe tener control total sobre el suministro de energía, pudiendo:

Aprobar o rechazar solicitudes de energía adicional.

Ajustar manualmente los límites de suministro por vivienda.

Redistribuir energía entre paneles y viviendas.

Asignar energía directamente sin solicitud previa (acciones manuales).

Ver historial completo de acciones de suministro.

🎨 ESTILO VISUAL GENERAL
Paleta de colores:
Azul principal: #2563EB

Verde: #22C55E

Blanco: #FFFFFF

Gris claro: #F3F4F6

Gris medio: #9CA3AF

Gris oscuro: #1F2937

Rojo: #EF4444

Amarillo: #F59E0B

Estilo de diseño:
Glassmorphism: Tarjetas con fondo semi-transparente, desenfoque (backdrop-filter: blur(10px)), bordes sutiles y sombras suaves.

Esquinas redondeadas: 12px para tarjetas, 8px para botones.

Sombras: box-shadow: 0 4px 6px rgba(0,0,0,0.1)

Iconografía: FontAwesome o Material Icons (sol, panel, casa, batería, sensor, dinero, reloj, engranaje).

Tipografía: Inter, Roboto o similar (sans-serif, peso 400-700).

Responsive: Escritorio (>=1280px) y tablet (>=768px). Sidebar colapsable en tablet.

📱 PANTALLAS REQUERIDAS
1. INICIO DE SESIÓN (Login)
Elementos:

Logo del sistema (nombre "SOLARSMART" + icono de sol).

Imagen ilustrativa de paneles solares y viviendas inteligentes (lado derecho).

Campos:

Correo electrónico (input con icono de usuario).

Contraseña (input con icono de candado, con opción de mostrar/ocultar).

Botón principal: "Iniciar sesión" (azul #2563EB, hover más oscuro).

Enlace "¿Olvidaste tu contraseña?".

Diseño minimalista, dividido en dos columnas.

2. DASHBOARD DEL ADMINISTRADOR
Layout: Sidebar izquierdo + contenido principal.

Sidebar:

Logo del sistema en la parte superior.

Menú de navegación:

📊 Dashboard

🏠 Viviendas

☀️ Paneles Solares

📡 Sensores IoT

📝 Solicitudes

💰 Facturación

🔔 Notificaciones

📈 Reportes

⚙️ Configuración

Contenido principal:

A) Indicadores (tarjetas superiores)
Energía total generada hoy: XXX kWh (verde)

Energía total consumida: XXX kWh (azul)

Energía disponible: XXX kWh (amarillo)

Viviendas conectadas: 4/4 (verde)

Paneles activos: 4/4 (verde)

Solicitudes pendientes: X (naranja, con badge)

Alertas activas: X (rojo, con badge)

Sensores conectados: X/8 (verde)

B) Gráficos
Gráfico de generación de energía: Línea o barras (últimas 24h).

Gráfico de consumo por vivienda: Barras apiladas o columnas (últimas 24h).

C) Diagrama de flujo energético (elemento clave)
Visualización: 4 paneles solares (iconos) conectados a 4 viviendas (iconos) mediante líneas de flujo.

Líneas de flujo:

Verde: Flujo normal (suministro base).

Amarillo: Flujo adicional (energía extra solicitada).

Rojo: Déficit (necesita más energía).

Interactividad: Al hacer clic en una línea, se abre un panel lateral que permite:

Ver la energía actual (kW).

Redirigir el flujo a otra vivienda.

Aumentar o disminuir la cantidad de energía.

Botones de acción rápida:

"Redistribuir energía"

"Asignar excedentes"

"Balancear carga"

3. GESTIÓN DE VIVIENDAS
Layout: Grid de 4 tarjetas (2x2 o 4x1 según responsive).

Cada tarjeta debe incluir:
Información visible:

Nombre o número de vivienda (ej. "Vivienda 1", "Casa García-López")

Consumo actual: X.X kW

Energía disponible: X.X kWh

Panel solar asignado: "Panel A"

Estado del sensor: 🟢 Conectado / 🔴 Desconectado

Estado de la conexión: 🟢 Online / 🔴 Offline

Nivel de batería: XX% (si aplica)

Estado del suministro:

🟢 Normal (fondo verde)

🟡 Consumo elevado (fondo amarillo)

🔴 Consumo crítico (fondo rojo)

Controles de administrador (NUEVO):

Slider de límite de suministro: Control deslizante que permite aumentar o disminuir el límite de energía para esa vivienda.

Botón "Aplicar cambio": Confirma el nuevo límite.

Indicador de energía extra: Muestra cuánta energía adicional (kWh) se ha asignado manualmente.

Botón "Ajustar suministro": Abre un modal donde el administrador puede:

Ver el consumo actual.

Ver la energía disponible en la red.

Ingresar la nueva cantidad de energía a suministrar (kWh).

Establecer duración (horas, días o indefinido).

Confirmar el cambio.

Botón "Ver detalles": Navega a la pantalla de detalle de la vivienda.

4. GESTIÓN DE PANELES SOLARES
Layout: Grid de 4 tarjetas.

Cada tarjeta debe incluir:
Información visible:

Nombre o número de panel (ej. "Panel 1", "Panel A")

Energía generada hoy: XX.X kWh

Potencia actual: X.X kW

Temperatura: XX°C

Radiación solar: XXX W/m²

Estado operativo: 🟢 Activo / 🟡 Mantenimiento / 🔴 Inactivo

Porcentaje de utilización: XX%

Energía disponible: XX.X kWh

Estado de mantenimiento: OK / Precaución / Fallo

Controles de administrador (NUEVO):

Selector de asignación: Desplegable que permite asignar manualmente la producción del panel a una vivienda específica.

Gráfico de barras: Muestra qué porcentaje de la generación va a cada vivienda.

Botón "Redistribuir energía": Abre un modal donde el administrador puede:

Seleccionar un panel con excedente.

Seleccionar una vivienda con déficit.

Ingresar la cantidad de energía a transferir (kWh).

Confirmar la acción.

5. DETALLE DE UNA VIVIENDA
Layout: Dos columnas (información + gráficos).

Sección izquierda:
Información general:

Nombre y número de vivienda.

Panel solar asignado.

Consumo promedio (kW)

Consumo máximo (kW)

Consumo mínimo (kW)

Energía adicional utilizada (kWh) (acumulado)

Sección "Gestión de suministro" (NUEVO):

Consumo actual y límite de suministro actual.

Botón "Aumentar suministro" que abre un modal con:

Consumo histórico y déficit actual.

Campo para ingresar la cantidad extra (kWh).

Selector de duración (horas, días o indefinido).

Confirmación del cambio.

Registro de cambios: Tabla que muestra todas las modificaciones de suministro realizadas por el administrador (fecha, cantidad, motivo).

Sección derecha:
Gráficos de consumo:

Últimas 24 horas (línea)

Últimos 7 días (barras)

Último mes (barras)

Abajo:
Historial de solicitudes de energía:

Tabla con: Fecha, Hora, Energía solicitada (kWh), Motivo, Estado (Pendiente/Aprobada/Rechazada), Costo (€).

Historial de pagos:

Tabla con: Fecha, Concepto, Importe, Estado (Pagado/Pendiente).

Alertas recibidas:

Lista de notificaciones.

Botón principal:
"Solicitar energía adicional" (para el residente):

Abre un modal donde el residente ingresa:

Cantidad de energía extra (kWh)

Motivo de la solicitud (campo de texto)

Botón "Enviar solicitud".

6. SOLICITUDES DE ENERGÍA (Pantalla central del administrador)
Layout: Tabla con filtros y acciones.

Columnas de la tabla:

Vivienda

Fecha

Hora

Energía solicitada (kWh)

Consumo actual (kW)

Motivo

Estado (Pendiente 🟡, Aprobada 🟢, Rechazada 🔴)

Costo estimado (€) (calculado automáticamente)

Acciones por solicitud:

✅ Botón "Aprobar" (verde): Abre un modal donde el administrador puede:

Ver la cantidad solicitada y el costo estimado.

Ajustar la cantidad (si no puede suministrar el 100%).

Seleccionar la fuente de energía (panel específico o batería).

Confirmar la aprobación.

❌ Botón "Rechazar" (rojo): Solicita confirmación antes de rechazar.

📋 Botón "Ver historial" (azul): Muestra historial de solicitudes de esa vivienda.

Botón adicional (NUEVO):

⚡ "Asignar manualmente": Permite suministrar energía sin solicitud previa (para emergencias). Abre un modal donde el administrador selecciona vivienda, cantidad y motivo.

Filtros:

Pendientes / Aprobadas / Rechazadas

Buscador por vivienda

7. MONITOREO DE SENSORES IoT
Layout: Tabla en tiempo real.

Columnas:

Vivienda

Voltaje (V)

Corriente (A)

Potencia (kW)

Consumo instantáneo (kW)

Consumo acumulado (kWh)

Temperatura (°C)

Estado del sensor (🟢 Conectado / 🔴 Desconectado)

Última actualización (hora)

Indicadores:

Puntos verdes/rojos para cada sensor.

Icono de "refrescar" para actualizar datos.

8. FACTURACIÓN
Layout: Resumen + gráfico + historial.

Resumen superior:
Energía adicional consumida por vivienda (kWh)

Precio por kWh (configurable)

Total a pagar por vivienda

Estado del pago (Pagado/Pendiente)

Gráfico:
Costos mensuales: Barras o líneas.

Historial de facturas:
Tabla con: Fecha, Concepto, Importe, Estado (Pagado/Pendiente), Acciones (Descargar PDF, Ver detalle).

Método de pago:
Opciones (tarjeta, transferencia, etc.) en diseño.

9. CENTRO DE NOTIFICACIONES
Layout: Feed cronológico.

Tipos de alertas:

"Alto consumo detectado en Vivienda X"

"Sensor desconectado en Vivienda Y"

"Solicitud de energía aprobada para Vivienda Z"

"Solicitud rechazada"

"Panel solar fuera de servicio"

"Baja generación solar"

"Consumo excesivo"

Cada notificación:

Icono (según tipo)

Mensaje

Fecha y hora

Botón "Marcar como leída"

10. REPORTES
Layout: Dashboard de estadísticas.

Gráficos:

Energía generada por panel (barras)

Consumo por vivienda (barras o líneas)

Comparación mensual (barras apiladas)

Ahorro energético (kWh ahorrados)

Emisiones de CO₂ evitadas (kg)

Eficiencia del sistema (%)

Horarios de mayor consumo (gráfico de calor)

Filtros: Por fecha (mes, año).

🔄 FLUJO COMPLETO DEL SISTEMA (con interacciones visuales)
Paso	Acción	Visualización
1	Sensores IoT detectan incremento de consumo en una vivienda	La tarjeta de la vivienda cambia a 🟡 (elevado) o 🔴 (crítico)
2	Sistema genera alerta automática	Aparece en Centro de notificaciones
3	Residente solicita energía adicional desde "Detalle de vivienda"	Se abre modal de solicitud
4	Solicitud aparece en "Solicitudes de energía" del administrador	Estado: ⏳ Pendiente
5	Administrador evalúa disponibilidad	Revisa diagrama de flujo y paneles
6	Administrador aprueba o rechaza	Modal de confirmación
7	Si se aprueba:	
7a	El sistema redirige energía desde paneles con excedente	Diagrama de flujo se actualiza con línea 🟡
7b	Se registra consumo adicional y costo	Aparece en Facturación e Historial
7c	Notificación al residente	Aparece en Centro de notificaciones
8	Administrador puede ajustar manualmente en cualquier momento	Sliders, modales y botones de "Asignar manualmente"
🧩 ELEMENTOS INTERACTIVOS ESPECÍFICOS PARA EL ADMINISTRADOR
Controles de suministro manual:
Sliders en cada tarjeta de vivienda para ajustar límite de energía.

Modales de aprobación/rechazo con opción de ajustar cantidad.

Botones "Asignar manualmente" para suministro sin solicitud.

Diagrama de flujo interactivo con líneas clicables para redirigir energía.

Selectores desplegables en paneles para asignar producción a viviendas.

Historial de acciones del administrador (quién, cuándo, cuánto, por qué).

🎯 ENTREGABLE ESPERADO EN FIGMA
Maqueta de alta fidelidad con todas las pantallas listadas.

Componentes reutilizables:

Botones (primario, secundario, éxito, peligro)

Tarjetas (glassmorphism)

Gráficos (línea, barras, columnas)

Modales

Tablas

Sliders

Inputs

Prototipo navegable que simule el flujo completo:

Login → Dashboard

Solicitar energía desde una vivienda

Aprobar solicitud en el panel de administrador

Ver cambios en diagrama de flujo

Ver registro en facturación y notificaciones

Guía de estilos: colores, tipografía, sombras, espaciados, estados de botones.

Responsive: versión escritorio y tablet.

🏷️ ETIQUETAS DE DISEÑO (para Figma)
Usar Auto Layout para estructura.

Crear variants para botones (estados: default, hover, active, disabled).

Usar componentes anidados para tablas y tarjetas.

Aplicar Glassmorphism con efectos de fondo.

Incluir animaciones sutiles (transiciones, hover effects).

📌 NOTAS FINALES
El administrador debe tener control total y visible sobre la asignación de energía.

Los controles de administrador deben ser claramente diferenciables (borde azul, icono de engranaje).

El flujo energético debe ser visualmente claro y actualizarse según las acciones del administrador.

Los costos deben estar siempre visibles y actualizarse automáticamente.