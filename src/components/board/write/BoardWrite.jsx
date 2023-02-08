import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import BoardWriteInput from './BoardWriteInput';
import BoardWriteImage from './BoardWriteImage';
import {
  fetchBoardImage,
  fetchBoardPost,
} from '../../../services/board-service';
import { BsPencilSquare } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const BoardWrite = () => {
  const navigator = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [article, setArticle] = useState({ title: '', content: '' });
  const [file, setFile] = useState();
  const [thumbnail, setThumbnail] = useState('');

  // 사용자가 올린 이미지를 db에 넣고 스토리지에 올라간 링크로 받아옴
  const setImgUrl = async () => {
    const formData = new FormData();
    formData.append('image', file);
    console.log(file, formData);
    const { data } = await fetchBoardImage(formData); // ???
    console.log(data);
    setThumbnail(data);
  };

  // 글 작성
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!article.title || !article.content) {
      alert('제목과 내용은 필수 입력입니다.');
      return;
    }

    const uploadArticle = async () => {
      // thumbnail
      if (file) {
        await setImgUrl();
      }
      console.log(thumbnail);
      // article
      const body = {
        user_id: user.user_id,
        title: article.title,
        content: article.content,
        thumbnail: thumbnail,
      };
      await fetchBoardPost(body);
    };
    uploadArticle();
    navigator('/board');
  };

  return (
    <WriteSection>
      <form method="post" encType="multipart/form-data">
        <BoardWriteInput
          type="title"
          label="제목"
          placeholder="제목"
          value={article.title}
          setValue={setArticle}
        />
        <BoardWriteInput
          type="content"
          label="본문"
          placeholder="새 글 작성"
          value={article.content}
          setValue={setArticle}
        />
        <BoardWriteImage setFile={setFile} />
        <HrStyle />
        <BoardWriteButtonStyle onClick={handleSubmit}>
          <BsPencilSquare style={{ fontSize: '0.9rem' }} />
          <p>저장</p>
        </BoardWriteButtonStyle>
      </form>
    </WriteSection>
  );
};
export default BoardWrite;

const WriteSection = styled.section`
  width: 70%;
  margin-top: 8rem;
`;

const HrStyle = styled.hr`
  background-color: #ced4da;
  border: none;
  height: 0.1px;
  margin: 1rem 0;
`;

const BoardWriteButtonStyle = styled.button`
  display: flex;
  justify-content: space-around;
  align-items: center;
  float: right;
  width: 7rem;
  padding: 0.5rem 2rem;
  border-radius: 8px;
  border: none;
  background-color: #799fc1;
  color: white;
  font-size: 0.7rem;
  cursor: pointer;
`;