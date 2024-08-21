"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set the component as mounted when pathname is available
    if (pathname) {
      setIsMounted(true);
    }
  }, [pathname]);

  // Function to determine the header text based on the route
  const getHeaderText = () => {
    if (pathname.includes('/doctors/new')) {
      return 'Create New Doctor';
    } else if (pathname.includes('/doctors')) {
      return 'Doctor List';
    } else if (pathname.includes('/doctor/edit')) {
      return 'Edit Doctor';
    } else {
      return 'Header';
    }
  };

  // Only render the header text when the component is mounted
  if (!isMounted) return null;

  return <div className="flex gap-2 p-4 border-b">{getHeaderText()}</div>;
}
