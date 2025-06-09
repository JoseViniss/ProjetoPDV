package br.ProjetoPDV.PDVfood.model;

import java.math.BigDecimal;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;

@Entity
public class Produto {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty
	private String nome;
	
	@NotEmpty
	private BigDecimal valor_venda;
	
	@NotEmpty
	@Column(name = "imagem")
	private String imagem_produto;
	
	
	
	// GETTERS E SETTERS
	public long getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public BigDecimal getValor_venda() {
		return valor_venda;
	}

	public void setValor_venda(BigDecimal valor_venda) {
		this.valor_venda = valor_venda;
	}

	public String getImagem_produto() {
		return imagem_produto;
	}

	public void setImagem_produto(String imagem_produto) {
		this.imagem_produto = imagem_produto;
	}
	
	
}
