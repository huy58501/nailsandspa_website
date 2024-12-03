'use client'; // This ensures the component runs on the client side
import React, { useEffect } from 'react';
import Service from '@/src/components/projects/NailsAndSpa/front-end/service';
// import { useRouter } from 'next/navigation';

export default function Page(): JSX.Element {
//  const router = useRouter();
  
//  useEffect(() => {
//    router.push('/projects/sweetienails/login');
//  }, [router]);

  return (
    <>
      <Service />
    </>
  );
}
