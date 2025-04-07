'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();
  
  return (
    <nav className="bg-black text-white p-4 border-b border-red-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-red-600">
          Typing Game
        </Link>
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === '/' ? 'bg-red-900 text-white' : 'hover:bg-gray-800'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/contact" 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === '/contact' ? 'bg-red-900 text-white' : 'hover:bg-gray-800'
            }`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
