import Phone from '../../components/UI/Phone';

import styled from 'styled-components';
import ChatRoomSearch from '../../components/phone/chat/ChatRoomSearch';
import ChatRoomSearchResult from '../../components/phone/chat/ChatRoomSearchResult';
import MyChatRoomList from '../../components/phone/chat/MyChatRoomList';
import ChatRoomNav from '../../components/phone/chat/ChatRoomNav';
import ChatInviteList from '../../components/phone/chat/ChatInviteList';

function PhoneChatingList() {
  return (
    <Phone>
      <ChatRoomNav />
      <PhoneChatingListStyle>
        <ChatInviteList />
        <ChatRoomSearch />
        <ChatRoomSearchResult />
        <MyChatRoomList />
      </PhoneChatingListStyle>
    </Phone>
  );
}

export default PhoneChatingList;

const PhoneChatingListStyle = styled.div`
  padding: 0.5rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #617485;
  }
`;
