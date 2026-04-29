import {
  All,
  Controller,
  HttpException,
  InternalServerErrorException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { AuthStrategyService } from '../authStrategy/authStrategy.service';

@Controller('api')
export class ProxyForwardController {
  private readonly apiUrl: string;
  constructor(
    private sessionService: SessionService,
    private AuthStrategyService: AuthStrategyService,
  ) {
    this.apiUrl = process.env.API_URL!;
  }

  @All('*')
  async forwardRequest(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('No session');
    }

    const session = this.sessionService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found or expired');
    }

    const headers = this.AuthStrategyService.injectHeaders(
      session.strategy as 'jwt' | 'oauth' | 'apiKey',
      session.accessToken,
    );
    const path = req.path.replace(/^\/api/, '');
    const queryString = req.url.includes('?')
      ? req.url.slice(req.url.indexOf('?'))
      : '';
    const url = `${this.apiUrl}${path}${queryString}`;
    let apiResponse = await this.sendRequest(req, url, headers);

    if (apiResponse.status === 401) {
      const refreshed = await this.refreshSession(
        session.refreshToken,
        sessionId,
      );
      if (!refreshed) {
        this.sessionService.deleteSession(sessionId);
        res.clearCookie('sessionId');
        throw new UnauthorizedException('Session not found or expired');
      }
      const newAuthHeaders = this.AuthStrategyService.injectHeaders(
        session.strategy as 'jwt' | 'oauth' | 'apiKey',
        refreshed.accessToken,
      );
      apiResponse = await this.sendRequest(req, url, newAuthHeaders);
    }
    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      throw new HttpException(data, apiResponse.status);
    }
    return data;
  }

  async sendRequest(req: Request, url, authHeaders) {
    const headers = { ...authHeaders };
    const contentType = req.headers['content-type'];

    if (contentType) {
      headers['content-type'] = contentType;
    }
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(req.method);
    let body: string | undefined;
    if (hasBody && req.body) {
      body = JSON.stringify(req.body);
    }

    try {
      return await fetch(url, {
        method: req.method,
        headers,
        body,
      });
    } catch (e) {
      throw new InternalServerErrorException('Backend service is unavailable');
    }
  }

  async refreshSession(refreshToken, sessionId) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken, deviceId: sessionId }),
      });

      const data = await response.json();
      if (!response.ok) return null;

      this.sessionService.updateSession(sessionId, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        strategy: 'jwt',
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      return data;
    } catch {
      return null;
    }
  }
}
