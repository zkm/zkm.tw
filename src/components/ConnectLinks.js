import React from 'react';
import IconGithub from '../icons/IconGithub';
import IconLinkedIn from '../icons/IconLinkedIn';
import IconTwitter from '../icons/IconTwitter';
import IconInstagram from '../icons/IconInstagram';
import IconLink from '../icons/IconStackOverflow';

class ConnectLinks extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <a href="https://github.com/zkm" target="_blank" rel="noreferrer noopener">
              <IconGithub size="24" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/zschneider/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconLinkedIn size="24" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/zkm" target="_blank" rel="noreferrer noopener">
              <IconTwitter size="24" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/zachschneider/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconInstagram size="24" />
            </a>
          </li>
          <li>
            <a
              href="https://stackoverflow.com/users/461733/zach-schneider"
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconLink size="24" />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default ConnectLinks;
