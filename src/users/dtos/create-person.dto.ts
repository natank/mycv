import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PersonalDetailsDto } from './personalDetails.dto';
export class CreatePersonReqDto {
  @Expose()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonalDetailsDto)
  // Nested fields are not exposed automatically,
  // a field should have at least one class-validator decorator to be visible
  personalDetails: PersonalDetailsDto;
}
