import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TestingService {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async deleteAll(): Promise<boolean> {
    try {
      await this.dataSource.query(`delete from public."users"`);
      return true;
    } catch {
      return false;
    }
  }
}
