package br.ProjetoPDV.PDVfood.controller;

import java.io.UnsupportedEncodingException;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import br.ProjetoPDV.PDVfood.services.CookieService;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class HomeController {
	@GetMapping("/")
	public String home(Model model, HttpServletRequest request) throws UnsupportedEncodingException{
		model.addAttribute("nome",CookieService.getCookie(request, "nomeUsuario"));
		model.addAttribute("imagem",CookieService.getCookie(request, "imagemUsuario"));
		return "index";
	}
}
