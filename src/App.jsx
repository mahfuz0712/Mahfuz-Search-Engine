import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();

      if (json.query.searchinfo.totalhits === 0) {
        alert("No results found. Try different keywords");
        return;
      }
      setResults(json.query.search);
    } catch (err) {
      console.error(err);
      alert("Failed to search Wikipedia");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Header */}
      <header className="mt-20 text-center flex flex-col items-center border-b border-gray-300 pb-10 mb-10">
        <h4 className="text-[45px] mb-20 font-['PT_Sans']">
          <span className="text-red-500">M</span>ahfuz{" "}
          <span className="text-red-500">S</span>earch{" "}
          <span className="text-red-500">E</span>ngine
        </h4>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-3xl space-y-4"
        >
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-gray-400 px-5 py-3 text-lg outline-none focus:border-red-500"
            autoFocus
          />
          <div className="flex space-x-2">
            <a
              href="https://wikipedia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-300 hover:bg-red-500 hover:text-white px-4 py-2 rounded text-center"
            >
              Wikipedia
            </a>
            <a
              href="https://duckduckgo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-300 hover:bg-red-500 hover:text-white px-4 py-2 rounded text-center"
            >
              DuckDuckGo
            </a>
          </div>
        </form>
      </header>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}

      {/* Search Results */}
      <section className="w-full max-w-2xl">
        {results.map((result) => {
          const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
          return (
            <div key={result.pageid} className="mb-6">
              <h3 className="text-xl font-semibold">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.title}
                </a>
              </h3>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 break-words"
              >
                {url}
              </a>
              <p
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: result.snippet }}
              ></p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
