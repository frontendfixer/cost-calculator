'use client';

import { format } from 'date-fns';
import { type icons } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '~/components/Icon';
import { cn } from '~/lib/utils';
import AddItemModal from './AddItemModal';

const currentMonth = format(new Date(), 'MMMM');
const menuItems: {
  title: string;
  link: string;
  icon: keyof typeof icons;
}[] = [
  {
    title: 'Home',
    link: '/home',
    icon: 'Home',
  },
  {
    title: currentMonth,
    link: '/spending',
    icon: 'Calendar',
  },
  {
    title: 'Reports',
    link: '/reports',
    icon: 'Sheet',
  },
  {
    title: 'Profile',
    link: '/profile',
    icon: 'User',
  },
];

const Footer = () => {
  const pathName = usePathname();
  return (
    <footer
      className="relative grid items-center justify-between gap-2 rounded-lg bg-accent p-2 text-accent-foreground"
      style={{
        gridTemplateColumns: `repeat(${menuItems.length + 1}, minmax(0, 1fr))`,
      }}
    >
      {menuItems.slice(0, 2).map(item => (
        <Link
          href={item.link}
          className={cn(
            'flex flex-col items-center gap-1 rounded-lg p-2 px-3 hover:cursor-pointer',
            pathName.includes(item.link) && 'bg-background text-foreground',
          )}
          key={item.link}
        >
          <Icon name={item.icon} size={24} />
          <h3 className="text-sm font-semibold">{item.title}</h3>
        </Link>
      ))}
      <AddItemModal />
      {menuItems.slice(2, menuItems.length).map(item => (
        <Link
          href={item.link}
          className={cn(
            'flex flex-col items-center gap-1 rounded-lg p-2 px-3 hover:cursor-pointer',
            pathName.includes(item.link) && 'bg-background text-foreground',
          )}
          key={item.link}
        >
          <Icon name={item.icon} size={24} />
          <h3 className="text-sm font-semibold">{item.title}</h3>
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
