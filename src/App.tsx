import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Home, Sun, Activity, FileText,
  DollarSign, Bell, BarChart2, Settings, Eye, EyeOff,
  Zap, Battery, AlertTriangle, CheckCircle, XCircle,
  Clock, RefreshCw, Download, Plus, Search, X,
  TrendingUp, Gauge, Wifi, WifiOff,
  Trash2, Scale, Share2, ArrowRight,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: '#060d1a',
  panel: 'rgba(13,27,58,0.7)',
  card: 'rgba(255,255,255,0.04)',
  cardHover: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderBright: 'rgba(37,99,235,0.4)',
  blue: '#2563EB',
  blueLight: '#3b82f6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  text: '#f1f5f9',
  muted: '#94a3b8',
  dim: '#475569',
}

const glass = {
  background: C.card,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${C.border}`,
  borderRadius: '12px',
}

const glassPanel = {
  ...glass,
  background: C.panel,
}

export interface ViviendaItem {
  id: number
  nombre: string
  panel: string
  consumo: number
  disponible: number
  bateria: number
  sensor: boolean
  online: boolean
  estado: 'normal' | 'elevado' | 'critico'
  limite: number
  extraAsignado: number
}

export interface PanelItem {
  id: string
  nombre: string
  generado: number
  potencia: number
  temp: number
  radiacion: number
  estado: 'activo' | 'mantenimiento' | 'inactivo'
  utilizacion: number
  disponible: number
  asignadoA: string
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const INITIAL_VIVIENDAS: ViviendaItem[] = [
  { id: 1, nombre: 'Casa García-López', panel: 'Panel A', consumo: 3.2, disponible: 8.4, bateria: 74, sensor: true, online: true, estado: 'normal', limite: 5.0, extraAsignado: 1.2 },
  { id: 2, nombre: 'Casa Martínez', panel: 'Panel B', consumo: 6.8, disponible: 2.1, bateria: 31, sensor: true, online: true, estado: 'elevado', limite: 7.0, extraAsignado: 2.5 },
  { id: 3, nombre: 'Casa López', panel: 'Panel C', consumo: 9.1, disponible: 0.4, bateria: 12, sensor: false, online: true, estado: 'critico', limite: 8.0, extraAsignado: 3.8 },
  { id: 4, nombre: 'Casa Sánchez', panel: 'Panel D', consumo: 2.7, disponible: 11.2, bateria: 88, sensor: true, online: true, estado: 'normal', limite: 5.0, extraAsignado: 0.0 },
]

const INITIAL_PANELES: PanelItem[] = [
  { id: 'A', nombre: 'Panel A', generado: 18.4, potencia: 4.2, temp: 42, radiacion: 820, estado: 'activo', utilizacion: 68, disponible: 8.4, asignadoA: 'Casa García-López' },
  { id: 'B', nombre: 'Panel B', generado: 21.7, potencia: 5.1, temp: 45, radiacion: 890, estado: 'activo', utilizacion: 82, disponible: 2.1, asignadoA: 'Casa Martínez' },
  { id: 'C', nombre: 'Panel C', generado: 9.3, potencia: 1.8, temp: 38, radiacion: 510, estado: 'mantenimiento', utilizacion: 45, disponible: 0.4, asignadoA: 'Casa López' },
  { id: 'D', nombre: 'Panel D', generado: 24.1, potencia: 5.8, temp: 48, radiacion: 940, estado: 'activo', utilizacion: 71, disponible: 11.2, asignadoA: 'Casa Sánchez' },
]

const solicitudes = [
  { id: 1, vivienda: 'Casa García-López', fecha: '2026-07-23', hora: '09:14', energia: 2.0, consumoActual: 3.2, motivo: 'Aire acondicionado adicional', estado: 'pendiente', costo: 0.28 },
  { id: 2, vivienda: 'Casa Martínez', fecha: '2026-07-23', hora: '08:47', energia: 3.5, consumoActual: 6.8, motivo: 'Recarga vehículo eléctrico', estado: 'pendiente', costo: 0.49 },
  { id: 3, vivienda: 'Casa López', fecha: '2026-07-22', hora: '19:30', energia: 1.5, consumoActual: 9.1, motivo: 'Sistema de calefacción', estado: 'aprobada', costo: 0.21 },
  { id: 4, vivienda: 'Casa Sánchez', fecha: '2026-07-22', hora: '14:22', energia: 1.0, consumoActual: 2.7, motivo: 'Electrodomésticos adicionales', estado: 'rechazada', costo: 0.14 },
  { id: 5, vivienda: 'Casa Martínez', fecha: '2026-07-21', hora: '11:05', energia: 2.2, consumoActual: 5.3, motivo: 'Trabajo desde casa', estado: 'aprobada', costo: 0.31 },
]

const sensores = [
  { vivienda: 'Casa García-López', voltaje: 220.3, corriente: 14.5, potencia: 3.2, instantaneo: 3.1, acumulado: 48.2, temp: 24.1, conectado: true, ultima: '10:42:18' },
  { vivienda: 'Casa Martínez', voltaje: 219.8, corriente: 30.9, potencia: 6.8, instantaneo: 6.9, acumulado: 91.4, temp: 26.3, conectado: true, ultima: '10:42:15' },
  { vivienda: 'Casa López', voltaje: 221.1, corriente: 41.2, potencia: 9.1, instantaneo: 9.0, acumulado: 124.7, temp: 28.7, conectado: false, ultima: '10:38:02' },
  { vivienda: 'Casa Sánchez', voltaje: 220.6, corriente: 12.2, potencia: 2.7, instantaneo: 2.8, acumulado: 36.9, temp: 23.4, conectado: true, ultima: '10:42:19' },
]

const notificaciones = [
  { id: 1, tipo: 'alerta', icono: 'alert', msg: 'Alto consumo detectado en Casa López (9.1 kW)', hora: '10:41', leida: false },
  { id: 2, tipo: 'info', icono: 'sensor', msg: 'Sensor desconectado en Casa López', hora: '10:38', leida: false },
  { id: 3, tipo: 'exito', icono: 'check', msg: 'Solicitud de energía aprobada para Casa López', hora: '09:15', leida: false },
  { id: 4, tipo: 'info', icono: 'request', msg: 'Nueva solicitud de energía de Casa Martínez (3.5 kWh)', hora: '08:47', leida: true },
  { id: 5, tipo: 'alerta', icono: 'panel', msg: 'Panel C en modo mantenimiento — baja generación', hora: '07:30', leida: true },
  { id: 6, tipo: 'error', icono: 'deficit', msg: 'Déficit energético detectado en Casa López', hora: '07:15', leida: true },
]

const facturas = [
  { vivienda: 'Casa García-López', extra: 1.2, precio: 0.14, total: 0.17, estado: 'pagado' },
  { vivienda: 'Casa Martínez', extra: 5.7, precio: 0.14, total: 0.80, estado: 'pendiente' },
  { vivienda: 'Casa López', extra: 8.3, precio: 0.14, total: 1.16, estado: 'pendiente' },
  { vivienda: 'Casa Sánchez', extra: 0.0, precio: 0.14, total: 0.00, estado: 'pagado' },
]

const genHours = Array.from({ length: 24 }, (_, i) => ({
  hora: `${i.toString().padStart(2, '0')}:00`,
  generado: Math.max(0, Math.sin((i - 6) * Math.PI / 12) * 18 + Math.random() * 3),
  consumido: 8 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
}))

const costosMensuales = [
  { mes: 'Feb', total: 1.85 },
  { mes: 'Mar', total: 2.10 },
  { mes: 'Abr', total: 1.60 },
  { mes: 'May', total: 2.80 },
  { mes: 'Jun', total: 3.20 },
  { mes: 'Jul', total: 2.13 },
]

// ─── Helpers ────────────────────────────────────────────────────────────────
function Badge({ estado }: { estado: string }) {
  const map: Record<string, { color: string; label: string }> = {
    normal: { color: C.green, label: 'Normal' },
    elevado: { color: C.amber, label: 'Consumo elevado' },
    critico: { color: C.red, label: 'Crítico' },
    activo: { color: C.green, label: 'Activo' },
    mantenimiento: { color: C.amber, label: 'Mantenimiento' },
    inactivo: { color: C.red, label: 'Inactivo' },
    pendiente: { color: C.amber, label: 'Pendiente' },
    aprobada: { color: C.green, label: 'Aprobada' },
    rechazada: { color: C.red, label: 'Rechazada' },
    pagado: { color: C.green, label: 'Pagado' },
  }
  const { color, label } = map[estado] || { color: C.muted, label: estado }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: `${color}18`, color, border: `1px solid ${color}40`,
      borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

function StatCard({ icon, label, value, sub, color = C.blue }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ ...glass, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: C.muted, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ color, opacity: 0.9 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>}
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ ...glassPanel, padding: 28, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const customTooltipStyle = {
  background: 'rgba(13,27,58,0.95)',
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  color: C.text,
  fontSize: 12,
}

// ─── Screens ────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('admin@solarsmart.io')
  const [pass, setPass] = useState('••••••••')
  const [showPass, setShowPass] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: `radial-gradient(ellipse at 20% 50%, #0d1f4a 0%, ${C.bg} 60%)`,
    }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 80px', maxWidth: 520
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{
            width: 40, height: 40, background: `linear-gradient(135deg, ${C.amber}, ${C.blue})`,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sun size={22} color="#fff" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            SOLAR<span style={{ color: C.blue }}>SMART</span>
          </span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
          Bienvenido de nuevo
        </h1>
        <p style={{ color: C.muted, marginBottom: 36, fontSize: 15 }}>
          Sistema de Gestión de Energía Solar
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Correo electrónico</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', ...glass,
                color: C.text, fontSize: 15, outline: 'none',
                background: 'rgba(255,255,255,0.05)'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', ...glass,
                  color: C.text, fontSize: 15, outline: 'none',
                  background: 'rgba(255,255,255,0.05)'
                }}
              />
              <button onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: C.muted, cursor: 'pointer'
              }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button onClick={onLogin} style={{
            background: `linear-gradient(135deg, ${C.blue}, #1d4ed8)`,
            border: 'none', borderRadius: 10, color: '#fff',
            padding: '14px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            marginTop: 4
          }}>
            Iniciar sesión
          </button>
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(13,27,58,0.4)', borderLeft: `1px solid ${C.border}`,
        padding: 60, position: 'relative', overflow: 'hidden'
      }}>
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
          <circle cx="210" cy="210" r="140" fill={`${C.amber}10`} stroke={`${C.amber}40`} strokeWidth="1.5" />
          <circle cx="210" cy="210" r="70" fill={`${C.blue}20`} stroke={C.blue} strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

