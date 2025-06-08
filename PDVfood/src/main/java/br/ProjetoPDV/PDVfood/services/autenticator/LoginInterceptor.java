package br.ProjetoPDV.PDVfood.services.autenticator;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import br.ProjetoPDV.PDVfood.services.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LoginInterceptor implements HandlerInterceptor{
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
		
		if(CookieService.getCookie(request, "idUsuario") != null) {
			return true;
		}
		
		response.sendRedirect("/login");
		return false;
		
	}
}
