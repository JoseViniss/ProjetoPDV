package br.ProjetoPDV.PDVfood.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ProjetoPDV.PDVfood.model.ItemComanda;
import br.ProjetoPDV.PDVfood.model.Produto;
import br.ProjetoPDV.PDVfood.model.Venda;
import br.ProjetoPDV.PDVfood.repository.ProdutoRepository;
import br.ProjetoPDV.PDVfood.repository.VendaRepository;

@Service
public class VendaService {
	
	@Autowired
	private VendaRepository vendaRepository;
	
	@Autowired
	private ProdutoRepository produtoRepository;
	
	@Transactional(readOnly = true)
	public List<Venda> getAll(){
		return vendaRepository.findAll();
	}
	
	@Transactional(readOnly = true)
	public List<Venda> buscaData(LocalDate dataVenda){
		return vendaRepository.buscaData(dataVenda);
	}
	
	@Transactional
	public Venda cadastrarVenda(Venda venda){
		Venda novaVenda = new Venda();
	    
	    List<ItemComanda> itensDaComanda = new ArrayList<>();
	    
	    for (ItemComanda item : venda.getItens()) {
	        Produto produtoOriginal = produtoRepository.findById(item.getProdutoID())
	            .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
	            
	        ItemComanda novoItem = new ItemComanda();
	        
	        novoItem.setProduto(produtoOriginal);
	        novoItem.setNome_produto(produtoOriginal.getNome());
	        novoItem.setValor_unitario(produtoOriginal.getValor_venda());
	        novoItem.setQuantidade_vendida(item.getQuantidade_vendida());
	        
	        BigDecimal subtotal = novoItem.getValor_unitario().multiply(new BigDecimal(novoItem.getQuantidade_vendida()));
	        novoItem.setSub_total(subtotal);
	        
	        novoItem.setVenda(novaVenda);
	        
	        itensDaComanda.add(novoItem);
	    }
	    
	    novaVenda.setItens(itensDaComanda);
	    
	    return vendaRepository.save(novaVenda);
	}
	
	@Transactional
	public ResponseEntity<?> removerVenda(Long id) {
		
		Optional<Venda> vendaOptional = vendaRepository.findById(id);
		
		if ( !vendaOptional.isPresent() )
		{ 
			return ResponseEntity.status(HttpStatus.FOUND).body("Venda não encontrada...");
		}
		
		vendaRepository.deleteById(id);
		
		return ResponseEntity.status(HttpStatus.OK).body("Game excluído com sucesso ...");
	}
	
}
