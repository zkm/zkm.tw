import React from 'react';
import links from '../data/links';
import IconBtn from './IconBtn';

export interface ConnectLinksProps {
  'data-testid'?: string;
}

const ConnectLinks: React.FC<ConnectLinksProps> = ({ 'data-testid': dataTestId }) => {


  return (
    <ul data-testid={dataTestId}>
      {links.map((link) => (
        <li key={link.text}>
          <a href={link.href}>
            <IconBtn size={link.size} content={link.content} iconName={link.text} viewBox={link.viewBox} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default ConnectLinks;
