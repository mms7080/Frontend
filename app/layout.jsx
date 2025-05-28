import react from 'react';
import '../styles/globals.css';
import { Provider } from '/components/ui/provider'
import { ChakraProvider } from '@chakra-ui/react'

export default function Layout({children}) {
      return <html suppressHydrationWarning>            
      <head>

      </head>
      <body>
        <Provider>
            {children}
        </Provider>
        <script type="text/javascript" src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&libraries=services,clusterer`}></script>
      </body>
      </html>;
}