import './App.scss';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Zach Schneider [dot]com</h1>
				<picture>
					<source srcSet={process.env.PUBLIC_URL + './img/profile-coffee.webp'} type="image/webp" />
					<source srcSet={process.env.PUBLIC_URL + './img/profile-coffee.jpg'} type="image/jpeg" />
					<source srcSet={process.env.PUBLIC_URL + './img/profile-coffee.png'} type="image/png" />
					<img src={process.env.PUBLIC_URL + './img/profile-coffee.png'} alt="Zach Schneider" />
				</picture>
				<h2>Stay in Touch</h2>
				<ul>
					<li>
						<a className="App-link" role="button" href="https://twitter.com/zkm" title="Twitter">
							Twitter
						</a>
					</li>

					<li>
						<a className="App-link" role="button" href="https://github.com/zkm" title="Github">
							Github
						</a>
					</li>
					<li>
						<a className="App-link" role="button" href="/blog/" title="blog">
							Blog
						</a>
					</li>
				</ul>
				&copy; 2006 — {new Date().getFullYear()}, Zach Schneider [dot]com
			</header>
		</div>
	);
}

export default App;
