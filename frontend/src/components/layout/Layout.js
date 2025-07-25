import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-gradient-to-r from-primary-50 via-accent-50 to-secondary-50 text-neutral-800 py-6 text-center border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium">
            © {new Date().getFullYear()} Collaborative Notes. By <span className="text-accent-dark">Zidane Sabir</span>
          </p>
         
        </div>
      </footer>
    </div>
  );
};

export default Layout;