package com.ssafy.metassafy.service.team;

import com.ssafy.metassafy.dto.team.Team;
import com.ssafy.metassafy.dto.user.User;

import java.util.List;

public interface TeamService {
    public void makeTeam(Team team,String user_id);
    public void deleteTeam(int team_no);
    public boolean isAlone(int team_no); //팀 삭제 전 혼자 남았는지 체크


    public void applyTeam(int team_no, String user_id); //apply 하면 user_id가 해당 트랙팀이 비어있는지 체크해야
    public boolean checkIsHaveTeam(String user_id,String team_no);

    public void acceptUser(int team_no,String user_id);
    public void rejectUser(int team_no,String user_id);
    public void removeUser(int team_no,String user_id);

    public void giveLeader(String user_id);
    public void goOutTeam(int team_no,String user_id);


    public Team getTeamInfo(int team_no);
    public List<User> getTeamUser(int team_no);



}
