import { IconProps } from '../components/Icon/Icon';
import { Omit } from 'utility-types';

interface IconBtnProps extends Omit<IconProps, 'iconName'> {
  iconName: string;
}

export type { IconBtnProps };
