'use client'

import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react"

const SignInButton = () => {
  return (
      <Button onClick={() => signIn("google")}>Signin with Google</Button>
  )
};

export default SignInButton;
