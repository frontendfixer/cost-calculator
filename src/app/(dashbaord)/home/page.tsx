import { getServerAuthSession } from '~/server/auth';
import Statistic from './components/Statistic';
import ChartReport from './components/ChartReport';

const DashboardPage = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="space-y-4 p-3">
      <h1>
        <span className="text-muted-foreground">Welcome</span> <br />
        <strong className="text-2xl font-extrabold">
          {session?.user.name}{' '}
        </strong>
      </h1>
      <Statistic />
      <ChartReport />
    </div>
  );
};

export default DashboardPage;
