import { render, screen } from '@testing-library/react';
import Icon from '../components/Icon';

test('renders an icon', () => {
    const content = <path d="M12,2C6,2z" />;
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
});
