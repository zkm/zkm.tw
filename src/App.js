import './App.scss';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Zach Schneider [dot]com</h1>
				<img src="https://zkm.s3.amazonaws.com/profile-coffee.jpg" alt="Zach Schneider" />
				<h2>Stay in Touch</h2>
				<ul>
					<li>
						<a className="App-link" href="https://twitter.com/zkm" title="Twitter">
							Twitter
						</a>
					</li>

					<li>
						<a className="App-link" href="https://github.com/zkm" title="Github">
							Github
						</a>
					</li>
					<li>
						<a className="App-link" href="/blog/" title="blog">
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
