import './App.scss';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Zach Schneider [dot]com</h1>
				<picture>
					<source
						srcSet={process.env.PUBLIC_URL + '/img/profile-coffee.webp'}
						type="image/webp"
						alt="Zach Schneider"
					/>
					<source
						srcSet={process.env.PUBLIC_URL + '/img/profile-coffee.jpg'}
						type="image/jpeg"
						alt="Zach Schneider"
					/>
					<source
						srcSet={process.env.PUBLIC_URL + '/img/profile-coffee.png'}
						type="image/png"
						alt="Zach Schneider"
					/>
					<img src={process.env.PUBLIC_URL + '/img/profile-coffee.png'} alt="Zach Schneider" />
				</picture>
				<h2>Stay in Touch</h2>
				<ul>
					<li>
						<a className="App-link" role="button" href="/blog/" title="blog">
							Blog
						</a>
					</li>
					<li>
						<a className="App-link" role="button" href="//github.com/zkm" title="Github">
							Github
						</a>
					</li>
					<li>
						<a className="App-link" role="button" href="//linkedin.com/in/zschneider" title="LinkedIn">
							LinkedIn
						</a>
					</li>
					<li>
						<a className="App-link" role="button" href="//twitter.com/zkm" title="Twitter">
							Twitter
						</a>
					</li>
				</ul>
				&copy; 2006 &ndash; {new Date().getFullYear()}
			</header>
		</div>
	);
}

export default App;
