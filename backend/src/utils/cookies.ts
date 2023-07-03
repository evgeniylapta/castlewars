import cookie from 'cookie-parse'
import { Request } from 'express'

export function getCookieFromRequest(request: Request, cookieName: string) {
  return cookie.parse(((request.headers as any).cookie))[cookieName]
}
