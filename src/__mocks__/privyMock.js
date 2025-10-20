// Mock for @privy-io/react-auth
import { vi } from 'vitest'

export const usePrivy = vi.fn(() => ({
  ready: true,
  authenticated: false,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  linkWallet: vi.fn(),
  unlinkWallet: vi.fn()
}));

export const PrivyProvider = ({ children }) => <div>{children}</div>;

export default {
  usePrivy,
  PrivyProvider
};