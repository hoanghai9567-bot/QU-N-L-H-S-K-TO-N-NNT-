import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FolderOpen,
  PieChart,
  Settings,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { DocumentHandover, DocumentStatus, DocumentType } from './types';
import { StatCard } from './components/StatCard';
import { HandoverTable } from './components/HandoverTable';
import { HandoverForm } from './components/HandoverForm';
import { handoverService } from './services';

export default function App() {
  const [handovers, setHandovers] = useState<DocumentHandover[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');

  useEffect(() => {
    setHandovers(handoverService.getHandovers());
  }, []);

  const stats = useMemo(() => {
    return {
      total: handovers.length,
      waiting: handovers.filter(h => h.status === DocumentStatus.SUBMITTED).length,
      needApproval: handovers.filter(h => h.status === DocumentStatus.CHIEF_APPROVAL).length,
      completed: handovers.filter(h => h.status === DocumentStatus.COMPLETED).length,
      avgSpeed: '45 phút', // Mock average for dashboard
    };
  }, [handovers]);

  const filteredHandovers = useMemo(() => {
    return handovers.filter(h => {
      const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           h.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           h.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [handovers, searchTerm, statusFilter]);

  const handleAddHandover = (data: Omit<DocumentHandover, 'id' | 'status' | 'submittedAt'>) => {
    const newHandover: DocumentHandover = {
      ...data,
      id: `DOC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: DocumentStatus.SUBMITTED,
      submittedAt: new Date().toISOString(),
    };
    handoverService.saveHandover(newHandover);
    setHandovers(handoverService.getHandovers());
  };

  const handleStatusChange = (id: string, status: DocumentStatus) => {
    const item = handovers.find(h => h.id === id);
    if (item) {
      const updated = { ...item, status };
      const now = new Date().toISOString();
      
      switch (status) {
        case DocumentStatus.RECEIVED:
          updated.receivedAt = now;
          updated.receiver = 'Lê Thị B - Kế toán';
          break;
        case DocumentStatus.PROCESSING:
          updated.processor = 'Phạm Minh H - Kế toán';
          break;
        case DocumentStatus.CHIEF_APPROVAL:
          updated.processedAt = now;
          break;
        case DocumentStatus.RETURN_TO_STAFF:
          updated.approvedAt = now;
          updated.approver = 'Kế Toán Trưởng';
          break;
        case DocumentStatus.COMPLETED:
          updated.returnedAt = now;
          break;
      }

      handoverService.saveHandover(updated);
      setHandovers(handoverService.getHandovers());
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hành động này sẽ xóa vĩnh viễn hồ sơ. Tiếp tục?')) {
      handoverService.deleteHandover(id);
      setHandovers(handoverService.getHandovers());
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans flex overflow-hidden">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-[#111111] border-r border-[#262626] flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-[#d4af37] flex items-center justify-center text-black font-bold">A</div>
            <h1 className="font-serif italic text-xl tracking-tight text-white">Accounting</h1>
          </div>
          
          <nav className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold">Dashboard</p>
              <div className="sidebar-link active">
                <LayoutDashboard size={16} />
                <span className="text-sm">Hệ Thống Bàn Giao</span>
              </div>
              <div className="sidebar-link">
                <PieChart size={16} />
                <span className="text-sm">Báo Cáo Thống Kê</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold">Phân Loại</p>
              <ul className="space-y-3 text-sm">
                <li className="sidebar-link">Hợp Đồng Mới</li>
                <li className="sidebar-link">Hóa Đơn Đầu Vào</li>
                <li className="sidebar-link">Chứng Từ Thuế</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[#262626] space-y-4">
           <div className="sidebar-link">
            <Settings size={16} />
            <span className="text-sm">Cài Đặt</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/initials/svg?seed=KTT" alt="Admin" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Kế Toán Trưởng</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 border-b border-[#262626] flex items-center justify-between px-10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="font-serif text-2xl text-white">Quy trình Giao nhận Hồ sơ</h2>
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mt-1 font-bold">
              Cập nhật lần cuối: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} Today
            </p>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="dark-btn-primary flex items-center gap-2 group"
          >
            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-500" />
            Tạo Lệnh Bàn Giao
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Stats Grid */}
          <section className="px-10 py-8 grid grid-cols-4 gap-6">
            <StatCard title="Tổng hồ sơ đang lưu hành" value={stats.total} icon={FolderOpen} />
            <StatCard title="Hồ sơ cần tiếp nhận" value={stats.waiting} icon={Clock} />
            <StatCard title="Cần KTT Phê duyệt" value={stats.needApproval} icon={ShieldCheck} isAccent />
            <StatCard title="Tốc độ xử lý TB" value={stats.avgSpeed} icon={PieChart} />
          </section>

          {/* Filters and List */}
          <section className="px-10 pb-12">
            <div className="bg-[#111111] border border-[#262626] flex flex-col">
              <div className="p-6 border-b border-[#262626] bg-[#151515] flex justify-between items-center">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={14} />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm mã hồ sơ, người giao..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#262626] text-xs px-10 py-2.5 focus:border-[#d4af37] outline-none transition-all placeholder:text-[#333]"
                    />
                  </div>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-[#0a0a0a] border border-[#262626] text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 outline-none focus:border-[#d4af37]"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    {Object.values(DocumentStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">Giao dịch hồ sơ gần đây</h3>
              </div>

              <HandoverTable 
                handovers={filteredHandovers} 
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Modal Form */}
      <HandoverForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddHandover}
      />
    </div>
  );
}
