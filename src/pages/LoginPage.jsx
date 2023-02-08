import AuthTitle from '../components/auth/AuthTitle';
import AuthClose from '../components/auth/login/AuthClose';
import LoginBottom from '../components/auth/login/LoginBottom';
import LoginPageForm from '../components/auth/login/LoginPageForm';
import styled from 'styled-components';

export default function LoginPage() {
  return (
    <LoginPageStyle>
      <div>
        {/* <AuthClose onClose={props.onClose} /> */}
        <AuthTitle title="METASSAFY!" subTitle="DIVE TO" />
        <LoginPageForm />
        <LoginBottom />
      </div>
    </LoginPageStyle>
  );
}

const LoginPageStyle = styled.div`
  /* background-color: white; */
  display: flex;
  justify-content: center;
`;