package kr.or.iei;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
		return http.httpBasic(HttpBasicConfigurer::disable)	//http 기본인증 제거. 즉 security 설치시 나타나는 기본 로그인창 안 쓰겠다.
				   .csrf(CsrfConfigurer::disable)			//CSRF 기본설정 제거
				   .cors(Customizer.withDefaults())			//CORS 기본설정 제거
				   //session 인증 사용 안 함(서버는 상태값을 갖지 않음 = stateless)
				   .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				   //일단 모든 요청에 대해서 승인(url별로 개별적으로 승인 할지말지는 추후에 인터셉터에서 로그인 체크 여부로 처리)
				   .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
				   .build();								//보안설정 객체 생성
	}
}
