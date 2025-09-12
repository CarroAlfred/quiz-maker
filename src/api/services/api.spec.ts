import { describe, it, expect, beforeEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axiosClient, { api } from './api';

describe('axiosClient suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mock = new MockAdapter(axiosClient);

  it('should GET data', async () => {
    mock.onGet('/test').reply(200, { message: 'ok' });

    const result = await api.get<{ message: string }>('/test');
    expect(result.message).toBe('ok');
  });

  it('should POST data', async () => {
    mock.onPost('/submit').reply(201, { success: true });

    const result = await api.post<{ success: boolean }>('/submit', { foo: 'bar' });
    expect(result.success).toBe(true);
  });
});
