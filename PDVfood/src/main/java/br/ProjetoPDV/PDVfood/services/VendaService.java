package br.ProjetoPDV.PDVfood.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ProjetoPDV.PDVfood.dto.ItemComandaDTO;
import br.ProjetoPDV.PDVfood.dto.VendaDTO;
import br.ProjetoPDV.PDVfood.model.Cliente;
import br.ProjetoPDV.PDVfood.model.ItemComanda;
import br.ProjetoPDV.PDVfood.model.Produto;
import br.ProjetoPDV.PDVfood.model.Venda;
import br.ProjetoPDV.PDVfood.repository.ClienteRepository;
import br.ProjetoPDV.PDVfood.repository.ProdutoRepository;
import br.ProjetoPDV.PDVfood.repository.VendaRepository;

@Service
public class VendaService {
	
	@Autowired
	private VendaRepository vendaRepository;
	
	@Autowired
	private ProdutoRepository produtoRepository;
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	@Transactional(readOnly = true)
	public List<Venda> getAll(){
		return vendaRepository.findAll();
	}
	
	@Transactional(readOnly = true)
    public List<VendaDTO> findAllAsDto() {
        return vendaRepository.findAll().stream()
                .map(this::convertToVendaListDto)
                .collect(Collectors.toList());
    }
	
	@Transactional(readOnly = true)
	private VendaDTO convertToVendaListDto(Venda venda) {
        VendaDTO dto = new VendaDTO();
        dto.setId(venda.getId());
        dto.setDataVenda(venda.getDataVenda());
        dto.setValorTotal(venda.getValor_total());
        
        if (venda.getCliente() != null) {
            dto.setNomeCliente(venda.getCliente().getNome());
        } else {
            dto.setNomeCliente("Consumidor Final");
        }

        List<ItemComandaDTO> itensDto = venda.getItens().stream().map(itemVenda -> {
            ItemComandaDTO itemDto = new ItemComandaDTO();
            itemDto.setNomeProduto(itemVenda.getProduto().getNome());
            itemDto.setQuantidade(itemVenda.getQuantidade_vendida());
            itemDto.setValorUnitario(itemVenda.getValor_unitario());
            itemDto.setSubtotal(itemVenda.getSub_total());
            return itemDto;
        }).collect(Collectors.toList());
        
        dto.setItens(itensDto);

        return dto;
    }

	
	@Transactional(readOnly = true)
	public List<Venda> buscaData(LocalDate dataVenda){
		return vendaRepository.buscaData(dataVenda);
	}
	
	@Transactional
	public Venda cadastrarVenda(VendaDTO vendaDTO) {
	    
		Venda novaVenda = new Venda();
		
		Cliente cliente = clienteRepository.findById(vendaDTO.getClienteId()).orElse(null);
	    novaVenda.setCliente(cliente);
	    
	    BigDecimal totalBruto = BigDecimal.ZERO;
	    
	    List<ItemComanda> itensDaComanda = new ArrayList<>();
	    
	    for (ItemComandaDTO itemDTO : vendaDTO.getItens()) {
	        Produto produtoOriginal = produtoRepository.findById(itemDTO.getProdutoId())
	            .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
	            
	        ItemComanda novoItem = new ItemComanda();
	        
	        novoItem.setProduto(produtoOriginal);
	        novoItem.setNome_produto(produtoOriginal.getNome());
	        novoItem.setValor_unitario(produtoOriginal.getValor_venda());
	        novoItem.setQuantidade_vendida(itemDTO.getQuantidade());
	        
	        BigDecimal subtotal = novoItem.getValor_unitario().multiply(new BigDecimal(novoItem.getQuantidade_vendida()));
	        novoItem.setSub_total(subtotal);
	        
	        novoItem.setVenda(novaVenda);
	        
	        itensDaComanda.add(novoItem);
	        
	        totalBruto = totalBruto.add(subtotal);
	    }
	    
	    novaVenda.setItens(itensDaComanda);
	    
	    novaVenda.setValor_total(totalBruto);
	    
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
		
		return ResponseEntity.status(HttpStatus.OK).body("Venda excluído com sucesso ...");
	}
	
}
