import FriendChatBox from '../../components/phone/chat/FriendChatBox';
import Phone from '../../components/UI/Phone';

import styled from 'styled-components';
import ChatRoomNav from '../../components/phone/chat/ChatRoomNav';
import MyChatBox from '../../components/phone/chat/MyChatBox';
import ChatRoomForm from '../../components/phone/chat/ChatRoomForm';

const chats = [];

function PhoneChatingRoom() {
  return (
    <Phone>
      <ChatRoomNav />
      <PhoneChatingRoomStyle>
        {chats.map((chat) => {
          if (chat.user_id === localStorage.user_id) {
            return <MyChatBox chat={chat} key={chat.chat_no} />;
          } else {
            return <FriendChatBox chat={chat} key={chat.chat_no} />;
          }
        })}
        <FriendChatBox chat="여기 chat데이터 들어가야함" />
        <MyChatBox />
        <FriendChatBox chat="여기 chat데이터 들어가야함" />
        <MyChatBox />
        <FriendChatBox chat="여기 chat데이터 들어가야함" />
        <MyChatBox />
        <FriendChatBox chat="여기 chat데이터 들어가야함" />
        <FriendChatBox chat="여기 chat데이터 들어가야함" />
        <MyChatBox />
        <MyChatBox />
      </PhoneChatingRoomStyle>
      <ChatRoomForm />
    </Phone>
  );
}

export default PhoneChatingRoom;

const PhoneChatingRoomStyle = styled.div`
  padding: 0.5rem;
  display: block;
  display: grid;
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
