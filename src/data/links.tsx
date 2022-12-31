import { ReactComponent as GitHub } from '../assets/icon_gh.svg';
import { ReactComponent as Instagram } from '../assets/icon_ig.svg';
import { ReactComponent as LinkedIn } from '../assets/icon_li.svg';
import { ReactComponent as DefaultIcon } from '../assets/icon_link.svg';
import { ReactComponent as Twitter } from '../assets/icon_tw.svg';
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
    href: 'https://twitter.com/zkm',
    target: '_blank',
    rel: 'noreferrer noopener',
    size: '24',
    content: <Twitter />,
    text: 'Twitter',
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
    content: <DefaultIcon />,
    text: 'StackOverflow',
    viewBox: '-2 -2 24 24',
  },
];

export default links;
