import { describe, expect, it } from 'vitest';
import { resetPayment, selectPaymentMethod } from './payment-actions';
import { storefrontPaymentReducer } from './payment-reducer';
import { initialStorefrontPaymentState, type StorefrontPaymentState } from './payment-state';

describe('storefrontPaymentReducer', () => {
  it('starts with no selected payment method', () => {
    expect(initialStorefrontPaymentState).toEqual({
      selectedPaymentMethodId: null,
    });
  });

  it('selects a payment method', () => {
    const state = storefrontPaymentReducer(initialStorefrontPaymentState, selectPaymentMethod('card'));

    expect(state).toEqual({
      selectedPaymentMethodId: 'card',
    });
  });

  it('replaces the selected payment method', () => {
    const state = storefrontPaymentReducer(
      { selectedPaymentMethodId: 'card' },
      selectPaymentMethod('cash'),
    );

    expect(state).toEqual({
      selectedPaymentMethodId: 'cash',
    });
  });

  it('resets the selected payment method', () => {
    const state = storefrontPaymentReducer({ selectedPaymentMethodId: 'cash' }, resetPayment());

    expect(state).toEqual({
      selectedPaymentMethodId: null,
    });
  });

  it('returns immutable state for selection changes', () => {
    const previous: StorefrontPaymentState = { selectedPaymentMethodId: 'cash' };
    const next = storefrontPaymentReducer(previous, selectPaymentMethod('card'));

    expect(next).not.toBe(previous);
    expect(previous).toEqual({
      selectedPaymentMethodId: 'cash',
    });
  });

  it('keeps state unchanged for unknown actions', () => {
    const state: StorefrontPaymentState = { selectedPaymentMethodId: 'card' };
    const next = storefrontPaymentReducer(state, { type: 'unknown' } as never);

    expect(next).toBe(state);
  });
});
