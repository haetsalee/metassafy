package com.ssafy.metassafy.controller.friend;

import com.ssafy.metassafy.dto.friend.FriendDto;
import com.ssafy.metassafy.dto.user.User;

import com.ssafy.metassafy.service.friend.FriendService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/friend")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Api("친구 컨트롤러  API V1")
@Slf4j
public class FriendController {
    private static final Logger logger = LoggerFactory.getLogger(FriendController.class);
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    @Autowired
    private FriendService service;

    //user_id의 친구 목록 조회
    @GetMapping("/getFriendList/{user_id}")
    public List<User> getFriendList(@PathVariable("user_id") String user_id){
        return service.getFrinedList(user_id);
    }

    //user_id의 친구 수 조회
    @GetMapping("/getFriendNum/{user_id}")
    public String getFriendNum(@PathVariable("user_id") String user_id){
        return service.getFrinedNum(user_id);
    }

    //user_id가 받은 모든 친구 신청 알람 보여줌
    @GetMapping("/getNotifyList/{user_id}")
    public List<FriendDto> getNotifyList(@PathVariable("user_id") String user_id){
        return service.getNotifyList(user_id);
    }
    //user_id가 알림창 입장해 있는 경우 실시간 알림
    //알림창에 입장한 걸로 connect 판단.
    @GetMapping(value="/receive/notify/{to_user_id}" ,produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter receiveNotify(@PathVariable("to_user_id") String user_id){
        SseEmitter sseEmitter = new SseEmitter(1000L * 60L * 15L);
        //503 방지 위한 더미 데이터 보내기
        try {
            sseEmitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        sseEmitter.onTimeout(() -> {
            sseEmitter.complete();
            service.removeEmitter(user_id);
            logger.info(user_id+"가 알람창 나감(timeout)");
        });

        service.setUserEmitter(user_id, sseEmitter); //sseEmitter 추가하고
        logger.info(user_id+"가 알람창 입장");

        return sseEmitter;
    }

    //친구 신청 보내기
    @GetMapping("/call/notify/{from_user_id}/{to_user_id}")
    public boolean callNotify(@PathVariable("from_user_id") String from_user_id,@PathVariable("to_user_id") String to_user_id) {
        if(service.isValidAdd(from_user_id,to_user_id)){
            service.sendMessage(to_user_id,from_user_id);
            logger.info(to_user_id+"에게 알림 보냄(컨트롤러)");
            return true; //신청 보내기 성공
        }
        return false; //이미 친구거나, 보낸 채로 방치한 친구신청이 있는 경우
    }

    //신청 수락
    @PostMapping("/acceptFriend")
    public void acceptFriend(@RequestBody FriendDto friend){
        service.acceptFriend(friend);
    }

    //신청 거절->테이블에서 삭제
    @PostMapping("/rejectFriend")
    public void rejectFriend(@RequestBody FriendDto friend){
        service.rejectFriend(friend);
    }



}
