import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  fetchProfileModify,
  fetchTechSave,
} from '../../services/profile-service';
import CalendarInput from './Inputs/CalendarInput';
import DropdownInput from './Inputs/DropdownInput';
import RowRadioButtonsGroup from './Inputs/RowRadioButtonGroup';
import dayjs from 'dayjs';
import useInfo from '../../hooks/use-info';
import { BiSave } from 'react-icons/bi';
import MultipleSelectChip from './Inputs/MultipleSelectChip';

const genderList = {
  label: '성별',
  data: ['남성', '여성', '미정'],
};

const generationList = {
  key: 'generation',
  label: '기수',
  data: [9, 8, 7, 6, 5, 4, 3, 2, 1],
};

const areaList = {
  label: '지역',
  data: ['서울', '대전', '구미', '광주', '부울경'],
};

const trackList = {
  label: '트랙',
  data: ['자바', '파이썬', '모바일', '임베디드'],
};

const majorList = {
  label: '전공',
  data: ['전공', '비전공'],
};

const positionList = {
  label: '희망 포지션',
  data: [
    { label: 'BE', value: 'BE', name: 'interest', id: 'BE' },
    { label: 'FE', value: 'FE', name: 'interest', id: 'FE' },
    {
      label: '기타',
      value: '기타',
      name: 'interest',
      id: 'posNull',
    },
  ],
};

