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
      </body>
      </html>;
}