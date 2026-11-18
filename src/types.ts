/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DocumentStatus {
  SUBMITTED = 'SUBMITTED',           // 1. Người giao hồ sơ
  RECEIVED = 'RECEIVED',             // 2. Nhân viên nhận
  PROCESSING = 'PROCESSING',         // 3. Nhân viên xử lý
  CHIEF_APPROVAL = 'CHIEF_APPROVAL', // 4. Kế toán trưởng phê duyệt
  RETURN_TO_STAFF = 'RETURN_TO_STAFF',// 5. Nhân viên nhận lại hồ sơ
  COMPLETED = 'COMPLETED',           // 6. Trả bản cứng (Hoàn tất)
  REJECTED = 'REJECTED'              // Từ chối
}

export enum DocumentType {
  INVOICE = 'INVOICE',
  CONTRACT = 'CONTRACT',
  VOUCHER = 'VOUCHER',
  OTHER = 'OTHER'
}

export interface DocumentHandover {
  id: string;
  title: string;
  type: DocumentType;
  sender: string;
  receiver?: string;
  processor?: string;
  approver?: string;
  submittedAt: string;
  receivedAt?: string;
  processedAt?: string;
  approvedAt?: string;
  returnedAt?: string;
  status: DocumentStatus;
  notes: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const formatDuration = (start?: string, end?: string) => {
  if (!start || !end) return null;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const diffInMinutes = Math.floor((e - s) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes} phút`;
  const hours = Math.floor(diffInMinutes / 60);
  const mins = diffInMinutes % 60;
  return `${hours}h ${mins}m`;
};

export const STATUS_LABELS: Record<DocumentStatus, { label: string; color: string; bg: string }> = {
  [DocumentStatus.SUBMITTED]: { label: 'Chờ nhận', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  [DocumentStatus.RECEIVED]: { label: 'Đã nhận', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  [DocumentStatus.PROCESSING]: { label: 'Đang xử lý', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  [DocumentStatus.CHIEF_APPROVAL]: { label: 'Chờ KTT duyét', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  [DocumentStatus.RETURN_TO_STAFF]: { label: 'Nhận lại hồ sơ', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  [DocumentStatus.COMPLETED]: { label: 'Đã trả bản cứng', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  [DocumentStatus.REJECTED]: { label: 'Từ chối', color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

export const TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.INVOICE]: 'Hóa đơn',
  [DocumentType.CONTRACT]: 'Hợp đồng',
  [DocumentType.VOUCHER]: 'Chứng từ',
  [DocumentType.OTHER]: 'Khác',
};
