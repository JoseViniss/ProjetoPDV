package br.ProjetoPDV.PDVfood.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ProjetoPDV.PDVfood.model.Produto;
import br.ProjetoPDV.PDVfood.repository.ProdutoRepository;
import jakarta.validation.Valid;

@Service
public class ProdutoService {
	
	@Autowired
	private ProdutoRepository produtoRepository;
	
	@Transactional(readOnly = true)
	public List<Produto> getAll(){
		return produtoRepository.findAll();
	}
	
	@Transactional
	public Produto cadstroProduto(@Valid Produto produto) {
		return produtoRepository.save(produto);
	}
	
}
