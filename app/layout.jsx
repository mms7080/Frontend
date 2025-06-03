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
            
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </Provider>
        <script
          type="text/javascript"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVERMAP_KEY}&submodules=geocoder`}
        />
      </body>
    </html>
  );
}
