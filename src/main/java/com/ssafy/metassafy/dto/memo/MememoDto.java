package com.ssafy.metassafy.dto.memo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.boot.autoconfigure.domain.EntityScan;

//댓글들 (작성자이름, 날짜, 내용, 내가좋아요, 좋아요수)
@Getter
@Setter
@ToString
@EntityScan
public class MememoDto {
    private int mememo_no;
    private String user_id;
    private int memo_no;
    private String content;
    private int mememo_like;
    private int my_like;
    private String regtime;
    private String name;
}
