import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthStrategyService {
  injectHeaders(strategy: 'jwt' | 'oauth' | 'apiKey', token: string) {
    switch (strategy) {
      case 'jwt':
        return { Authorization: `Bearer ${token}` }
      case 'oauth':
        return { Authorization: `Bearer ${token}` }
      case 'apiKey':
        return { 'X-API-Key': `${token}` }
    }
  }
}