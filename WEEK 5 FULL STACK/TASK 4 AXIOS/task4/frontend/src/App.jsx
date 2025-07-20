import React from 'react';
import Header from './pages/Header';
import Footer from './pages/Footer';
import UserList from './pages/UserList';

export default function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <UserList />
      </main>
      <Footer />
    </>
  );
}
