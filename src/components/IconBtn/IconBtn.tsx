import React from 'react';
import Icon from '../Icon/Icon';
import { IconBtnProps } from '../../types/IconBtn';

const IconBtn: React.FC<IconBtnProps> = (props) => (
  <Icon {...props} />
);

IconBtn.displayName = 'IconBtn';

export default IconBtn;
