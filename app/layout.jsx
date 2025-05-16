import react from 'react';
import '../styles/globals.css';
import { Provider } from '/components/ui/provider'

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