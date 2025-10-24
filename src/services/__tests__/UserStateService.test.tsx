import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { UserStateProvider, useUser } from '../UserStateService';

// Mock Privy SDK
vi.mock('@privy-io/react-auth', () => ({
  usePrivy: vi.fn(() => ({
    ready: true,
    authenticated: false,
    user: null,
    logout: vi.fn(),
  })),
  useLoginWithEmail: vi.fn(() => ({
    login: vi.fn(),
    sendCode: vi.fn(),
  })),
  useLogout: vi.fn(() => ({
    logout: vi.fn(),
  })),
}));

// Mock components for testing
const TestComponent = () => {
  const userContext = useUser();
  
  return (
    <div>
      <div data-testid="loading">{userContext?.isLoading?.toString()}</div>
      <div data-testid="authenticated">{userContext?.isAuthenticated?.toString()}</div>
      <div data-testid="user-id">{userContext?.user?.id || 'no-user'}</div>
      <div data-testid="user-email">{userContext?.user?.email || 'no-email'}</div>
    </div>
  );
};

describe('UserStateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide user context with default values', () => {
    render(
      <UserStateProvider>
        <TestComponent />
      </UserStateProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-id')).toHaveTextContent('no-user');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no-email');
  });

  it('should throw error when useUserState is used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useUserState must be used within a UserStateProvider');
  });

  it('should export useUser hook correctly', () => {
    const TestUseUser = () => {
      const user = useUser();
      return <div data-testid="use-user">{user ? 'defined' : 'undefined'}</div>;
    };

    render(
      <UserStateProvider>
        <TestUseUser />
      </UserStateProvider>
    );

    expect(screen.getByTestId('use-user')).toHaveTextContent('defined');
  });
});