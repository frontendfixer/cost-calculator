import { redirect } from 'next/navigation';
import SignInButton from '~/components/SignInButton';
import WalletAnimation from '~/components/WalletAnimation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { constants } from '~/constants';
import { isValidSessionUser } from './actions';

export default async function HomePage() {
  const isValidSession = await isValidSessionUser();
  if (isValidSession) {
    redirect('/home');
  }

  return (
    <main className="flex h-[100svh] flex-col items-center justify-center p-4">
      <Card className="w-[90vw] max-w-md border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-center text-3xl font-bold">
            {constants.app_name}
          </CardTitle>
          <CardDescription>{constants.app_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="my-8 flex flex-col items-center justify-center gap-8">
            <WalletAnimation />
            <SignInButton />
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-4 text-xs text-muted-foreground">
          <p>All right reserved © {new Date().getFullYear()}</p>
          <p> v.{constants.app_version}</p>
        </CardFooter>
      </Card>
    </main>
  );
}
