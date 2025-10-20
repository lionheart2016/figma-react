// Mock for react-i18next
import { vi } from 'vitest'

export const useTranslation = vi.fn(() => ({
  t: vi.fn((key) => key),
  i18n: {
    changeLanguage: vi.fn(),
    language: 'en'
  }
}));

export const Trans = ({ children }) => <>{children}</>;
export const withTranslation = vi.fn(() => (Component) => (props) => <Component {...props} t={vi.fn((key) => key)} />);

export default {
  useTranslation,
  Trans,
  withTranslation
};