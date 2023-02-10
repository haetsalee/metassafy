import styled from 'styled-components';
import MyChatList from './MyChatList';

function MyChatRoomList(props) {
  // console.log(props.roomList);
  return (
    <div>
      <ChatRoomFormStyle>
        <MyChatListStyle>
          <strong>채팅 목록</strong>
        </MyChatListStyle>
      </ChatRoomFormStyle>
      {props.roomList.map((room) => {
        return (
          <MyChatList
            room={room}
            key={room.croom_no}
            setPage={props.setPage}
            setCroom={props.setCroom}
          />
        );
      })}
    </div>
  );
}

export default MyChatRoomList;

const ChatRoomFormStyle = styled.div`
  background-color: #e0f4ff;
  height: 2rem;
  width: 95%;
  border-radius: 1rem;
  display: flex;
  margin: 0.5rem;
`;

const MyChatListStyle = styled.p`
  width: 80%;
  font-size: 0.9rem;
  color: #617485;
  background-color: #e0f4ff;
  margin: 0.5rem 1rem 0rem 1rem;
`;
