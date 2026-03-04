import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  ShieldAlert, 
  Calendar, 
  Plus, 
  Search, 
  LayoutDashboard, 
  ChevronRight,
  Menu,
  X,
  HeartPulse,
  Baby,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityMember, Program, ViolenceReport, DashboardStats } from './types';

type View = 'public' | 'admin';
type Tab = 'dashboard' | 'community' | 'programs' | 'reports' | 'family-planning';

export default function App() {
  const [view, setView] = useState<View>('public');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({ communityCount: 0, programCount: 0, reportCount: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  if (view === 'public') {
    return <LandingPage onAdminLogin={() => setView('admin')} stats={stats} />;
  }

  const NavItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold text-lg tracking-tight">DP3AP2KB</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="community" icon={Users} label="Data Masyarakat" />
          <NavItem id="programs" icon={Calendar} label="Program Kerja" />
          <NavItem id="reports" icon={ShieldAlert} label="Laporan Kekerasan" />
          <NavItem id="family-planning" icon={HeartPulse} label="Keluarga Berencana" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setView('public')}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all mb-4"
          >
            <X size={18} />
            <span className={!isSidebarOpen ? 'hidden' : ''}>Keluar Admin</span>
          </button>
          <div className={`flex items-center gap-3 px-4 py-2 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin Tolikara</span>
                <span className="text-xs text-slate-500">Petugas Dinas</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">
            {activeTab === 'dashboard' && 'Ringkasan Sistem'}
            {activeTab === 'community' && 'Manajemen Data Masyarakat'}
            {activeTab === 'programs' && 'Agenda Program Kerja'}
            {activeTab === 'reports' && 'Pusat Laporan Kekerasan'}
            {activeTab === 'family-planning' && 'Layanan KB & Stunting'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'community' && <CommunityModule />}
            {activeTab === 'programs' && <ProgramsModule />}
            {activeTab === 'reports' && <ReportsModule />}
            {activeTab === 'family-planning' && <FamilyPlanningModule />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Dashboard({ stats }: { stats: DashboardStats }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Masyarakat" 
          value={stats.communityCount} 
          icon={Users} 
          color="bg-blue-500" 
          trend="+12% dari bulan lalu"
        />
        <StatCard 
          title="Program Berjalan" 
          value={stats.programCount} 
          icon={Calendar} 
          color="bg-emerald-500" 
          trend="4 agenda minggu ini"
        />
        <StatCard 
          title="Laporan Masuk" 
          value={stats.reportCount} 
          icon={ShieldAlert} 
          color="bg-rose-500" 
          trend="2 perlu penanganan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-600" />
            Program Kerja Utama
          </h3>
          <div className="space-y-4">
            {['Pengarusutamaan Gender (PUG)', 'Pemenuhan Hak Anak (PHA)', 'Gerakan Orang Tua Asuh (GENTING)', 'Sosialisasi Stunting'].map((prog, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium">{prog}</span>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Aktif</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Status Validasi Data
          </h3>
          <div className="flex items-center justify-center py-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-emerald-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">75%</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Data Valid</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center">Tingkatkan validasi data melalui penyuluhan langsung ke masyarakat.</p>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h4 className="text-3xl font-bold">{value}</h4>
        </div>
        <div className={`${color} p-3 rounded-xl text-white`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
        <ChevronRight size={14} className="text-emerald-500" />
        {trend}
      </div>
    </div>
  );
}

function CommunityModule() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', nik: '', address: '', phone: '', gender: 'Perempuan', birth_date: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch('/api/community');
    const data = await res.json();
    setMembers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowForm(false);
      fetchMembers();
      setFormData({ name: '', nik: '', address: '', phone: '', gender: 'Perempuan', birth_date: '' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Masyarakat</h2>
          <p className="text-slate-500">Kelola informasi kependudukan terintegrasi.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <UserPlus size={18} />
          Tambah Data
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Input Data Baru</h3>
              <button onClick={() => setShowForm(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">NIK</label>
                <input required value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2 border rounded-lg">
                    <option>Perempuan</option>
                    <option>Laki-laki</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tgl Lahir</label>
                  <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded-lg" rows={2} />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">Simpan Data</button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">NIK</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Gender</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Alamat</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium">{m.name}</td>
                <td className="px-6 py-4 text-slate-500 font-mono text-sm">{m.nik}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${m.gender === 'Perempuan' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                    {m.gender}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-[200px]">{m.address}</td>
                <td className="px-6 py-4">
                  <button className="text-emerald-600 hover:underline text-sm font-bold">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ProgramsModule() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'PUG' as any, description: '', date: '', location: '' });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const res = await fetch('/api/programs');
    const data = await res.json();
    setPrograms(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowForm(false);
      fetchPrograms();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agenda Program Kerja</h2>
          <p className="text-slate-500">Pantau pelaksanaan program PUG, PHA, GENTING, dan Stunting.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          Buat Agenda
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Agenda Baru</h3>
              <button onClick={() => setShowForm(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Kegiatan</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full p-2 border rounded-lg">
                  <option value="PUG">Pengarusutamaan Gender (PUG)</option>
                  <option value="PHA">Pemenuhan Hak Anak (PHA)</option>
                  <option value="GENTING">Gerakan Orang Tua Asuh (GENTING)</option>
                  <option value="STUNTING">Sosialisasi Stunting</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lokasi</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg" rows={3} />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">Publikasikan Agenda</button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">{p.category}</span>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={12} /> {p.date}</span>
            </div>
            <h4 className="text-lg font-bold mb-2">{p.title}</h4>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-xs font-medium text-slate-400">Lokasi: {p.location}</span>
              <button className="text-emerald-600 text-sm font-bold">Lihat Laporan</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ReportsModule() {
  const [reports, setReports] = useState<ViolenceReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ victim_name: '', reporter_name: '', incident_date: '', description: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await fetch('/api/reports');
    const data = await res.json();
    setReports(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowForm(false);
      fetchReports();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan Kekerasan</h2>
          <p className="text-slate-500">Pusat pengaduan kekerasan terhadap perempuan dan anak.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-700 transition-colors"
        >
          <ShieldAlert size={18} />
          Buat Laporan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Laporan Baru</h3>
              <button onClick={() => setShowForm(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Korban</label>
                <input required value={formData.victim_name} onChange={e => setFormData({...formData, victim_name: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Pelapor</label>
                <input required value={formData.reporter_name} onChange={e => setFormData({...formData, reporter_name: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Kejadian</label>
                <input type="date" value={formData.incident_date} onChange={e => setFormData({...formData, incident_date: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kronologi Singkat</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg" rows={3} />
              </div>
              <button type="submit" className="w-full bg-rose-600 text-white py-2 rounded-lg font-bold">Kirim Laporan</button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="space-y-4">
        {reports.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-6">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">Kasus: {r.victim_name}</h4>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">{r.status}</span>
              </div>
              <p className="text-sm text-slate-500 mb-4">{r.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Pelapor: {r.reporter_name}</span>
                <span>•</span>
                <span>Kejadian: {r.incident_date}</span>
                <span>•</span>
                <span>Dibuat: {new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button className="self-center bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200">
              Tindak Lanjut
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FamilyPlanningModule() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Layanan KB & Stunting</h2>
          <p className="text-slate-500">Penyuluhan alat kontrasepsi dan pencegahan stunting.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <HeartPulse size={32} />
          </div>
          <h3 className="text-xl font-bold mb-4">Penyuluhan Alat Kontrasepsi</h3>
          <p className="text-slate-500 mb-6">Bekerja sama dengan Dinas Kesehatan untuk memberikan edukasi penggunaan alat kontrasepsi yang aman dan efektif bagi keluarga di Tolikara.</p>
          <div className="space-y-3">
            {['Konsultasi IUD', 'Suntik KB', 'Pil Kontrasepsi', 'Implan'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {item}
              </div>
            ))}
          </div>
          <button className="mt-8 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Catat Layanan Baru</button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Baby size={32} />
          </div>
          <h3 className="text-xl font-bold mb-4">Pencegahan Stunting (GENTING)</h3>
          <p className="text-slate-500 mb-6">Gerakan Orang Tua Asuh (GENTING) bertujuan untuk menurunkan angka stunting melalui pendampingan gizi dan pola asuh yang tepat.</p>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-800">Target Penurunan</span>
              <span className="text-sm font-bold text-blue-800">15%</span>
            </div>
            <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[65%]" />
            </div>
          </div>
          <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Lihat Data Balita</button>
        </div>
      </div>
    </motion.div>
  );
}

function LandingPage({ onAdminLogin, stats }: { onAdminLogin: () => void, stats: DashboardStats }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-100">T</div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">DP3AP2KB</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kabupaten Tolikara</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#beranda" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Beranda</a>
            <a href="#program" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Program</a>
            <a href="#statistik" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Statistik</a>
            <a href="#lapor" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Lapor</a>
            <button 
              onClick={onAdminLogin}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Portal Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldAlert size={14} />
              Melindungi & Memberdayakan
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Mewujudkan Keluarga <span className="text-emerald-600">Sejahtera</span> di Tolikara.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Dinas Pemberdayaan Perempuan & Anak Kabupaten Tolikara hadir untuk memberikan perlindungan, 
              pemberdayaan, dan layanan keluarga berencana bagi seluruh masyarakat.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#lapor" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2">
                Buat Laporan Pengaduan
                <ChevronRight size={18} />
              </a>
              <a href="#program" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Lihat Program Kami
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/tolikara/800/1000" 
                alt="Tolikara Community" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[240px]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <span className="text-2xl font-bold">{stats.communityCount}+</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Masyarakat Tolikara telah terdaftar dalam sistem informasi kami.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="statistik" className="bg-slate-900 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-bold text-white">{stats.communityCount}</h3>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Masyarakat Terdata</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-bold text-white">{stats.programCount}</h3>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Program Terlaksana</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-bold text-white">{stats.reportCount}</h3>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Kasus Tertangani</p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="program" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Program Kerja Unggulan</h2>
            <p className="text-slate-600">Fokus kami adalah menciptakan lingkungan yang aman bagi perempuan dan anak serta keluarga yang sehat.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProgramCard 
              icon={Users} 
              title="PUG" 
              desc="Pengarusutamaan Gender untuk kesetaraan hak." 
              color="text-emerald-600" 
              bg="bg-emerald-50" 
            />
            <ProgramCard 
              icon={Baby} 
              title="PHA" 
              desc="Pemenuhan Hak Anak untuk masa depan yang cerah." 
              color="text-blue-600" 
              bg="bg-blue-50" 
            />
            <ProgramCard 
              icon={HeartPulse} 
              title="GENTING" 
              desc="Gerakan Orang Tua Asuh untuk cegah stunting." 
              color="text-rose-600" 
              bg="bg-rose-50" 
            />
            <ProgramCard 
              icon={Calendar} 
              title="Keluarga Berencana" 
              desc="Penyuluhan alat kontrasepsi dan kesehatan ibu." 
              color="text-amber-600" 
              bg="bg-amber-50" 
            />
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section id="lapor" className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[40px] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <h2 className="text-4xl md:text-5xl font-bold text-white relative z-10">Butuh Bantuan atau Ingin Melapor?</h2>
          <p className="text-slate-400 text-lg relative z-10">Kami menjamin kerahasiaan identitas Anda. Tim kami siap mendampingi setiap laporan kekerasan terhadap perempuan dan anak.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
            <button className="w-full md:w-auto bg-rose-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20 flex items-center justify-center gap-3">
              <ShieldAlert size={24} />
              Lapor Sekarang
            </button>
            <div className="text-white font-bold flex flex-col items-center md:items-start">
              <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Hubungi Kami</span>
              <span className="text-xl">0812-XXXX-XXXX</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">DP3AP2KB</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kabupaten Tolikara</span>
            </div>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Kontak</a>
          </div>
          <p className="text-sm text-slate-400">© 2026 DP3AP2KB Kabupaten Tolikara. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function ProgramCard({ icon: Icon, title, desc, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
    >
      <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
        <Icon size={28} />
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}


