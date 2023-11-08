import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Test } from '@nestjs/testing';

describe('BlogController', () => {
  let blogController: BlogController;
  let blogService: BlogService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [BlogService],
    }).compile();
  });
});
