package br.ProjetoPDV.PDVfood.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import br.ProjetoPDV.PDVfood.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long>{
	Optional<Produto>findByNome(String nome);
}
