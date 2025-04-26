
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameContainer from '@/components/GameContainer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100">
        <GameContainer />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
