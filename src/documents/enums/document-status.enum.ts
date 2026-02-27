export enum DocumentStatus {
  DRAFT = 'DRAFT',               // Soạn thảo
  SUBMITTED = 'SUBMITTED',       // Đã gửi
  ASSIGNED = 'ASSIGNED',         // Đã được giao xử lý
  IN_PROCESS = 'IN_PROCESS',     // Đang xử lý
  APPROVED = 'APPROVED',         // Đã duyệt
  COMPLETED = 'COMPLETED',       // Hoàn thành
  FAILED = 'FAILED',             // Xử lý thất bại
  REJECTED = 'REJECTED',         // Bị từ chối
  CLOSED = 'CLOSED',             // Đóng hồ sơ
}
