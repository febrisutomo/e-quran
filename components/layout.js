import Footer from './footer';
import Navbar from './navbar';

export default function Layout({ children }) {
  return (
    <div className="dark:bg-gray-900">
      <Navbar />

      <main className="container mx-auto min-h-screen px-4 py-8 lg:px-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
