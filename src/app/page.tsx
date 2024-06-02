import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import SignInButton from '~/components/SignInButton';
import { constants } from '~/constants';
import Logo from '~/components/Logo';

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-4">
      <Card className="w-[90vw] max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold md:text-3xl">
            {constants.app_name}
          </CardTitle>
          <CardDescription>{constants.app_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="my-8 flex flex-col items-center justify-center gap-8">
            <Logo className="size-[120px]" />
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
