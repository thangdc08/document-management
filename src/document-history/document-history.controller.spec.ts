import { Test, TestingModule } from '@nestjs/testing';
import { DocumentHistoryController } from './document-history.controller';
import { DocumentHistoryService } from './document-history.service';

describe('DocumentHistoryController', () => {
  let controller: DocumentHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentHistoryController],
      providers: [DocumentHistoryService],
    }).compile();

    controller = module.get<DocumentHistoryController>(DocumentHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
