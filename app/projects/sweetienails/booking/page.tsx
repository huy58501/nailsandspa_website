'use client'; // This ensures the component runs on the client side
import React, { useEffect } from 'react';
import MenuBar from '@/src/components/projects/NailsAndSpa/front-end/menuBar';
import BookingPage from '@/src/components/projects/NailsAndSpa/front-end/BookingPage';

export default function Page(): JSX.Element {
  return (
    <>
      <MenuBar />
      <BookingPage />
    </>
  );
}
