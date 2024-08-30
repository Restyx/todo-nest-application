import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCardMembershipDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  memberId: number[];
}
