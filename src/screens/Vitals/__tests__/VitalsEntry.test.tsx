import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VitalsEntryScreen from '../VitalsEntry';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('VitalsEntryScreen', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    query: { petId: '123' },
    push: mockPush,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders vitals form correctly', () => {
    render(<VitalsEntryScreen />);

    expect(screen.getByText('Vitals Entry')).toBeInTheDocument();
    expect(screen.getByLabelText(/temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/heart rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/respiratory rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByText('Chief Complaint')).toBeInTheDocument();
  });

  it('displays triage level selector', () => {
    render(<VitalsEntryScreen />);

    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByText('Non-Urgent')).toBeInTheDocument();
  });

  it('validates vital signs are within normal ranges', async () => {
    render(<VitalsEntryScreen />);

    const tempInput = screen.getByLabelText(/temperature/i);
    await userEvent.type(tempInput, '105.5'); // High temperature

    // Should show warning
    await waitFor(() => {
      expect(tempInput.parentElement).toHaveClass('border-yellow-500');
    });
  });

  it('selects triage level', async () => {
    render(<VitalsEntryScreen />);

    const criticalButton = screen.getByText('Critical').closest('button');
    await userEvent.click(criticalButton!);

    expect(criticalButton).toHaveClass('ring-2');
  });

  it('saves vitals and creates case', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { caseId: 'case-123' },
      }),
    });

    render(<VitalsEntryScreen />);

    // Fill in vitals
    await userEvent.type(screen.getByLabelText(/temperature/i), '101.5');
    await userEvent.type(screen.getByLabelText(/heart rate/i), '120');
    await userEvent.type(screen.getByLabelText(/respiratory rate/i), '30');
    await userEvent.type(screen.getByLabelText(/weight/i), '25.5');

    // Select triage level
    const urgentButton = screen.getByText('Urgent').closest('button');
    await userEvent.click(urgentButton!);

    // Enter chief complaint
    const complaintInput = screen.getByPlaceholderText(/describe the reason/i);
    await userEvent.type(complaintInput, 'Vomiting and lethargy');

    // Submit
    const submitButton = screen.getByRole('button', { name: /add to queue/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/cases', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('101.5'),
      }));
      expect(mockPush).toHaveBeenCalledWith('/queue');
    });
  });

  it('auto-saves data periodically', async () => {
    jest.useFakeTimers();

    render(<VitalsEntryScreen />);

    // Enter some data
    await userEvent.type(screen.getByLabelText(/temperature/i), '101.5');

    // Fast-forward 30 seconds (auto-save interval)
    jest.advanceTimersByTime(30000);

    // Should show auto-save indicator
    await waitFor(() => {
      expect(screen.getByText(/saved/i)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('handles photo capture', async () => {
    render(<VitalsEntryScreen />);

    const photoButton = screen.getByRole('button', { name: /add photo/i });
    expect(photoButton).toBeInTheDocument();

    // Click to open file input
    await userEvent.click(photoButton);

    // Verify file input exists
    const fileInput = screen.getByLabelText(/upload image/i);
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('validates required fields before submission', async () => {
    render(<VitalsEntryScreen />);

    const submitButton = screen.getByRole('button', { name: /add to queue/i });
    await userEvent.click(submitButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/please select a triage level/i)).toBeInTheDocument();
    });
  });

  it('displays mucous membrane color options', async () => {
    render(<VitalsEntryScreen />);

    const mmSelect = screen.getByLabelText(/mucous membrane color/i);
    await userEvent.click(mmSelect);

    expect(screen.getByText('Pink (Normal)')).toBeInTheDocument();
    expect(screen.getByText('Pale')).toBeInTheDocument();
    expect(screen.getByText('Cyanotic')).toBeInTheDocument();
    expect(screen.getByText('Jaundiced')).toBeInTheDocument();
  });
});