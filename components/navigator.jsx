import {Flex} from "@chakra-ui/react";
import {Tooltip} from "./ui/tooltip"
import {FaCaretUp,FaCaretDown,FaHome} from 'react-icons/fa';

export default function FixedRightSideNavigator() {
  /* 스크롤 이벤트 핸들러 */
  const handleScroll = (direction) => {
    const amount = 400; /* 스크롤 이동 거리 */
    window.scrollBy({
      top: direction === "up" ? -amount : amount,
      behavior: "smooth",
    });
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
      <Tooltip content="즐겨찾기" positioning={{placement:"left"}} showArrow openDelay={100} closeDelay={100}>
        <Flex w='50px' h='50px' borderRadius='5px' justifyContent='center' alignItems='center' onClick={()=>alert("Ctrl+D를 눌러 이 페이지를 즐겨찾기에 추가하세요")} transition='all 0.25s ease-in 0s' _hover={{bg:'#E5E5E5',cursor:'pointer'}}>{/* 아래로 스크롤 작동 */}
            <FaHome size='30px' color='gray'/>
        </Flex>
      </Tooltip>
      <Tooltip content="아래로" positioning={{placement:"left"}} showArrow openDelay={100} closeDelay={100}>
        <Flex w='50px' h='50px' borderRadius='5px' justifyContent='center' alignItems='center' onClick={()=>handleScroll("down")} transition='all 0.25s ease-in 0s' _hover={{bg:'#E5E5E5',cursor:'pointer'}}>{/* 아래로 스크롤 작동 */}
            <FaCaretDown size='50px'  color='gray'/>
        </Flex>
      </Tooltip>
    </Flex>
  );
}