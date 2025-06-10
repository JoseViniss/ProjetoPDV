package br.ProjetoPDV.PDVfood.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.ProjetoPDV.PDVfood.model.ItemComanda;

@Repository
public interface ItemComandaRepository extends JpaRepository<ItemComanda, Long>{
	
	@Query(nativeQuery = true, value="""
			SELECT * FROM item_comanda WHERE venda_id = :venda_id
			""")
	List<ItemComanda> itensVenda(Long venda_id);
}
