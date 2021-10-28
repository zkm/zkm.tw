import React from "react";
import logo from "./img/profile-coffee.webp";
import webSafelogo from "./img/profile-coffee.png";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Zach Schneider [dot]com</h1>
        <picture className="App-logo">
          <source
            srcSet={`${process.env.PUBLIC_URL} ${logo}`}
            type="image/webp"
            alt="Zach Schneider"
          />
          <source
            srcSet={`${process.env.PUBLIC_URL} ${webSafelogo}`}
            type="image/jpeg"
            alt="Zach Schneider"
          />
          <img
            src={`${process.env.PUBLIC_URL} ${webSafelogo}`}
            alt="Zach Schneider"
            width="500px"
            height="500px"
          />
        </picture>
        <h2>Stay in Touch</h2>
        <ul>
          <li>
            <a className="App-link" role="button" href="/blog/" title="blog">
              Blog
            </a>
          </li>
          <li>
            <a
              className="App-link"
              role="button"
              href="//github.com/zkm"
              title="Github">
              Github
            </a>
          </li>
          <li>
            <a
              className="App-link"
              role="button"
              href="//linkedin.com/in/zschneider"
              title="LinkedIn">
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className="App-link"
              role="button"
              href="//twitter.com/zkm"
              title="Twitter">
              Twitter
            </a>
          </li>
        </ul>
      </header>
      <footer>
        <sup>&copy;</sup> 2005 &ndash; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
