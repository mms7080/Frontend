import {Flex} from "@chakra-ui/react";
import {Tooltip} from "./ui/tooltip"
import {FaCaretUp,FaCaretDown,FaHome} from 'react-icons/fa';
import Link from 'next/link';

export default function FixedRightSideNavigator() {
  /* 스크롤 이벤트 핸들러 */
  const handleScroll = (direction) => {
    if (direction === "up") {
      window.scrollTo({
        top: 0, /* 윗쪽 끝으로 이동 */
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight, /* 아래쪽 끝으로 이동 */
        behavior: "smooth",
      });
    }
  };
  return (
    <Flex
      h="170px"/* 네비게이터 높이 */
      w="80px"/* 네비게이터 너비 */
      flexDirection="column"
      justifyContent='space-between'
      alignItems="center"
      position="fixed"
      top="25vh"
      right="0"
      zIndex='2'
    >
      <Tooltip content="위로" positioning={{placement:"left"}} showArrow openDelay={100} closeDelay={100}>
        <Flex w='50px' h='50px' borderRadius='5px' justifyContent='center' alignItems='center' onClick={()=>handleScroll("up")} transition='all 0.25s ease-in 0s' _hover={{bg:'#E5E5E5',cursor:'pointer'}}>{/* 아래로 스크롤 작동 */}
            <FaCaretUp size='50px' color='gray'/>
        </Flex>
      </Tooltip>
      <Tooltip content="홈" positioning={{placement:"left"}} showArrow openDelay={100} closeDelay={100}>
        <Link href='/home'>
          <Flex w='50px' h='50px' borderRadius='5px' justifyContent='center' alignItems='center' transition='all 0.25s ease-in 0s' _hover={{bg:'#E5E5E5',cursor:'pointer'}}>{/* 아래로 스크롤 작동 */}
              <FaHome size='30px' color='gray'/>
          </Flex>
        </Link>
      </Tooltip>
      <Tooltip content="아래로" positioning={{placement:"left"}} showArrow openDelay={100} closeDelay={100}>
        <Flex w='50px' h='50px' borderRadius='5px' justifyContent='center' alignItems='center' onClick={()=>handleScroll("down")} transition='all 0.25s ease-in 0s' _hover={{bg:'#E5E5E5',cursor:'pointer'}}>{/* 아래로 스크롤 작동 */}
            <FaCaretDown size='50px'  color='gray'/>
        </Flex>
      </Tooltip>
    </Flex>
  );
}