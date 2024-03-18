package kr.or.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.iei.ResponseDTO;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.service.MemberService;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/member")
@Tag(name="MEMBER", description = "MEMBER API")
public class MemberController {

	@Autowired
	private MemberService memberService;
	
	@Operation(summary = "아이디 중복체크", description = "매개변수로 전달받은 아이디의 사용가는ㅇ여부 조회")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@GetMapping(value="/id/{memberId}")
	public ResponseEntity<ResponseDTO> selectOneMember(@PathVariable String memberId){
		Member member = memberService.selectOneMember(memberId);
		if(member == null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary = "회원가입", description = "회원 정보 객체를 받아서 member_tbl에 등록")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value="/join")
	public ResponseEntity<ResponseDTO> join(@RequestBody Member member){
		int result = memberService.insertMember(member);
		if(result>0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary = "로그인", description = "아이디와 비밀번호를 받아서 로그인")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value="/login")
	public ResponseEntity<ResponseDTO> login(@RequestBody Member member){
		//Member m = memberService.login(member); 토근 쓰기 전에 사용하던 방식
		String accessToken = memberService.login(member);
		if(accessToken != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", accessToken);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@GetMapping
	public ResponseEntity<ResponseDTO> getMember(@RequestAttribute String memberId){
		/*
		memberId를 RequestBody에서 꺼내는게 아니라 RequestAttribute에서 꺼내는 이유는
		로그인 인터셉터 통과시 아래 코드가 동작하기 때문
		String memberId = jwtUtil.getMemberId(token);
		request.setAttribute("memberId", memberId);
		 */
		//인터셉터에서 memberId 가져옴(가져오는 과정 엄청 길다... 근데 할만함)
		Member member = memberService.selectOneMember(memberId);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		//이미 로그인 성공이므로 여기서 다시 get할땐 실패할 수가 없음.
	}
	
	@PatchMapping(value="/phone")
	public ResponseEntity<ResponseDTO> updatePhone(@RequestBody Member member){
		int result = memberService.updatePhone(member);
		if(result>0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@DeleteMapping///(value="/{memberId}")를 안 적은 이유는, 인터셉터가 알아서 보내주니까(getMember메소드 확인)
	public ResponseEntity<ResponseDTO> delete(@RequestAttribute String memberId){
		int result = memberService.deleteMember(memberId);
		if(result>0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PostMapping(value="/pw")
	public ResponseEntity<ResponseDTO> checkPw(@RequestBody Member member, @RequestAttribute String memberId){
		//member객체에는 지금 memberPw만 값이 들어있고, memberId 등은 null인 상태임
		//select하기 위해선 memberId도 필요함.
		//그래서 인터셉터에서 로그인시 저장한 memberId도 같이 꺼내옴 :  @RequestAttribute String memberId
		member.setMemberId(memberId);
		int result = memberService.checkPw(member);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "valid", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "invalid", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PatchMapping(value="/pw")//위와 같은 pw지만 메소드가 달라서 괜찮음
	public ResponseEntity<ResponseDTO> changePw(@RequestBody Member member, @RequestAttribute String memberId){
		member.setMemberId(memberId);
		//PasswordEncAdvice클래스의 pwEncPointcut 메소드 조건 확인하고 아래 코드 볼 것
		int result = memberService.changePwMember(member);
		if(result>0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
}
