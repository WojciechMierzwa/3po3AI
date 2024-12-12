import Navbar from './components/navbar/navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <header className="fixed w-full top-0 left-0 z-50 bg-gray-800 shadow-md">
          <Navbar />
        </header>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
