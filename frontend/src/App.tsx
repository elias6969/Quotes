import { Routes, Route, Link } from 'react-router-dom';
import Scene from './scene';
import './App.css';
import { useEffect, useState } from 'react';

function Home() {
  const [quote, setQuote] = useState<{ quote: string, author: string } | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [authorText, setAuthorText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/quote');
      const data = await res.json();
      setQuote(data);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/quote', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote: quoteText, author: authorText }),
      });
      const data = await res.json();
      setQuote(data);
      setQuoteText("");
      setAuthorText("");
    } catch (error) {
      console.error("Failed to post quote: ", error);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <main className="main">
      <div className="card">
        <section className="quote-box">
          <h1>Random Quotes!</h1>
          {loading ? (
            <p>Loading...</p>
          ) : quote ? (
            <blockquote>
              <p>"{quote.quote}"</p>
              <footer>- {quote.author}</footer>
            </blockquote>
          ) : (
            <p>No quote available</p>
          )}
          <button onClick={fetchQuote}>Get Another Quote</button>
        </section>

        <section className="form-box">
          <h2>Add Quotes!</h2>
          <input
            placeholder="Enter quote text"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
          />
          <input
            placeholder="Enter author"
            value={authorText}
            onChange={(e) => setAuthorText(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit Quote</button>
        </section>
      </div>
    </main>
  );
}

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">🤓 QuoteZone</div>
        <div className="nav-links">
          <Link to="/">🏠 Home</Link>
          <Link to="#">😂 Shower Thoughts</Link>
          <Link to="#">💡 Useless facts</Link>
          <Link to="/cool3d">😭 cool3dEffect</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cool3d" element={<Scene />} />
      </Routes>
    </>
  );
}

export default App;
