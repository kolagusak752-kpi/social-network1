import { Controller, Get, Post, Body, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Get("/")
    hello() {
        console.log("hello")
    }

    @Post("register")
    async register(@Body() dto:RegisterDto) {
        const user = await this.authService.register(dto)
        return user
    }
    @Post("login")
    async login(@Body() dto:LoginDto) {
        const user = await this.authService.login(dto)
        return user
    }
    @HttpCode(200)
    @Post("refreshtokens")
    getNewTokens(@Body() dto: RefreshDto) {
        return this.authService.updateTokens(dto)
    }

    @Post("logout")
    logout(@Body() dto: RefreshDto) {
        return this.authService.logout(dto)
    }
}