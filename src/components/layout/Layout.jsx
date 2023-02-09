import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import MainNavigation from './MainNavigation';

function Layout(props) {
  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
      <MainNavigation />
      {/* </div> */}
      <MainStyle>
        <Outlet />
      </MainStyle>
    </div>
  );
}

export default Layout;

const MainStyle = styled.main`
  // margin: 3rem auto;
  /* width: 100%; */
  min-height: 100vh;
  background-color: #c2fbfb;
  /* position: absolute;
  top: 0; */
  // max-width: 40rem;
  // margin: 10rem;
`;