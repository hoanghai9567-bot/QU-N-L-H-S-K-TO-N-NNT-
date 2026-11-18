import React, { useState } from 'react';
import { DocumentType, DocumentHandover } from '../types';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HandoverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DocumentHandover, 'id' | 'status' | 'submittedAt'>) => void;
}

export const HandoverForm = ({ isOpen, onClose, onSubmit }: HandoverFormProps) => {
  const [title, setTitle] = useState('');
  const [sender, setSender] = useState('');
  const [type, setType] = useState<DocumentType>(DocumentType.INVOICE);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, sender, type, priority, notes });
    setTitle('');
    setSender('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-[#111111] w-full max-w-lg border border-[#262626] shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-[#262626] bg-[#0d0d0d] flex items-center justify-between">
              <h2 className="text-xl font-serif italic text-white">Tạo Lệnh Giao Nhận</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-sm transition-colors group">
                <X size={18} className="text-[#555] group-hover:text-white" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2 font-bold">Tên hồ sơ / Nội dung</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Hóa đơn điện tháng 04..."
                  className="w-full bg-[#111111] px-4 py-3 border border-[#262626] text-white text-sm focus:border-[#d4af37] outline-none transition-all placeholder:text-[#333]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2 font-bold">Người bàn giao</label>
                  <input
                    required
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Họ tên - Phòng ban"
                    className="w-full bg-[#111111] px-4 py-3 border border-[#262626] text-white text-sm focus:border-[#d4af37] outline-none transition-all placeholder:text-[#333]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2 font-bold">Loại hồ sơ</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DocumentType)}
                    className="w-full bg-[#111111] px-4 py-3 border border-[#262626] text-white text-sm focus:border-[#d4af37] outline-none transition-all appearance-none"
                  >
                    <option value={DocumentType.INVOICE}>Hóa đơn</option>
                    <option value={DocumentType.CONTRACT}>Hợp đồng</option>
                    <option value={DocumentType.VOUCHER}>Chứng từ</option>
                    <option value={DocumentType.OTHER}>Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2 font-bold">Độ ưu tiên</label>
                <div className="flex gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                        priority === p
                          ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5'
                          : 'border-[#262626] text-[#555] hover:border-[#333]'
                      }`}
                    >
                      {p === 'LOW' ? 'Thấp' : p === 'MEDIUM' ? 'Thường' : 'Khẩn'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2 font-bold">Ghi chú thêm</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#111111] px-4 py-3 border border-[#262626] text-white text-sm focus:border-[#d4af37] outline-none transition-all placeholder:text-[#333]"
                  placeholder="Yêu cầu cụ thể..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="dark-btn-primary w-full py-4 flex items-center justify-center gap-2 group"
              >
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Khởi tạo bàn giao
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
