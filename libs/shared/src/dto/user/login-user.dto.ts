import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Имя пользователя для входа в систему',
    example: 'pro100user',
    minLength: 8,
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  username: string;

  @ApiProperty({
    description: 'Пароль для входа в систему',
    example: 'Aw13Ers!k',
    minLength: 8,
    maxLength: 256,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  password: string;
}
