import React from 'react';
import Icon, { IconProps } from './Icon';

const IconBtn: React.FC<IconProps> = (props) => (
  <Icon {...props} />
);

IconBtn.displayName = 'IconBtn';

export default IconBtn;
