import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [quote, setQuote] = useState(null);
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

  const handleSubmit = async (e) => {
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
    <>
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1> Random Quotes!</h1>
      {loading ?( <p>Loading....</p> ) : quote ? ( <blockquote> <p>"{quote.quote}"</p> <footer>- {quote.author}</footer> </blockquote> ) : ( <p>No quote available</p> )} 
      <button onClick={fetchQuote} style={{ marginTop: '1rem' }}>
        Get Another Quote 
        </button>
    </div>
    <div style={{padding: '1rem', fontFamily: 'sans-serif'}}>
     <h2> Add Quotes! </h2>
     <input placeholder="Enter quote text" value={quoteText} onChange={(e) => setQuoteText(e.target.value)}/>
     <input placeholder="Enter Author" value={authorText} onChange={(e) => setAuthorText(e.target.value)}/>
     <button onClick={handleSubmit}>Submit Quote</button>
    </div>
    </>
  );
}

export default App;
