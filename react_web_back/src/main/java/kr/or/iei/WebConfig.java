package kr.or.iei;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.or.iei.util.LoginInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer{

	@Autowired
	private LoginInterceptor loginInterceptor;
	
	
	//alt+shift+s -> v -> addResourceHandlers 선택
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/board/editor/**")
				.addResourceLocations("file:///C:/Temp/react/boardEditor/");
		registry.addResourceHandler("/board/thumbnail/**")
				.addResourceLocations("file:///C:/Temp/react/board/");
	}
	//alt+shift+s -> v -> addCorsMappings 선택
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// TODO Auto-generated method stub
		WebMvcConfigurer.super.addCorsMappings(registry);
	}

	
	//alt+shift+s -> v -> addInterceptors 선택
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(loginInterceptor)
				.addPathPatterns("/member/**", 
								 "/board/**",
								 "/admin/**")
				.excludePathPatterns("/member/login", "/member/id/*", "/member/join",
									 "/board/list/*", "/board/editor/*", "/board/thumbnail/*", "/board/one/*", "/board/file/*");
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	
}
