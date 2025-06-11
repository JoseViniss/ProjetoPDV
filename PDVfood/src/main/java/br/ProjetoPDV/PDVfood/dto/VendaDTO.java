package br.ProjetoPDV.PDVfood.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class VendaDTO {
	
	private Long id;

	private Long clienteId;
	
	private String nomeCliente;

	private List<ItemComandaDTO> itens;
	
	private LocalDate dataVenda;
	
	private BigDecimal valorTotal;
	
	public VendaDTO() {}

	public List<ItemComandaDTO> getItens() {
		return itens;
	}

	public void setItens(List<ItemComandaDTO> itens) {
		this.itens = itens;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}

	public LocalDate getDataVenda() {
		return dataVenda;
	}

	public void setDataVenda(LocalDate dataVenda) {
		this.dataVenda = dataVenda;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeCliente() {
		return nomeCliente;
	}

	public void setNomeCliente(String nomeCliente) {
		this.nomeCliente = nomeCliente;
	}

	public BigDecimal getValorTotal() {
		return valorTotal;
	}

	public void setValorTotal(BigDecimal valorTotal) {
		this.valorTotal = valorTotal;
	}
	
}
