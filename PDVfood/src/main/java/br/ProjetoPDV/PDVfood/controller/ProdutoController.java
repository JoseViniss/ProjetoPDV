package br.ProjetoPDV.PDVfood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ProjetoPDV.PDVfood.model.Produto;
import br.ProjetoPDV.PDVfood.services.ProdutoService;

@RestController
@RequestMapping("/produto")
public class ProdutoController {
	
	@Autowired
	private ProdutoService produtoService;
	
	@PostMapping("/save")
	public ResponseEntity<Produto> cadastroProduto(@RequestBody Produto produto) {
		try {
			Produto inserir = produtoService.cadstroProduto(produto);
			return ResponseEntity.ok(inserir);
		}catch (Exception e){
			return ResponseEntity.badRequest().build();
		}
	}

}
