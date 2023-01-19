package com.ssafy.metassafy.dto.board;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@Getter
@Setter
@ToString
@EntityScan
public class BoardParameterDto {
    private String key;
    private String word;
}
