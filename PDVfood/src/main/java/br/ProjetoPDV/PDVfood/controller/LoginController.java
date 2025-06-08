package br.ProjetoPDV.PDVfood.controller;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import br.ProjetoPDV.PDVfood.model.Usuario;
import br.ProjetoPDV.PDVfood.repository.UsuarioRepository;
import br.ProjetoPDV.PDVfood.services.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Controller
public class LoginController {
	
	@Autowired
	private UsuarioRepository usuario;
	
	@GetMapping("/login")
	private String login() {
		return "login";
	}
	
	@GetMapping("/cadastroUsuario")
	public String registrar() {
		return "registrar";
	}
	
	@PostMapping("/logar")
	public String loginUsuario(Usuario usuario, Model model, HttpServletResponse response) throws UnsupportedEncodingException {
		
		Usuario user = this.usuario.findByEmailAndSenha(usuario.getEmail(), usuario.getSenha());
		if(user != null) {
			CookieService.setCookie(response, "idUsuario", String.valueOf(user.getId()), 10000);
			CookieService.setCookie(response, "nomeUsuario", String.valueOf(user.getNome()), 10000);
			CookieService.setCookie(response, "imagemUsuario", String.valueOf(user.getImagem()), 10000);
			return "redirect:/";
		}
		
		model.addAttribute("erro", "Usuario inválido");
		return "login";
		
	}
	
	@GetMapping("/sair")
	public String sairUsuario(HttpServletResponse response) throws UnsupportedEncodingException{
			CookieService.setCookie(response, "idUsuario", "", 0);
			return "redirect:/";
		}
	
	
	@PostMapping("/cadastroUsuario")
	public String cadastroUsuario(@Valid Usuario usuario, BindingResult result) {
		
		if(result.hasErrors()) {
			return "redirect:/cadastroUsuario";
		}
		
		this.usuario.save(usuario);	
		
		return "redirect:/login";
	}
	
}
