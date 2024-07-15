'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const type = params.get('type') ?? '';

  const handleTypeChange = (value: string) => {
    params.set('type', value);
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <ToggleGroup
      type="single"
      value={type}
      variant="outline"
      size="sm"
      onValueChange={handleTypeChange}
      className="gap-2"
    >
      <ToggleGroupItem
        value="credit"
        className="border-success text-success data-[state=on]:bg-success"
      >
        Credited
      </ToggleGroupItem>
      <ToggleGroupItem
        value="debit"
        className="border-destructive text-destructive data-[state=on]:bg-destructive"
      >
        Debited
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default Filters;
