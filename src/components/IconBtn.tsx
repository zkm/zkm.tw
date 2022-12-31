import React from 'react';
import Icon, { IconProps } from './Icon';

interface IconBtnProps extends Omit<IconProps, 'iconName'> {
  iconName: string;
}

const IconBtn: React.FC<IconBtnProps> = (props) => (
  <Icon {...props} />
);

IconBtn.displayName = 'IconBtn';

export default IconBtn;
