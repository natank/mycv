import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
export class PersonalDetailsDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  age: number;

  @IsString()
  @IsNotEmpty()
  city: string;
}
