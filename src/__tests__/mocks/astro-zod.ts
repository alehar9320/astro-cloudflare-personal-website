import { z as zod } from 'zod';

// Create a proxy to ensure all Zod functionality is preserved while adding our mock helper
export const z = new Proxy(zod, {
  get(target, prop, receiver) {
    if (prop === 'exerciseMock') {
      return () => true;
    }
    return Reflect.get(target, prop, receiver);
  },
});
