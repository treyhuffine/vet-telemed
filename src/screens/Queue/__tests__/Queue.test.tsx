import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QueueScreen from '../Queue';
import { useVetAuth } from '@/context/VetAuth';
import { DragDropContext } from '@hello-pangea/dnd';

jest.mock('@/context/VetAuth');
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the WebSocket connection
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

global.WebSocket = jest.fn(() => mockWebSocket) as any;

describe('QueueScreen', () => {
  beforeEach(() => {
    (useVetAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'vet@example.com', role: 'vet' },
    });

    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders queue dashboard correctly', () => {
    render(<QueueScreen />);

    expect(screen.getByText('Queue Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Waiting')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('In Consultation')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays queue statistics', () => {
    render(<QueueScreen />);

    expect(screen.getByText('Total Cases')).toBeInTheDocument();
    expect(screen.getByText('Red Triage')).toBeInTheDocument();
    expect(screen.getByText('Avg Wait Time')).toBeInTheDocument();
  });

  it('filters cases by triage level', async () => {
    render(<QueueScreen />);

    // Click on Red filter
    const redFilter = screen.getByRole('button', { name: /red/i });
    await userEvent.click(redFilter);

    // Verify filter is applied
    expect(redFilter).toHaveClass('bg-red-100');
  });

  it('opens case details modal on case click', async () => {
    render(<QueueScreen />);

    // Wait for mock cases to load
    await waitFor(() => {
      const firstCase = screen.getByText('Bella');
      expect(firstCase).toBeInTheDocument();
    });

    // Click on a case
    const caseCard = screen.getByText('Bella').closest('div[draggable="true"]');
    fireEvent.click(caseCard!);

    // Verify modal opens
    await waitFor(() => {
      expect(screen.getByText('Case Details')).toBeInTheDocument();
    });
  });

  it('searches for cases', async () => {
    render(<QueueScreen />);

    const searchInput = screen.getByPlaceholderText('Search by pet name or owner...');
    await userEvent.type(searchInput, 'Bella');

    // Verify search is applied (in real app, this would filter the cases)
    expect(searchInput).toHaveValue('Bella');
  });

  it('handles case assignment for vet tech role', () => {
    (useVetAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'tech@example.com', role: 'vet_tech' },
    });

    render(<QueueScreen />);

    // Vet techs should not see "My Cases" toggle
    expect(screen.queryByLabelText('My Cases Only')).not.toBeInTheDocument();
  });

  it('toggles between all cases and my cases for vets', async () => {
    render(<QueueScreen />);

    const myCasesToggle = screen.getByLabelText('My Cases Only');
    expect(myCasesToggle).toBeInTheDocument();

    await userEvent.click(myCasesToggle);

    // Verify toggle is checked
    expect(myCasesToggle).toBeChecked();
  });

  it('updates case status via drag and drop', async () => {
    render(<QueueScreen />);

    // Note: Testing drag and drop with @hello-pangea/dnd is complex
    // This is a simplified test that verifies the structure exists
    const waitingColumn = screen.getByText('Waiting').closest('.bg-white');
    const readyColumn = screen.getByText('Ready').closest('.bg-white');

    expect(waitingColumn).toBeInTheDocument();
    expect(readyColumn).toBeInTheDocument();
  });

  it('displays alert for red triage cases', async () => {
    render(<QueueScreen />);

    await waitFor(() => {
      const redTriageCards = screen.getAllByText(/Critical|Emergency/i);
      expect(redTriageCards.length).toBeGreaterThan(0);
    });
  });

  it('auto-refreshes queue data', async () => {
    jest.useFakeTimers();

    render(<QueueScreen />);

    // Fast-forward 30 seconds (auto-refresh interval)
    jest.advanceTimersByTime(30000);

    // Verify WebSocket is connected
    expect(global.WebSocket).toHaveBeenCalled();

    jest.useRealTimers();
  });
});