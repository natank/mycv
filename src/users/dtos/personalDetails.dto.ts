import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
export class PersonalDetailsDto {
  // Nested fields are not exposed automatically,
  // a field should have at least one class-validator decorator to be visible
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  city: string;
}
