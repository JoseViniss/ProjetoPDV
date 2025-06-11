// Salve em public/js/script_vendas.js

document.addEventListener('DOMContentLoaded', () => {

    const accordionContainer = document.getElementById('accordionVendas');
    const formBuscaVendas = document.getElementById('formBuscaVendas');
    const btnLimparBusca = document.getElementById('btnLimparBusca');
    const placeholder = document.getElementById('vendasPlaceholder');

    const formatCurrency = (value) => (typeof value === 'number' ? value : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        const options = {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleString('pt-BR', options);
    };

    const fetchAndRenderVendas = (url = '/vendas') => {
        placeholder.style.display = 'block';
        accordionContainer.innerHTML = '';
        accordionContainer.appendChild(placeholder);

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao buscar vendas.');
                return response.json();
            })
            .then(vendas => { // <-- MUDANÇA AQUI! Não precisamos mais de 'pageData.content'
                placeholder.style.display = 'none';

                if (!vendas || vendas.length === 0) {
                    accordionContainer.innerHTML = '<div class="text-center p-5 bg-white rounded shadow-sm">Nenhuma venda encontrada para os critérios informados.</div>';
                    return;
                }

                vendas.forEach(venda => {
                    const accordionItem = document.createElement('div');
                    accordionItem.className = 'accordion-item';
                    
                    // O HTML do accordion com um botão de excluir separado para melhor clique
                    accordionItem.innerHTML = `
					<h2 class="accordion-header" id="heading-${venda.id}">
					           <div class="d-flex w-100 align-items-center">
					               
					               <button class="accordion-button collapsed p-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${venda.id}" aria-expanded="false" aria-controls="collapse-${venda.id}">
					                   
					                   <div class="row w-100 align-items-center gx-3">
					                       
					                       <div class="col-4 col-sm-3 col-lg-2">
					                           <span class="fw-bold">Venda #${venda.id}</span>
					                       </div>
					                       
					                       <div class="col-sm-4 col-lg-4 d-none d-sm-block">
					                           <div class="d-flex align-items-center text-muted">
					                               <i class="bi bi-person-fill me-2"></i>
					                               <span>${venda.nomeCliente}</span>
					                           </div>
					                       </div>

					                       <div class="col-lg-3 d-none d-lg-block">
					                            <div class="d-flex align-items-center text-muted">
					                               <i class="bi bi-calendar3 me-2"></i>
					                               <span>${venda.dataVenda}</span>
					                           </div>
					                       </div>

					                       <div class="col-7 col-sm-4 col-lg-3 text-end ms-auto">
					                           <span class="fs-6 fw-bold text-success">${formatCurrency(venda.valorTotal)}</span>
					                       </div>

					                   </div>
					               </button>

					               <button class="btn btn-sm btn-outline-danger ms-2 me-3 btn-delete-venda" data-venda-id="${venda.id}" title="Excluir Venda">
					                   <i class="bi bi-trash3-fill"></i>
					               </button>
					           </div>
					       </h2>
					       <div id="collapse-${venda.id}" class="accordion-collapse collapse" aria-labelledby="heading-${venda.id}" data-bs-parent="#accordionVendas">
					           <div class="accordion-body bg-light">
					               <h6 class="mb-3">Detalhes do Pedido</h6>
					               <table class="table table-sm table-striped table-bordered table-details">
					                   <thead>
					                       <tr>
					                           <th>Produto</th>
					                           <th class="text-end">Qtd.</th>
					                           <th class="text-end">Valor Unit.</th>
					                           <th class="text-end">Subtotal</th>
					                       </tr>
					                   </thead>
					                   <tbody>
					                       ${venda.itens.map(item => `
					                           <tr>
					                               <td>${item.nomeProduto}</td>
					                               <td class="text-end">${item.quantidade}</td>
					                               <td class="text-end">${formatCurrency(item.precoUnitario)}</td>
					                               <td class="text-end fw-medium">${formatCurrency(item.subtotal)}</td>
					                           </tr>
					                       `).join('')}
					                   </tbody>
					               </table>
					           </div>
					       </div>
                    `;
                    accordionContainer.appendChild(accordionItem);
                });
            })
            .catch(error => {
                console.error(error);
                placeholder.style.display = 'none';
                accordionContainer.innerHTML = '<div class="alert alert-danger text-center">Falha ao carregar vendas. Tente novamente mais tarde.</div>';
            });
    };

    formBuscaVendas.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('buscaId').value;
        const data = document.getElementById('buscaData').value;
        
        const params = new URLSearchParams();
        if (id) params.append('id', id);
        if (data) params.append('data', data);

        fetchAndRenderVendas(`/vendas/filtro?${params.toString()}`);
    });

    btnLimparBusca.addEventListener('click', () => {
        formBuscaVendas.reset();
        fetchAndRenderVendas();
    });

    accordionContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.btn-delete-venda');
        if (deleteButton) {
            const vendaId = deleteButton.dataset.vendaId;
            if (confirm(`Tem certeza que deseja excluir a Venda #${vendaId}?`)) {
                fetch(`/excluir/${vendaId}`, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) throw new Error('Falha ao excluir a venda.');
                        deleteButton.closest('.accordion-item').remove();
                        alert(`Venda #${vendaId} excluída com sucesso.`);
                    })
                    .catch(error => {
                        console.error(error);
                        alert(error.message);
                    });
            }
        }
    });

    // Carga inicial
    fetchAndRenderVendas();
});