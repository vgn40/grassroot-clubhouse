import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { paymentsHandlers } from './handlers/payments';

// Combine all handlers
const allHandlers = [...handlers, ...paymentsHandlers];

export const worker = setupWorker(...allHandlers);