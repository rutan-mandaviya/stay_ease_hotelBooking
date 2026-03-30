
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/user.model';

export class RegisterDto {
  @ApiProperty({ example: 'Guest User', description: 'User full name' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'rutanpatel3@gmail.com',
    description: 'Unique and Real email address',
  })
  @IsEmail({}, { message: 'Provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 'Pass@1234',
    description: 'Min 8 chars, at least 1 letter and 1 number',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.GUEST,
    description: 'User role (Admin is restricted on public signup)',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be admin, hotel_owner, or guest' })
  role?: UserRole;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  phone?: string;
}
