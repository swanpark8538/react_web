package kr.or.iei.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LoginInterceptor implements HandlerInterceptor {

	@Autowired
	private JwtUtil jwtUtil;
	
	//아래 preHandle은 control+space 자동완성 중에 있음
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		//로그인을 성공한 후에 요청이 들어오면, header에서 인증토큰을 꺼냄 (HttpHeaders는 lang이 아니라 springframework꺼를 import)
		//왜 header에서 꺼내냐? front에서 마이페이지에 해당하는 MemberInfo.js에 들어가서 보면
		//axios로 get 할때 보내는 객체의 key가 header이고, value가 객체임. 그 객체는 {Authorization: "Bearer " + token}임.
		String auth = request.getHeader(HttpHeaders.AUTHORIZATION);//key인 header의 value인 객체 안에서 key가 Authorization임 ㅋㅋ
		//System.out.println("헤더에서 꺼낸 정보 : "+auth);// = Bearer 토큰값
		//↑ : 헤더에서 꺼낸 정보 예시 : Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6InVzZXIwMSIsImlhdCI6MTcxMDQ4MzYzMywiZXhwIjoxNzEwNDg3MjMzfQ.PCcJrZOWUFj1A_3oNf2XGJp2DE2RlSSH8pdykLgNNuM
		
		//1. 인증토큰이 없거나 잘못된 값을 보낸 경우
		if(auth == null || auth.indexOf("null") != -1 || !auth.startsWith("Bearer ")) { //indexOf 이거는 로그아웃 로직 만들다가 실수할 수 있어서 넣어둔거
			return false; //이후 컨트롤러 실행 X
		}
		//여기까지 왔다면 인증코드값은 형식에 맞는 상태
		//2. 인증시간이 만료되었는지 체크
		String token = auth.split(" ")[1];//"Bearer 토큰값"에서 토큰값만 가져옴
		if(jwtUtil.isExpired(token)) {//true = 인증시간 만료
			return false;
		}
		
		//여기까지 왔다면, 1.인증정보 정상이고, 2.만료 이전 상태임. 즉 정상요청임.
		//이후 컨트롤러에서 로그인한 회원 아이디를 사용할 수 있도록, 토큰값에서 아이디를 추출해서 등록
		String memberId = jwtUtil.getMemberId(token);
		request.setAttribute("memberId", memberId);
		//이제 인터셉터 통과 -> emmberController의 getMember메소드로 memberId가 들어감
		return true;
	}
}
