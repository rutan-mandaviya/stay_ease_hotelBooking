import { UserRole } from '../../users/user.model';

export class JwtPayloadDto {
  id: string;
  email: string;
  role: UserRole;
}
