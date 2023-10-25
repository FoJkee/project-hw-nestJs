import { Blog } from './blog.schema';

export class BlogViewModels {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  constructor(BlogView: Blog) {
    this.id = BlogView.id;
    this.name = BlogView.name;
    this.description = BlogView.description;
    this.websiteUrl = BlogView.websiteUrl;
    this.createdAt = BlogView.createdAt;
    this.isMembership = BlogView.isMembership;
  }
}
