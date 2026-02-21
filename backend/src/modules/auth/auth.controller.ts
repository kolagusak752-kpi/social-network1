import { Controller, Get, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

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
        const user =  await this.authService.login(dto)
        return user
    }
}