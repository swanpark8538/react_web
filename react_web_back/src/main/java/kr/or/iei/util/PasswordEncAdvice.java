package kr.or.iei.util;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import kr.or.iei.member.model.dto.Member;

@Aspect//=AOP 적용
@Component
public class PasswordEncAdvice {

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
							  //returnType:int		경로					//Member로 끝나는 모든메소드	(Member객체-주소적어야함)
	@Pointcut(value="execution (int kr.or.iei.member.model.service.MemberService.*Member(kr.or.iei.member.model.dto.Member))")
	public void pwEncPointcut() {}
	
	@Before(value="pwEncPointcut()")//pwEncPointcut메소드 실행 전에 동작하라
	public void pwEncAdvice(JoinPoint jp) {
		Object[] args = jp.getArgs();//매개변수 가져와!
		Member member = (Member)args[0];//Member객체로 변경
		String encPw = bCryptPasswordEncoder.encode(member.getMemberPw());//암호화
		member.setMemberPw(encPw);//Member객체 pw를 암호화한 pw로 변경
	}
}
