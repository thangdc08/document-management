import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { AuthService } from '../auth.service';

// Implement CanActivate để tạo Guard kiểm tra quyền truy cập.
// Guard này sẽ chạy trước controller và quyết định
// request có được phép truy cập API hay không.
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService, // logic kiểm tra quyền nằm trong Service
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Đọc permission yêu cầu từ @RequiredPermission()
        // getAllAndOverride: kiểm tra cả method-level lẫn class-level
        const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Không có @RequiredPermission → chỉ cần đăng nhập là đủ, cho qua
        if (!requiredPermission) {
            return true;
        }

        // Lấy user từ request (đã được JwtAuthGuard gắn vào trước đó)
        const request = context.switchToHttp().getRequest();
        const user = request.user;


        if (!user) {
            throw new ForbiddenException('Không tìm thấy thông tin người dùng');
        }


        // Kiểm tra quyền/permission
        const hasPermission = await this.authService.hasPermission(user?.RoleId, requiredPermission);

        if (!hasPermission) {
            throw new ForbiddenException(
                `Bạn không có quyền thực hiện hành động này (${requiredPermission})`,
            );
        }

        return true;
    }
}
