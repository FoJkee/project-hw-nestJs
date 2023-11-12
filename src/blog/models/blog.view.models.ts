import { randomUUID } from 'crypto';

export class BlogViewModels {
  constructor(
    public id: string = randomUUID(),
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string = new Date().toISOString(),
    public isMembership: boolean,
  ) {}
}
