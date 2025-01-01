'use client'; // This ensures the component runs on the client side
import React, { useEffect } from 'react';
import MenuBar from '@/src/components/projects/NailsAndSpa/front-end/menuBar';
import NailsAndSpa from '@/src/components/projects/NailsAndSpa/front-end/NailsAndSpa';
// import { useRouter } from 'next/navigation';

export default function Page(): JSX.Element {
//  const router = useRouter();
  
//  useEffect(() => {
//    router.push('/projects/sweetienails/login');
//  }, [router]);

  return (
    <>
      <MenuBar />
      <NailsAndSpa />
    </>
  );
}
