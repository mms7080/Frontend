// export default function movie_layout({children}) {
//     return <div className="bg-[#141414]">
//         {children}
//     </div>
// }

'use client';
import { Box } from '@chakra-ui/react';

export default function Layout({ children }) {
  return (
    <Box bg="#141414" minH="100vh" color="white">
      {children}
    </Box>
  );
}