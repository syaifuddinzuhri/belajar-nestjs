import { Controller, Get, Post, Body, Response, Request } from '@nestjs/common';
import { LoginWithGoogleDto } from 'src/decorators/login-with-google.dto.';
import { ResponseSuccess } from 'src/helpers/responses/custom-response-success';
import { AuthService } from 'src/services/member/auth.service';
import { Response as Res, Request as Req } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async profile(@Request() req: Req) {
    try {
      const result = await this.authService.profile(req);
      return new ResponseSuccess(result);
    } catch (error) {
      throw error;
    }
  }

  @Post('login-with-google')
  async loginWithGoogle(
    @Body() body: LoginWithGoogleDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    try {
      const result = await this.authService.loginWithGoogle(body, res);
      return new ResponseSuccess(result, 'Login with Google successfully');
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  async logout(@Request() req: Req, @Response({ passthrough: true }) res: Res) {
    try {
      const result = await this.authService.logout(req, res);
      return new ResponseSuccess(result, 'Logout successfully');
    } catch (error) {
      throw error;
    }
  }
}
