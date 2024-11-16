import React from 'react';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  return <div>{children}</div>;
}
