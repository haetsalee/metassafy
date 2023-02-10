import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { BiCheckCircle } from 'react-icons/bi';
import Phone from '../../components/UI/Phone';
import API from '../../utils/api';

function PhoneChatEdit() {
  const params = useParams();
  const room = params.id;
  const [newName, setNewName] = useState('');
  const navigation = useNavigate();

  const content = {
    croom_name: newName,
    croom_no: room,
    croom_img:
      'https://kr.object.ncloudstorage.com/metassafy/445366e7-2a5a-4aba-bb4e-4a5d8dd4ca1fblob',
  };

  function changeName() {
    API.put(`/chat/room`, JSON.stringify(content))
      .then((res) => {
        console.log(res);
      })
      .then(() => navigation(`../chat/room/${room}`));
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      changeName();
    }
  }

  return (
    <CenterDiv>
      <BoxP>이름 수정</BoxP>
      <FlexDiv>
        <InputName
          placeholder="수정할 이름을 작성해주세요"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
          onKeyPress={handleKeyPress}
        />
        <BtnDiv>
          <BiCheckCircle style={{ cursor: 'pointer' }} onClick={changeName} />
        </BtnDiv>
      </FlexDiv>
      <BoxForRoomP onClick={() => navigation(`../chat/room/${room}`)}>
        채팅방으로 되돌아가기
      </BoxForRoomP>
      <BoxForOUTP>채팅방 나가기</BoxForOUTP>
    </CenterDiv>
  );
}

export default PhoneChatEdit;

const InputName = styled.input`
  margin: 1rem 0rem 4rem 0rem;
  border: none;
  border-bottom: 1px solid #617485;
  width: 100%;
  height: 2rem;
  &::placeholder {
    color: #0000002f;
  }
  &:focus {
    outline: 0px;
  }
`;

const CenterDiv = styled.div`
  text-align: center;
  margin: 7rem 4rem;
`;

const BoxP = styled.p`
  background-color: #e0f4ff;
  color: #617485;
  height: 1.8rem;
  padding-top: 0.4rem;
  border-radius: 1rem;
  :hover {
    background-color: #8bb7d2;
    color: white;
  }
`;

const BoxForOUTP = styled.p`
  background-color: #e0f4ff;
  color: #617485;
  height: 1.8rem;
  padding: 0.4rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
  :hover {
    background-color: #d28b8b;
    color: white;
  }
`;

const BoxForRoomP = styled.p`
  background-color: #e0f4ff;
  color: #617485;
  height: 1.8rem;
  padding: 0.4rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
  :hover {
    background-color: #f9f6fc;
    color: black;
  }
`;

const FlexDiv = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const BtnDiv = styled.div`
  margin: 1.5rem 0rem 0rem 0.5rem;
`;
