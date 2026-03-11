import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { ConfigService } from "@nestjs/config";

// Tạo strategy để xác thực token với tên là jwt
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findOneByUserName(payload.username);

        if (!user || !user.IsActive) {
            throw new UnauthorizedException("Tài khoản không hợp lệ hoặc đã bị khóa");
        }

        return {
            Id: user.Id,
            Username: user.Username,
            RoleId: user.RoleId,
        };
    }
}