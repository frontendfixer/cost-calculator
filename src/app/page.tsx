import Image from "next/image";
import SignInButton from "./SignInButton";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center gap-5 h-screen p-4">
      <Image src={"/logo.svg"} width={120} height={120} alt="logo" />
      <h1 className="text-7xl font-extrabold">Cost Calculator</h1>
        <SignInButton/>
    </main>
  );
}
