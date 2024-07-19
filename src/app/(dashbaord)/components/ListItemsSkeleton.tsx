import { Skeleton } from '~/components/ui/skeleton';
import { rangeArr } from '~/lib/utils';

const ListItemsSkeleton = () => {
  return (
    <div className="mt-3 space-y-2 bg-transparent">
      {rangeArr(0, 5, 1).map(i => (
        <Skeleton key={i} className="h-16 rounded-lg" />
      ))}
    </div>
  );
};

export default ListItemsSkeleton;
