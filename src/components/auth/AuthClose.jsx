import React from 'react';

import { VscChromeClose } from 'react-icons/vsc';
import styled from 'styled-components';

const StyledDiv = styled.div`
  position: absolute;
  top: 15px;
  right: 10px;
  float: right;
  cursor: pointer;
`;

const AuthClose = (props) => {
  return (
    <StyledDiv onClick={props.onClose}>
      <VscChromeClose color="#ADB5BD" />
    </StyledDiv>
  );
};

export default AuthClose;
