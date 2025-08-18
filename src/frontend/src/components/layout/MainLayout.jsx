import React from 'react';
import Navbar from '../Navbar';
import MaxWidthContainer from './MaxWidthContainer';
// import Footer from '../sections/Footer'; // Uncomment when Footer is created

export default function MainLayout({ children }) {
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <MaxWidthContainer>
          {children}
        </MaxWidthContainer>
      </main>
      {/* <Footer /> */}
    </div>
  );
} 