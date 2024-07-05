import { Skeleton } from '~/components/ui/skeleton';
import { rangeArr } from '~/lib/utils';

const ListItemsSkeleton = () => {
  return (
    <Skeleton className="space-y-3 bg-transparent p-4">
      {rangeArr(0, 3, 1).map(i => (
        <Skeleton
          key={i}
          className="flex h-16 items-center justify-between bg-muted/20 p-2"
        />
      ))}
    </Skeleton>
  );
};

export default ListItemsSkeleton;
