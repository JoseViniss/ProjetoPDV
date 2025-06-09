package br.ProjetoPDV.PDVfood.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.ProjetoPDV.PDVfood.model.Cliente;
import br.ProjetoPDV.PDVfood.repository.ClienteRepository;
import jakarta.validation.Valid;

@Service
public class ClienteService {
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	@Transactional(readOnly = true)
	public List<Cliente> getAll(){
		return clienteRepository.findAll();
	}
	
	@Transactional
	public Cliente cadastroCliente(@Valid Cliente cliente) {
		return clienteRepository.save(cliente);
	}
	
	public Cliente getClienteById(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }
}
