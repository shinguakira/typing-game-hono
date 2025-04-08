'use client';
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';

export const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit the form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-16 bg-black flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Contact Us</h2>

      <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-lg shadow-md border border-red-800">
        {submitted ? (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Message Sent!</h3>
            <p className="mb-6 text-gray-300">
              Thank you for your message. We&apos;ll get back to you as soon as possible.
            </p>
            <Button
              variant="game"
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-800 text-white shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-800 text-white shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={5}
                className="block w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-800 text-white shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-900/30 rounded-md">
                <p className="text-sm font-semibold text-red-400">
                  {error.includes('Need to fix application') ? (
                    <>
                      <span className="block text-lg font-bold">Failed to send message</span>
                      <span className="block mt-2">
                        Need to fix application: Email configuration missing
                      </span>
                    </>
                  ) : (
                    error
                  )}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="game"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
