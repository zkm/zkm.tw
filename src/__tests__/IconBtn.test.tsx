import React from 'react';
import { render, screen } from '@testing-library/react';
import IconBtn from '../components/IconBtn/IconBtn';
import IconGithub from '../assets/icons/icon_gh.svg';

describe('IconBtn', () => {
  it('renders an icon button with the correct size, color, and viewBox values', () => {
    const content = <IconGithub />;
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
    expect(iconBtnElement).toHaveAttribute('width', '24');
    expect(iconBtnElement).toHaveAttribute('height', '24');
    expect(iconBtnElement).toHaveAttribute('viewBox', '0 0 24 24');
    expect(iconBtnElement).toHaveStyle('color: red');
  });
});
