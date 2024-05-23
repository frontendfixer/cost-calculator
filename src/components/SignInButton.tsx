'use client';

import { Button } from '~/components/ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

const SignInButton = () => {
  const signInWithGoogle = async () => {
    const res = await signIn('google');
    console.log(res);
  };
  return (
    <Button
      onClick={signInWithGoogle}
      variant="secondary"
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
