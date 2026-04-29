import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface SessionData {
  accessToken: string;
  refreshToken: string;
  strategy: 'jwt' | 'oauth' | 'apiKey';
  expiresAt: number;
}

@Injectable()
export class SessionService {
  private sessions: Map<string, SessionData> = new Map();
  constructor() {}

  createSession(
    tokens: SessionData,
    sessionId: string | undefined = undefined,
  ) {
    if (sessionId === undefined) sessionId = randomUUID();
    this.sessions.set(sessionId, tokens);
    return sessionId;
  }

  getSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return undefined;
    }
    return session;
  }

  updateSession(sessionId: string, tokens: SessionData) {
    this.sessions.set(sessionId, tokens);
  }

  deleteSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
