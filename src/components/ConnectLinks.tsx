import React from 'react';
import links from '../data/links';
import IconBtn from './IconBtn';
import styled from 'styled-components';

const ConnectList = styled.ul`
  list-style: none;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
`;

const ConnectListItem = styled.li`
  display: inline-block;
  margin-left: 0.5em;

  &:before {
    padding: 0 10px 0 0;
  }
`;

const ConnectAnchor = styled.a`
  align-items: center;
  background: #5990f7;
  border-radius: 50%;
  color: #000;
  display: flex;
  justify-content: center;
  padding: 0;
  text-decoration: none;
  transition: transform 0.15s ease-in-out;
  height: 3rem;
  width: 3rem;
`;
export interface ConnectLinksProps {
  'data-testid'?: string;
}

const ConnectLinks: React.FC<ConnectLinksProps> = ({ 'data-testid': dataTestId }) => {
  return (
    <ConnectList data-testid={dataTestId}>
      {links.map((link) => (
        <ConnectListItem key={link.text}>
          <ConnectAnchor href={link.href} aria-label={link.text}>
            <IconBtn
              size={link.size}
              content={link.content}
              iconName={link.text}
              viewBox={link.viewBox}
            />
          </ConnectAnchor>
        </ConnectListItem>
      ))}
    </ConnectList>
  );
};

export default ConnectLinks;
