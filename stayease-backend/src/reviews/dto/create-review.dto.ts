import { IsInt, IsString, IsUUID, Max, Min, IsOptional, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  booking_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MinLength(5)
  comment?: string;
}
