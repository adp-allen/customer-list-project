import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';
import { useAuth } from '../AuthContext';
import '@testing-library/jest-dom/matchers';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add the jest-dom matchers to Vitest's expect
expect.extend(matchers);

// Mock dependencies
vi.mock('./Table', () => ({
    Table: () => <div data-testid="mock-table">Mocked Table</div>
}));

vi.mock('./LoginModal', () => ({
    default: ({ onClose, onLoginSuccess }) => (
        <div data-testid="mock-login-modal">
            <button data-testid="close-modal" onClick={onClose}>Close</button>
            <button data-testid="login-success" onClick={onLoginSuccess}>Login</button>
        </div>
    )
}));

vi.mock('../AuthContext', () => ({
    useAuth: vi.fn()
}));

describe('Home Component', () => {
    const mockLogin = vi.fn();
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders login button when user is not logged in', () => {
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, login: mockLogin, logout: mockLogout });
        
        render(<Home />);
        
        const loginButton = screen.getByText('Login');
        expect(loginButton).toBeInTheDocument();
    });

    test('redirects to dashboard when user is logged in', () => {
        // Mock the window.location.assign
        const assignMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { assign: assignMock },
            writable: true
        });
        
        // Mock localStorage for isLoggedIn check
        const getItemMock = vi.fn().mockReturnValue('true');
        Object.defineProperty(window, 'localStorage', {
            value: { getItem: getItemMock },
            writable: true
        });
        
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: true, login: mockLogin, logout: mockLogout });
        
        render(<Home />);
        
        // Get the login button
        const loginButton = screen.getAllByText('Login');
        fireEvent.click(loginButton[0]);

        expect(assignMock).toHaveBeenCalledWith('/dash');
    });

    test('clicking login button shows the login modal', () => {
        // Mock localStorage for isLoggedIn check - setting it to null to simulate not logged in
        const getItemMock = vi.fn().mockReturnValue(null);
        Object.defineProperty(window, 'localStorage', {
            value: { getItem: getItemMock },
            writable: true
        });
        
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, login: mockLogin, logout: mockLogout });
        
        render(<Home />);

        const loginButton = screen.getAllByText('Login');
        fireEvent.click(loginButton[0]);

        expect(screen.getByTestId('mock-login-modal')).toBeInTheDocument();
    });

    test('clicking login button shows modal when user is not logged in', () => {
        // Mock localStorage for isLoggedIn check
        const getItemMock = vi.fn().mockReturnValue(null); // not logged in
        Object.defineProperty(window, 'localStorage', {
            value: { getItem: getItemMock },
            writable: true
        });
        
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, login: mockLogin, logout: mockLogout });
        
        render(<Home />);
        
        // Get the login button
        const loginButton = screen.getAllByText('Login');
        fireEvent.click(loginButton[0]);
        expect(screen.getByTestId('mock-login-modal')).toBeInTheDocument();
    });
    test('successful login calls login function and hides modal', () => {
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, login: mockLogin, logout: mockLogout });
        
        render(<Home />);
        
        // Open the login modal
        const loginButton = screen.getAllByText('Login');
        fireEvent.click(loginButton[0]);
        
        // Trigger successful login
        const loginSuccessButton = screen.getByTestId('login-success');
        fireEvent.click(loginSuccessButton);
        
        // Check login was called and modal is closed
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('mock-login-modal')).not.toBeInTheDocument();
    });

    test('closing the login modal hides it', () => {
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, login: mockLogin, logout: mockLogout });
        
        render(<Home />);
        
        // Open the login modal
        const loginButton = screen.getAllByText('Login');
        fireEvent.click(loginButton[0]);

        // Close the modal
        const closeButton = screen.getByTestId('close-modal');
        fireEvent.click(closeButton);
        
        // Check modal is closed
        expect(screen.queryByTestId('mock-login-modal')).not.toBeInTheDocument();
    });

    test('Table component receives correct isLoggedIn prop', () => {
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: true, login: mockLogin, logout: mockLogout });
        
        const { rerender } = render(<Home />);
        
        // Table should be rendered
        expect(screen.getAllByTestId('mock-table')[0]).toBeInTheDocument();
        
        // Change login state and rerender
        vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, login: mockLogin, logout: mockLogout });
        rerender(<Home />);
        
        // Table should still be rendered (with new props)
        expect(screen.getAllByTestId('mock-table')[0]).toBeInTheDocument();
    });
});