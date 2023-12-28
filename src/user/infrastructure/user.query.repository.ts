import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { UserQueryDto } from '../dto/user.query.dto';
import { pagination, PaginationView } from '../../pagination/pagination';
import { UserViewModels } from '../models/user.view.models';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly UserModel: Model<UserDocument>,
  ) {}

  async getUsers(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    const { sortBy, pageSize, pageNumber, sortDirection } =
      pagination(userQueryDto);

    const searchEmailTerm = userQueryDto.searchEmailTerm
      ? userQueryDto.searchEmailTerm.toString()
      : '';
    const searchLoginTerm = userQueryDto.searchLoginTerm
      ? userQueryDto.searchLoginTerm.toString()
      : '';

    const filter: any = {
      $and: [
        { email: { $regex: searchEmailTerm ?? '', $options: 'i' } },

        { login: { $regex: searchLoginTerm ?? '', $options: 'i' } },
      ],
    };
    const users = await this.UserModel.find(filter, {
      _id: 0,
      __v: 0,
      password: 0,
      emailConfirmation: 0,
    })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    const userCountDocument: number =
      await this.UserModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(userCountDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: userCountDocument,
      items: users,
    };
  }
}
