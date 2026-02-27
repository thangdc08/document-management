export enum DocumentAction {
  CREATE = 'CREATE',               // Tạo mới → DRAFT
  SUBMIT = 'SUBMIT',               // Gửi → SUBMITTED
  ASSIGN = 'ASSIGN',               // Giao xử lý → ASSIGNED
  START_PROCESS = 'START_PROCESS', // Bắt đầu xử lý → IN_PROCESS
  APPROVE = 'APPROVE',             // Duyệt → APPROVED
  COMPLETE = 'COMPLETE',           // Hoàn thành → COMPLETED
  FAIL = 'FAIL',                   // Thất bại → FAILED
  REJECT = 'REJECT',               // Từ chối → REJECTED
  CLOSE = 'CLOSE',                 // Đóng hồ sơ → CLOSED
  UPDATE = 'UPDATE',               // Chỉnh sửa nội dung (không đổi status)
  DELETE = 'DELETE',               // Xóa (soft delete)
}