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

const ScreenReaderText = styled.span`
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  word-wrap: normal;
  word-break: normal;
`;

IconContainer.displayName = 'IconContainer';

const Icon: React.FC<IconProps> = ({ content, iconName, viewBox, size, ...props }) => (
  <IconContainer width={size} height={size} viewBox={viewBox} {...props}>
    <ScreenReaderText>{iconName}</ScreenReaderText>
    {content}
  </IconContainer>
);

Icon.defaultProps = {
  size: 24,
};

export default Icon;
