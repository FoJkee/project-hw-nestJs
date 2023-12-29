import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(protected testingService: TestingService) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAll(): Promise<boolean> {
    return this.testingService.deleteAll();
  }
}
