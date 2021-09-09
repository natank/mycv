import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  mail: string;

  @IsString()
  @IsOptional()
  pwd: string;
}
