import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { displayMauCount } from './display-mau';

describe('displayMauCount', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('p');
    element.id = 'mau-count';
    element.style.display = 'none';
    element.textContent = '0 MAU this month';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets display block and formats MAU when response has a numeric mau value', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ mau: 1234 }) };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

    await displayMauCount(element);

    expect(element.style.display).toBe('block');
    expect(element.textContent).toBe('1,234 MAU this month');
  });

  it('sets display none when response has no mau field', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({}) };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

    await displayMauCount(element);

    expect(element.style.display).toBe('none');
  });

  it('sets display none when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    await displayMauCount(element);

    expect(element.style.display).toBe('none');
  });

  it('sets display none when response is not ok', async () => {
    const mockResponse = { ok: false, status: 500 };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

    await displayMauCount(element);

    expect(element.style.display).toBe('none');
  });
});
