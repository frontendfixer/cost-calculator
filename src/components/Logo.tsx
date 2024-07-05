import { cn } from '~/lib/utils';
import Image from 'next/image';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('relative h-[54px] w-[160px]', className)}>
      <Image
        src={'/logo-horizontal.png'}
        fill
        alt="logo"
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
