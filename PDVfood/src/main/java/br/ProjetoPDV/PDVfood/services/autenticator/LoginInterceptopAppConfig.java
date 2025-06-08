package br.ProjetoPDV.PDVfood.services.autenticator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class LoginInterceptopAppConfig implements WebMvcConfigurer{
	
	@Autowired
	private LoginInterceptor logininterceptor;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(logininterceptor).excludePathPatterns(
					"/login",
					"/logar",
					"/error",
					"/cadastroUsuario"
				);
	}
	
}
