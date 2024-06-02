import { slugToTitle } from '~/lib/utils';

const DashboardPage = () => {
  return (
    <div>
      <h1>{slugToTitle('home_page-demo')}</h1>
    </div>
  );
};

export default DashboardPage;
