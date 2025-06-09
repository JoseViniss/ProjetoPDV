package br.ProjetoPDV.PDVfood.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ProjetoPDV.PDVfood.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long>{
	Optional<Cliente>getByNome(String nome);
}
