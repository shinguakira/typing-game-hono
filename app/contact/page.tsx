'use client';
import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import { GameProvider } from '../context/GameContext';
import Navigation from '../components/Navigation';

export default function ContactPage() {
  return (
    <GameProvider>
      <Navigation />
      <ContactForm />
    </GameProvider>
  );
}
