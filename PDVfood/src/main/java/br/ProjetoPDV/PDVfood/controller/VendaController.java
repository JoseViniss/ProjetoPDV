package br.ProjetoPDV.PDVfood.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import br.ProjetoPDV.PDVfood.model.Venda;
import br.ProjetoPDV.PDVfood.services.VendaService;

@RestController
public class VendaController {
	
	@Autowired
	VendaService vendaService;
	
	@GetMapping("/lancadas")
	public List<Venda> listaVendas(){
		return vendaService.getAll();
	}
	
	@GetMapping("/datas")
	public List<Venda> listaVendas(@RequestBody LocalDate data){
		return vendaService.buscaData(data);
	}
	
	@PostMapping("/vendas/cadastro")
	public ResponseEntity<Venda> cadastroVenda(@RequestBody Venda vendaNova) {
		try {
			Venda inserir = vendaService.cadastrarVenda(vendaNova);
			return ResponseEntity.ok(inserir);
		}catch (Exception e){
			return ResponseEntity.badRequest().build();
		}
	}
	
}
