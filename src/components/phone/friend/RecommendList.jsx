import React, { useState } from 'react';
import styled from 'styled-components';
import RecommendListItem from './RecommendListItem';
import API from '../../../utils/api';
import { getJsonLocalUserInfo } from '../../../utils/local-storage';

const RecommendList = () => {
  const [friends, setFriends] = useState([]);
  const user = getJsonLocalUserInfo();
  console.log(user, '---------------');
  API.get(`/friend/getRecommendFriendList`, {
    params: { user_id: user.user_id, area: user.area, interest: user.interest },
  }).then((res) => {
    setFriends(res.data);
  });

  return (
    <FriendListStyle>
      {friends.map((friend) => (
        <RecommendListItem key={friend.id} friend={friend} />
      ))}
    </FriendListStyle>
  );
};

export default RecommendList;

const FriendListStyle = styled.div`
  padding: 0.5rem;
  border-radius: 1rem 1rem 1rem 0rem;
`;
