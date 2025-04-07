import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../../app/components/contact/ContactForm';

global.fetch = jest.fn();

describe('ContactForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );
  });

  it('renders the contact form correctly', () => {
    render(<ContactForm />);
    
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message' } });
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message',
        }),
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Message Sent!')).toBeInTheDocument();
      expect(screen.getByText("Thank you for your message. We'll get back to you as soon as possible.")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Another Message' })).toBeInTheDocument();
    });
  });

  it('handles API error responses', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to send message: Email configuration missing' })
      })
    );
    
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message' } });
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to send message: Email configuration missing')).toBeInTheDocument();
    });
  });

  it('handles network errors', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );
    
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message' } });
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to submit the form. Please try again.')).toBeInTheDocument();
    });
  });

  it('allows sending another message after successful submission', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    
    await waitFor(() => {
      expect(screen.getByText('Message Sent!')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Send Another Message' }));
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });
});
