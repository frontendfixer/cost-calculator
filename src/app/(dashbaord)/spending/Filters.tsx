'use client';

import { Pilcrow, PilcrowLeft, PilcrowRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const handleTypeChange = (value: string) => {
    params.set('type', value);
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <ToggleGroup type="single" onValueChange={handleTypeChange}>
      <ToggleGroupItem value="credit">
        <PilcrowLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="debit">
        <PilcrowRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default Filters;
