import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'rutanpatel3@gmail.com',
    description: 'Registered email address',
  })
  @IsEmail({}, { message: 'Provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 'Pass1234',
    description: 'User password',
    format: 'password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
