import { DocumentHandover, STATUS_LABELS, TYPE_LABELS, DocumentStatus } from '../types';
import { Calendar, User, Trash2, CheckCircle, Clock, ChevronRight, ShieldCheck, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HandoverTableProps {
  handovers: DocumentHandover[];
  onStatusChange: (id: string, status: DocumentStatus) => void;
  onDelete: (id: string) => void;
}

export const HandoverTable = ({ handovers, onStatusChange, onDelete }: HandoverTableProps) => {
  
  const getNextAction = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.SUBMITTED:
        return { label: 'Tiếp nhận', icon: Clock, next: DocumentStatus.RECEIVED, color: 'text-blue-500 hover:bg-blue-500/10' };
      case DocumentStatus.RECEIVED:
        return { label: 'Xử lý', icon: ChevronRight, next: DocumentStatus.PROCESSING, color: 'text-indigo-500 hover:bg-indigo-500/10' };
      case DocumentStatus.PROCESSING:
        return { label: 'Trình KTT', icon: ShieldCheck, next: DocumentStatus.CHIEF_APPROVAL, color: 'text-purple-500 hover:bg-purple-500/10' };
      case DocumentStatus.CHIEF_APPROVAL:
        return { label: 'Phê duyệt', icon: CheckCircle, next: DocumentStatus.RETURN_TO_STAFF, color: 'text-emerald-500 hover:bg-emerald-500/10' };
      case DocumentStatus.RETURN_TO_STAFF:
        return { label: 'Trả bản cứng', icon: Undo2, next: DocumentStatus.COMPLETED, color: 'text-pink-500 hover:bg-pink-500/10' };
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#111111] border border-[#262626] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="dark-table-header">
              <th className="px-6 py-4">Mã / Hồ sơ</th>
              <th className="px-6 py-4">Luận chuyển</th>
              <th className="px-6 py-4">Thời gian Nhận</th>
              <th className="px-6 py-4">Thời gian Xử lý</th>
              <th className="px-6 py-4">KPI Xử lý</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Phê duyệt / Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {handovers.map((item, index) => {
              const action = getNextAction(item.status);
              const processingTime = item.receivedAt && item.processedAt 
                ? formatDuration(item.receivedAt, item.processedAt) 
                : null;
              
              return (
                <motion.tr
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id}
                  className="dark-table-row group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[#d4af37] mb-1">#{item.id.toUpperCase()}</span>
                      <span className="text-[#e5e5e5] font-medium line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[#a3a3a3]">
                        <span className="w-10 text-[9px] uppercase text-[#555]">Giao:</span>
                        <span className="text-white">{item.sender.split('-')[0]}</span>
                      </div>
                      {item.receiver && (
                        <div className="flex items-center gap-2 text-[#a3a3a3]">
                          <span className="w-10 text-[9px] uppercase text-[#555]">Nhận:</span>
                          <span className="text-blue-400">{item.receiver.split('-')[0]}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#a3a3a3]">
                    {item.receivedAt ? (
                      <div className="flex flex-col">
                        <span className="text-white">{new Date(item.receivedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-[10px]">{new Date(item.receivedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    ) : '---'}
                  </td>
                  <td className="px-6 py-4 text-[#a3a3a3]">
                    {item.processedAt ? (
                      <div className="flex flex-col">
                        <span className="text-white">{new Date(item.processedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-[10px]">{new Date(item.processedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    ) : '---'}
                  </td>
                  <td className="px-6 py-4">
                    {processingTime ? (
                      <span className="px-2 py-1 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 rounded-sm font-mono font-bold">
                        {processingTime}
                      </span>
                    ) : (
                      <span className="text-[#333]">Chưa hoàn tất</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-bold ${STATUS_LABELS[item.status].bg} ${STATUS_LABELS[item.status].color}`}>
                      ● {STATUS_LABELS[item.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {action && (
                        <button 
                          onClick={() => onStatusChange(item.id, action.next)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-transparent transition-all ${action.color} border-current/20 active:scale-95`}
                        >
                          <action.icon size={14} />
                          <span className="uppercase tracking-widest text-[9px] font-bold">{action.label}</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-[#555] hover:text-rose-500 hover:bg-rose-500/10 rounded-sm transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
            {handovers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-[#555] italic font-serif">
                  Không tìm thấy hồ sơ nào trong danh mục này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
