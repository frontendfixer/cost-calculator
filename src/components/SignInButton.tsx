'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '~/components/ui/button';

const SignInButton = () => {
  const signInWithGoogle = async () => {
    return await signIn('google', { callbackUrl: '/home' });
  };
  return (
    <Button
      onClick={signInWithGoogle}
      about="Sign in with google account"
      size="lg"
      className="w-full justify-center gap-5"
    >
      <Image
        src={'/icons/google.svg'}
        width={20}
        height={20}
        alt="google icon"
      />
      Signin with Google
    </Button>
  );
};

export default SignInButton;
