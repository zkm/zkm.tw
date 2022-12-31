import { render, screen } from '@testing-library/react';
import IconBtn from '../components/IconBtn';

test('renders an icon button', () => {
  const content = <path d="M12,2C6,2z" />;
  const iconName = 'Github';
  const viewBox = '0 0 24 24';
  const size = 24;
  const color = 'red';

  render(
    <IconBtn
      content={content}
      iconName={iconName}
      viewBox={viewBox}
      size={size}
      color={color}
      data-testid="icon-btn"
    />
  );

  const iconBtnElement = screen.getByTestId('icon-btn');
  expect(iconBtnElement).toBeInTheDocument();
});
