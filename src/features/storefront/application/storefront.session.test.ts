import { describe, expect, it } from 'vitest';
import { createStorefrontCustomerSession } from './storefront.session';

describe('storefront customer session', () => {
  it('creates a demo sign-in session without retaining password', () => {
    const result = createStorefrontCustomerSession('sign-in', {
      email: ' Cliente@Example.com ',
      password: 'demo123',
    });

    expect(result.errors).toEqual({});
    expect(result.session).toEqual({
      name: 'cliente',
      email: 'cliente@example.com',
    });
    expect(result.session).not.toHaveProperty('password');
  });

  it('creates a demo registration session from validated customer fields', () => {
    const result = createStorefrontCustomerSession('register', {
      name: 'Luis Demo',
      email: 'luis@example.com',
      phone: '+598 99 123 456',
      password: 'demo123',
    });

    expect(result.session?.name).toBe('Luis Demo');
    expect(result.session?.phone).toBe('+598 99 123 456');
  });

  it('rejects invalid demo credentials without creating a session', () => {
    const result = createStorefrontCustomerSession('register', {
      name: '',
      email: 'bad-email',
      password: '12',
    });

    expect(result.session).toBeUndefined();
    expect(result.errors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
    });
  });
});
