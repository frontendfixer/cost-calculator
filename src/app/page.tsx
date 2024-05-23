import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { LockIcon } from 'lucide-react';
import SignInButton from '~/components/SignInButton';

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold md:text-3xl">
            Cost Calculator
          </CardTitle>
          <CardDescription>Manage your costs with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-8">
            <Image
              src={'/logo.svg'}
              width={72}
              height={72}
              alt="logo"
              priority
            />
            <SignInButton />
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground">
          <div className="flex items-center gap-4 text-sm">
            <LockIcon size={16} />
            All right reserved and secured.
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
