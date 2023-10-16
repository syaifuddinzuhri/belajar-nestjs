import {
  Controller,
  Get,
  Injectable,
  Body,
  Post,
  Response,
  Request,
} from '@nestjs/common';
import { Response as Res, Request as Req } from 'express';
import { LoginDto } from 'src/decorators/login.dto';
import { ResponseSuccess } from 'src/helpers/responses/custom-response-success';
import { AuthService } from 'src/services/admin/auth.service';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Response({ passthrough: true }) res: Res,
    @Request() req: Req,
  ) {
    try {
      const data = await this.authService.login(body, res, req);
      const response = new ResponseSuccess(data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get('profile')
  async profile(@Request() req: Req, @Response({ passthrough: true }) res: Res) {
    try {
      const result = await this.authService.profile(req, res);
      return new ResponseSuccess(result);
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
