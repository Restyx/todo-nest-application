import { IsNotEmpty, IsEmail, MinLength, MaxLength, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(64)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  password: string;
}
