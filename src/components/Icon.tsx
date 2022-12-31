import React from 'react';
import { Omit } from 'utility-types';
import styled from 'styled-components';
import { color } from 'styled-system';

export interface IconProps {
  size: number | string;
  color?: string;
  content: React.ReactNode;
  iconName: React.ReactNode;
  viewBox: string;
}

const IconContainer = styled.svg<Omit<IconProps, 'size' | 'content' | 'iconName' | 'viewBox'>>`
  ${color};
  fill: currentcolor;
`;

IconContainer.displayName = 'IconContainer';

const Icon: React.FC<IconProps> = ({ content, iconName, viewBox, size, ...props }) => (
  <IconContainer width={size} height={size} viewBox={viewBox} {...props}>
    <span className="screen-reader-text">{iconName}</span>
    {content}
  </IconContainer>
);

Icon.defaultProps = {
  size: 24,
};

export default Icon;
