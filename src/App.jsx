import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ApiTest from "./components/ApiTest.jsx";
import SetsList from "./pages/SetsList.jsx";
import Landing from "./pages/Landing.jsx";
import SetCards from "./pages/SetCards.jsx";
import { useEffect, useState } from 'react';

export default function App() {
  const [path, setPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigateTo = (to) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setPath(to);
    }
  };

  // simple router: / -> sets list, /sets -> sets list, /sets/:id -> SetCards
  let content = null;
  if (path === '/sets') {
    content = <SetsList navigateTo={navigateTo} />;
  } else if (path === '/' ) {
    content = <Landing navigateTo={navigateTo} />;
  } else if (path.startsWith('/sets/')) {
    const parts = path.split('/');
    const setId = parts[2] || '';
    content = <SetCards setId={setId} navigateTo={navigateTo} />;
  } else {
    // fallback to sets list
    content = <SetsList navigateTo={navigateTo} />;
  }

  return (
    <div>
      <Header />
      <main className="p-6 bg-gray-50 min-h-screen">
        <section className="max-w-6xl mx-auto">
          {content}
        </section>
      </main>
      <ApiTest />
      <Footer />
    </div>
  );
}
