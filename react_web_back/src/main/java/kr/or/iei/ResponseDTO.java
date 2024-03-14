package kr.or.iei;

import org.springframework.http.HttpStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor //모든 매개변수가 있는 생성자
@Getter	//getter
@Schema(description = "응답데이터 형식")
public class ResponseDTO { //현재 기본생성자 없고, setter도 없음
	
	@Schema(description = "응답 코드", type = "number")
	private int code;
	@Schema(description = "응답 객체", type = "HttpStatus")
	private HttpStatus httpStatus;
	@Schema(description = "응답 메세지", type = "string")
	private String message;
	@Schema(description = "응답 데이터", type = "object")
	private Object data;
}