const InputBoxList = () => {
  const user = useInfo();
  // const  test = {"user_id":"zzzzz","user_pwd":"zzzzz",
  // "student_no":"2222","name":"zzzzz",
  // "area":"구미","email":"zz@z","gender":"w",
  // "birthday":"2023-02-03T04:09:23.840Z","age":10,"interest":"BE",
  // "regtime":1675121266000,
  // "profile_img":"https://kr.object.ncloudstorage.com/metassafy/06c4fb8f-7409-40c0-a2b7-6e83f0ca0cebdefault.png",
  // "profile_txt":"앙뇽~~~~~~~~~~~~~~~~!!!!",
  // "first_semester":"파이썬","common":null,"special":null,"free":null,"first_semester_class":0,"common_class":0,"special_class":0,"free_class":0,"x":0,"y":0,"z":0,"common_team":0,"special_team":0,"free_team":0,"current_role":null,
  // "generation":8,"major":"비전공",
  // "common_jo":"미정","special_jo":"미정","free_jo":"미정"};
  const [info, setInfo] = useState({
    user_id: '',
    name: '',
    genderF: '', // w, m
    birthday: '',
    generation: 0, // 기수
    area: '', // 지역
    first_semester: '', // 트랙
    major: '', // 전공
    interest: '', // 희망 포지션
    profile_txt: '', // 자기소개
  });
  const [techList, setTechList] = useState([]); // tech_id 기술스택

  useEffect(() => {
    const initInfo = {
      user_id: user.user_id,
      name: user.name || '',
      genderF: user.genderF || '', // w, m
      birthday: dayjs(user.birthday) || '',
      generation: user.generation || '', // 기수
      area: user.area || '', // 지역
      first_semester: user.first_semester || '', // 트랙
      major: user.major || '', // 전공
      interest: user.interest || '', // 희망 포지션
      profile_txt: user.profile_txt || '', // 자기소개
    };
    setInfo({ ...initInfo });
  }, [user]);

  useEffect(() => {
    console.log('변화 정보!!!', info);
  }, [info]);

  const handleChange = (e, key) => {
    setInfo((preState) => {
      const state = { ...preState };
      state[key] = e.target.value;
      return state;
    });
  };

  const onSubmitHandler = () => {
    // submit
    console.log('제출!!', info, techList);
    fetchProfileModify(info);
    const techs = techList.map((tech) => tech.tech_id);
    fetchTechSave(user.user_id, techs);
  };

  return (
    <InputListStyle>
      {/* 이름 */}
      <InputLineStyle>
        <LabelStyle>이름</LabelStyle>
        <InputsStyle>
          <TextField
            id="standard-basic"
            variant="standard"
            value={info.name || ''}
            onChange={(e) => handleChange(e, 'name')}
          />
        </InputsStyle>
      </InputLineStyle>
      {/* 개인정보 */}
      <InputLineStyle>
        <LabelStyle>개인정보</LabelStyle>
        <InputsStyle>
          <DropdownInput
            data={genderList}
            width="30%"
            value={info.genderF || ''}
            defaultValue={info.genderF || ''}
            onChange={(e) => handleChange(e, 'genderF')}
          />
          <CalendarInput
            value={info.birthday}
            // value="2023-02-03T04:09:23.840Z"
            onChange={(e) => {
              setInfo((preState) => {
                const state = { ...preState };
                state['birthday'] = String(e['$d']);
                console.log(state['birthday'], 'sdfsdfsdfsdkf');
                return state;
              });
              console.log(String(e['$d']));
            }}
          />
        </InputsStyle>
      </InputLineStyle>
      {/* SSAFY */}
      <InputLineStyle>
        <LabelStyle>SSAFY</LabelStyle>
        <InputsStyle>
          <DropdownInput
            data={generationList}
            width="25%"
            value={info.generation || ''}
            defaultValue={info.generation || ''}
            onChange={(e) => handleChange(e, 'generation')}
          />
          <DropdownInput
            data={areaList}
            width="25%"
            value={info.area || ''}
            defaultValue={info.area || ''}
            onChange={(e) => handleChange(e, 'area')}
          />
          <DropdownInput
            data={trackList}
            width="25%"
            value={info.first_semester || ''}
            defaultValue={info.first_semester || ''}
            onChange={(e) => handleChange(e, 'first_semester')}
          />
          <DropdownInput
            data={majorList}
            width="25%"
            value={info.major || ''}
            defaultValue={info.major || ''}
            onChange={(e) => handleChange(e, 'major')}
          />
        </InputsStyle>
      </InputLineStyle>
      {/* 희망 포지션 */}
      <InputLineStyle>
        <LabelStyle>희망 포지션</LabelStyle>
        <InputsStyle>
          <RowRadioButtonsGroup
            defaultValue={info.interest}
            data={positionList}
            value={info.interest}
            onChange={(e) => handleChange(e, 'interest')}
          />
        </InputsStyle>
      </InputLineStyle>
      {/* 자기소개 */}
      <InputLineStyle>
        <LabelStyle>자기소개</LabelStyle>
        <InputsStyle>
          <TextField
            fullWidth
            id="standard-basic"
            variant="standard"
            multiline
            maxRows={4}
            value={info.profile_txt || ''}
            onChange={(e) => handleChange(e, 'profile_txt')}
          />
        </InputsStyle>
      </InputLineStyle>
      {/* 기술스택 */}
      <InputLineStyle>
        <LabelStyle>기술스택</LabelStyle>
        <InputsStyle>
          <MultipleSelectChip setTechList={setTechList}></MultipleSelectChip>
        </InputsStyle>
      </InputLineStyle>
      <ButtonStyle onClick={onSubmitHandler}>
        저장
        <BiSave />
      </ButtonStyle>
    </InputListStyle>
  );
};

export default InputBoxList;

const InputListStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem 2rem;
  width: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e0f4ff;
    border-radius: 10px;
    background-clip: padding-box;
    border: 1px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background-color: #617485;
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
  }
`;

const LabelStyle = styled.label`
  font-size: 0.8rem;
  color: #617485;
  margin-bottom: 0.2rem;
`;

const InputsStyle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const InputLineStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const ButtonStyle = styled.button`
  width: 5rem;
  height: 2rem;
  background-color: #799fc1;
  border: 1px solid #799fc0;
  border-radius: 8px;
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  font-family: 'korail_bold';
  cursor: pointer;
`;
