import React from 'react';

import Mypage from '../../components/mypage/page';
import withLogin from '../../lib/server/withLogin';

export const metadata={
    title: '마이페이지',
    description: '개인정보 수정, 예매내역 확인 등을 할 수 있는 페이지입니다.',
};

export default ()=>withLogin(Mypage);