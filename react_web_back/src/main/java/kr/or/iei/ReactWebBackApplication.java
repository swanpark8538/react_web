package kr.or.iei;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication(exclude= {SecurityAutoConfiguration.class})//암호화 기본세팅 제거
@EnableAspectJAutoProxy(proxyTargetClass = true)//관점지향프로그래밍 적용
public class ReactWebBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactWebBackApplication.class, args);
	}

}
