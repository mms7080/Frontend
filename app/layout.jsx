import React from 'react';
import '../styles/globals.css';
import { Provider } from '../components/ui/provider';
import { Footer } from '../components';

export default function Layout({ children }) {
  return (
    <html lang="ko">
      <head />
      <body>
        <Provider>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            {children}
            <main style={{ flex: 1 }}></main>
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
