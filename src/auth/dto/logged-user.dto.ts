import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoggedUserDto {
  @ApiProperty({ description: 'Идентификатор пользователя', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: 'имя пользователя', example: 'pro100user' })
  @IsNotEmpty()
  @IsString()
  readonly username: string;
}
