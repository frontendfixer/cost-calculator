'use client';

import Lottie from 'lottie-react';
import { cn } from '~/lib/utils';
import animationData from '~/public/wallet-money.json';

const WalletAnimation = ({ className }: { className?: string }) => {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      className={cn('mx-auto w-[300px]', className)}
    />
  );
};

export default WalletAnimation;
