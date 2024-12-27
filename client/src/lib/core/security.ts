import type { NextRequest } from 'next/server'

export class SecurityService {
  private static instance: SecurityService

  private constructor() {}

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  public applyRateLimiting(request: NextRequest) {
    // Implement rate limiting logic here
    // You can use the existing ratelimit implementation from middleware
  }
}

export const security = SecurityService.getInstance() 