import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navigation } from '../../app/components/Navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  return function Link({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
    return <a {...props}>{children}</a>;
  };
});

jest.mock('../../app/components/Settings', () => ({
  Settings: () => <div data-testid="settings-component">Settings</div>,
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation links correctly', () => {
    require('next/navigation').usePathname.mockReturnValue('/');
    
    render(<Navigation />);
    
    expect(screen.getByText('Typing Game')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByTestId('settings-component')).toBeInTheDocument();
  });

  it('highlights the Home link when on home page', () => {
    require('next/navigation').usePathname.mockReturnValue('/');
    
    render(<Navigation />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');
    
    expect(homeLink).toHaveClass('bg-red-900');
    expect(contactLink).not.toHaveClass('bg-red-900');
  });

  it('highlights the Contact link when on contact page', () => {
    require('next/navigation').usePathname.mockReturnValue('/contact');
    
    render(<Navigation />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');
    
    expect(contactLink).toHaveClass('bg-red-900');
    expect(homeLink).not.toHaveClass('bg-red-900');
  });
});
