import React from "react";
import { hot } from "react-hot-loader";
import webSafelogo from "@assets/images/profile-coffee.jpg";
import logo from '@assets/images/profile-coffee.webp';

import "./Application.scss";

type Props = {
  title: string;
  version: string;
};

const Application: React.FC<Props> = props => {
  // const [counter, setCounter] = useState(0);

  return (
    <React.Fragment>
      <main>
        <div className="main-heading">
          <h1>
            {props.title}
          </h1>
        </div>
        <p className="main-logo">
          <img
            src={logo}
            alt="Zach Schneider"
            srcSet={webSafelogo}
            width="500"
          />
        </p>

        <h2>Stay in Touch</h2>
        <div className="main-connect">
          <ul>
          <li>
              <a
                className="btn"
                role="button"
                href="https://zachschneider.com/"
                title="Blog">
                Blog
              </a>
            </li>
            <li>
              <a
                className="btn"
                role="button"
                href="https://github.com/zkm"
                title="Github">
                Github
              </a>
            </li>
            <li>
              <a
                className="btn"
                role="button"
                href="https://linkedin.com/in/zschneider"
                title="LinkedIn">
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className="btn"
                role="button"
                href="https://twitter.com/zkm"
                title="Twitter">
                Twitter
              </a>
            </li>
          </ul>
        </div>
        <footer>
          <sup>&copy;</sup> 2005 &ndash; {new Date().getFullYear()}
        </footer>
      </main>
    </React.Fragment>
  );
};

export default hot(module)(Application);
