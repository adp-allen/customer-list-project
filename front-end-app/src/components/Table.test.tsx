import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { Table } from './Table';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add the jest-dom matchers to Vitest's expect
expect.extend(matchers);
// Mock fetch API
global.fetch = vi.fn();

describe('Table Component', () => {
    const mockCustomers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password1' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password2' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', password: 'password3' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', password: 'password4' },
        { id: 5, name: 'Charlie Green', email: 'charlie@example.com', password: 'password5' },
        { id: 6, name: 'Diana White', email: 'diana@example.com', password: 'password6' },
        { id: 7, name: 'Edward Black', email: 'edward@example.com', password: 'password7' },
        { id: 8, name: 'Fiona Grey', email: 'fiona@example.com', password: 'password8' },
        { id: 9, name: 'George Red', email: 'george@example.com', password: 'password9' },
        { id: 10, name: 'Hannah Blue', email: 'hannah@example.com', password: 'password10' },
        { id: 11, name: 'Ian Yellow', email: 'ian@example.com', password: 'password11' },
        { id: 12, name: 'Julia Purple', email: 'julia@example.com', password: 'password12' },
    ];

    beforeEach(() => {
         cleanup(); // Clean up before each test
        vi.clearAllMocks();
        
        // Mock successful fetch response
        vi.mocked(fetch).mockResolvedValue({
            json: () => Promise.resolve(mockCustomers),
        } as Response);
    });
    test('displays the heading text "Customer List"', () => {
        render(<Table isLoggedIn={true} />);
        
        // Check if the heading text is visible
        const heading = screen.getByText('Customer List');
        expect(heading).toBeInTheDocument();
    });
    test('renders table with all columns when user is logged in', async () => {
        render(<Table isLoggedIn={true} />);
        
        // Check header columns
        expect(screen.getByText('id')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        const table = screen.getByRole('table');
        
        // Check that the first customer data is rendered correctly with all columns
        const firstRow = within(table).getAllByRole('row')[1]; // First row after header
        expect(within(firstRow).getByText('1')).toBeInTheDocument();
        expect(within(firstRow).getByText('John Doe')).toBeInTheDocument();
        expect(within(firstRow).getByText('john@example.com')).toBeInTheDocument();
        expect(within(firstRow).getByText('password1')).toBeInTheDocument();
    });

    test('renders table without Email and Password columns when user is not logged in', async () => {
        render(<Table isLoggedIn={false} />);
        
        // Check header columns
        expect(screen.getByText('id')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.queryByText('Email')).not.toBeInTheDocument();
        expect(screen.queryByText('Password')).not.toBeInTheDocument();
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        const table = screen.getByRole('table');
        
        // Check that customer data is rendered but without email and password
        const firstRow = within(table).getAllByRole('row')[1]; // First row after header
        expect(within(firstRow).getByText('1')).toBeInTheDocument();
        expect(within(firstRow).getByText('John Doe')).toBeInTheDocument();
        
        // Email and password should not be present in the row
        const firstRowCells = within(firstRow).getAllByRole('cell');
        expect(firstRowCells.length).toBe(2); // Only id and name columns
    });
    test('handles fetch error gracefully', async () => {
        // Set up a spy to capture unhandled rejections
        const unhandledRejectionSpy = vi.fn();
        window.addEventListener('unhandledrejection', unhandledRejectionSpy);
        
        // Silence console errors
        const originalConsoleError = console.error;
        console.error = vi.fn();
        
        try {
            // Mock fetch to reject
            vi.mocked(fetch).mockRejectedValueOnce(new Error('Failed to fetch'));
            
            render(<Table isLoggedIn={true} />);
            
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/customers/');
            
            // Wait to ensure error handling ran
            await vi.waitFor(() => {
                // Table should still render without data
                expect(screen.getByText('Customer List')).toBeInTheDocument();
            });
        } finally {
            // Clean up regardless of test outcome
            console.error = originalConsoleError;
            window.removeEventListener('unhandledrejection', unhandledRejectionSpy);
        }
    });

    test('pagination displays correct number of pages', async () => {
        render(<Table isLoggedIn={false} />);
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        const pagination = screen.getByTestId('pagination');
        
        // Calculate expected pages (12 items with 10 per page = 2 pages)
        const pageButtons = within(pagination).getAllByRole('button')
            .filter(button => button.textContent === '1' || button.textContent === '2');
        
        expect(pageButtons.length).toBe(2);
        expect(pageButtons[0].textContent).toBe('1');
        expect(pageButtons[1].textContent).toBe('2');
        
        // There should be no button for page 3
        const page3Buttons = within(pagination).queryAllByText('3');
        expect(page3Buttons.length).toBe(0);
    });

    test('pagination shows correct items on first page', async () => {
        const { container } = render(<Table isLoggedIn={false} />);
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        // Get the table rows (skip header row)
        const tableRows = container.querySelectorAll('tbody tr');
        
        // First 10 items should be visible
        expect(tableRows.length).toBe(10);
        expect(tableRows[0].textContent).toContain('John Doe');
        expect(tableRows[9].textContent).toContain('Hannah Blue');
        
        // 11th item should not be in the DOM
        expect(screen.queryByText('Ian Yellow')).not.toBeInTheDocument();
    });

    test('pagination navigates to next page correctly', async () => {
        render(<Table isLoggedIn={false} />);
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        // Click the next page button
        const nextPageButton = screen.getByRole('button', { name: '>' });
        fireEvent.click(nextPageButton);
        
        // Now we should see the 11th and 12th items
        expect(screen.getByText('Ian Yellow')).toBeInTheDocument();
        expect(screen.getByText('Julia Purple')).toBeInTheDocument();
        
        // And we should not see the first page items anymore
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    test('pagination navigates to specific page when page number is clicked', async () => {
        render(<Table isLoggedIn={false} />);
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        // Find pagination section and click on page 2
        const pagination = screen.getByTestId('pagination');
        const page2Button = within(pagination).getByText('2');
        fireEvent.click(page2Button);
        
        // Page 2 should show items 11-12
        expect(screen.getByText('Ian Yellow')).toBeInTheDocument();
        expect(screen.getByText('Julia Purple')).toBeInTheDocument();
        
        // Page 1 items should not be visible
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    test('prev button is disabled on first page', async () => {
        render(<Table isLoggedIn={false} />);
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        // Check that prev button is disabled
        const prevButton = screen.getByRole('button', { name: '<' });
        expect(prevButton).toBeDisabled();
    });

    test('next button is disabled on last page', async () => {
        render(<Table isLoggedIn={false} />);
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        // Navigate to page 2
        const pagination = screen.getByTestId('pagination');
        const page2Button = within(pagination).getByText('2');
        fireEvent.click(page2Button);
        
        // Check that next button is disabled on last page
        const nextButton = screen.getByRole('button', { name: '>' });
        expect(nextButton).toBeDisabled();
    });

    test('active page has the correct style class', async () => {
        render(<Table isLoggedIn={false} />);
        
        await vi.waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        
        // Find pagination buttons
        const pagination = screen.getByTestId('pagination');
        const page1Button = within(pagination).getByText('1');
        const page2Button = within(pagination).getByText('2');
        
        // Check that page 1 has active class
        expect(page1Button.className).toContain('active');
        
        // Page 2 should not have active class
        expect(page2Button.className).not.toContain('active');
        
        // Click on page 2
        fireEvent.click(page2Button);
        
        // Now page 2 should have active class
        expect(page2Button.className).toContain('active');
        
        // And page 1 should not
        expect(page1Button.className).not.toContain('active');
    });
});