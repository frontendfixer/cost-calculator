'use client';

import { signOut } from 'next-auth/react';
import Icon from './Icon';
import { Button } from './ui/button';

const SignOutButton = () => {
  return (
    <Button
      variant="destructive"
      onClick={async () => await signOut()}
      className="h-12 w-full"
    >
      <Icon name="LogOut" size={20} />
      Sign out
    </Button>
  );
};

export default SignOutButton;
