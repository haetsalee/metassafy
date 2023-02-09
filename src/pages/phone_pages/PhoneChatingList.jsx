import Phone from '../../components/UI/Phone';

import ChatRoomSearch from '../../components/phone/chat/ChatRoomSearch';
import ChatRoomSearchResult from '../../components/phone/chat/ChatRoomSearchResult';
import MyChatRoomList from '../../components/phone/chat/MyChatRoomList';
import ChatInviteList from '../../components/phone/chat/ChatInviteList';

import { getJsonLocalUserInfo } from '../../utils/local-storage';
import { useState, useEffect } from 'react';

import API from '../../utils/api';

import styled from 'styled-components';

function PhoneChatingList(props) {
  const user = getJsonLocalUserInfo()['user_id'] || 'annonymous';

  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [inviteList, setInviteList] = useState([]);
  console.log(roomList);
  const [forTime, setForTime] = useState(0);

  useEffect(() => {
    API.get(`/user/searchUser/${search}`)
      .then((res) => {
        setSearchList(res.data);
      })
      .catch((err) => console.log(err));
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => setForTime(forTime + 1), 2000);

    let temp = [];
    API.get(`/participant`, { params: { user_id: user } }).then((res) => {
      temp = res.data;
      API.put(`/participant/not_read_chat`, JSON.stringify(temp)).then(
        (res) => {
          API.get(`/chat/rooms`, {
            params: {
              user_id: user,
            },
          })
            .then((res) => {
              // console.log(res.data);
              setRoomList(res.data);
            })
            .catch((err) => console.log(err));
        }
      );
    });
    // console.log(temp);
    //Participant의 not_read_chat을 갱신

    return () => clearTimeout(timeout);
  }, [forTime]);

  return (
    <Phone>
      <ChatRoomNavStyle>
        <ChatListP>채팅방</ChatListP>
      </ChatRoomNavStyle>
      <PhoneChatingListStyle>
        <ChatInviteList inviteList={inviteList} />
        <ChatRoomSearch setSearch={setSearch} />
        <ChatRoomSearchResult
          setSearchList={searchList}
          setInviteList={setInviteList}
        />
        <MyChatRoomList
          roomList={roomList}
          setPage={props.setPage}
          setCroom={props.setCroom}
        />
      </PhoneChatingListStyle>
    </Phone>
  );
}

export default PhoneChatingList;

const PhoneChatingListStyle = styled.div`
  padding: 0.5rem;
  width: 100%;
  height: 82%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #617485;
  }
`;

const ChatRoomNavStyle = styled.div`
  padding: 0.5rem 2rem 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  width: 95%;
`;

const ChatListP = styled.p`
  margin: 1rem 1rem 0rem 0rem;
  font-size: 1.1rem;
`;