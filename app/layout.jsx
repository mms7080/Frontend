import React from 'react';
import '../styles/globals.css';
import { Provider } from '../components/ui/provider';
import { Footer } from '../components';

export default function Layout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
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

        {/* <script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&libraries=services,clusterer`}
        ></script> */}
      </body>
    </html>
  );
}
