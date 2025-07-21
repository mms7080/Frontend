import React, { Suspense } from 'react';
import '../styles/globals.css';
import { Provider } from '../components/ui/provider';
import { Header,Footer } from '../components';

export default function Layout({ children }) {
  return (
    <html lang="ko">
      <link rel="icon" href="/favicon.png" />
      <head />
      <body>
        <Provider>
          <Suspense fallback={<div></div>}>
            <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
            >
              <Header/>
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer/>
            </div>
          </Suspense>
        </Provider>
        <script
          type="text/javascript"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVERMAP_KEY}&submodules=geocoder`}
        />
      </body>
    </html>
  );
}
