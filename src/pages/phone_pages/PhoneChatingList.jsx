import Phone from '../../components/UI/Phone';

import styled from 'styled-components';
import ChatRoomSearch from '../../components/phone/chat/ChatRoomSearch';
import ChatRoomSearchResult from '../../components/phone/chat/ChatRoomSearchResult';
import MyChatRoomList from '../../components/phone/chat/MyChatRoomList';
import ChatRoomNav from '../../components/phone/chat/ChatRoomNav';
import ChatInviteList from '../../components/phone/chat/ChatInviteList';

import { useState, useEffect } from 'react';

import API from '../../utils/api';

let user = 'annonymous';
if (window.localStorage.getItem('USER')) {
  user = JSON.parse(window.localStorage.getItem('USER')).user_id;
}

function PhoneChatingList() {
  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [inviteList, setInviteList] = useState([]);

  useEffect(() => {
    API.get(`/user/searchUser/${search}`)
      .then((res) => {
        setSearchList(res.data);
      })
      .catch((err) => console.log(err));
  }, [search]);

  useEffect(() => {
    API.get(`/chat/rooms`, {
      params: {
        user_id: user,
      },
    })
      .then((res) => {
        setRoomList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Phone>
      <ChatRoomNav />
      <PhoneChatingListStyle>
        <ChatInviteList />
        <ChatRoomSearch setSearch={setSearch} />
        <ChatRoomSearchResult
          setSearchList={searchList}
          setInviteList={setInviteList}
        />
        <MyChatRoomList roomList={roomList} />
      </PhoneChatingListStyle>
    </Phone>
  );
}

export default PhoneChatingList;

const PhoneChatingListStyle = styled.div`
  padding: 0.5rem;
  width: 100%;
  height: 90%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #617485;
  }
`;
