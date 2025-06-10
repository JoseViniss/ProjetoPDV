package br.ProjetoPDV.PDVfood.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ProjetoPDV.PDVfood.model.ItemComanda;

import br.ProjetoPDV.PDVfood.repository.ItemComandaRepository;

@Service
public class ItemComandaService {
	
	@Autowired
	private ItemComandaRepository itemRepository;
	
	@Transactional(readOnly = true)
	public List<ItemComanda> itensVenda(Long id){
		return itemRepository.itensVenda(id);
	}
}
