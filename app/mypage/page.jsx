import React from 'react';

import Mypage from '../../components/mypage/page';
import withLogin from '../../lib/server/withLogin';

export default ()=>withLogin(Mypage);