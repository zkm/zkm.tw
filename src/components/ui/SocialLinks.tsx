// src/components/ui/SocialLinks.tsx
import React from 'react';
import IconLink from './IconLink';
import links from '../../data/links';

const SocialLinks: React.FC = () => (
  <nav aria-label="Social media links">
    {links.map(({ href, label, icon }) => (
      <IconLink
        key={label}
        href={href}
        icon={icon}
        label={label}
        target="_blank"
        rel="noopener noreferrer"
      />
    ))}
  </nav>
);

export default SocialLinks;
