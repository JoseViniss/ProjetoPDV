package br.ProjetoPDV.PDVfood.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.ProjetoPDV.PDVfood.model.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long>{
	
	@Query(nativeQuery = true, value = """
				SELECT * FROM venda WHERE data_venda = :dataBusca
			""")
	List<Venda> buscaData(LocalDate dataBusca);
	
}
