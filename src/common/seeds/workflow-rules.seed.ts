import { DocumentStatus } from "src/documents/enums/document-status.enum";
import { DocumentAction } from "src/documents/enums/document-action.enum";

export const WORKFLOW_RULES_SEED = [
    // (Bắt đầu) -> Văn thư tạo văn bản -> DRAFT
    // DRAFT
    { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.SUBMIT, NextStatus: DocumentStatus.SUBMITTED, RoleCode: 'VAN_THU' },
    { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'VAN_THU' },
    { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'ADMIN' },
    { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.DELETE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'VAN_THU' },
    { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.DELETE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'ADMIN' },

    // SUBMITTED
    { CurrentStatus: DocumentStatus.SUBMITTED, Action: DocumentAction.REJECT, NextStatus: DocumentStatus.REJECTED, RoleCode: 'GIAM_DOC' },
    { CurrentStatus: DocumentStatus.SUBMITTED, Action: DocumentAction.ASSIGN, NextStatus: DocumentStatus.ASSIGNED, RoleCode: 'GIAM_DOC' },

    // REJECTED
    { CurrentStatus: DocumentStatus.REJECTED, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'VAN_THU' },

    // ASSIGNED
    { CurrentStatus: DocumentStatus.ASSIGNED, Action: DocumentAction.ASSIGN, NextStatus: DocumentStatus.ASSIGNED, RoleCode: 'TRUONG_PHONG' },
    { CurrentStatus: DocumentStatus.ASSIGNED, Action: DocumentAction.START_PROCESS, NextStatus: DocumentStatus.IN_PROCESS, RoleCode: 'CAN_BO' },

    // IN_PROCESS
    { CurrentStatus: DocumentStatus.IN_PROCESS, Action: DocumentAction.COMPLETE, NextStatus: DocumentStatus.APPROVED, RoleCode: 'CAN_BO' },
    { CurrentStatus: DocumentStatus.IN_PROCESS, Action: DocumentAction.FAIL, NextStatus: DocumentStatus.FAILED, RoleCode: 'CAN_BO' },

    // APPROVED
    { CurrentStatus: DocumentStatus.APPROVED, Action: DocumentAction.APPROVE, NextStatus: DocumentStatus.COMPLETED, RoleCode: 'GIAM_DOC' },

    // FAILED / COMPLETED
    { CurrentStatus: DocumentStatus.FAILED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'GIAM_DOC' },
    { CurrentStatus: DocumentStatus.FAILED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'ADMIN' },
    { CurrentStatus: DocumentStatus.COMPLETED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'GIAM_DOC' },
    { CurrentStatus: DocumentStatus.COMPLETED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'ADMIN' },
];
