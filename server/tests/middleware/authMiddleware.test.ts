import { Request, Response } from 'express';
import { authenticate } from '../../src/middleware/authMiddleware';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('AuthMiddleware', () => {
  const mockNext = jest.fn();
  
  it('should pass authentication with valid token', async () => {
    const req = {
      headers: { authorization: 'Bearer valid-token' },
    } as Request;
    
    const mockUser = { id: '1', email: 'test@example.com' };
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    await authenticate(req, {} as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect((req as any).user).toEqual(mockUser);
  });

  it('should fail authentication with invalid token', async () => {
    const req = {
      headers: { authorization: 'Bearer invalid-token' },
    } as Request;
    
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authenticate(req, {} as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});