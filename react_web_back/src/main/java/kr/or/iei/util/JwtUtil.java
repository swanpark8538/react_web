package kr.or.iei.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	@Value("${jwt.secret}")//=application.properties에서 선언한 secret값
	private String secret;
	
	//access token을 생성하는 메소드( param1 : 토큰에 저장할 정보(=식별자), param2 : 토근 유효시간(즉 만료시간)(시간 단위 ms, type은 long) )
	public String createToken(String memberId, long expiredDateMs) {
		Claims claims = Jwts.claims();//Claims = 생성하는 토큰을 통해서 얻을 수 있는 값을 저장하는 map객체
		claims.put("memberId", memberId);//이 map에 key로 memberId, value로 memberId를 저장
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());//우리가 지정한 문자열(secret)을 암호화코드를 생성
		
		return Jwts.builder()				//JWT토큰 생성 시작
				.setClaims(claims)			//아이디 정보 세팅
				.setIssuedAt(new Date(System.currentTimeMillis()))					//인증 시작시간 = 현재 시스템 시간
				.setExpiration(new Date(System.currentTimeMillis()+expiredDateMs))	//인증 만료시간 = 현재 시스템 시간 + 1시간
				.signWith(key, SignatureAlgorithm.HS256)	//암호화할 때 사용할 key값 및 알고리즘
				.compact();					//위 내용들 종합해서 JWT토큰 생성
		/*
		token에 포함되는 정보
		1. 회원을 식별할 수 있는 식별자(여기선 memberId 사용)
		2. 로그인 성공 시각(인증 시작시각)
		3. 로그인 만료 시간(인증 만료시간)
		 */
		//https://jwt.io/에 들어가서 알고리즘 HS256으로 설정하고, accessToken값을 encoded에 붙여넣으면, 오른쪽에 해석이 뜸(색으로 구분됨). 그러나 key는 해석 못함 당연히. 
	}
	
	//매개변수로 토큰을 받아서, 토큰시간이 만료되었는지 체크하는 메소드
	public boolean isExpired(String token) {
		//키 암호화
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		//Jwt 객체에 시크릿키(인증정보가 정상인지 체크하는 용도), 토큰(사용자가 보낸 값), 현재시간이랑 비교해서 만료되었는지
		return Jwts.parserBuilder()
				   .setSigningKey(key).build()
				   .parseClaimsJws(token)				//토큰 가져옴
				   .getBody()							//토큰의 바디만 가져옴
				   .getExpiration().before(new Date());	//인증시간이 현재시간보다 before면(=즉 만료되었으면) true
	}
	
	//매개변수로 토큰을 받아서 회원 아이디 값을 추출하는 메소드
	public String getMemberId(String token) {
		//키 암호화
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		//Jwt 객체에 시크릿키(인증정보가 정상인지 체크하는 용도), 토큰(사용자가 보낸 값), 현재시간이랑 비교해서 만료되었는지
		return Jwts.parserBuilder()
				   .setSigningKey(key).build()
				   .parseClaimsJws(token)				//토큰 가져옴
				   .getBody()							//토큰의 바디만 가져옴
				   .get("memberId", String.class);		//memberId를 String으로 가져옴
	}
}
