// src/data/links.ts
import { SocialLink } from '../types/SocialLink';
import { ReactComponent as GitHub } from '../assets/icons/icon_gh.svg';
import { ReactComponent as Instagram } from '../assets/icons/icon_ig.svg';
import { ReactComponent as LinkedIn } from '../assets/icons/icon_li.svg';
import { ReactComponent as Mastodon } from '../assets/icons/icon_mst.svg';
import { ReactComponent as X } from '../assets/icons/icon_x.svg';
import { ReactComponent as StackOverflow } from '../assets/icons/icon_stackoverflow.svg';

const links: SocialLink[] = [
  { href: 'https://github.com/zkm', label: 'GitHub', icon: <GitHub /> },
  { href: 'https://www.linkedin.com/in/zschneider/', label: 'LinkedIn', icon: <LinkedIn /> },
  { href: 'https://hachyderm.io/@zkm', label: 'Mastodon', icon: <Mastodon /> },
  { href: 'https://x.com/zkm', label: 'X', icon: <X /> },
  { href: 'https://www.instagram.com/zachschneider/', label: 'Instagram', icon: <Instagram /> },
  {
    href: 'https://stackoverflow.com/users/461733/zach-schneider',
    label: 'StackOverflow',
    icon: <StackOverflow />,
  },
];

export default links;
