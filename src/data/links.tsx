import { ReactComponent as GitHub } from '../assets/icons/icon_gh.svg';
import { ReactComponent as Instagram } from '../assets/icons/icon_ig.svg';
import { ReactComponent as LinkedIn } from '../assets/icons/icon_li.svg';
import { ReactComponent as Mastodon } from '../assets/icons/icon_mst.svg'
import { ReactComponent as X } from '../assets/icons/icon_x.svg';
import { ReactComponent as StackOverflow } from '../assets/icons/icon_stackoverflow.svg'
interface LinkCommonProps {
  target: string;
  rel: string;
  size: string;
  viewBox: string;
}

interface Link extends LinkCommonProps {
  href: string;
  content: JSX.Element;
  text: string;
}

const links: Link[] = [
  {
    href: 'https://github.com/zkm',
    target: '_blank',
    rel: 'noreferrer noopener',
    size: '24',
    content: <GitHub />,
    text: 'Github',
    viewBox: '0 0 24 24',
  },
  {
    href: 'https://www.linkedin.com/in/zschneider/',
    target: '_blank',
    rel: 'noreferrer noopener',
    size: '24',
    content: <LinkedIn />,
    text: 'LinkedIn',
    viewBox: '0 0 24 24',
  },
  {
    href: 'https://hachyderm.io/@zkm',
    target: '_blank',
    rel: 'me',
    size: '24',
    content: <Mastodon />,
    text: 'Mastodon',
    viewBox: '0 0 24 24',
  },
  {
    href: 'https://x.com/zkm',
    target: '_blank',
    rel: 'noreferrer noopener',
    size: '24',
    content: <X />,
    text: 'X',
    viewBox: '0 0 24 24',
  },
  {
    href: 'https://www.instagram.com/zachschneider/',
    target: '_blank',
    rel: 'noreferrer noopener',
    size: '24',
    content: <Instagram />,
    text: 'Instagram',
    viewBox: '0 0 24 24',
  },
  {
    href: 'https://stackoverflow.com/users/461733/zach-schneider',
    target: '_blank',
    rel: 'noreferrer noopener',
    size: '24',
    content: <StackOverflow />,
    text: 'StackOverflow',
    viewBox: '0 0 24 24',
  },
];

export default links;
