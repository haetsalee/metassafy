// import { useHistory } from 'react-router-dom';
// import TextGroupComponent from '../components/phone/TextGroupComponent';
import Phone from '../components/UI/Phone';
import React from 'react';
import PhoneUserProfile from './phone_pages/PhoneUserProfile';
// import GetUserStack from '../components/phone/GetUserStack';
import { useEffect } from 'react';
import { fetchUserInfo } from '../services/auth-service';
import PhoneChatingRoom from './phone_pages/PhoneChatingRoom';
import PhoneChatingList from './phone_pages/PhoneChatingList';
import PhoneFriendPage from './phone_pages/PhoneFriendPage';
import { useState } from 'react';
import PhoneNav from '../components/phone/phoneNav/PhoneNav';

function Page1() {
  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      console.log(userInfo);
    };

    getUserInfo();
  }, []);

  const [page, setPage] = useState('profile');
  const [croom, setCroom] = useState('');

  return (
    <section
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Phone>
        {/* <PhoneUserProfile></PhoneUserProfile> */}
        {page === 'profile' && <PhoneUserProfile />}
        {page === 'chatroom' && (
          <PhoneChatingRoom setPage={setPage} croom={croom} />
        )}
        {page === 'chatlist' && (
          <PhoneChatingList setPage={setPage} setCroom={setCroom} />
        )}
        {page === 'friend' && <PhoneFriendPage />}
        <PhoneNav status={page} setPage={setPage} />

        {/* 프로필 사진
      활동중 뱃지
      이름
      반
      <TextGroupComponent name='김싸피' class='구미 2반'/>
      전공
      포지션
      공통
      기술스택
      자기소개
      생일 */}
      </Phone>
      {/* <GetUserStack></GetUserStack> */}
    </section>
  );
}

export default Page1;
