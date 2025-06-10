package br.ProjetoPDV.PDVfood.model;

import java.math.BigDecimal;

import io.micrometer.common.lang.NonNull;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Entity
public class ItemComanda {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NonNull
	private String nome_produto;
	
	@NotNull(message = "O valor de venda não pode ser nulo.")
	@DecimalMin(value = "0.01", message = "O valor de venda deve ser maior que zero.")
	private BigDecimal valor_unitario;
	
	@NonNull
	private Integer quantidade_vendida;
	
	@NotNull(message = "O valor de venda não pode ser nulo.")
	@DecimalMin(value = "0.01", message = "O valor de venda deve ser maior que zero.")
	private BigDecimal sub_total;
	
	@ManyToOne
	@JoinColumn(name = "venda_id", nullable = false)
	private Venda venda;
	
	@ManyToOne
	@JoinColumn(name = "produto_id")
	private Produto produto;
	
	
	
	public Long getId() {
		return id;
	}

	public String getNome_produto() {
		return nome_produto;
	}

	public void setNome_produto(String nome_produto) {
		this.nome_produto = nome_produto;
	}

	public BigDecimal getValor_unitario() {
		return valor_unitario;
	}

	public void setValor_unitario(BigDecimal valor_unitario) {
		this.valor_unitario = valor_unitario;
	}

	public Integer getQuantidade_vendida() {
		return quantidade_vendida;
	}

	public void setQuantidade_vendida(Integer quantidade_vendida) {
		this.quantidade_vendida = quantidade_vendida;
	}

	public BigDecimal getSub_total() {
		return sub_total;
	}

	public void setSub_total(BigDecimal sub_total) {
		this.sub_total = sub_total;
	}

	public Venda getVenda() {
		return venda;
	}

	public void setVenda(Venda venda) {
		this.venda = venda;
	}

	public Produto getProduto() {
		return produto;
	}

	public void setProduto(Produto produto) {
		this.produto = produto;
	}
	
	public Long getProdutoID() {
		return produto.getId();
	}
	
}
