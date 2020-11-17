import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Zach Schneider [dot] com</h1>
				<img src="//zkm.s3.amazonaws.com/profile-coffee.jpg" alt="Zach Schneider" />
				<h2>Stay in Touch</h2>
				<ul>
					<li>
						<a className="twitter" href="//twitter.com/zkm" title="Twitter">
							Twitter
						</a>
					</li>

					<li>
						<a className="github" href="//github.com/zkm" title="Github">
							Github
						</a>
					</li>
					<li>
						<a className="blog" href="/blog/" title="blog">
							Random Thoughts
						</a>
					</li>
				</ul>
				&copy; 2006 — 2020, ZachSchneider[dot]com
			</header>
		</div>
	);
}

export default App;
