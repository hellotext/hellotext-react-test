import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the Hellotext SDK
jest.mock('@hellotext/hellotext', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    track: jest.fn(() => Promise.resolve({ data: { ok: true } })),
    session: 'mock-session-123',
    on: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

// Mock the SDK stylesheet import
jest.mock('@hellotext/hellotext/styles/index.css', () => {});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('Setup Screen', () => {
  test('renders setup screen with Business ID input and Initialize button', () => {
    render(<App />);
    expect(screen.getByLabelText(/business id/i)).toBeInTheDocument();
    expect(screen.getByTestId('initialize-btn')).toBeInTheDocument();
    expect(screen.getByTestId('initialize-btn')).toHaveTextContent(/initialize sdk/i);
  });

  test('Initialize button is disabled when Business ID is empty', () => {
    render(<App />);
    const btn = screen.getByTestId('initialize-btn');
    expect(btn).toBeDisabled();
  });

  test('persists Business ID in localStorage after initialization', () => {
    const Hellotext = require('@hellotext/hellotext').default;
    render(<App />);

    const input = screen.getByLabelText(/business id/i);
    fireEvent.change(input, { target: { value: 'TestBiz123' } });
    fireEvent.click(screen.getByTestId('initialize-btn'));

    expect(localStorage.getItem('ht_business_id')).toBe('TestBiz123');
    expect(Hellotext.initialize).toHaveBeenCalledWith('TestBiz123', {});
  });
});

describe('Dashboard', () => {
  const initializeApp = () => {
    render(<App />);
    const input = screen.getByLabelText(/business id/i);
    fireEvent.change(input, { target: { value: 'MyBiz' } });
    fireEvent.click(screen.getByTestId('initialize-btn'));
  };

  test('shows dashboard with tab navigation after initialization', () => {
    initializeApp();

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('tab-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('tab-session')).toBeInTheDocument();
    expect(screen.getByTestId('tab-tracking')).toBeInTheDocument();
    expect(screen.getByTestId('tab-forms')).toBeInTheDocument();
    expect(screen.getByTestId('tab-webchat')).toBeInTheDocument();
  });

  test('displays the Business ID in the dashboard header', () => {
    initializeApp();
    expect(screen.getByText('MyBiz')).toBeInTheDocument();
  });

  test('event log is visible and shows initialization entry', () => {
    initializeApp();
    expect(screen.getByTestId('event-log')).toBeInTheDocument();
    expect(screen.getByText('Hellotext.initialize')).toBeInTheDocument();
  });

  test('switching tabs updates the visible panel', () => {
    initializeApp();

    // Click Tracking tab
    fireEvent.click(screen.getByTestId('tab-tracking'));
    expect(screen.getByRole('heading', { name: /tracking events/i })).toBeInTheDocument();
    expect(screen.getByTestId('track-product.viewed')).toBeInTheDocument();

    // Click Forms tab
    fireEvent.click(screen.getByTestId('tab-forms'));
    expect(screen.getByLabelText(/form id/i)).toBeInTheDocument();
  });
});
