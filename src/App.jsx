import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ApiTest from "./components/ApiTest.jsx";
import CardImage from "./components/CardImage.jsx";
import SetImage from "./components/SetImage.jsx";

export default function App() {
  return (
    <div>
      <Header />
      <main>
        {/* Section des Cartes */}
        <section>
            <CardImage cardId="rsv10pt5-1" />
        </section>
      </main>
      <ApiTest />
      <Footer />
    </div>
  );
}
