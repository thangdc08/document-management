export const PERMISSIONS_SEED = [
    // Documents
    { Code: 'DOC_VIEW', Name: 'Xem danh sách văn bản' },
    { Code: 'DOC_DETAIL', Name: 'Xem chi tiết văn bản' },
    { Code: 'DOC_CREATE', Name: 'Tạo văn bản' },
    { Code: 'DOC_UPDATE', Name: 'Sửa văn bản' },
    { Code: 'DOC_DELETE', Name: 'Xóa văn bản' },
    { Code: 'DOC_WORKFLOW', Name: 'Thực hiện quy trình' },
    { Code: 'DOC_HISTORY', Name: 'Xem lịch sử văn bản' },
    { Code: 'DOC_ALLOWED_ACTIONS', Name: 'Xem hành động cho phép' },
    { Code: 'DOC_UPLOAD', Name: 'Upload file' },

    // Users
    { Code: 'USER_VIEW', Name: 'Xem danh sách người dùng' },
    { Code: 'USER_CREATE', Name: 'Tạo người dùng' },
    { Code: 'USER_DETAIL', Name: 'Xem chi tiết người dùng' },
    { Code: 'USER_UPDATE', Name: 'Sửa người dùng' },
    { Code: 'USER_DELETE', Name: 'Xóa người dùng' },

    // Roles
    { Code: 'ROLE_VIEW', Name: 'Xem danh sách vai trò' },
    { Code: 'ROLE_CREATE', Name: 'Tạo vai trò' },
    { Code: 'ROLE_DETAIL', Name: 'Xem chi tiết vai trò' },
    { Code: 'ROLE_UPDATE', Name: 'Sửa vai trò' },
    { Code: 'ROLE_DELETE', Name: 'Xóa vai trò' },
    { Code: 'ROLE_DEACTIVATE', Name: 'Vô hiệu hóa vai trò' },
    { Code: 'ROLE_ASSIGN_PERMISSIONS', Name: 'Gán quyền cho vai trò' },

    // Permissions
    { Code: 'PERMISSION_VIEW', Name: 'Xem danh sách quyền' },
    { Code: 'PERMISSION_CREATE', Name: 'Tạo quyền' },
    { Code: 'PERMISSION_DETAIL', Name: 'Xem chi tiết quyền' },
    { Code: 'PERMISSION_UPDATE', Name: 'Sửa quyền' },
    { Code: 'PERMISSION_DELETE', Name: 'Xóa quyền' },

    // Document History
    { Code: 'HISTORY_VIEW', Name: 'Xem toàn bộ lịch sử hệ thống' },
    { Code: 'HISTORY_DETAIL', Name: 'Xem chi tiết bản ghi lịch sử' },

    // Admin
    { Code: 'ADMIN_ALL', Name: 'Toàn quyền Admin' },
];

export const ROLE_PERMISSIONS_MAP = {
    ADMIN: ['ADMIN_ALL'],
    VAN_THU: [
        'DOC_VIEW', 'DOC_DETAIL', 'DOC_CREATE', 'DOC_UPDATE', 'DOC_DELETE', 'DOC_HISTORY', 'DOC_UPLOAD',
        'USER_VIEW'
    ],
    GIAM_DOC: [
        'DOC_VIEW', 'DOC_DETAIL', 'DOC_WORKFLOW', 'DOC_HISTORY', 'DOC_ALLOWED_ACTIONS',
        'USER_VIEW', 'ROLE_VIEW'
    ],
    TRUONG_PHONG: [
        'DOC_VIEW', 'DOC_DETAIL', 'DOC_WORKFLOW', 'DOC_HISTORY', 'DOC_ALLOWED_ACTIONS'
    ],
    CAN_BO: [
        'DOC_VIEW', 'DOC_DETAIL', 'DOC_WORKFLOW', 'DOC_HISTORY', 'DOC_ALLOWED_ACTIONS'
    ],
};