// ─── Energy Flow Diagram (NODO CENTRAL DE DISTRIBUCIÓN) ─────────────────────
function EnergyFlowDiagram({
  viviendas,
  paneles,
  onAddViviendaPanel,
  onDeleteViviendaPanel,
  onSelectLine,
}: {
  viviendas: ViviendaItem[]
  paneles: PanelItem[]
  onAddViviendaPanel: (data: { nombre: string; consumo: number; potencia: number; bateria: number; estado: 'normal' | 'elevado' | 'critico' }) => void
  onDeleteViviendaPanel: (id: number) => void
  onSelectLine: (info: string) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRedistributeModal, setShowRedistributeModal] = useState(false)
  const [showSurplusModal, setShowSurplusModal] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // Form State for Add Vivienda + Panel
  const [newNombre, setNewNombre] = useState('')
  const [newConsumo, setNewConsumo] = useState('3.5')
  const [newPotencia, setNewPotencia] = useState('4.8')
  const [newBateria, setNewBateria] = useState('80')
  const [newEstado, setNewEstado] = useState<'normal' | 'elevado' | 'critico'>('normal')

  const N = viviendas.length
  const countAbove = Math.floor(N / 2)
  const countBelow = Math.ceil(N / 2)
  const maxInRow = Math.max(countAbove, countBelow, 1)

  const svgWidth = Math.max(900, maxInRow * 240)
  const svgHeight = 500
  const nodeY = 250

  const getX = (index: number) => {
    const isAbove = index % 2 === 1
    const countInRow = isAbove ? countAbove : countBelow
    const rowIdx = Math.floor(index / 2)

    if (countInRow <= 1) return svgWidth / 2
    const padding = 130
    const usableWidth = svgWidth - padding * 2
    return padding + (rowIdx / (countInRow - 1)) * usableWidth
  }

  const handleLineClick = (i: number) => {
    setSelected(i)
    const v = viviendas[i]
    const p = paneles.find(panel => panel.nombre === v?.panel) || paneles[i]
    if (v && p) {
      onSelectLine(`${p.nombre} → ${v.nombre}: ${p.potencia} kW distribuidos`)
    }
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nombreClean = newNombre.trim() || `Vivienda ${N + 1}`
    onAddViviendaPanel({
      nombre: nombreClean,
      consumo: parseFloat(newConsumo) || 3.5,
      potencia: parseFloat(newPotencia) || 4.8,
      bateria: Math.min(100, Math.max(0, parseInt(newBateria) || 80)),
      estado: newEstado,
    })
    setNewNombre('')
    setShowAddModal(false)
    triggerToast(`✨ Se ha añadido ${nombreClean} junto con su panel solar correspondiente.`)
  }

  const triggerToast = (msg: string) => {
    setActionMessage(msg)
    setTimeout(() => setActionMessage(null), 4000)
  }

  const handleBalanceLoad = () => {
    triggerToast('⚖ Carga balanceada automáticamente entre todos los paneles y viviendas.')
  }

  return (
    <div style={{ ...glass, padding: '24px', overflow: 'hidden', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>
            Flujo de Energía en Tiempo Real — Red VPP
          </h3>
          <p style={{ margin: '2px 0 0', color: C.muted, fontSize: 12 }}>
            Sincronización automática de Paneles Solares y Viviendas mediante VPP (Distribución en dos niveles)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: C.muted }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 14, height: 3, background: C.green, borderRadius: 2 }} /> Suministro Normal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 14, height: 3, background: C.amber, borderTop: `2px dashed ${C.amber}` }} /> Consumo Elevado
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 14, height: 3, background: C.red }} /> Déficit Crítico
          </span>
        </div>
      </div>

      {/* Toast alert banner */}
      {actionMessage && (
        <div style={{
          marginBottom: 16, padding: '10px 16px', background: `${C.blue}20`,
          border: `1px solid ${C.blueLight}`, borderRadius: 8, fontSize: 13,
          color: '#93c5fd', display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Zap size={16} color={C.blueLight} />
          {actionMessage}
        </div>
      )}

      {/* SVG Canvas Container */}
      <div style={{ width: '100%', overflowX: 'auto', paddingBottom: 10 }}>
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ minWidth: '100%', overflow: 'visible' }}>
          {/* Sun icon centered at top */}
          <g>
            <circle cx={svgWidth / 2} cy={22} r={13} fill={`${C.amber}25`} stroke={C.amber} strokeWidth="2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
              const rad = (a * Math.PI) / 180
              return (
                <line
                  key={a}
                  x1={svgWidth / 2 + Math.cos(rad) * 16}
                  y1={22 + Math.sin(rad) * 16}
                  x2={svgWidth / 2 + Math.cos(rad) * 21}
                  y2={22 + Math.sin(rad) * 21}
                  stroke={C.amber}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )
            })}
          </g>

          {/* Central Horizontal VPP Line (In the middle of the canvas) */}
          {N > 0 && (
            <g>
              <line x1={40} y1={nodeY} x2={svgWidth - 40} y2={nodeY} stroke={C.blue} strokeWidth="3" opacity="0.85" />
              <line x1={40} y1={nodeY} x2={svgWidth - 40} y2={nodeY} stroke="#60a5fa" strokeWidth="8" opacity="0.15" />
              {/* Central VPP Pill Badge */}
              <rect x={svgWidth / 2 - 75} y={nodeY - 17} width="150" height="34" rx="17" fill="#050e21" stroke={C.blueLight} strokeWidth="2" />
              <foreignObject x={svgWidth / 2 - 70} y={nodeY - 14} width="140" height="28">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: '100%', color: C.text, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em' }}>
                  <Share2 size={15} color={C.blueLight} />
                  <span>VPP</span>
                </div>
              </foreignObject>
            </g>
          )}

          {/* Render Items: Alternating Above and Below Central VPP Line */}
          {viviendas.map((v, i) => {
            const p = paneles.find(panel => panel.nombre === v.panel) || paneles[i] || {
              nombre: `Panel ${String.fromCharCode(65 + i)}`,
              potencia: 4.5,
              generado: 18.0
            }
            const x = getX(i)
            const isSelected = selected === i
            const color = v.estado === 'normal' ? C.green : v.estado === 'elevado' ? C.amber : C.red
            const batteryColor = v.bateria > 50 ? C.green : v.bateria > 20 ? C.amber : C.red

            const isAbove = i % 2 === 1
            const itemY = isAbove ? 80 : 350
            const xHouse = x - 48
            const xPanel = x + 36

            return (
              <g key={v.id}>
                {/* ── VERTICAL CONNECTOR LINE TO CENTRAL VPP LINE ── */}
                {isAbove ? (
                  <>
                    {/* From Top Item down to VPP Line */}
                    <line
                      x1={x} y1={itemY + 75} x2={x} y2={nodeY - 17}
                      stroke={color}
                      strokeWidth={isSelected ? 3.5 : 2.5}
                      strokeDasharray={v.estado === 'elevado' ? '6 4' : v.estado === 'critico' ? '3 3' : 'none'}
                      opacity={isSelected ? 1 : 0.85}
                    />
                    <line x1={xHouse} y1={itemY + 75} x2={xPanel} y2={itemY + 75} stroke={color} strokeWidth={isSelected ? 3 : 2} opacity="0.75" />
                    <line x1={xHouse} y1={itemY + 60} x2={xHouse} y2={itemY + 75} stroke={color} strokeWidth={isSelected ? 3 : 2} opacity="0.75" />
                    <line x1={xPanel} y1={itemY + 60} x2={xPanel} y2={itemY + 75} stroke={color} strokeWidth={isSelected ? 3 : 2} opacity="0.75" />
                    <circle r={isSelected ? 5 : 4} fill={color} opacity="0.95">
                      <animateMotion
                        dur={`${1.4 + (i % 3) * 0.3}s`}
                        repeatCount="indefinite"
                        path={`M ${x} ${itemY + 75} L ${x} ${nodeY - 17}`}
                      />
                    </circle>
                  </>
                ) : (
                  <>
                    {/* From VPP Line down to Bottom Item */}
                    <line
                      x1={x} y1={nodeY + 17} x2={x} y2={itemY - 22}
                      stroke={color}
                      strokeWidth={isSelected ? 3.5 : 2.5}
                      strokeDasharray={v.estado === 'elevado' ? '6 4' : v.estado === 'critico' ? '3 3' : 'none'}
                      opacity={isSelected ? 1 : 0.85}
                    />
                    <line x1={xHouse} y1={itemY - 22} x2={xPanel} y2={itemY - 22} stroke={color} strokeWidth={isSelected ? 3 : 2} opacity="0.75" />
                    <line x1={xHouse} y1={itemY - 22} x2={xHouse} y2={itemY - 6} stroke={color} strokeWidth={isSelected ? 3 : 2} opacity="0.75" />
                    <line x1={xPanel} y1={itemY - 22} x2={xPanel} y2={itemY - 16} stroke={color} strokeWidth={isSelected ? 3 : 2} opacity="0.75" />
                    <circle r={isSelected ? 5 : 4} fill={color} opacity="0.95">
                      <animateMotion
                        dur={`${1.4 + (i % 3) * 0.3}s`}
                        repeatCount="indefinite"
                        path={`M ${x} ${nodeY + 17} L ${x} ${itemY - 22}`}
                      />
                    </circle>
                  </>
                )}

                {/* ── LEFT: VIVIENDA GRAPHIC & LABELS ── */}
                <g style={{ cursor: 'pointer' }} onClick={() => handleLineClick(i)}>
                  {/* Roof */}
                  <polygon
                    points={`${xHouse},${itemY - 6} ${xHouse - 26},${itemY + 16} ${xHouse + 26},${itemY + 16}`}
                    fill={`${color}18`} stroke={`${color}70`} strokeWidth="1.6"
                  />
                  {/* Base */}
                  <rect
                    x={xHouse - 22} y={itemY + 16} width="44" height="30" rx="3"
                    fill={`${color}12`} stroke={`${color}60`} strokeWidth="1.6"
                  />
                  {/* Door */}
                  <rect x={xHouse - 6} y={itemY + 28} width="12" height="18" rx="1.5" fill={`${color}35`} />

                  {/* House Name & Consumo */}
                  <text x={xHouse} y={itemY + 62} textAnchor="middle" fill={C.text} fontSize="11" fontWeight="600">
                    {v.nombre.replace('Casa ', '')}
                  </text>
                  <text x={xHouse} y={itemY + 76} textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
                    {v.consumo} kW
                  </text>
                </g>

                {/* ── RIGHT: PANEL SOLAR CON TODAS SUS CARACTERÍSTICAS ── */}
                <g style={{ cursor: 'pointer' }} onClick={() => handleLineClick(i)}>
                  {/* Panel Title */}
                  <text x={xPanel} y={itemY - 24} textAnchor="middle" fill={C.text} fontSize="11" fontWeight="700" letterSpacing="0.04em">
                    {p.nombre.toUpperCase()}
                  </text>

                  {/* Panel Grid Box */}
                  <rect
                    x={xPanel - 32} y={itemY - 18} width="64" height="40" rx="5"
                    fill="rgba(13,27,58,0.85)" stroke={isSelected ? C.blueLight : 'rgba(59,130,246,0.5)'}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />
                  <line x1={xPanel - 32} y1={itemY - 4} x2={xPanel + 32} y2={itemY - 4} stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
                  <line x1={xPanel - 32} y1={itemY + 10} x2={xPanel + 32} y2={itemY + 10} stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
                  <line x1={xPanel - 10} y1={itemY - 18} x2={xPanel - 10} y2={itemY + 22} stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
                  <line x1={xPanel + 10} y1={itemY - 18} x2={xPanel + 10} y2={itemY + 22} stroke="rgba(59,130,246,0.3)" strokeWidth="1" />

                  {/* Battery Indicator Pill */}
                  <rect x={xPanel - 25} y={itemY + 27} width="50" height="16" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <rect x={xPanel - 21} y={itemY + 30} width={Math.max(4, (v.bateria / 100) * 42)} height="10" rx="4" fill={batteryColor} opacity="0.8" />
                  <text x={xPanel} y={itemY + 39} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                    {v.bateria}%
                  </text>

                  {/* kW Power Text */}
                  <text x={xPanel} y={itemY + 58} textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
                    {p.potencia} kW
                  </text>
                </g>

                {/* Delete Button (✕) */}
                <g
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteViviendaPanel(v.id)
                    triggerToast(`🗑 Se ha eliminado ${v.nombre} y su panel solar asociado.`)
                  }}
                >
                  <circle cx={xPanel + 42} cy={itemY - 16} r="9" fill="#ef444425" stroke="#ef4444" strokeWidth="1.2" />
                  <text x={xPanel + 42} y={itemY - 12.5} textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="800">
                    ✕
                  </text>
                </g>
              </g>
            )
          })}

          {/* Empty state if 0 items */}
          {N === 0 && (
            <foreignObject x={svgWidth / 2 - 180} y={120} width="360" height="120">
              <div style={{ textAlign: 'center', color: C.muted }}>
                <p style={{ margin: '0 0 12px', fontSize: 14 }}>No hay viviendas ni paneles activos en la red.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: C.purple, border: 'none', color: '#fff',
                    borderRadius: 8, padding: '10px 18px', fontSize: 13,
                    fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  + Agregar Vivienda y Panel
                </button>
              </div>
            </foreignObject>
          )}
        </svg>
      </div>

      {/* ── BOTTOM ACTION BUTTONS (Matching Image 3) ── */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setShowRedistributeModal(true)}
          style={{
            background: C.blue, border: 'none', color: '#fff',
            borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 10px rgba(37,99,235,0.3)'
          }}
        >
          <ArrowRight size={15} /> Redistribuir energía
        </button>

        <button
          onClick={() => setShowSurplusModal(true)}
          style={{
            background: C.green, border: 'none', color: '#fff',
            borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 10px rgba(34,197,94,0.3)'
          }}
        >
          <Plus size={15} /> Asignar excedentes
        </button>

        <button
          onClick={handleBalanceLoad}
          style={{
            background: C.amber, border: 'none', color: '#000',
            borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 10px rgba(245,158,11,0.3)'
          }}
        >
          <Scale size={15} /> Balancear carga
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: C.purple, border: 'none', color: '#fff',
            borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 10px rgba(139,92,246,0.3)'
          }}
        >
          <Home size={15} /> + Agregar Vivienda y Panel
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            background: C.red, border: 'none', color: '#fff',
            borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 10px rgba(239,68,68,0.3)'
          }}
        >
          <Trash2 size={15} /> - Eliminar Vivienda
        </button>
      </div>

      {/* Selected line details bar */}
      {selected !== null && viviendas[selected] && (
        <div style={{
          marginTop: 14, padding: '12px 16px', background: `${C.blue}18`,
          border: `1px solid ${C.blue}40`, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
        }}>
          <div>
            <div style={{ fontSize: 13, color: C.blueLight, fontWeight: 600 }}>
              {viviendas[selected].panel} → {viviendas[selected].nombre}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
              Consumo actual: {viviendas[selected].consumo} kW · Batería: {viviendas[selected].bateria}%
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onDeleteViviendaPanel(viviendas[selected].id)}
              style={{ ...glass, border: `1px solid ${C.red}50`, color: C.red, borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', background: `${C.red}18` }}
            >
              Eliminar Vivienda y Panel
            </button>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: AGREGAR VIVIENDA Y PANEL ── */}
      {showAddModal && (
        <Modal title="🏠 Agregar Vivienda y Panel Solar" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              Se creará automáticamente una nueva vivienda junto con un panel solar asignado en la red.
            </p>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Nombre de la Vivienda / Residente</label>
              <input
                required
                value={newNombre}
                onChange={e => setNewNombre(e.target.value)}
                placeholder="ej. Familia Torres"
                style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.05)' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Consumo Estimado (kW)</label>
                <input
                  type="number" step="0.1" required
                  value={newConsumo}
                  onChange={e => setNewConsumo(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Potencia del Panel (kW)</label>
                <input
                  type="number" step="0.1" required
                  value={newPotencia}
                  onChange={e => setNewPotencia(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Carga Batería (%)</label>
                <input
                  type="number" min="0" max="100" required
                  value={newBateria}
                  onChange={e => setNewBateria(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Estado Suministro</label>
                <select
                  value={newEstado}
                  onChange={e => setNewEstado(e.target.value as any)}
                  style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(13,27,58,0.9)' }}
                >
                  <option value="normal">Normal</option>
                  <option value="elevado">Consumo elevado</option>
                  <option value="critico">Crítico</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                type="submit"
                style={{ flex: 1, background: C.purple, border: 'none', color: '#fff', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                + Guardar Vivienda y Panel
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ flex: '0 0 auto', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '12px 18px', fontSize: 14, cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL: ELIMINAR VIVIENDA Y PANEL ── */}
      {showDeleteModal && (
        <Modal title="🗑 Eliminar Vivienda y Panel Solar" onClose={() => setShowDeleteModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              Selecciona la vivienda que deseas retirar de la red. Se eliminará también su panel solar asociado.
            </p>
            {viviendas.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: C.dim }}>No hay viviendas para eliminar.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                {viviendas.map(v => (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${C.border}`, borderRadius: 8
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{v.nombre}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        Asignado a: <span style={{ color: C.blueLight }}>{v.panel}</span> · Consumo: {v.consumo} kW
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onDeleteViviendaPanel(v.id)
                        triggerToast(`🗑 Se ha eliminado ${v.nombre} y el ${v.panel}.`)
                      }}
                      style={{
                        background: `${C.red}20`, border: `1px solid ${C.red}40`,
                        color: C.red, borderRadius: 6, padding: '7px 12px', fontSize: 12,
                        fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL: REDISTRIBUIR ENERGÍA ── */}
      {showRedistributeModal && (
        <Modal title="⇄ Redistribuir Energía" onClose={() => setShowRedistributeModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Panel origen con excedente</label>
              <select style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(13,27,58,0.9)' }}>
                {paneles.map(p => <option key={p.id}>{p.nombre} ({p.potencia} kW disp.)</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Vivienda destino</label>
              <select style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(13,27,58,0.9)' }}>
                {viviendas.map(v => <option key={v.id}>{v.nombre} ({v.estado})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Cantidad a redistribuir (kWh)</label>
              <input type="number" defaultValue="2.5" style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <button
              onClick={() => {
                setShowRedistributeModal(false)
                triggerToast('⚡ Energía redistribuida con éxito en el nodo central.')
              }}
              style={{ background: C.blue, border: 'none', color: '#fff', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Confirmar redistribución
            </button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: ASIGNAR EXCEDENTES ── */}
      {showSurplusModal && (
        <Modal title="✚ Asignar Excedentes Energéticos" onClose={() => setShowSurplusModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              Asigna el exceso de generación solar a la red o a baterías comunitarias.
            </p>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Destino del Excedente</label>
              <select style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(13,27,58,0.9)' }}>
                <option>Baterías centrales de almacenamiento</option>
                <option>Inyección a red eléctrica principal</option>
                <option>Reserva para viviendas en estado crítico</option>
              </select>
            </div>
            <button
              onClick={() => {
                setShowSurplusModal(false)
                triggerToast('🔋 Excedentes asignados correctamente.')
              }}
              style={{ background: C.green, border: 'none', color: '#fff', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Asignar excedente
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({
  viviendas,
  paneles,
  onAddViviendaPanel,
  onDeleteViviendaPanel,
}: {
  viviendas: ViviendaItem[]
  paneles: PanelItem[]
  onAddViviendaPanel: (data: any) => void
  onDeleteViviendaPanel: (id: number) => void
}) {
  const [flowInfo, setFlowInfo] = useState<string | null>(null)

  const totalGenerado = paneles.reduce((acc, p) => acc + p.generado, 0).toFixed(1)
  const totalConsumido = viviendas.reduce((acc, v) => acc + v.consumo * 8, 0).toFixed(1)
  const totalDisponible = paneles.reduce((acc, p) => acc + p.disponible, 0).toFixed(1)
  const viviendasOnline = viviendas.filter(v => v.online).length
  const panelesActivos = paneles.filter(p => p.estado === 'activo').length
  const sensoresOk = viviendas.filter(v => v.sensor).length

  const kpis = [
    { icon: <Sun size={18} />, label: 'Generado hoy', value: `${totalGenerado} kWh`, sub: '↑ 12% vs ayer', color: C.amber },
    { icon: <Zap size={18} />, label: 'Consumido hoy', value: `${totalConsumido} kWh`, sub: `${viviendas.length} viviendas activas`, color: C.blue },
    { icon: <Battery size={18} />, label: 'Disponible', value: `${totalDisponible} kWh`, sub: 'Excedente de red', color: C.green },
    { icon: <Home size={18} />, label: 'Viviendas online', value: `${viviendasOnline} / ${viviendas.length}`, sub: 'Conectadas', color: C.green },
    { icon: <Sun size={18} />, label: 'Paneles activos', value: `${panelesActivos} / ${paneles.length}`, sub: 'Red solar', color: C.amber },
    { icon: <FileText size={18} />, label: 'Solicitudes pendientes', value: '2', sub: 'Requieren atención', color: C.amber },
    { icon: <AlertTriangle size={18} />, label: 'Alertas activas', value: '3', sub: 'Ver notificaciones', color: C.red },
    { icon: <Wifi size={18} />, label: 'Sensores conectados', value: `${sensoresOk} / ${viviendas.length}`, sub: 'Frecuencia 3s', color: C.green },
  ]

  const consumoBarData = Array.from({ length: 8 }, (_, i) => {
    const hora = `${(i * 3).toString().padStart(2, '0')}:00`
    const entry: any = { hora }
    viviendas.forEach(v => {
      const shortName = v.nombre.replace('Casa ', '')
      entry[shortName] = parseFloat((v.consumo * (0.8 + Math.random() * 0.4)).toFixed(1))
    })
    return entry
  })

  const colorsList = [C.blue, C.green, C.amber, C.purple, '#ec4899', '#14b8a6']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {kpis.map(k => <StatCard key={k.label} {...k} />)}
      </div>

      {/* Energy Flow Animation Diagram */}
      <EnergyFlowDiagram
        viviendas={viviendas}
        paneles={paneles}
        onAddViviendaPanel={onAddViviendaPanel}
        onDeleteViviendaPanel={onDeleteViviendaPanel}
        onSelectLine={setFlowInfo}
      />

      {flowInfo && (
        <div style={{
          padding: '10px 16px', background: `${C.blue}15`, border: `1px solid ${C.blue}40`,
          borderRadius: 8, fontSize: 13, color: C.blueLight
        }}>
          ⚡ Línea seleccionada: {flowInfo} — Operando normalmente.
        </div>
      )}

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ ...glass, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: C.text }}>
            Generación y Consumo — últimas 24h
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={genHours} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.amber} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hora" tick={{ fill: C.dim, fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: C.dim, fontSize: 9 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="generado" stroke={C.amber} fill="url(#genGrad)" strokeWidth={2} name="Generado (kWh)" dot={false} />
              <Area type="monotone" dataKey="consumido" stroke={C.blue} fill="url(#consGrad)" strokeWidth={2} name="Consumido (kWh)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...glass, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: C.text }}>
            Consumo por Vivienda — últimas 24h
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={consumoBarData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hora" tick={{ fill: C.dim, fontSize: 9 }} />
              <YAxis tick={{ fill: C.dim, fontSize: 9 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {viviendas.map((v, idx) => {
                const shortName = v.nombre.replace('Casa ', '')
                return (
                  <Bar
                    key={v.id}
                    dataKey={shortName}
                    stackId="a"
                    fill={colorsList[idx % colorsList.length]}
                  />
                )
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── Viviendas Screen ───────────────────────────────────────────────────────
function Viviendas({
  viviendas,
  onAddViviendaPanel,
  onDeleteViviendaPanel,
  setViviendas,
}: {
  viviendas: ViviendaItem[]
  onAddViviendaPanel: (data: any) => void
  onDeleteViviendaPanel: (id: number) => void
  setViviendas: React.Dispatch<React.SetStateAction<ViviendaItem[]>>
}) {
  const [sliders, setSliders] = useState<Record<number, number>>({})
  const [modal, setModal] = useState<number | null>(null)
  const [adjustModal, setAdjustModal] = useState<number | null>(null)
  const [adjVal, setAdjVal] = useState('1.0')

  const getSliderVal = (id: number, def: number) => sliders[id] ?? def

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Gestión de Viviendas</h2>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Control de suministro e integración de paneles</p>
        </div>
        <button
          onClick={() => {
            const count = viviendas.length + 1
            onAddViviendaPanel({
              nombre: `Casa Nueva ${count}`,
              consumo: 3.8,
              potencia: 4.8,
              bateria: 85,
              estado: 'normal',
            })
          }}
          style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            border: 'none', color: '#fff', borderRadius: 10, padding: '10px 20px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <Plus size={16} /> Agregar Vivienda y Panel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {viviendas.map((v) => {
          const borderColor = v.estado === 'normal' ? C.green : v.estado === 'elevado' ? C.amber : C.red
          const currentLimit = getSliderVal(v.id, v.limite)

          return (
            <div key={v.id} style={{
              ...glass,
              border: `1px solid ${borderColor}40`,
              padding: 22,
              boxShadow: `0 0 20px ${borderColor}08`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{v.nombre}</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Panel asignado: <span style={{ color: C.blueLight }}>{v.panel}</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge estado={v.estado} />
                  <button
                    onClick={() => onDeleteViviendaPanel(v.id)}
                    title="Eliminar vivienda y panel"
                    style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Consumo actual', value: `${v.consumo} kW`, color: C.text },
                  { label: 'Disponible', value: `${v.disponible} kWh`, color: C.green },
                  { label: 'Batería', value: `${v.bateria}%`, color: v.bateria > 50 ? C.green : v.bateria > 20 ? C.amber : C.red },
                  { label: 'Extra asignado', value: `${v.extraAsignado} kWh`, color: C.amber },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 14, marginBottom: 16, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {v.sensor
                    ? <Wifi size={13} color={C.green} />
                    : <WifiOff size={13} color={C.red} />}
                  <span style={{ color: v.sensor ? C.green : C.red }}>Sensor {v.sensor ? 'OK' : 'Offline'}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: v.online ? C.green : C.red }} />
                  <span style={{ color: v.online ? C.green : C.red }}>{v.online ? 'Online' : 'Offline'}</span>
                </span>
              </div>

              <div style={{
                borderTop: `1px solid ${C.border}`, paddingTop: 16,
                border: `1px solid ${C.borderBright}`,
                borderRadius: 8, padding: 14, background: 'rgba(37,99,235,0.04)',
                marginTop: 4
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 12, color: C.blueLight }}>
                  <Settings size={13} /> Controles de administrador
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginBottom: 6 }}>
                    <span>Límite de suministro</span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{currentLimit.toFixed(1)} kW</span>
                  </div>
                  <input
                    type="range" min="1" max="12" step="0.5"
                    value={currentLimit}
                    onChange={e => setSliders(s => ({ ...s, [v.id]: parseFloat(e.target.value) }))}
                    style={{ width: '100%', accentColor: C.blue, cursor: 'pointer' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setAdjustModal(v.id)}
                    style={{ flex: 1, background: `${C.blue}20`, border: `1px solid ${C.blue}40`, color: C.blueLight, borderRadius: 7, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    ⚡ Ajustar suministro
                  </button>
                  <button
                    onClick={() => setModal(v.id)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.text, borderRadius: 7, padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {adjustModal !== null && (
        <Modal title={`Ajustar suministro`} onClose={() => setAdjustModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Cantidad adicional (kWh)</label>
              <input type="number" value={adjVal} onChange={e => setAdjVal(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 15, outline: 'none', background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => setAdjustModal(null)} style={{ flex: 1, background: `${C.green}20`, border: `1px solid ${C.green}40`, color: C.green, borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Confirmar cambio
              </button>
              <button onClick={() => setAdjustModal(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '12px', fontSize: 14, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal !== null && viviendas.find(v => v.id === modal) && (
        <Modal title={`Detalle — ${viviendas.find(v => v.id === modal)?.nombre}`} onClose={() => setModal(null)}>
          <DetalleViviendaContent v={viviendas.find(v => v.id === modal)!} />
        </Modal>
      )}
    </div>
  )
}

function DetalleViviendaContent({ v }: { v: ViviendaItem }) {
  const weekData = Array.from({ length: 7 }, (_, i) => ({
    dia: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i],
    consumo: v.consumo * 12 + Math.random() * 10 - 5
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { l: 'Promedio', v: `${v.consumo} kW` },
          { l: 'Máximo', v: `${(v.consumo * 1.4).toFixed(1)} kW` },
          { l: 'Mínimo', v: `${(v.consumo * 0.4).toFixed(1)} kW` },
        ].map(s => (
          <div key={s.l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: C.muted }}>{s.l}</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Consumo últimos 7 días</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weekData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="dia" tick={{ fill: C.dim, fontSize: 10 }} />
            <YAxis tick={{ fill: C.dim, fontSize: 10 }} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Bar dataKey="consumo" fill={C.blue} radius={[4, 4, 0, 0]} name="Consumo (kWh)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Paneles Solares Screen ─────────────────────────────────────────────────
function PanelesSolares({
  paneles,
  viviendas,
}: {
  paneles: PanelItem[]
  viviendas: ViviendaItem[]
}) {
  const [redistModal, setRedistModal] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Paneles Solares</h2>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Monitoreo y asignación directa por vivienda</p>
        </div>
        <button onClick={() => setRedistModal(true)} style={{ background: `linear-gradient(135deg, ${C.amber}, #d97706)`, border: 'none', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowRight size={16} /> Redistribuir energía
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {paneles.map(p => {
          const bc = p.estado === 'activo' ? C.green : p.estado === 'mantenimiento' ? C.amber : C.red
          return (
            <div key={p.id} style={{ ...glass, border: `1px solid ${bc}25`, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{p.nombre}</div>
                  <div style={{ color: C.muted, fontSize: 12 }}>Asignado a: <span style={{ color: C.blueLight }}>{p.asignadoA}</span></div>
                </div>
                <Badge estado={p.estado} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { l: 'Generado hoy', v: `${p.generado} kWh`, c: C.amber },
                  { l: 'Potencia actual', v: `${p.potencia} kW`, c: C.blue },
                  { l: 'Temperatura', v: `${p.temp}°C`, c: p.temp > 50 ? C.red : C.text },
                  { l: 'Radiación', v: `${p.radiacion} W/m²`, c: C.text },
                ].map(s => (
                  <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{s.l}</div>
                    <div style={{ fontWeight: 700, color: s.c, fontSize: 16 }}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginBottom: 6 }}>
                  <span>Utilización</span>
                  <span style={{ color: C.text, fontWeight: 600 }}>{p.utilizacion}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${p.utilizacion}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 3 }} />
                </div>
              </div>

              <div style={{ borderRadius: 8, padding: 14, background: 'rgba(37,99,235,0.04)', border: `1px solid ${C.borderBright}` }}>
                <div style={{ fontSize: 12, color: C.blueLight, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Settings size={13} /> Control de asignación
                </div>
                <select style={{ width: '100%', padding: '9px 12px', ...glass, color: C.text, fontSize: 13, outline: 'none', background: 'rgba(13,27,58,0.9)' }} defaultValue={p.asignadoA}>
                  {viviendas.map(v => <option key={v.id}>{v.nombre}</option>)}
                </select>
              </div>
            </div>
          )
        })}
      </div>

      {redistModal && (
        <Modal title="Redistribuir Energía" onClose={() => setRedistModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Panel con excedente</label>
              <select style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text, fontSize: 14, outline: 'none', background: 'rgba(13,27,58,0.9)' }}>
                {paneles.map(p => <option key={p.id}>{p.nombre} ({p.disponible} kWh disp.)</option>)}
              </select>
            </div>
            <button onClick={() => setRedistModal(false)} style={{ background: C.amber, border: 'none', color: '#000', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Confirmar transferencia
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Sensores IoT ───────────────────────────────────────────────────────────
function SensoresIoT({ viviendas }: { viviendas: ViviendaItem[] }) {
  const [data, setData] = useState(sensores)

  useEffect(() => {
    const id = setInterval(() => {
      setData(s => s.map(r => ({
        ...r,
        instantaneo: parseFloat((r.potencia + (Math.random() - 0.5) * 0.3).toFixed(2)),
        ultima: new Date().toLocaleTimeString('es-ES'),
      })))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Sensores IoT</h2>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Monitoreo en tiempo real · actualiza cada 3s</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
          <span style={{ fontSize: 13, color: C.green }}>Live</span>
        </div>
      </div>

      <div style={{ ...glass, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Vivienda', 'Voltaje (V)', 'Corriente (A)', 'Potencia (kW)', 'Instantáneo (kW)', 'Estado', 'Última actualización'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {viviendas.map((v, i) => (
              <tr key={v.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{v.nombre}</td>
                <td style={{ padding: '14px 16px', color: C.text }}>220.0</td>
                <td style={{ padding: '14px 16px', color: C.text }}>{(v.consumo * 4.5).toFixed(1)}</td>
                <td style={{ padding: '14px 16px', color: C.amber, fontWeight: 700 }}>{v.consumo}</td>
                <td style={{ padding: '14px 16px', color: C.green, fontWeight: 700 }}>{(v.consumo * 0.98).toFixed(2)}</td>
                <td style={{ padding: '14px 16px', color: v.sensor ? C.green : C.red }}>{v.sensor ? 'Conectado' : 'Offline'}</td>
                <td style={{ padding: '14px 16px', color: C.dim, fontSize: 12 }}>10:42:18</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Solicitudes ────────────────────────────────────────────────────────────
function Solicitudes({ viviendas }: { viviendas: ViviendaItem[] }) {
  const [filter, setFilter] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas')
  const [search, setSearch] = useState('')

  const filtered = solicitudes.filter(s =>
    (filter === 'todas' || s.estado === filter) &&
    (s.vivienda.toLowerCase().includes(search.toLowerCase()) || search === '')
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Solicitudes de Energía</h2>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Gestión de peticiones de energía adicional</p>
        </div>
      </div>

      <div style={{ ...glass, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Vivienda', 'Fecha', 'Energía (kWh)', 'Motivo', 'Estado'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{s.vivienda}</td>
                <td style={{ padding: '14px 16px', color: C.muted }}>{s.fecha}</td>
                <td style={{ padding: '14px 16px', color: C.amber, fontWeight: 700 }}>{s.energia}</td>
                <td style={{ padding: '14px 16px', color: C.muted }}>{s.motivo}</td>
                <td style={{ padding: '14px 16px' }}><Badge estado={s.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Facturación ────────────────────────────────────────────────────────────
function Facturacion({ viviendas }: { viviendas: ViviendaItem[] }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Facturación</h2>
        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Julio 2026 · Precio base: €0.14/kWh</p>
      </div>

      <div style={{ ...glass, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Vivienda', 'Panel', 'Energía extra (kWh)', 'Total €'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {viviendas.map((v) => (
              <tr key={v.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{v.nombre}</td>
                <td style={{ padding: '14px 20px', color: C.blueLight }}>{v.panel}</td>
                <td style={{ padding: '14px 20px', color: C.amber, fontWeight: 700 }}>{v.extraAsignado.toFixed(1)}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: C.green }}>€{(v.extraAsignado * 0.14).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Notificaciones ─────────────────────────────────────────────────────────
function Notificaciones() {
  const [nots, setNots] = useState(notificaciones)
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Centro de Notificaciones</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {nots.map(n => (
          <div key={n.id} style={{ ...glass, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Bell size={16} color={C.blueLight} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{n.msg}</div>
              <div style={{ fontSize: 12, color: C.dim, marginTop: 3 }}>Hoy a las {n.hora}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Reportes ───────────────────────────────────────────────────────────────
function Reportes({ viviendas, paneles }: { viviendas: ViviendaItem[]; paneles: PanelItem[] }) {
  const reportesPaneles = paneles.map(p => ({ name: p.nombre, kWh: p.generado }))
  const reportesConsumo = viviendas.map(v => ({ name: v.nombre.replace('Casa ', ''), kWh: parseFloat((v.consumo * 12).toFixed(1)) }))
  const COLORS = [C.blue, C.green, C.amber, C.purple, '#ec4899']

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Reportes y Estadísticas</h2>
        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Análisis de rendimiento en tiempo real</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ ...glass, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Generación por Panel</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reportesPaneles}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: C.dim, fontSize: 11 }} />
              <YAxis tick={{ fill: C.dim, fontSize: 11 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="kWh" radius={[4, 4, 0, 0]}>
                {reportesPaneles.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...glass, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Consumo por Vivienda</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reportesConsumo}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: C.dim, fontSize: 11 }} />
              <YAxis tick={{ fill: C.dim, fontSize: 11 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="kWh" radius={[4, 4, 0, 0]}>
                {reportesConsumo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── Main App Container ─────────────────────────────────────────────────────
type Page = 'dashboard' | 'viviendas' | 'paneles' | 'sensores' | 'solicitudes' | 'facturacion' | 'notificaciones' | 'reportes'

const NAV_ITEMS: { key: Page; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { key: 'viviendas', label: 'Viviendas', icon: <Home size={18} /> },
  { key: 'paneles', label: 'Paneles Solares', icon: <Sun size={18} /> },
  { key: 'sensores', label: 'Sensores IoT', icon: <Activity size={18} /> },
  { key: 'solicitudes', label: 'Solicitudes', icon: <FileText size={18} /> },
  { key: 'facturacion', label: 'Facturación', icon: <DollarSign size={18} /> },
  { key: 'notificaciones', label: 'Notificaciones', icon: <Bell size={18} /> },
  { key: 'reportes', label: 'Reportes', icon: <BarChart2 size={18} /> },
]

function MainApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<Page>('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  // Central Dynamic State
  const [viviendas, setViviendas] = useState<ViviendaItem[]>(INITIAL_VIVIENDAS)
  const [paneles, setPaneles] = useState<PanelItem[]>(INITIAL_PANELES)

  // Synchronized Add Handler (Adds 1 Vivienda + 1 Panel Solar)
  const handleAddViviendaPanel = (nueva: {
    nombre: string
    consumo: number
    potencia: number
    bateria: number
    estado: 'normal' | 'elevado' | 'critico'
  }) => {
    const usedLetters = new Set(paneles.map(p => p.id))
    let letter = 'A'
    for (let i = 0; i < 26; i++) {
      const candidate = String.fromCharCode(65 + i)
      if (!usedLetters.has(candidate)) {
        letter = candidate
        break
      }
    }

    const panelNombre = `Panel ${letter}`
    const viviendaId = Date.now()
    const viviendaNombre = nueva.nombre.startsWith('Casa ') ? nueva.nombre : `Casa ${nueva.nombre}`

    const newPanel: PanelItem = {
      id: letter,
      nombre: panelNombre,
      generado: parseFloat((nueva.potencia * 4.2).toFixed(1)),
      potencia: nueva.potencia,
      temp: Math.floor(Math.random() * 8) + 38,
      radiacion: Math.floor(Math.random() * 150) + 800,
      estado: 'activo',
      utilizacion: Math.floor(Math.random() * 30) + 60,
      disponible: parseFloat((nueva.potencia * 1.5).toFixed(1)),
      asignadoA: viviendaNombre,
    }

    const newVivienda: ViviendaItem = {
      id: viviendaId,
      nombre: viviendaNombre,
      panel: panelNombre,
      consumo: nueva.consumo,
      disponible: parseFloat((nueva.potencia * 1.5).toFixed(1)),
      bateria: nueva.bateria,
      sensor: true,
      online: true,
      estado: nueva.estado || 'normal',
      limite: parseFloat((nueva.consumo * 1.5).toFixed(1)),
      extraAsignado: nueva.estado === 'elevado' ? 1.5 : nueva.estado === 'critico' ? 3.0 : 0.0,
    }

    setViviendas(prev => [...prev, newVivienda])
    setPaneles(prev => [...prev, newPanel])
  }

  // Synchronized Delete Handler (Removes Vivienda & Panel Solar)
  const handleDeleteViviendaPanel = (id: number) => {
    const targetVivienda = viviendas.find(v => v.id === id)
    if (!targetVivienda) return

    const targetPanelNombre = targetVivienda.panel

    setViviendas(prev => prev.filter(v => v.id !== id))
    setPaneles(prev => prev.filter(p => p.nombre !== targetPanelNombre && p.asignadoA !== targetVivienda.nombre))
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            viviendas={viviendas}
            paneles={paneles}
            onAddViviendaPanel={handleAddViviendaPanel}
            onDeleteViviendaPanel={handleDeleteViviendaPanel}
          />
        )
      case 'viviendas':
        return (
          <Viviendas
            viviendas={viviendas}
            onAddViviendaPanel={handleAddViviendaPanel}
            onDeleteViviendaPanel={handleDeleteViviendaPanel}
            setViviendas={setViviendas}
          />
        )
      case 'paneles':
        return (
          <PanelesSolares
            paneles={paneles}
            viviendas={viviendas}
          />
        )
      case 'sensores':
        return <SensoresIoT viviendas={viviendas} />
      case 'solicitudes':
        return <Solicitudes viviendas={viviendas} />
      case 'facturacion':
        return <Facturacion viviendas={viviendas} />
      case 'notificaciones':
        return <Notificaciones />
      case 'reportes':
        return <Reportes viviendas={viviendas} paneles={paneles} />
      default:
        return null
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        background: 'rgba(6,14,30,0.95)',
        borderRight: `1px solid ${C.border}`,
        overflow: 'hidden',
      }}>
        {/* Logo & Toggle */}
        <div style={{
          height: 64, display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0 12px' : '0 16px',
          borderBottom: `1px solid ${C.border}`, flexShrink: 0
        }}>
          <div
            onClick={() => collapsed && setCollapsed(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: collapsed ? 'pointer' : 'default' }}
            title={collapsed ? "Expandir menú" : undefined}
          >
            <div style={{
              width: 32, height: 32, flexShrink: 0,
              background: `linear-gradient(135deg, ${C.amber}, ${C.blue})`,
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sun size={18} color="#fff" />
            </div>
            {!collapsed && (
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                SOLAR<span style={{ color: C.blueLight }}>SMART</span>
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              title="Contraer menú lateral"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: '6px',
                color: C.dim,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = C.text }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = C.dim }}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.key
            return (
              <button key={item.key} onClick={() => setPage(item.key)} title={item.label} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: '10px 14px', marginBottom: 2, borderRadius: 8, border: 'none',
                background: active ? `${C.blue}25` : 'transparent',
                color: active ? C.blueLight : C.muted,
                cursor: 'pointer', transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                whiteSpace: 'nowrap', fontWeight: active ? 600 : 400, fontSize: 14,
              }}>
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 12, padding: '10px 14px', borderRadius: 8, border: 'none',
              background: 'transparent', color: C.dim, cursor: 'pointer', fontSize: 14,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = C.dim; e.currentTarget.style.background = 'transparent' }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Contraer menú</span>}
          </button>
          <button onClick={onLogout} title="Cerrar sesión" style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12, padding: '10px 14px', borderRadius: 8, border: 'none',
            background: 'transparent', color: C.dim, cursor: 'pointer', fontSize: 14,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = C.dim; e.currentTarget.style.background = 'transparent' }}
          >
            <EyeOff size={18} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          height: 64, flexShrink: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 28px',
          borderBottom: `1px solid ${C.border}`, background: 'rgba(6,14,30,0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expandir menú lateral" : "Contraer menú lateral"}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: '8px',
                color: C.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            >
              <Menu size={18} />
            </button>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>
              {NAV_ITEMS.find(n => n.key === page)?.label}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
            <span style={{ fontSize: 12, color: C.green }}>Sistema En Línea</span>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(true)

  return loggedIn
    ? <MainApp onLogout={() => setLoggedIn(false)} />
    : <LoginPage onLogin={() => setLoggedIn(true)} />
}
