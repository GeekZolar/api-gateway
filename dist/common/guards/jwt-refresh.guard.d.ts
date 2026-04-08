declare const JwtRefreshGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtRefreshGuard extends JwtRefreshGuard_base {
    handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser;
}
export {};
