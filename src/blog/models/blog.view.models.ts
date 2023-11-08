import { Types } from 'mongoose';

export class BlogViewModels {
  constructor(
    public id: Types.ObjectId,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}
