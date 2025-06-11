package br.ProjetoPDV.PDVfood.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.ProjetoPDV.PDVfood.dto.VendaDTO;
import br.ProjetoPDV.PDVfood.model.Venda;
import br.ProjetoPDV.PDVfood.services.VendaService;

@RestController
public class VendaController {
	
	@Autowired
	VendaService vendaService;
	
	@GetMapping("/vendas")
    public ResponseEntity<List<VendaDTO>> listarVendas() {
        List<VendaDTO> vendas = vendaService.findAllAsDto();
        return ResponseEntity.ok(vendas);
    }
	
	@GetMapping("/datas")
	public List<Venda> listaVendas(@PathVariable LocalDate data){
		return vendaService.buscaData(data);
	}
	
	@PostMapping("/vendas/cadastro")
	public ResponseEntity<Venda> cadastroVenda(@RequestBody VendaDTO vendaDTO) {
		Venda novaVenda = vendaService.cadastrarVenda(vendaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaVenda);
	}
	
	@DeleteMapping("/excluir/{id}")
	public ResponseEntity<?> excluirVenda(@PathVariable Long id){
		return vendaService.removerVenda(id);
	}
	
}
