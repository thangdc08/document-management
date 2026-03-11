import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

// Tạo guard để xác thực token sử dụng strategy jwt
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    // Kiểm tra xem request có phải là public không
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // getAllAndOverride kiểm tra cả @Public() trên method VÀ trên class/controller
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        // Nếu route không phải public thì gọi AuthGuard('jwt')
        // Guard này sẽ:
        // 1. Lấy JWT từ header Authorization
        // 2. Verify token
        // 3. Gọi JwtStrategy.validate()
        // 4. Nếu hợp lệ thì gắn user vào request
        return super.canActivate(context) as Promise<boolean>;
    }
}
