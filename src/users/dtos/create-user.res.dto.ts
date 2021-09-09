import { IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  mail: string;

  @IsString()
  pwd: string;
}
