import { IsEnum, IsString } from 'class-validator';
import { myStatusView } from '../../post/models/post.view.models';

export class Reaction {
  @IsEnum(myStatusView)
  @IsString()
  likeStatus: myStatusView;
}
