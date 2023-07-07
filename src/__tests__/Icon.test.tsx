import { render, screen } from '@testing-library/react';
import Icon from '../components/Icon/Icon';
import IconGithub from '../assets/icons/icon_gh.svg';

test('renders an icon with the correct size, color, and viewBox values', () => {
  const content = <IconGithub />;
  const iconName = 'Github';
  const viewBox = '0 0 24 24';
  const size = 24;
  const color = 'red';

  render(
    <Icon
      content={content}
      iconName={iconName}
      viewBox={viewBox}
      size={size}
      color={color}
      data-testid="icon"
    />
  );

  const iconElement = screen.getByTestId('icon');
  expect(iconElement).toBeInTheDocument();
  expect(iconElement).toHaveAttribute('width', '24');
  expect(iconElement).toHaveAttribute('height', '24');
  expect(iconElement).toHaveAttribute('viewBox', '0 0 24 24');
  expect(iconElement).toHaveStyle('color: red');
});
