import { DocumentHandover, DocumentStatus, DocumentType } from './types';

const STORAGE_KEY = 'accounting_handovers_v2';

export const mockData: DocumentHandover[] = [
  {
    id: '1',
    title: 'Hóa đơn tiền điện tháng 3/2024',
    type: DocumentType.INVOICE,
    sender: 'Nguyễn Văn A - Hành chính',
    submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: DocumentStatus.COMPLETED,
    notes: 'Đã thanh toán qua chuyển khoản, trả bản cứng cho kho lưu trữ',
    priority: 'MEDIUM',
    receiver: 'Lê Thị B - Kế toán',
    processedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    returnedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '2',
    title: 'Hợp đồng thuê văn phòng Q2/2024',
    type: DocumentType.CONTRACT,
    sender: 'Trần Thị C - Pháp chế',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: DocumentStatus.CHIEF_APPROVAL,
    notes: 'Đã xử lý số liệu, chờ Kế toán trưởng ký duyệt',
    priority: 'HIGH',
    receiver: 'Lê Thị B - Kế toán',
    processor: 'Phạm Minh H - Kế toán',
    processedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Chứng từ tạm ứng công tác phí - Đoàn X',
    type: DocumentType.VOUCHER,
    sender: 'Phạm Văn D - Kinh doanh',
    submittedAt: new Date().toISOString(),
    status: DocumentStatus.SUBMITTED,
    notes: 'Hồ sơ gốc đính kèm 3 hóa đơn lẻ',
    priority: 'LOW'
  }
];

export const handoverService = {
  getHandovers: (): DocumentHandover[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      return mockData;
    }
    return JSON.parse(stored);
  },

  saveHandover: (handover: DocumentHandover) => {
    const handovers = handoverService.getHandovers();
    const index = handovers.findIndex(h => h.id === handover.id);
    if (index > -1) {
      handovers[index] = handover;
    } else {
      handovers.unshift(handover);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handovers));
  },

  deleteHandover: (id: string) => {
    const handovers = handoverService.getHandovers().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handovers));
  }
};
