import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      Id: user.Id,
      Username: user.Username,
      FullName: user.FullName,
      Email: user.Email,
      RoleId: user.RoleId,
      IsActive: user.IsActive,
      CreatedAt: user.CreatedAt,
    };
  }
}