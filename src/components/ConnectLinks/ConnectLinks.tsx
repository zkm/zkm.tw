import React from 'react';
import links from '../../data/links';
import IconBtn from '../IconBtn/IconBtn';
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.iconColor}; // ← dynamic text/icon color
  text-decoration: none;
  transition: transform 0.2s ease, filter 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: scale(1.15);
    filter: brightness(1.15);
    outline: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.iconFocusOutline};
  }
`;


export interface ConnectLinksProps {
  'data-testid'?: string;
}

const ConnectLinks: React.FC<ConnectLinksProps> = ({ 'data-testid': dataTestId }) => {
  return (
    <ConnectList data-testid={dataTestId}>
      {links.map((link) => (
        <ConnectListItem key={link.text}>
          <ConnectAnchor href={link.href} aria-label={link.text} rel={link.rel}>
            {React.cloneElement(link.content, {
              className: 'svg-icon',
              role: 'img',
              'aria-label': link.text,
            })}
            {/* <IconBtn
              size={link.size}
              content={link.content}
              iconName={link.text}
              viewBox={link.viewBox}
            /> */}
          </ConnectAnchor>
        </ConnectListItem>
      ))}
    </ConnectList>
  );
};

export default ConnectLinks;
