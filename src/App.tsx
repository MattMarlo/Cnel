import { useState } from 'react'
import {
  LayoutDashboard, Home, Sun, Activity, FileText,
  DollarSign, Bell, BarChart2, Eye, EyeOff,
  Zap, Battery, AlertTriangle, CheckCircle,
  Search, X, Users, UserPlus, Shield, User,
  Mail, Key, Phone, Trash2, Send, ChevronLeft,
  ChevronRight, Menu, Share2
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
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
  charging?: boolean
  eolicaPotencia?: number
  tieneEolica?: boolean
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

export interface EnergyRequest {
  id: number
  userId?: string
  vivienda: string
  viviendaId?: number
  fecha: string
  hora: string
  energia: number
  consumoActual: number
  motivo: string
  prioridad?: 'normal' | 'alta' | 'emergencia'
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  costo: number
  asignado?: string
  asignadoKwh?: number
}

export interface UserItem {
  id: string
  nombre: string
  email: string
  pass: string
  rol: 'admin' | 'usuario'
  viviendaId?: number
  viviendaNombre?: string
  fechaRegistro: string
  estado: 'activo' | 'inactivo'
  telefono?: string
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const INITIAL_USERS: UserItem[] = [
  {
    id: 'u1',
    nombre: 'Administrador del Sistema',
    email: 'admin@solarsmart.io',
    pass: 'admin',
    rol: 'admin',
    fechaRegistro: '2026-01-15',
    estado: 'activo',
    telefono: '+593 99 123 4567',
  },
  {
    id: 'u2',
    nombre: 'Juan García (Usuario Demostración)',
    email: 'usuario@gmail.com',
    pass: 'usuario',
    rol: 'usuario',
    viviendaId: 1,
    viviendaNombre: 'Casa García-López',
    fechaRegistro: '2026-07-01',
    estado: 'activo',
    telefono: '+593 98 765 4321',
  },
  {
    id: 'u3',
    nombre: 'Carlos Martínez',
    email: 'carlos.martinez@gmail.com',
    pass: 'martinez123',
    rol: 'usuario',
    viviendaId: 2,
    viviendaNombre: 'Casa Martínez',
    fechaRegistro: '2026-07-10',
    estado: 'activo',
    telefono: '+593 99 888 7777',
  },
  {
    id: 'u4',
    nombre: 'Elena López',
    email: 'elena.lopez@gmail.com',
    pass: 'lopez123',
    rol: 'usuario',
    viviendaId: 3,
    viviendaNombre: 'Casa López',
    fechaRegistro: '2026-07-15',
    estado: 'activo',
    telefono: '+593 96 555 4444',
  },
  {
    id: 'u5',
    nombre: 'Roberto Sánchez',
    email: 'roberto.sanchez@gmail.com',
    pass: 'sanchez123',
    rol: 'usuario',
    viviendaId: 4,
    viviendaNombre: 'Casa Sánchez',
    fechaRegistro: '2026-07-20',
    estado: 'activo',
    telefono: '+593 97 111 2222',
  },
]

const INITIAL_VIVIENDAS: ViviendaItem[] = [
  { id: 1, nombre: 'Casa García-López', panel: 'Panel A', consumo: 3.2, disponible: 8.4, bateria: 74, sensor: true, online: true, estado: 'normal', limite: 5.0, extraAsignado: 1.2, eolicaPotencia: 0, tieneEolica: false, charging: false },
  { id: 2, nombre: 'Casa Martínez', panel: 'Panel B', consumo: 6.8, disponible: 2.1, bateria: 31, sensor: true, online: true, estado: 'elevado', limite: 7.0, extraAsignado: 2.5, eolicaPotencia: 0, tieneEolica: false, charging: false },
  { id: 3, nombre: 'Casa López', panel: 'Panel C', consumo: 9.1, disponible: 0.4, bateria: 12, sensor: false, online: true, estado: 'critico', limite: 8.0, extraAsignado: 3.8, eolicaPotencia: 0, tieneEolica: false, charging: false },
  { id: 4, nombre: 'Casa Sánchez', panel: 'Panel D', consumo: 2.7, disponible: 11.2, bateria: 88, sensor: true, online: true, estado: 'normal', limite: 5.0, extraAsignado: 0.0, eolicaPotencia: 0, tieneEolica: false, charging: false },
]

const INITIAL_PANELES: PanelItem[] = [
  { id: 'A', nombre: 'Panel A', generado: 18.4, potencia: 4.2, temp: 42, radiacion: 820, estado: 'activo', utilizacion: 68, disponible: 8.4, asignadoA: 'Casa García-López' },
  { id: 'B', nombre: 'Panel B', generado: 21.7, potencia: 5.1, temp: 45, radiacion: 890, estado: 'activo', utilizacion: 82, disponible: 2.1, asignadoA: 'Casa Martínez' },
  { id: 'C', nombre: 'Panel C', generado: 9.3, potencia: 1.8, temp: 38, radiacion: 510, estado: 'mantenimiento', utilizacion: 45, disponible: 0.4, asignadoA: 'Casa López' },
  { id: 'D', nombre: 'Panel D', generado: 24.1, potencia: 5.8, temp: 48, radiacion: 940, estado: 'activo', utilizacion: 71, disponible: 11.2, asignadoA: 'Casa Sánchez' },
]

const INITIAL_SOLICITUDES: EnergyRequest[] = [
  { id: 1, userId: 'u2', vivienda: 'Casa García-López', viviendaId: 1, fecha: '2026-07-27', hora: '09:14', energia: 2.0, consumoActual: 3.2, motivo: 'Aire acondicionado adicional', prioridad: 'normal', estado: 'pendiente', costo: 0.28 },
  { id: 2, userId: 'u3', vivienda: 'Casa Martínez', viviendaId: 2, fecha: '2026-07-27', hora: '08:47', energia: 3.5, consumoActual: 6.8, motivo: 'Recarga vehículo eléctrico', prioridad: 'alta', estado: 'pendiente', costo: 0.49 },
  { id: 3, userId: 'u4', vivienda: 'Casa López', viviendaId: 3, fecha: '2026-07-26', hora: '19:30', energia: 1.5, consumoActual: 9.1, motivo: 'Sistema de calefacción', prioridad: 'emergencia', estado: 'aprobada', costo: 0.21, asignado: 'Panel C', asignadoKwh: 1.5 },
  { id: 4, userId: 'u5', vivienda: 'Casa Sánchez', viviendaId: 4, fecha: '2026-07-26', hora: '14:22', energia: 1.0, consumoActual: 2.7, motivo: 'Electrodomésticos adicionales', prioridad: 'normal', estado: 'rechazada', costo: 0.14 },
  { id: 5, userId: 'u3', vivienda: 'Casa Martínez', viviendaId: 2, fecha: '2026-07-25', hora: '11:05', energia: 2.2, consumoActual: 5.3, motivo: 'Trabajo desde casa', prioridad: 'normal', estado: 'aprobada', costo: 0.31, asignado: 'Panel B', asignadoKwh: 2.2 },
]

const notificaciones = [
  { id: 1, tipo: 'alerta', msg: 'Alto consumo detectado en Casa López (9.1 kW)', hora: '10:41' },
  { id: 2, tipo: 'info', msg: 'Sensor desconectado en Casa López', hora: '10:38' },
  { id: 3, tipo: 'exito', msg: 'Solicitud de energía aprobada para Casa López', hora: '09:15' },
  { id: 4, tipo: 'info', msg: 'Nueva solicitud de energía de Casa Martínez (3.5 kWh)', hora: '08:47' },
  { id: 5, tipo: 'alerta', msg: 'Panel C en modo mantenimiento — baja generación', hora: '07:30' },
  { id: 6, tipo: 'error', msg: 'Déficit energético detectado en Casa López', hora: '07:15' },
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
    admin: { color: C.purple, label: 'Administrador' },
    usuario: { color: C.blueLight, label: 'Usuario Residencial' },
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

function Modal({ title, onClose, children, maxWidth }: { title: string; onClose: () => void; children: React.ReactNode; maxWidth?: number }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ ...glassPanel, padding: 28, width: '100%', maxWidth: maxWidth || 540, maxHeight: '90vh', overflowY: 'auto' }}>
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

function AssignRow({ r, paneles, onAssign }: { r: any; paneles: PanelItem[]; onAssign: (panelId: string, kwh: number) => void }) {
  const [panelId, setPanelId] = useState<string>(paneles[0]?.id || 'A')
  const [kwh, setKwh] = useState<string>((paneles[0]?.disponible && Math.min(paneles[0].disponible, r.energia)) ? String(Math.min(paneles[0].disponible, r.energia)) : String(r.energia || '1'))
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select value={panelId} onChange={e => setPanelId(e.target.value)} style={{ padding: '8px 10px', ...glass, color: C.text, background: C.bg }}>
        {paneles.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.disponible} kWh disp.)</option>)}
      </select>
      <input type="number" step="0.1" value={kwh} onChange={e => setKwh(e.target.value)} style={{ width: 80, padding: '8px 10px', ...glass, color: C.text }} />
      <button onClick={() => onAssign(panelId, parseFloat(kwh))} style={{ background: C.blue, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Asignar</button>
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

// ─── LoginPage ──────────────────────────────────────────────────────────────
function LoginPage({ users, onLogin }: { users: UserItem[]; onLogin: (user: UserItem) => void }) {
  const [email, setEmail] = useState('usuario@gmail.com')
  const [pass, setPass] = useState('usuario')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    
    if (!found) {
      setError('El correo electrónico no se encuentra registrado.')
      return
    }

    if (found.pass !== pass) {
      setError('Contraseña incorrecta. Verifica tus credenciales.')
      return
    }

    if (found.estado !== 'activo') {
      setError('Esta cuenta de usuario se encuentra inactiva.')
      return
    }

    onLogin(found)
  }

  const fillQuick = (e: string, p: string) => {
    setEmail(e)
    setPass(p)
    setError(null)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: `radial-gradient(ellipse at 20% 50%, #0d1f4a 0%, ${C.bg} 60%)`,
    }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 80px', maxWidth: 540
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
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

        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
          Bienvenido de nuevo
        </h1>
        <p style={{ color: C.muted, marginBottom: 28, fontSize: 14 }}>
          Sistema de Gestión de Energía Solar & Apartado de Usuario
        </p>

        {/* Quick Credentials Helpers */}
        <div style={{
          ...glass, padding: 14, marginBottom: 24, background: 'rgba(37,99,235,0.06)',
          border: `1px solid ${C.blue}30`, borderRadius: 10
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.blueLight, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            ⚡ Accesos Rápidos de Prueba:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              type="button"
              onClick={() => fillQuick('usuario@gmail.com', 'usuario')}
              style={{
                background: 'rgba(34,197,94,0.15)', border: `1px solid ${C.green}40`,
                color: C.green, padding: '6px 12px', borderRadius: 6, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <User size={13} />
              Usuario: usuario@gmail.com
            </button>
            <button
              type="button"
              onClick={() => fillQuick('admin@solarsmart.io', 'admin')}
              style={{
                background: 'rgba(139,92,246,0.15)', border: `1px solid ${C.purple}40`,
                color: C.purple, padding: '6px 12px', borderRadius: 6, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Shield size={13} />
              Admin: admin@solarsmart.io
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 14px', background: `${C.red}15`, border: `1px solid ${C.red}40`,
            borderRadius: 8, color: C.red, fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Correo electrónico</label>
            <input
              type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
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
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', ...glass,
                  color: C.text, fontSize: 15, outline: 'none',
                  background: 'rgba(255,255,255,0.05)'
                }}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: C.muted, cursor: 'pointer'
              }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" style={{
            background: `linear-gradient(135deg, ${C.blue}, #1d4ed8)`,
            border: 'none', borderRadius: 10, color: '#fff',
            padding: '14px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            marginTop: 8, boxShadow: `0 4px 14px ${C.blue}40`
          }}>
            Iniciar sesión
          </button>
        </form>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(13,27,58,0.4)', borderLeft: `1px solid ${C.border}`,
        padding: 60, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ textAlign: 'center', zIndex: 2, maxWidth: 440 }}>
          <div style={{
            width: 80, height: 80, background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
            borderRadius: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20, boxShadow: `0 8px 30px ${C.blue}50`
          }}>
            <Zap size={40} color="#fff" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px' }}>Red Energética Inteligente VPP</h2>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
            Gestión interconectada en tiempo real entre los residentes y la administración solar comunitaria.
          </p>
        </div>
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none" style={{ position: 'absolute', opacity: 0.4 }}>
          <circle cx="210" cy="210" r="140" fill={`${C.amber}10`} stroke={`${C.amber}40`} strokeWidth="1.5" />
          <circle cx="210" cy="210" r="70" fill={`${C.blue}20`} stroke={C.blue} strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

// ─── Energy Flow Diagram (FULL ANIMATED GRAPHIC DIAGRAM) ────────────────────
function EnergyFlowDiagram({
  viviendas,
  paneles,
  onAddViviendaPanel,
  onDeleteViviendaPanel,
  onSelectLine,
  onAddEolica,
  onAssignEnergy,
  requests,
  setRequests,
}: {
  viviendas: ViviendaItem[]
  paneles: PanelItem[]
  onAddViviendaPanel: (data: any) => void
  onDeleteViviendaPanel: (id: number) => void
  onSelectLine: (info: string) => void
  onAddEolica: (viviendaId: number, potencia: number) => void
  onAssignEnergy?: (panelId: string, kwh: number, viviendaId: number) => void
  requests?: EnergyRequest[]
  setRequests?: React.Dispatch<React.SetStateAction<EnergyRequest[]>>
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // Estado para el modal de eólica
  const [eolicaModalOpen, setEolicaModalOpen] = useState(false)
  const [eolicaViviendaId, setEolicaViviendaId] = useState<number | null>(null)
  const [eolicaPotenciaInput, setEolicaPotenciaInput] = useState('5.0')

  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [requestKwh, setRequestKwh] = useState('2.0')
  const [requestPrice, setRequestPrice] = useState('0.25')
  const [requestMotivo, setRequestMotivo] = useState('')

  // Form State for Add Vivienda + Panel
  const [newNombre, setNewNombre] = useState('')
  const [newConsumo, setNewConsumo] = useState('3.5')
  const [newPotencia, setNewPotencia] = useState('4.8')
  const [newBateria, setNewBateria] = useState('80')
  const [newEstado, setNewEstado] = useState<'normal' | 'elevado' | 'critico'>('normal')

  const reqList = requests || []

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

  const handleConfirmEolica = () => {
    if (eolicaViviendaId === null) return
    const potencia = parseFloat(eolicaPotenciaInput)
    if (isNaN(potencia) || potencia <= 0) {
      alert('Ingresa una potencia válida en kW')
      return
    }
    onAddEolica(eolicaViviendaId, potencia)
    setEolicaModalOpen(false)
    setEolicaViviendaId(null)
    setEolicaPotenciaInput('5.0')
    triggerToast(`💨 Se ha añadido energía eólica de ${potencia} kW a la vivienda.`)
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

          {/* Central Horizontal VPP Line */}
          {N > 0 && (
            <g>
              <line x1={40} y1={nodeY} x2={svgWidth - 40} y2={nodeY} stroke={C.blue} strokeWidth="3" opacity="0.85" />
              <line x1={40} y1={nodeY} x2={svgWidth - 40} y2={nodeY} stroke="#60a5fa" strokeWidth="8" opacity="0.15" />
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

            const tieneEolica = v.tieneEolica && v.eolicaPotencia && v.eolicaPotencia > 0
            const spinSpeed = Math.max(1.2, 4 - (v.eolicaPotencia || 0) * 0.25)
            const eolicOffset = 72
            const eolicSide = (xPanel > xHouse) ? -eolicOffset : eolicOffset
            const eolicX = xHouse + eolicSide

            return (
              <g key={v.id}>
                {/* ── VERTICAL CONNECTOR LINE TO CENTRAL VPP LINE ── */}
                {isAbove ? (
                  <>
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

                {/* ── BOTÓN "+" PARA AÑADIR EÓLICA ── */}
                <g
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEolicaViviendaId(v.id)
                    setEolicaPotenciaInput(v.eolicaPotencia?.toString() || '5.0')
                    setEolicaModalOpen(true)
                  }}
                >
                  <circle cx={xHouse + 40} cy={itemY + 26} r="14" fill="#1f2937" stroke="#8B5CF6" strokeWidth="2" />
                  <text x={xHouse + 40} y={itemY + 31} textAnchor="middle" fill="#8B5CF6" fontSize="16" fontWeight="800">+</text>
                </g>

                {/* ── AEROGENERADOR (si tiene eólica) ── */}
                {tieneEolica && (
                  <>
                    <line x1={eolicX} y1={itemY - 26} x2={xHouse} y2={itemY - 6} stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
                    <line x1={eolicX} y1={itemY - 26} x2={xPanel} y2={itemY - 16} stroke="rgba(99,102,241,0.12)" strokeWidth="1" />

                    <g transform={`translate(${eolicX}, ${itemY - 40})`} filter={`url(#dropShadow${v.id})`}>
                      <defs>
                        <linearGradient id={`towerGrad${v.id}`} x1="0" x2="0">
                          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.06" />
                          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
                        </linearGradient>
                        <radialGradient id={`bladeGrad${v.id}`} cx="30%" cy="30%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                          <stop offset="100%" stopColor="#06b6d480" stopOpacity="0.6" />
                        </radialGradient>
                        <filter id={`dropShadow${v.id}`} x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
                        </filter>
                      </defs>
                      <rect x={-2} y={0} width={4} height={28} rx={2} fill={`url(#towerGrad${v.id})`} stroke="#94a3b8" strokeWidth="0.8" />
                      <rect x={-8} y={-6} width={16} height={8} rx={3} fill="#0f172a" stroke="#60a5fa" strokeWidth="0.8" />
                      <g style={{ transformOrigin: '0px 0px', animation: `spin ${spinSpeed}s cubic-bezier(0.33,0,0.67,1) infinite` }}>
                        <path d="M0,-1 C6,-1 10,-6 12,-8" stroke={`url(#bladeGrad${v.id})`} strokeWidth="2.6" strokeLinecap="round" fill="none" transform="rotate(0)" />
                        <path d="M0,-1 C-6,-1 -10,-6 -12,-8" stroke={`url(#bladeGrad${v.id})`} strokeWidth="2.6" strokeLinecap="round" fill="none" transform="rotate(120)" />
                        <path d="M0,-1 C6,-1 10,-6 12,-8" stroke={`url(#bladeGrad${v.id})`} strokeWidth="2.6" strokeLinecap="round" fill="none" transform="rotate(240)" />
                      </g>
                      <circle cx="0" cy="0" r="3.5" fill="#0ea5a3" stroke="#06b6d4" strokeWidth="0.8" opacity="0.98" />
                      <circle cx="0" cy="0" r="6" fill="#06b6d410" />
                      <text x="0" y="34" textAnchor="middle" fill="#60A5FA" fontSize="9" fontWeight="700">
                        {v.eolicaPotencia} kW
                      </text>
                    </g>
                  </>
                )}

                {/* ── RIGHT: PANEL SOLAR ── */}
                <g style={{ cursor: 'pointer' }} onClick={() => handleLineClick(i)}>
                  <text x={xPanel} y={itemY - 24} textAnchor="middle" fill={C.text} fontSize="11" fontWeight="700" letterSpacing="0.04em">
                    {p.nombre.toUpperCase()}
                  </text>

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
                  <g>
                    <rect x={xPanel - 25} y={itemY + 27} width="50" height="16" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                    <rect x={xPanel - 21} y={itemY + 30} width={Math.max(4, (v.bateria / 100) * 42)} height="10" rx="4" fill={batteryColor} opacity="0.95">
                      {v.charging && (
                        <animate attributeName="width" dur="1s" fill="freeze" />
                      )}
                    </rect>
                    <text x={xPanel} y={itemY + 39} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                      {v.bateria}%
                    </text>

                    {v.charging && (
                      <g>
                        <circle cx={xPanel + 18} cy={itemY + 33} r="14" fill={batteryColor + '18'} style={{ animation: 'pulse 1s ease-out infinite' }} />
                        <text x={xPanel + 18} y={itemY + 37} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" style={{ animation: 'bolt 0.9s ease-in-out infinite' }}>⚡</text>
                      </g>
                    )}
                  </g>

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

      {/* ── BOTTOM ACTION BUTTONS ── */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setShowRequestsModal(true)}
          style={{
            background: C.green, border: 'none', color: '#fff',
            borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 10px rgba(34,197,94,0.3)'
          }}
        >
          <FileText size={15} /> Solicitudes ({reqList.filter(r => r.estado === 'pendiente').length})
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
              {viviendas[selected].tieneEolica && ` · Eólica: ${viviendas[selected].eolicaPotencia} kW`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onDeleteViviendaPanel(viviendas[selected].id)}
              style={{ ...glass, border: `1px solid ${C.red}50`, color: C.red, borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', background: `${C.red}18` }}
            >
              Eliminar Vivienda y Panel
            </button>
            <button
              onClick={() => setShowCreateRequestModal(true)}
              style={{ ...glass, border: `1px solid ${C.green}50`, color: C.green, borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', background: `${C.green}10` }}
            >
              ⚡ Solicitar energía
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
                        {v.tieneEolica && ` · Eólica: ${v.eolicaPotencia} kW`}
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

      {/* ── MODAL: CREAR SOLICITUD DE ENERGÍA (DESDE VIVIENDA) ── */}
      {showCreateRequestModal && selected !== null && viviendas[selected] && (
        <Modal title="✉️ Solicitar Energía" onClose={() => setShowCreateRequestModal(false)}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={(e) => {
            e.preventDefault()
            const kwhVal = parseFloat(requestKwh)
            const price = parseFloat(requestPrice)
            if (isNaN(kwhVal) || kwhVal <= 0) return alert('Ingresa kWh válido')
            const nueva: EnergyRequest = {
              id: Date.now(),
              vivienda: viviendas[selected].nombre,
              viviendaId: viviendas[selected].id,
              fecha: new Date().toISOString().split('T')[0],
              hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              energia: kwhVal,
              consumoActual: viviendas[selected].consumo,
              motivo: requestMotivo || 'Solicitud de carga',
              prioridad: 'normal',
              estado: 'pendiente',
              costo: price,
            }
            if (setRequests) {
              setRequests(prev => [nueva, ...prev])
            }
            setShowCreateRequestModal(false)
            setRequestKwh('2.0')
            setRequestPrice('0.25')
            setRequestMotivo('')
            triggerToast(`🔔 Solicitud registrada: ${kwhVal} kWh para ${nueva.vivienda}`)
          }}>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Cantidad (kWh)</label>
              <input type="number" step="0.1" value={requestKwh} onChange={e => setRequestKwh(e.target.value)} style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Precio por kWh (USD)</label>
              <input type="number" step="0.01" value={requestPrice} onChange={e => setRequestPrice(e.target.value)} style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Motivo (opcional)</label>
              <input value={requestMotivo} onChange={e => setRequestMotivo(e.target.value)} placeholder="ej. Recarga VE" style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ flex: 1, background: C.green, border: 'none', color: '#fff', borderRadius: 8, padding: '10px', fontWeight: 700, cursor: 'pointer' }}>Enviar solicitud</button>
              <button type="button" onClick={() => setShowCreateRequestModal(false)} style={{ flex: '0 0 auto', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '10px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL: GESTIONAR SOLICITUDES ── */}
      {showRequestsModal && (
        <Modal title="📋 Gestión de Solicitudes" onClose={() => setShowRequestsModal(false)} maxWidth={900}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 420, overflowY: 'auto' }}>
            {reqList.length === 0 && <div style={{ color: C.dim, padding: 12 }}>No hay solicitudes.</div>}
            {reqList.map(r => (
              <div key={r.id} style={{ padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.text }}>{r.vivienda} · {r.energia} kWh · ${r.costo}/kWh</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{r.motivo} · {r.fecha} {r.hora} · Estado: {r.estado}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {r.estado === 'pendiente' ? (
                    <AssignRow r={r} paneles={paneles} onAssign={(panelId: string, kwhVal: number) => {
                      const k = parseFloat(kwhVal as any)
                      const panel = paneles.find(p => p.id === panelId)
                      if (!panel) return alert('Panel no válido')
                      if (k <= 0) return alert('kWh inválido')
                      if (panel.disponible < k) return alert('Panel no tiene suficiente disponible')
                      
                      const targetId = r.viviendaId || viviendas.find(v => v.nombre === r.vivienda)?.id || 1
                      if (onAssignEnergy) {
                        onAssignEnergy(panelId, k, targetId)
                      }
                      if (setRequests) {
                        setRequests(prev => prev.map(x => x.id === r.id ? { ...x, estado: 'aprobada', asignado: `Panel ${panelId}`, asignadoKwh: k } : x))
                      }
                      triggerToast(`✅ ${k} kWh asignados desde ${panel.nombre} a ${r.vivienda}`)
                    }} />
                  ) : (
                    <div style={{ fontSize: 12, color: C.dim }}>Asignado: {r.asignado || '-'}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── MODAL PARA AÑADIR ENERGÍA EÓLICA ── */}
      {eolicaModalOpen && (
        <Modal title="💨 Agregar Energía Eólica" onClose={() => setEolicaModalOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              Ingresa la potencia nominal del aerogenerador para esta vivienda.
            </p>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Potencia (kW)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={eolicaPotenciaInput}
                onChange={e => setEolicaPotenciaInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  ...glass,
                  color: C.text,
                  fontSize: 15,
                  outline: 'none',
                  background: 'rgba(255,255,255,0.05)'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleConfirmEolica}
                style={{
                  flex: 1,
                  background: `linear-gradient(135deg, #8B5CF6, #6D28D9)`,
                  border: 'none',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '12px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Agregar Aerogenerador
              </button>
              <button
                onClick={() => setEolicaModalOpen(false)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  borderRadius: 8,
                  padding: '12px',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Incluir keyframes para animación de aspas, pulso y rayos */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6 }
          50% { transform: scale(1.05); opacity: 0.95 }
          100% { transform: scale(0.95); opacity: 0.65 }
        }
        @keyframes bolt {
          0% { transform: translateY(0) scale(1) }
          50% { transform: translateY(-4px) scale(1.12) }
          100% { transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  )
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({
  viviendas,
  paneles,
  onAddViviendaPanel,
  onDeleteViviendaPanel,
  onAddEolica,
  onAssignEnergy,
  requests,
  setRequests,
}: {
  viviendas: ViviendaItem[]
  paneles: PanelItem[]
  onAddViviendaPanel: (data: any) => void
  onDeleteViviendaPanel: (id: number) => void
  onAddEolica: (viviendaId: number, potencia: number) => void
  onAssignEnergy?: (panelId: string, kwh: number, viviendaId: number) => void
  requests?: EnergyRequest[]
  setRequests?: React.Dispatch<React.SetStateAction<EnergyRequest[]>>
}) {
  const totalGenerado = paneles.reduce((acc, p) => acc + p.generado, 0).toFixed(1)
  const totalConsumido = viviendas.reduce((acc, v) => acc + v.consumo * 8, 0).toFixed(1)
  const totalDisponible = paneles.reduce((acc, p) => acc + p.disponible, 0).toFixed(1)
  const viviendasOnline = viviendas.filter(v => v.online).length
  const panelesActivos = paneles.filter(p => p.estado === 'activo').length
  const sensoresOk = viviendas.filter(v => v.sensor).length
  const pendientes = requests ? requests.filter(r => r.estado === 'pendiente').length : 0

  const kpis = [
    { icon: <Sun size={18} />, label: 'Generado hoy', value: `${totalGenerado} kWh`, sub: '↑ 12% vs ayer', color: C.amber },
    { icon: <Zap size={18} />, label: 'Consumido hoy', value: `${totalConsumido} kWh`, sub: `${viviendas.length} viviendas activas`, color: C.blue },
    { icon: <Battery size={18} />, label: 'Disponible', value: `${totalDisponible} kWh`, sub: 'Excedente de red', color: C.green },
    { icon: <Home size={18} />, label: 'Viviendas online', value: `${viviendasOnline} / ${viviendas.length}`, sub: 'Conectadas', color: C.green },
    { icon: <Sun size={18} />, label: 'Paneles activos', value: `${panelesActivos} / ${paneles.length}`, sub: 'Red solar', color: C.amber },
    { icon: <FileText size={18} />, label: 'Solicitudes pendientes', value: `${pendientes}`, sub: 'Peticiones de usuarios', color: C.amber },
    { icon: <AlertTriangle size={18} />, label: 'Alertas activas', value: '2', sub: 'Ver notificaciones', color: C.red },
    { icon: <Activity size={18} />, label: 'Sensores conectados', value: `${sensoresOk} / ${viviendas.length}`, sub: 'Frecuencia 3s', color: C.green },
  ]

  const consumoBarData = Array.from({ length: 8 }, (_, i) => {
    const hora = `${(i * 3).toString().padStart(2, '0')}:00`
    const entry: any = { hora }
    viviendas.forEach(v => {
      const shortName = v.nombre.replace('Casa ', '')
      entry[shortName] = parseFloat((v.consumo * (0.8 + (i % 3) * 0.2)).toFixed(1))
    })
    return entry
  })

  const colorsList = [C.blue, C.green, C.amber, C.purple, '#ec4899', '#14b8a6']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {kpis.map(k => <StatCard key={k.label} {...k} />)}
      </div>

      <EnergyFlowDiagram
        viviendas={viviendas}
        paneles={paneles}
        onAddViviendaPanel={onAddViviendaPanel}
        onDeleteViviendaPanel={onDeleteViviendaPanel}
        onSelectLine={() => {}}
        onAssignEnergy={onAssignEnergy}
        onAddEolica={onAddEolica}
        requests={requests}
        setRequests={setRequests}
      />

      <div style={{ ...glass, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Consumo Energético por Vivienda (24 Horas)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={consumoBarData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hora" tick={{ fill: C.dim, fontSize: 11 }} />
            <YAxis tick={{ fill: C.dim, fontSize: 11 }} />
            <Tooltip contentStyle={customTooltipStyle} />
            {viviendas.map((v, idx) => {
              const shortName = v.nombre.replace('Casa ', '')
              return <Bar key={v.id} dataKey={shortName} fill={colorsList[idx % colorsList.length]} radius={[4, 4, 0, 0]} />
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Viviendas ──────────────────────────────────────────────────────────────
function DetalleViviendaContent({ v }: { v: ViviendaItem }) {
  const areaData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    consumo: parseFloat((v.consumo * (0.7 + Math.sin(i) * 0.3)).toFixed(1)),
    bateria: Math.min(100, Math.max(10, Math.round(v.bateria + Math.cos(i) * 15))),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div style={{ ...glass, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.muted }}>Consumo Actual</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{v.consumo} kW</div>
        </div>
        <div style={{ ...glass, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.muted }}>Disponible Red</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.green }}>{v.disponible} kWh</div>
        </div>
        <div style={{ ...glass, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.muted }}>Nivel Batería</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: v.bateria < 20 ? C.red : C.amber }}>{v.bateria}%</div>
        </div>
      </div>

      <div style={{ ...glass, padding: 16 }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 13, color: C.muted }}>Historial de Consumo y Batería</h4>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" tick={{ fill: C.dim, fontSize: 10 }} />
            <YAxis tick={{ fill: C.dim, fontSize: 10 }} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Area type="monotone" dataKey="consumo" stroke={C.blue} fill={`${C.blue}30`} name="Consumo (kW)" />
            <Area type="monotone" dataKey="bateria" stroke={C.green} fill={`${C.green}20`} name="Batería (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Viviendas({
  viviendas,
  onAddViviendaPanel,
  onDeleteViviendaPanel,
}: {
  viviendas: ViviendaItem[]
  onAddViviendaPanel: (data: any) => void
  onDeleteViviendaPanel: (id: number) => void
}) {
  const [selectedVivienda, setSelectedVivienda] = useState<ViviendaItem | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [nombre, setNombre] = useState('')
  const [consumo, setConsumo] = useState('3.5')
  const [potencia, setPotencia] = useState('4.0')
  const [bateria, setBateria] = useState('85')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Gestión de Viviendas</h2>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Residencias conectadas a la red solar comunitaria</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}
        >
          + Registrar Nueva Vivienda
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {viviendas.map(v => (
          <div key={v.id} style={{ ...glass, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{v.nombre}</span>
              <Badge estado={v.estado} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div>
                <span style={{ color: C.muted }}>Panel solar:</span>
                <div style={{ fontWeight: 600, color: C.blueLight }}>{v.panel}</div>
              </div>
              <div>
                <span style={{ color: C.muted }}>Consumo actual:</span>
                <div style={{ fontWeight: 600 }}>{v.consumo} kW</div>
              </div>
              <div>
                <span style={{ color: C.muted }}>Disponible:</span>
                <div style={{ fontWeight: 600, color: C.green }}>{v.disponible} kWh</div>
              </div>
              <div>
                <span style={{ color: C.muted }}>Batería:</span>
                <div style={{ fontWeight: 600, color: v.bateria < 20 ? C.red : C.amber }}>{v.bateria}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                onClick={() => setSelectedVivienda(v)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, color: C.text, padding: 8, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Ver Detalles
              </button>
              {viviendas.length > 1 && (
                <button
                  onClick={() => onDeleteViviendaPanel(v.id)}
                  style={{ background: 'rgba(239,68,68,0.12)', border: `1px solid ${C.red}40`, color: C.red, padding: '8px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedVivienda && (
        <Modal title={`Detalles de ${selectedVivienda.nombre}`} onClose={() => setSelectedVivienda(null)} maxWidth={640}>
          <DetalleViviendaContent v={selectedVivienda} />
        </Modal>
      )}

      {showAdd && (
        <Modal title="➕ Añadir Nueva Vivienda" onClose={() => setShowAdd(false)}>
          <form onSubmit={e => {
            e.preventDefault()
            if (!nombre) return alert('Nombre requerido')
            onAddViviendaPanel({
              nombre,
              consumo: parseFloat(consumo),
              potencia: parseFloat(potencia),
              bateria: parseInt(bateria, 10),
              estado: 'normal'
            })
            setShowAdd(false)
            setNombre('')
          }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Nombre del Residente / Vivienda</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="ej. Casa Torres" required style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Consumo Estimado (kW)</label>
                <input type="number" step="0.1" value={consumo} onChange={e => setConsumo(e.target.value)} style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Potencia Panel Solar (kW)</label>
                <input type="number" step="0.1" value={potencia} onChange={e => setPotencia(e.target.value)} style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Nivel Batería (%)</label>
              <input type="number" value={bateria} onChange={e => setBateria(e.target.value)} style={{ width: '100%', padding: '11px 14px', ...glass, color: C.text }} />
            </div>
            <button type="submit" style={{ background: C.blue, color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Registrar Vivienda</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Paneles Solares ────────────────────────────────────────────────────────
function PanelesSolares({ paneles }: { paneles: PanelItem[]; viviendas: ViviendaItem[] }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Infraestructura de Paneles Solares</h2>
        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Estado térmico, radiación solar y potencia fotovoltaica</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {paneles.map(p => (
          <div key={p.id} style={{ ...glass, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sun size={20} color={C.amber} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>{p.nombre}</span>
              </div>
              <Badge estado={p.estado} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div>
                <span style={{ color: C.muted }}>Generación Hoy:</span>
                <div style={{ fontWeight: 700, color: C.amber }}>{p.generado} kWh</div>
              </div>
              <div>
                <span style={{ color: C.muted }}>Potencia Máx:</span>
                <div style={{ fontWeight: 700 }}>{p.potencia} kW</div>
              </div>
              <div>
                <span style={{ color: C.muted }}>Temperatura:</span>
                <div style={{ fontWeight: 600 }}>{p.temp} °C</div>
              </div>
              <div>
                <span style={{ color: C.muted }}>Radiación:</span>
                <div style={{ fontWeight: 600 }}>{p.radiacion} W/m²</div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
              Asignado a: <strong style={{ color: C.text }}>{p.asignadoA}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sensores IoT ───────────────────────────────────────────────────────────
function SensoresIoT({ viviendas }: { viviendas: ViviendaItem[] }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Sensores y Telemetría IoT</h2>
        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Lecturas de voltaje, corriente y frecuencia en tiempo real</p>
      </div>

      <div style={{ ...glass, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Vivienda', 'Estado Conexión', 'Voltaje (V)', 'Corriente (A)', 'Potencia (kW)', 'Última Lectura'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {viviendas.map(v => (
              <tr key={v.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{v.nombre}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ color: v.sensor ? C.green : C.red, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.sensor ? C.green : C.red }} />
                    {v.sensor ? 'En Línea' : 'Desconectado'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>220.4 V</td>
                <td style={{ padding: '14px 16px' }}>{(v.consumo * 4.5).toFixed(1)} A</td>
                <td style={{ padding: '14px 16px', color: C.blueLight, fontWeight: 700 }}>{v.consumo} kW</td>
                <td style={{ padding: '14px 16px', color: C.muted }}>Hace 3s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Solicitudes (Admin View) ───────────────────────────────────────────────
function Solicitudes({
  paneles,
  requests,
  setRequests,
  onAssignEnergy,
}: {
  viviendas: ViviendaItem[]
  paneles: PanelItem[]
  requests: EnergyRequest[]
  setRequests: React.Dispatch<React.SetStateAction<EnergyRequest[]>>
  onAssignEnergy?: (panelId: string, kwh: number, viviendaId: number) => void
}) {
  const [filter, setFilter] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas')
  const [search, setSearch] = useState('')
  const [selectedPanelMap, setSelectedPanelMap] = useState<Record<number, string>>({})

  const filtered = requests.filter(s =>
    (filter === 'todas' || s.estado === filter) &&
    (s.vivienda.toLowerCase().includes(search.toLowerCase()) || s.motivo.toLowerCase().includes(search.toLowerCase()))
  )

  const handleApprove = (req: EnergyRequest) => {
    const chosenPanelId = selectedPanelMap[req.id] || paneles[0]?.id || 'A'
    const targetViviendaId = req.viviendaId || 1

    if (onAssignEnergy) {
      onAssignEnergy(chosenPanelId, req.energia, targetViviendaId)
    }

    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, estado: 'aprobada', asignado: `Panel ${chosenPanelId}`, asignadoKwh: req.energia } : r))
  }

  const handleReject = (reqId: number) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, estado: 'rechazada' } : r))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Gestión de Solicitudes de Energía</h2>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Aprobación y asignación de excedentes fotovoltaicos a usuarios</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar solicitud..."
              style={{ width: '100%', padding: '8px 12px 8px 36px', ...glass, color: C.text, fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
            {(['todas', 'pendiente', 'aprobada', 'rechazada'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? C.blue : 'transparent',
                  color: filter === f ? '#fff' : C.muted,
                  border: 'none', borderRadius: 6, padding: '6px 12px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...glass, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Vivienda', 'Fecha & Hora', 'Energía Solicitada', 'Motivo', 'Estado', 'Acción Administrador'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: C.muted }}>No se encontraron solicitudes con este filtro.</td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{s.vivienda}</td>
                  <td style={{ padding: '14px 16px', color: C.muted }}>{s.fecha} {s.hora}</td>
                  <td style={{ padding: '14px 16px', color: C.amber, fontWeight: 700 }}>{s.energia} kWh</td>
                  <td style={{ padding: '14px 16px', color: C.text }}>{s.motivo}</td>
                  <td style={{ padding: '14px 16px' }}><Badge estado={s.estado} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    {s.estado === 'pendiente' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <select
                          value={selectedPanelMap[s.id] || paneles[0]?.id || 'A'}
                          onChange={e => setSelectedPanelMap({ ...selectedPanelMap, [s.id]: e.target.value })}
                          style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px', fontSize: 12 }}
                        >
                          {paneles.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} ({p.disponible} kWh disp.)</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleApprove(s)}
                          style={{ background: C.green, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(s.id)}
                          style={{ background: 'rgba(239,68,68,0.2)', color: C.red, border: `1px solid ${C.red}40`, padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: C.muted }}>
                        {s.estado === 'aprobada' ? `Asignado de ${s.asignado || 'Panel Solar'}` : 'Solicitud denegada'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Gestión de Usuarios (Admin Module) ─────────────────────────────────────
function GestionUsuarios({
  users,
  setUsers,
  viviendas,
}: {
  users: UserItem[]
  setUsers: React.Dispatch<React.SetStateAction<UserItem[]>>
  viviendas: ViviendaItem[]
}) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'todos' | 'admin' | 'usuario'>('todos')
  const [showAddModal, setShowAddModal] = useState(false)

  // Form state for creating user
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [rol, setRol] = useState<'usuario' | 'admin'>('usuario')
  const [viviendaId, setViviendaId] = useState<number>(viviendas[0]?.id || 1)
  const [telefono, setTelefono] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const filteredUsers = users.filter(u =>
    (roleFilter === 'todos' || u.rol === roleFilter) &&
    (u.nombre.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email || !pass) return alert('Completa los campos obligatorios')

    const assignedVivienda = viviendas.find(v => v.id === Number(viviendaId))
    const newUser: UserItem = {
      id: `u_${Date.now()}`,
      nombre,
      email: email.trim().toLowerCase(),
      pass,
      rol,
      viviendaId: Number(viviendaId),
      viviendaNombre: assignedVivienda ? assignedVivienda.nombre : 'Casa Residencial',
      fechaRegistro: new Date().toISOString().split('T')[0],
      estado: 'activo',
      telefono,
    }

    setUsers(prev => [...prev, newUser])
    setShowAddModal(false)
    setNombre('')
    setEmail('')
    setPass('')
    setTelefono('')
    setToast(`✅ Usuario ${newUser.nombre} creado con éxito. Credenciales: ${newUser.email} / ${newUser.pass}`)
    setTimeout(() => setToast(null), 5000)
  }

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u))
  }

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) return alert('No puedes eliminar el único usuario del sistema')
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Gestión de Usuarios del Sistema</h2>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Módulo para creación de accesos y asignación de viviendas residenciales</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: `linear-gradient(135deg, ${C.blue}, #1d4ed8)`,
            color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: `0 4px 14px ${C.blue}40`
          }}
        >
          <UserPlus size={18} /> Crear Nuevo Usuario
        </button>
      </div>

      {toast && (
        <div style={{
          padding: '12px 16px', background: `${C.green}20`, border: `1px solid ${C.green}50`,
          borderRadius: 8, color: C.green, fontSize: 13, fontWeight: 600, marginBottom: 20
        }}>
          {toast}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard icon={<Users size={18} />} label="Total Usuarios" value={`${users.length}`} sub="Registrados" color={C.blueLight} />
        <StatCard icon={<Shield size={18} />} label="Administradores" value={`${users.filter(u => u.rol === 'admin').length}`} sub="Acceso Total" color={C.purple} />
        <StatCard icon={<User size={18} />} label="Usuarios Residenciales" value={`${users.filter(u => u.rol === 'usuario').length}`} sub="Residentes de viviendas" color={C.green} />
        <StatCard icon={<CheckCircle size={18} />} label="Cuentas Activas" value={`${users.filter(u => u.estado === 'activo').length}`} sub="Operativas" color={C.amber} />
      </div>

      {/* Filter and Search toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            style={{ width: '100%', padding: '9px 12px 9px 36px', ...glass, color: C.text, fontSize: 13 }}
          />
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
          {(['todos', 'admin', 'usuario'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                background: roleFilter === r ? C.blue : 'transparent',
                color: roleFilter === r ? '#fff' : C.muted,
                border: 'none', borderRadius: 6, padding: '6px 14px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {r === 'todos' ? 'Todos' : r === 'admin' ? 'Administradores' : 'Usuarios'}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Usuario', 'Correo Electrónico', 'Contraseña', 'Rol', 'Vivienda Asignada', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: u.rol === 'admin' ? `linear-gradient(135deg, ${C.purple}, ${C.blue})` : `linear-gradient(135deg, ${C.blue}, ${C.green})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff'
                    }}>
                      {u.nombre.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: C.text }}>{u.nombre}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>Reg: {u.fechaRegistro}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: C.blueLight }}>{u.email}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: C.muted }}>{u.pass}</td>
                <td style={{ padding: '14px 16px' }}><Badge estado={u.rol} /></td>
                <td style={{ padding: '14px 16px', color: C.text, fontWeight: 500 }}>
                  {u.rol === 'usuario' ? (u.viviendaNombre || 'Casa García-López') : '— N/A (Admin) —'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    color: u.estado === 'activo' ? C.green : C.red,
                    fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.estado === 'activo' ? C.green : C.red }} />
                    {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      style={{
                        background: u.estado === 'activo' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                        border: `1px solid ${u.estado === 'activo' ? C.red : C.green}40`,
                        color: u.estado === 'activo' ? C.red : C.green,
                        borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer'
                      }}
                    >
                      {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Crear Usuario */}
      {showAddModal && (
        <Modal title="👤 Registrar Nuevo Usuario en el Sistema" onClose={() => setShowAddModal(false)} maxWidth={560}>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Nombre Completo</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="ej. María Fernández" required
                  style={{ width: '100%', padding: '11px 12px 11px 36px', ...glass, color: C.text }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Correo Electrónico</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="maria@gmail.com" required
                    style={{ width: '100%', padding: '11px 12px 11px 36px', ...glass, color: C.text }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text" value={pass} onChange={e => setPass(e.target.value)}
                    placeholder="clave123" required
                    style={{ width: '100%', padding: '11px 12px 11px 36px', ...glass, color: C.text }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Rol del Usuario</label>
                <select
                  value={rol} onChange={e => setRol(e.target.value as any)}
                  style={{ width: '100%', padding: '11px 12px', ...glass, color: C.text, background: C.bg }}
                >
                  <option value="usuario">Usuario Residencial</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Vivienda Asignada</label>
                <select
                  value={viviendaId} onChange={e => setViviendaId(Number(e.target.value))}
                  disabled={rol === 'admin'}
                  style={{ width: '100%', padding: '11px 12px', ...glass, color: C.text, background: C.bg }}
                >
                  {viviendas.map(v => (
                    <option key={v.id} value={v.id}>{v.nombre} ({v.panel})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Teléfono de Contacto (opcional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={telefono} onChange={e => setTelefono(e.target.value)}
                  placeholder="+593 99 000 1111"
                  style={{ width: '100%', padding: '11px 12px 11px 36px', ...glass, color: C.text }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                type="submit"
                style={{ flex: 1, background: `linear-gradient(135deg, ${C.blue}, #1d4ed8)`, color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Guardar Usuario
              </button>
              <button
                type="button" onClick={() => setShowAddModal(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.muted, padding: 12, borderRadius: 8, cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Facturación ────────────────────────────────────────────────────────────
function Facturacion({ viviendas }: { viviendas: ViviendaItem[] }) {
  const precioCompra = 0.14
  const precioVenta = 0.10

  const rows = viviendas.map((v) => {
    const compra = Math.max(0, v.consumo - v.disponible)
    const vende = Math.max(0, v.disponible - v.consumo)
    const extra = v.extraAsignado
    const total = (compra + extra) * precioCompra - vende * precioVenta
    return { v, compra, vende, extra, total }
  })

  const totCompra = rows.reduce((s, r) => s + r.compra, 0)
  const totVende = rows.reduce((s, r) => s + r.vende, 0)
  const totExtra = rows.reduce((s, r) => s + r.extra, 0)
  const totTotal = rows.reduce((s, r) => s + r.total, 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Facturación Comunitaria</h2>
        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>
          Tarifas vigentes · Compra: €{precioCompra.toFixed(2)}/kWh · Venta: €{precioVenta.toFixed(2)}/kWh
        </p>
      </div>

      <div style={{ ...glass, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Vivienda', 'Panel', 'Compra (kWh)', 'Vende (kWh)', 'Extra asignado (kWh)', 'Total €'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ v, compra, vende, extra, total }) => (
              <tr key={v.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{v.nombre}</td>
                <td style={{ padding: '14px 20px', color: C.blueLight }}>{v.panel}</td>
                <td style={{ padding: '14px 20px', color: compra > 0 ? C.red : C.dim, fontWeight: 700 }}>{compra.toFixed(1)}</td>
                <td style={{ padding: '14px 20px', color: vende > 0 ? C.green : C.dim, fontWeight: 700 }}>{vende.toFixed(1)}</td>
                <td style={{ padding: '14px 20px', color: extra > 0 ? C.amber : C.dim, fontWeight: 700 }}>{extra.toFixed(1)}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: total > 0 ? C.red : total < 0 ? C.green : C.dim }}>
                  {total < 0 ? `-€${Math.abs(total).toFixed(2)}` : `€${total.toFixed(2)}`}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid ${C.borderBright}`, background: 'rgba(37,99,235,0.06)' }}>
              <td style={{ padding: '14px 20px', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', color: C.blueLight }} colSpan={2}>Totales Red</td>
              <td style={{ padding: '14px 20px', fontWeight: 800, color: totCompra > 0 ? C.red : C.dim }}>{totCompra.toFixed(1)}</td>
              <td style={{ padding: '14px 20px', fontWeight: 800, color: totVende > 0 ? C.green : C.dim }}>{totVende.toFixed(1)}</td>
              <td style={{ padding: '14px 20px', fontWeight: 800, color: totExtra > 0 ? C.amber : C.dim }}>{totExtra.toFixed(1)}</td>
              <td style={{ padding: '14px 20px', fontWeight: 800, color: totTotal > 0 ? C.red : totTotal < 0 ? C.green : C.dim }}>
                {totTotal < 0 ? `-€${Math.abs(totTotal).toFixed(2)}` : `€${totTotal.toFixed(2)}`}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Notificaciones ─────────────────────────────────────────────────────────
function Notificaciones() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Centro de Notificaciones</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notificaciones.map(n => (
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
function Reportes({ viviendas }: { viviendas: ViviendaItem[]; paneles: PanelItem[] }) {
  const datosCompraVende = viviendas.map(v => ({
    name: v.nombre.replace('Casa ', ''),
    compra: parseFloat(Math.max(0, v.consumo - v.disponible).toFixed(1)),
    vende: parseFloat(Math.max(0, v.disponible - v.consumo).toFixed(1)),
  }))

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Reportes y Estadísticas</h2>
        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>Análisis de compra y venta de energía por vivienda</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ ...glass, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Compra por Vivienda (kWh)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={datosCompraVende}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: C.dim, fontSize: 11 }} />
              <YAxis tick={{ fill: C.dim, fontSize: 11 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="compra" name="Compra" radius={[4, 4, 0, 0]} fill={C.red} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...glass, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Excedente Vendido (kWh)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={datosCompraVende}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: C.dim, fontSize: 11 }} />
              <YAxis tick={{ fill: C.dim, fontSize: 11 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="vende" name="Vende" radius={[4, 4, 0, 0]} fill={C.green} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── APARTADO DE USUARIO (User Portal) ───────────────────────────────────────
function UserPortal({
  currentUser,
  viviendas,
  requests,
  setRequests,
  onLogout,
  onSwitchAdmin,
}: {
  currentUser: UserItem
  viviendas: ViviendaItem[]
  requests: EnergyRequest[]
  setRequests: React.Dispatch<React.SetStateAction<EnergyRequest[]>>
  onLogout: () => void
  onSwitchAdmin?: () => void
}) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'pedir' | 'solicitudes' | 'factura'>('resumen')
  
  // Request Form States
  const [kwh, setKwh] = useState('2.5')
  const [motivo, setMotivo] = useState('Aire acondicionado adicional')
  const [prioridad, setPrioridad] = useState<'normal' | 'alta' | 'emergencia'>('normal')
  const [toast, setToast] = useState<string | null>(null)

  const myVivienda = viviendas.find(v => v.id === currentUser.viviendaId) ||
    viviendas.find(v => v.nombre === currentUser.viviendaNombre) ||
    viviendas[0]

  const myRequests = requests.filter(r => r.vivienda === myVivienda?.nombre || r.userId === currentUser.id)

  const triggerToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleCreateEnergyRequest = (e: React.FormEvent) => {
    e.preventDefault()
    const cant = parseFloat(kwh)
    if (isNaN(cant) || cant <= 0) return alert('Por favor ingresa una cantidad de kWh válida.')

    const newReq: EnergyRequest = {
      id: Date.now(),
      userId: currentUser.id,
      vivienda: myVivienda?.nombre || 'Casa Residencial',
      viviendaId: myVivienda?.id || 1,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      energia: cant,
      consumoActual: myVivienda?.consumo || 3.2,
      motivo: motivo || 'Consumo residencial extra',
      prioridad,
      estado: 'pendiente',
      costo: parseFloat((cant * 0.14).toFixed(2)),
    }

    setRequests(prev => [newReq, ...prev])
    setMotivo('')
    setActiveTab('solicitudes')
    triggerToast(`⚡ Solicitud enviada al Administrador: ${cant} kWh. Recibirás respuesta en breve.`)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header style={{
        height: 70, borderBottom: `1px solid ${C.border}`, background: 'rgba(6,14,30,0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, background: `linear-gradient(135deg, ${C.amber}, ${C.blue})`,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sun size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
              SOLAR<span style={{ color: C.blue }}>SMART</span>
            </span>
            <span style={{ fontSize: 11, color: C.green, marginLeft: 8, fontWeight: 600, background: `${C.green}18`, padding: '2px 8px', borderRadius: 10 }}>
              Portal Residencial
            </span>
          </div>
        </div>

        {/* User Info & Switch Admin toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {onSwitchAdmin && (
            <button
              onClick={onSwitchAdmin}
              style={{
                background: 'rgba(139,92,246,0.15)', border: `1px solid ${C.purple}40`,
                color: C.purple, padding: '7px 14px', borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Shield size={15} /> Modo Administrador
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20, border: `1px solid ${C.border}` }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: C.blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13
            }}>
              {currentUser.nombre.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{currentUser.nombre}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{myVivienda?.nombre}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.muted, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <EyeOff size={16} /> Salir
          </button>
        </div>
      </header>

      {/* Main Portal Body */}
      <div style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        
        {toast && (
          <div style={{
            padding: '14px 20px', background: `${C.green}20`, border: `1px solid ${C.green}50`,
            borderRadius: 10, color: C.green, fontSize: 14, fontWeight: 600, marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <CheckCircle size={18} />
            {toast}
          </div>
        )}

        {/* Greeting Banner */}
        <div style={{
          ...glassPanel, padding: '24px 32px', marginBottom: 28,
          background: `radial-gradient(ellipse at 80% 50%, rgba(37,99,235,0.15) 0%, ${C.panel} 70%)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>
              Hola, {currentUser.nombre} 👋
            </h1>
            <p style={{ margin: '6px 0 0', color: C.muted, fontSize: 14 }}>
              Apartado de Residente para <strong style={{ color: C.blueLight }}>{myVivienda?.nombre}</strong> · Panel fotovoltaico: {myVivienda?.panel}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('pedir')}
            style={{
              background: `linear-gradient(135deg, ${C.amber}, #d97706)`,
              color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: `0 4px 16px ${C.amber}40`
            }}
          >
            <Zap size={18} /> Pedir Energía Adicional
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 16, marginBottom: 28 }}>
          {[
            { id: 'resumen', label: '⚡ Estado de Mi Vivienda' },
            { id: 'pedir', label: '➕ Pedir Energía' },
            { id: 'solicitudes', label: `📋 Mis Solicitudes (${myRequests.length})` },
            { id: 'factura', label: '📄 Mi Factura y Consumo' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                background: activeTab === t.id ? `${C.blue}25` : 'transparent',
                color: activeTab === t.id ? C.blueLight : C.muted,
                border: activeTab === t.id ? `1px solid ${C.blue}50` : '1px solid transparent',
                borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: RESUMEN DE LA VIVIENDA */}
        {activeTab === 'resumen' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              <StatCard icon={<Zap size={20} />} label="Consumo Actual" value={`${myVivienda?.consumo} kW`} sub="Medido en tiempo real" color={C.blue} />
              <StatCard icon={<Sun size={20} />} label="Energía Disponible" value={`${myVivienda?.disponible} kWh`} sub={`Proveniente de ${myVivienda?.panel}`} color={C.amber} />
              <StatCard icon={<Battery size={20} />} label="Batería Residual" value={`${myVivienda?.bateria}%`} sub={myVivienda?.charging ? '⚡ Recargando...' : 'Nivel de respaldo'} color={myVivienda?.bateria && myVivienda.bateria < 30 ? C.red : C.green} />
              <StatCard icon={<DollarSign size={20} />} label="Extra Asignado" value={`${myVivienda?.extraAsignado} kWh`} sub="Aprobado por Admin" color={C.purple} />
            </div>

            <div style={{ ...glassPanel, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Monitoreo Energético del Hogar</h3>
                  <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 13 }}>Estado de carga de la batería fotovoltaica comunitaria</p>
                </div>
                <Badge estado={myVivienda?.estado || 'normal'} />
              </div>

              <div style={{ width: '100%', height: 16, background: 'rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden', padding: 2 }}>
                <div style={{
                  width: `${myVivienda?.bateria}%`, height: '100%',
                  background: `linear-gradient(90deg, ${C.blue}, ${C.green})`,
                  borderRadius: 6, transition: 'width 0.6s ease'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginTop: 8 }}>
                <span>0% (Agotada)</span>
                <span style={{ fontWeight: 700, color: C.text }}>{myVivienda?.bateria}% Carga disponible</span>
                <span>100% (Capacidad máxima)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PEDIR ENERGÍA */}
        {activeTab === 'pedir' && (
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            <div style={{ ...glassPanel, padding: 32 }}>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <div style={{
                  width: 54, height: 54, background: `linear-gradient(135deg, ${C.amber}, ${C.blue})`,
                  borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
                }}>
                  <Zap size={28} color="#fff" />
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Solicitud de Energía Adicional</h2>
                <p style={{ margin: '6px 0 0', color: C.muted, fontSize: 14 }}>
                  Las solicitudes se envían directamente al Administrador para su aprobación y redistribución solar.
                </p>
              </div>

              <form onSubmit={handleCreateEnergyRequest} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 8 }}>
                    Cantidad requerida (kWh)
                  </label>
                  <input
                    type="number" step="0.5" min="0.5" max="20"
                    value={kwh} onChange={e => setKwh(e.target.value)}
                    required
                    style={{ width: '100%', padding: '14px 16px', ...glass, color: C.text, fontSize: 18, fontWeight: 700 }}
                  />
                  <span style={{ fontSize: 12, color: C.muted, marginTop: 4, display: 'block' }}>
                    Costo estimado: ${(parseFloat(kwh || '0') * 0.14).toFixed(2)} USD (Tarifa: $0.14 / kWh)
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 8 }}>
                    Motivo o Justificación del Consumo
                  </label>
                  <input
                    value={motivo} onChange={e => setMotivo(e.target.value)}
                    placeholder="ej. Recarga de vehículo eléctrico / Climatización"
                    required
                    style={{ width: '100%', padding: '12px 16px', ...glass, color: C.text, fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 8 }}>
                    Nivel de Prioridad
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {(['normal', 'alta', 'emergencia'] as const).map(p => (
                      <button
                        key={p} type="button" onClick={() => setPrioridad(p)}
                        style={{
                          background: prioridad === p ? (p === 'emergencia' ? C.red : p === 'alta' ? C.amber : C.blue) : 'rgba(255,255,255,0.04)',
                          color: prioridad === p ? '#fff' : C.muted,
                          border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600,
                          cursor: 'pointer', textTransform: 'capitalize'
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${C.green}, #16a34a)`,
                    color: '#fff', border: 'none', borderRadius: 10, padding: '16px',
                    fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 10,
                    boxShadow: `0 4px 18px ${C.green}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <Send size={18} /> Enviar Petición al Administrador
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: MIS SOLICITUDES */}
        {activeTab === 'solicitudes' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Historial de Solicitudes</h2>
              <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>
                Revisa el estado en tiempo real de tus peticiones de energía
              </p>
            </div>

            <div style={{ ...glass, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {['Fecha & Hora', 'Energía Pedida', 'Motivo', 'Prioridad', 'Estado', 'Respuesta / Asignación'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: C.dim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 28, textAlign: 'center', color: C.muted }}>Aún no has realizado solicitudes de energía.</td>
                    </tr>
                  ) : (
                    myRequests.map(r => (
                      <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '14px 18px', color: C.muted }}>{r.fecha} {r.hora}</td>
                        <td style={{ padding: '14px 18px', color: C.amber, fontWeight: 700, fontSize: 14 }}>{r.energia} kWh</td>
                        <td style={{ padding: '14px 18px', color: C.text }}>{r.motivo}</td>
                        <td style={{ padding: '14px 18px', textTransform: 'capitalize', fontWeight: 600, color: r.prioridad === 'emergencia' ? C.red : r.prioridad === 'alta' ? C.amber : C.muted }}>{r.prioridad || 'normal'}</td>
                        <td style={{ padding: '14px 18px' }}><Badge estado={r.estado} /></td>
                        <td style={{ padding: '14px 18px', color: C.muted }}>
                          {r.estado === 'aprobada' ? (
                            <span style={{ color: C.green, fontWeight: 600 }}>✅ Energía acreditada ({r.asignado || 'Red Solar'})</span>
                          ) : r.estado === 'rechazada' ? (
                            <span style={{ color: C.red }}>❌ Solicitud denegada por administración</span>
                          ) : (
                            <span style={{ color: C.amber }}>⏳ En revisión por el Administrador</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MI FACTURA */}
        {activeTab === 'factura' && (
          <div style={{ ...glassPanel, padding: 28 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800 }}>Resumen de Consumo & Facturación</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Total Extra Asignado este mes</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.amber }}>{myVivienda?.extraAsignado} kWh</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Costo Total Estimado</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.green }}>${((myVivienda?.extraAsignado || 0) * 0.14).toFixed(2)} USD</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Main App Container (Admin View) ─────────────────────────────────────────
type Page = 'dashboard' | 'viviendas' | 'paneles' | 'sensores' | 'solicitudes' | 'usuarios' | 'facturacion' | 'notificaciones' | 'reportes'

const NAV_ITEMS: { key: Page; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { key: 'viviendas', label: 'Viviendas', icon: <Home size={18} /> },
  { key: 'paneles', label: 'Paneles Solares', icon: <Sun size={18} /> },
  { key: 'sensores', label: 'Sensores IoT', icon: <Activity size={18} /> },
  { key: 'solicitudes', label: 'Solicitudes de Energía', icon: <FileText size={18} /> },
  { key: 'usuarios', label: 'Gestión de Usuarios', icon: <Users size={18} /> },
  { key: 'facturacion', label: 'Facturación', icon: <DollarSign size={18} /> },
  { key: 'notificaciones', label: 'Notificaciones', icon: <Bell size={18} /> },
  { key: 'reportes', label: 'Reportes', icon: <BarChart2 size={18} /> },
]

function MainApp({
  currentUser,
  users,
  setUsers,
  viviendas,
  setViviendas,
  paneles,
  setPaneles,
  requests,
  setRequests,
  onLogout,
  onSwitchUserPortal,
}: {
  currentUser: UserItem
  users: UserItem[]
  setUsers: React.Dispatch<React.SetStateAction<UserItem[]>>
  viviendas: ViviendaItem[]
  setViviendas: React.Dispatch<React.SetStateAction<ViviendaItem[]>>
  paneles: PanelItem[]
  setPaneles: React.Dispatch<React.SetStateAction<PanelItem[]>>
  requests: EnergyRequest[]
  setRequests: React.Dispatch<React.SetStateAction<EnergyRequest[]>>
  onLogout: () => void
  onSwitchUserPortal?: () => void
}) {
  const [page, setPage] = useState<Page>('dashboard')
  const [collapsed, setCollapsed] = useState(false)

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
      eolicaPotencia: 0,
      tieneEolica: false,
    }

    setViviendas(prev => [...prev, newVivienda])
    setPaneles(prev => [...prev, newPanel])
  }

  const handleDeleteViviendaPanel = (id: number) => {
    const targetVivienda = viviendas.find(v => v.id === id)
    if (!targetVivienda) return

    const targetPanelNombre = targetVivienda.panel

    setViviendas(prev => prev.filter(v => v.id !== id))
    setPaneles(prev => prev.filter(p => p.nombre !== targetPanelNombre && p.asignadoA !== targetVivienda.nombre))
  }

  const handleAddEolica = (viviendaId: number, potencia: number) => {
    setViviendas(prev =>
      prev.map(v =>
        v.id === viviendaId
          ? { ...v, eolicaPotencia: potencia, tieneEolica: true }
          : v
      )
    )
  }

  const handleAssignEnergyFromPanel = (panelId: string, kwh: number, viviendaId: number) => {
    setPaneles(prev => prev.map(p => p.id === panelId ? { ...p, disponible: Math.max(0, parseFloat((p.disponible - kwh).toFixed(2))) } : p))
    const targetV = viviendas.find(v => v.id === viviendaId)
    const startBateria = targetV ? targetV.bateria : 0
    const limite = targetV ? Math.max(0.1, targetV.limite) : 1

    setViviendas(prev => prev.map(v => v.id === viviendaId ? { ...v, disponible: parseFloat((v.disponible + kwh).toFixed(2)), extraAsignado: parseFloat((v.extraAsignado + kwh).toFixed(2)) } : v))

    const deltaPercent = Math.round((kwh / limite) * 100)
    const targetBateria = Math.min(100, startBateria + deltaPercent)

    setViviendas(prev => prev.map(v => v.id === viviendaId ? { ...v, charging: true } : v))
    if (targetBateria > startBateria) {
      const steps = Math.max(1, targetBateria - startBateria)
      let stepCount = 0
      const iv = setInterval(() => {
        stepCount++
        setViviendas(prev => prev.map(v => v.id === viviendaId ? { ...v, bateria: Math.min(targetBateria, startBateria + stepCount) } : v))
        if (stepCount >= steps) {
          clearInterval(iv)
          setTimeout(() => setViviendas(prev => prev.map(v => v.id === viviendaId ? { ...v, charging: false } : v)), 600)
        }
      }, 60)
    } else {
      setTimeout(() => setViviendas(prev => prev.map(v => v.id === viviendaId ? { ...v, charging: false } : v)), 800)
    }
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
            onAddEolica={handleAddEolica}
            onAssignEnergy={handleAssignEnergyFromPanel}
            requests={requests}
            setRequests={setRequests}
          />
        )
      case 'viviendas':
        return (
          <Viviendas
            viviendas={viviendas}
            onAddViviendaPanel={handleAddViviendaPanel}
            onDeleteViviendaPanel={handleDeleteViviendaPanel}
          />
        )
      case 'paneles':
        return <PanelesSolares paneles={paneles} viviendas={viviendas} />
      case 'sensores':
        return <SensoresIoT viviendas={viviendas} />
      case 'solicitudes':
        return (
          <Solicitudes
            viviendas={viviendas}
            paneles={paneles}
            requests={requests}
            setRequests={setRequests}
            onAssignEnergy={handleAssignEnergyFromPanel}
          />
        )
      case 'usuarios':
        return <GestionUsuarios users={users} setUsers={setUsers} viviendas={viviendas} />
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
        {/* Brand */}
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', borderBottom: `1px solid ${C.border}`
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, background: `linear-gradient(135deg, ${C.amber}, ${C.blue})`,
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Sun size={18} color="#fff" />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>
                SOLAR<span style={{ color: C.blue }}>SMART</span>
              </span>
            </div>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', color: C.muted, cursor: 'pointer'
              }}
            >
              <Sun size={22} color={C.amber} />
            </button>
          )}
        </div>

        {/* User Info Header in Sidebar */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={14} /> {currentUser.nombre}
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>Administrador Principal</div>
          </div>
        )}

        {/* Nav Items */}
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

        {/* Bottom Switch Portal & Logout */}
        <div style={{ padding: '12px 8px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {onSwitchUserPortal && !collapsed && (
            <button
              onClick={onSwitchUserPortal}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.green}40`,
                background: 'rgba(34,197,94,0.1)', color: C.green, cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}
            >
              <User size={15} /> Ver Portal Usuario
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 12, padding: '10px 14px', borderRadius: 8, border: 'none',
              background: 'transparent', color: C.dim, cursor: 'pointer', fontSize: 14,
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Contraer menú</span>}
          </button>

          <button onClick={onLogout} title="Cerrar sesión" style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12, padding: '10px 14px', borderRadius: 8, border: 'none',
            background: 'transparent', color: C.dim, cursor: 'pointer', fontSize: 14,
          }}>
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
              style={{
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '8px', color: C.text, cursor: 'pointer'
              }}
            >
              <Menu size={18} />
            </button>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>
              {NAV_ITEMS.find(n => n.key === page)?.label}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
            <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Modo Administrador En Línea</span>
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

// ─── Root Component ──────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS)
  const [viviendas, setViviendas] = useState<ViviendaItem[]>(INITIAL_VIVIENDAS)
  const [paneles, setPaneles] = useState<PanelItem[]>(INITIAL_PANELES)
  const [requests, setRequests] = useState<EnergyRequest[]>(INITIAL_SOLICITUDES)
  
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null)
  const [viewModeOverride, setViewModeOverride] = useState<'admin' | 'usuario' | null>(null)

  if (!currentUser) {
    return <LoginPage users={users} onLogin={(user) => { setCurrentUser(user); setViewModeOverride(null) }} />
  }

  const effectiveRole = viewModeOverride || currentUser.rol

  if (effectiveRole === 'usuario') {
    return (
      <UserPortal
        currentUser={currentUser}
        viviendas={viviendas}
        requests={requests}
        setRequests={setRequests}
        onLogout={() => { setCurrentUser(null); setViewModeOverride(null) }}
        onSwitchAdmin={currentUser.rol === 'admin' ? () => setViewModeOverride('admin') : undefined}
      />
    )
  }

  return (
    <MainApp
      currentUser={currentUser}
      users={users}
      setUsers={setUsers}
      viviendas={viviendas}
      setViviendas={setViviendas}
      paneles={paneles}
      setPaneles={setPaneles}
      requests={requests}
      setRequests={setRequests}
      onLogout={() => { setCurrentUser(null); setViewModeOverride(null) }}
      onSwitchUserPortal={() => setViewModeOverride('usuario')}
    />
  )
}
