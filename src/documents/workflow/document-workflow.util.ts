import { BadRequestException } from '@nestjs/common';
import { DocumentAction } from '../enums/document-action.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export class DocumentWorkflow {
  private static readonly transitions: Record<
    DocumentStatus,
    DocumentAction[]
  > = {
    [DocumentStatus.DRAFT]: [
      DocumentAction.SUBMIT,
      DocumentAction.UPDATE,
      DocumentAction.DELETE,
    ],

    [DocumentStatus.SUBMITTED]: [
      DocumentAction.ASSIGN,
      DocumentAction.REJECT,
      DocumentAction.CLOSE,
    ],

    [DocumentStatus.ASSIGNED]: [
      DocumentAction.START_PROCESS,
      DocumentAction.REJECT,
    ],

    [DocumentStatus.IN_PROCESS]: [
      DocumentAction.APPROVE,
      DocumentAction.FAIL,
    ],

    [DocumentStatus.APPROVED]: [
      DocumentAction.COMPLETE,
      DocumentAction.CLOSE,
    ],

    [DocumentStatus.COMPLETED]: [
      DocumentAction.CLOSE,
    ],

    [DocumentStatus.FAILED]: [
      DocumentAction.ASSIGN,
      DocumentAction.CLOSE,
    ],

    [DocumentStatus.REJECTED]: [
      DocumentAction.UPDATE,
      DocumentAction.SUBMIT,
      DocumentAction.CLOSE,
    ],

    [DocumentStatus.CLOSED]: [],
  };

  static validateTransition(
    current: DocumentStatus,
    action: DocumentAction,
  ) {
    const allowedActions = this.transitions[current];

    if (!allowedActions?.includes(action)) {
      throw new BadRequestException(
        `Cannot ${action} when status is ${current}`,
      );
    }
  }

  static mapActionToStatus(
    action: DocumentAction,
    current: DocumentStatus,
  ): DocumentStatus {
    switch (action) {
      case DocumentAction.CREATE:
        return DocumentStatus.DRAFT;

      case DocumentAction.SUBMIT:
        return DocumentStatus.SUBMITTED;

      case DocumentAction.ASSIGN:
        return DocumentStatus.ASSIGNED;

      case DocumentAction.START_PROCESS:
        return DocumentStatus.IN_PROCESS;

      case DocumentAction.APPROVE:
        return DocumentStatus.APPROVED;

      case DocumentAction.COMPLETE:
        return DocumentStatus.COMPLETED;

      case DocumentAction.FAIL:
        return DocumentStatus.FAILED;

      case DocumentAction.REJECT:
        return DocumentStatus.REJECTED;

      case DocumentAction.CLOSE:
        return DocumentStatus.CLOSED;

      case DocumentAction.UPDATE:
      case DocumentAction.DELETE:
      default:
        return current;
    }
  }
}