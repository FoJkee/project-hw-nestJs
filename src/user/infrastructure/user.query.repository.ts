import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { UserQueryDto } from '../dto/user.query.dto';
import { pagination, PaginationView } from '../../pagination/pagination';
import { UserViewModels } from '../models/user.view.models';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  public async getUsers(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    const { pageSize, pageNumber, sortBy, sortDirection } =
      pagination(userQueryDto);

    const searchEmailTerm = userQueryDto.searchEmailTerm;
    const searchLoginTerm = userQueryDto.searchLoginTerm;

    const filter: any = {};

    if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: 'i' };
    }

    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: 'i' };
    }

    if (searchEmailTerm && searchLoginTerm) {
      filter.$or = [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ];
    }

    const users = await this.UserModel.find(filter, {
      _id: 0,
      __v: 0,
      passwordHash: 0,
      emailConfirmation: 0,
    })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    const userCountDocument = await this.UserModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(userCountDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: userCountDocument,
      items: users,
    };
  }
}
