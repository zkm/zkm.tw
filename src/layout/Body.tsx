import React from 'react';
import ConnectLinks, { ConnectLinksProps } from '../components/ConnectLinks';
import links from '../data/links';

export type BodyProps = {
  title: string;
  links: any;
};

const Body: React.FC<BodyProps> = ({ title, links, ...rest }) => {
  return (
    <div className="main-connect">
      <h2>{title}</h2>
      <ConnectLinks />
    </div>
  );
};

Body.defaultProps = {
  title: '',
};

export default Body;
