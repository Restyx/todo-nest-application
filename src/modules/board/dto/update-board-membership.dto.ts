import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBoardMembershipDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  memberId: number[];
}
