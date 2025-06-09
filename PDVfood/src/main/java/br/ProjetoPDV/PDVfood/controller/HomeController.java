package br.ProjetoPDV.PDVfood.controller;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import br.ProjetoPDV.PDVfood.model.Cliente;
import br.ProjetoPDV.PDVfood.services.ClienteService;
import br.ProjetoPDV.PDVfood.services.CookieService;
import br.ProjetoPDV.PDVfood.services.ProdutoService;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class HomeController {
	
	@Autowired
    private ProdutoService produtoService;
	
	@Autowired
    private ClienteService clienteService;
	
	@GetMapping("/")
	public String home(Model model, HttpServletRequest request) throws UnsupportedEncodingException{
		
		model.addAttribute("nome",CookieService.getCookie(request, "nomeUsuario"));
		model.addAttribute("imagem",CookieService.getCookie(request, "imagemUsuario"));
		model.addAttribute("produtos", produtoService.getAll());
		model.addAttribute("clientes", clienteService.getAll());
		
		 if (!model.containsAttribute("cliente")) {
	            model.addAttribute("cliente", new Cliente());
	        }

			return "index";
		}
	
	@GetMapping("cadastro/produto")
	public String paginaCadastro(Model model, HttpServletRequest request) throws UnsupportedEncodingException{
		
		model.addAttribute("nome",CookieService.getCookie(request, "nomeUsuario"));
		model.addAttribute("imagem",CookieService.getCookie(request, "imagemUsuario"));
		
		return "cadastro_produto";
	}
}
