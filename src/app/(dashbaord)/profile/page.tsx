import { getServerAuthSession } from '~/server/auth';
import Image from 'next/image';
import { placeholderBlurHash } from '~/lib/utils';
import SignOutButton from '~/components/SignOutButton';
import { User } from '../actions';
import { Switch } from '~/components/ui/switch';
import ThemeSwitcher from '~/components/ThemeSelector';

const ProfilePage = async () => {
  const session = await getServerAuthSession();
  const userId = session?.user?.id;
  const user = await User.get(userId!);

  if (!user) return <div>user not found</div>;
  return (
    <div className="grid h-full grid-rows-[1fr_auto] py-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <Image
            src={user.image ? user.image : placeholderBlurHash}
            alt="profile image"
            width={90}
            height={90}
            className="rounded-full"
          />
          <div className="flex flex-1 flex-col justify-between gap-3">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <h3>{user.email}</h3>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between rounded-lg border bg-accent p-3 text-accent-foreground">
            <h3>Switch themes</h3>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <SignOutButton />
      </div>
    </div>
  );
};

export default ProfilePage;
