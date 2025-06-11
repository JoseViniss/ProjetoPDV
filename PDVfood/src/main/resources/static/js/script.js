'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. DECLARAÇÃO DE VARIÁVEIS E ELEMENTOS DO DOM
    // =========================================================================
    
    // Elementos do Painel de Produtos
    const productContainer = document.getElementById("productContainer");
    const paginationControls = document.getElementById("paginationControls");
    const searchInput = document.getElementById('searchInput');
    const decreaseQuantityButton = document.getElementById('decreaseQuantity');
    const increaseQuantityButton = document.getElementById('increaseQuantity');
    const itemQuantityInput = document.getElementById('itemQuantity');
    const btnAddSelectedItemToOrder = document.getElementById('btnAddSelectedItemToOrder');
    const btnAddByCode = document.getElementById('btnAddByCode');
    const inputCodigoProduto = document.getElementById('inputCodigoProduto');
    
    // Elementos da Comanda (Painel Direito)
    const orderTableBody = document.getElementById('orderTableBody');
    const totalItemsCountEl = document.getElementById('totalItemsCount');
    const orderSubtotalEl = document.getElementById('orderSubtotal');
    const discountInput = document.getElementById('discountInput');
    const totalPayableEl = document.getElementById('totalPayable');
    const btnGoToPayment = document.getElementById('btnGoToPayment');
    const btnCancelOrder = document.getElementById('btnCancelOrder');
    
    // Elementos do Modal de Pagamento
    const paymentModalEl = document.getElementById('paymentModal');
    const paymentModalTotalEl = document.getElementById('paymentModalTotal');
    const cashPaymentDetailsEl = document.getElementById('cashPaymentDetails');
    const valorRecebidoInput = document.getElementById('valorRecebido');
    const trocoCalculadoEl = document.getElementById('trocoCalculado');
    const btnFinalizarVenda = document.getElementById('btnFinalizarVenda');

    // Elementos do Modal de Cliente
    const selectCliente = document.getElementById('selectCliente');
    const formAddClient = document.getElementById('formAddClient');
    const addClientModal = document.getElementById('addClientModal');

    // Variáveis de Estado da Aplicação
    let currentProducts = [...initialProducts];
    let selectedProduct = null;
    let orderItems = [];
    const productsPerPage = 6;
    let currentPage = 1;
    let totalPayableValue = 0;

    // =========================================================================
    // 2. FUNÇÕES PRINCIPAIS DA APLICAÇÃO
    // =========================================================================

    function formatCurrency(value) {
        return (typeof value === 'number' ? value : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function renderProducts() {
        productContainer.innerHTML = "";
        selectedProduct = null;
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = currentProducts.slice(startIndex, endIndex);

        if (paginatedProducts.length === 0) {
            productContainer.innerHTML = `<div class="col-12 text-center text-muted p-5">Nenhum produto encontrado.</div>`;
            return;
        }

        paginatedProducts.forEach(prod => {
            const col = document.createElement("div");
            col.className = "col-6 col-md-4 col-lg-4 mb-3";
            const card = document.createElement("div");
            card.className = "card product-card h-100";
            card.dataset.productId = prod.id;
            card.innerHTML = `<img src="${prod.imagem_produto}" class="card-img-top" alt="${prod.nome}"><div class="card-body"><h5 class="product-name">${prod.id} - ${prod.nome}</h5><p class="product-price">${formatCurrency(prod.valor_venda)}</p></div>`;
            card.addEventListener("click", () => {
                const currentlySelectedCard = productContainer.querySelector('.product-card.selected');
                if (currentlySelectedCard) currentlySelectedCard.classList.remove('selected');
                card.classList.add('selected');
                selectedProduct = prod;
                itemQuantityInput.value = 1;
            });
            col.appendChild(card);
            productContainer.appendChild(col);
        });
    }

    function setupPagination() {
        paginationControls.innerHTML = "";
        const totalPages = Math.ceil(currentProducts.length / productsPerPage);
        if (totalPages <= 1) return;
        const createPageItem = (content, page, isDisabled = false, isActive = false) => {
            const li = document.createElement('li');
            li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.innerHTML = content;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isDisabled) { currentPage = page; renderProductsAndPagination(); }
            });
            li.appendChild(a);
            return li;
        };
        paginationControls.appendChild(createPageItem('&laquo;', currentPage - 1, currentPage === 1));
        for (let i = 1; i <= totalPages; i++) {
            paginationControls.appendChild(createPageItem(i, i, false, i === currentPage));
        }
        paginationControls.appendChild(createPageItem('&raquo;', currentPage + 1, currentPage === totalPages));
    }

    function renderProductsAndPagination() {
        renderProducts();
        setupPagination();
    }
    
    function addProductToOrder(product, quantity) {
        if (!product || quantity < 1) return;
        const existingItem = orderItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            orderItems.push({ ...product, quantity });
        }
        renderOrderTable();
        updateOrderSummary();
    }

    function renderOrderTable() {
        orderTableBody.innerHTML = "";
        if (orderItems.length === 0) {
            orderTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted p-4">Nenhum item na comanda.</td></tr>`;
            updateOrderSummary(); 
            return;
        }
        orderItems.forEach((item, index) => {
            const subtotal = item.valor_venda * item.quantity;
            const row = orderTableBody.insertRow();
            row.innerHTML = `
                <td>${item.nome}</td>
                <td class="text-end">${formatCurrency(item.valor_venda)}</td>
                <td class="text-center">
                    <input type="number" class="form-control form-control-sm quantity-input-comanda" value="${item.quantity}" min="1" data-index="${index}">
                </td>
                <td class="text-end fw-medium subtotal-cell">${formatCurrency(subtotal)}</td>
                <td class="text-center">
                    <button class="btn btn-outline-danger btn-sm btn-delete-item" data-index="${index}" title="Remover item"><i class="bi bi-trash3"></i></button>
                </td>
            `;
        });
        updateOrderSummary();
    }

    function updateOrderSummary() {
        let itemsCount = 0;
        let subtotal = 0;
        orderItems.forEach(item => {
            itemsCount += item.quantity;
            subtotal += item.valor_venda * item.quantity;
        });
        const discountPercent = parseFloat(discountInput.value) || 0;
        const discountAmount = (subtotal * discountPercent) / 100;
        totalPayableValue = subtotal - discountAmount;
        totalItemsCountEl.textContent = itemsCount;
        orderSubtotalEl.textContent = formatCurrency(subtotal);
        totalPayableEl.textContent = formatCurrency(totalPayableValue);
    }

    function resetApplicationState() {
        const paymentModalInstance = bootstrap.Modal.getInstance(paymentModalEl);
        if(paymentModalInstance) paymentModalInstance.hide();
        orderItems = [];
        discountInput.value = 0;
        selectCliente.value = 0;
        searchInput.value = '';
        currentProducts = [...initialProducts];
        currentPage = 1;
        renderOrderTable();
        renderProductsAndPagination();
    }

    // =========================================================================
    // 3. EVENT LISTENERS (OUVINTES DE EVENTOS)
    // =========================================================================

    // --- Painel de Produtos ---
    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.toLowerCase();
        currentProducts = initialProducts.filter(prod => prod.nome.toLowerCase().includes(searchTerm));
        currentPage = 1;
        renderProductsAndPagination();
    });

    decreaseQuantityButton.addEventListener('click', () => { if (parseInt(itemQuantityInput.value) > 1) itemQuantityInput.value = parseInt(itemQuantityInput.value) - 1; });
    increaseQuantityButton.addEventListener('click', () => { itemQuantityInput.value = parseInt(itemQuantityInput.value) + 1; });
    btnAddSelectedItemToOrder.addEventListener('click', () => { if (selectedProduct) { addProductToOrder(selectedProduct, parseInt(itemQuantityInput.value)); const card = productContainer.querySelector('.product-card.selected'); if(card) card.classList.remove('selected'); selectedProduct = null; itemQuantityInput.value = 1; } else { alert("Por favor, selecione um produto da lista."); } });
    btnAddByCode.addEventListener('click', () => {
        const id = parseInt(inputCodigoProduto.value.trim());
        if (isNaN(id)) return alert("Por favor, insira um ID numérico válido.");
        const product = initialProducts.find(p => p.id === id);
        if (product) { addProductToOrder(product, 1); inputCodigoProduto.value = ""; } else { alert(`Produto com ID "${id}" não encontrado.`); }
    });

    // --- Painel da Comanda ---
    // APLICAÇÃO DE EVENT DELEGATION: Um listener para a tabela inteira
    orderTableBody.addEventListener('click', function(event) {
        const deleteButton = event.target.closest('.btn-delete-item');
        if (deleteButton) {
            const itemIndex = parseInt(deleteButton.dataset.index);
            orderItems.splice(itemIndex, 1);
            renderOrderTable();
        }
    });
    orderTableBody.addEventListener('input', function(event) {
        const quantityInput = event.target.closest('.quantity-input-comanda');
        if (quantityInput) {
            const index = parseInt(quantityInput.dataset.index);
            let newQuantity = parseInt(quantityInput.value);
            if (isNaN(newQuantity) || newQuantity < 1) { newQuantity = 1; quantityInput.value = 1; }
            orderItems[index].quantity = newQuantity;
            const item = orderItems[index];
            const newSubtotal = item.valor_venda * newQuantity;
            const row = quantityInput.closest('tr');
            row.querySelector('.subtotal-cell').textContent = formatCurrency(newSubtotal);
            updateOrderSummary();
        }
    });

    discountInput.addEventListener('input', updateOrderSummary);
    btnCancelOrder.addEventListener('click', () => { if (confirm("Tem certeza que deseja cancelar este pedido?")) { resetApplicationState(); } });

    // --- Modal de Pagamento ---
    btnGoToPayment.addEventListener('click', (event) => {
        if (orderItems.length === 0) {
            alert("Adicione itens à comanda antes de prosseguir.");
            event.stopImmediatePropagation();
            return;
        }
        paymentModalTotalEl.textContent = formatCurrency(totalPayableValue);
        cashPaymentDetailsEl.style.display = 'none';
        valorRecebidoInput.value = '';
        trocoCalculadoEl.textContent = formatCurrency(0);
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => radio.checked = false);
    });

    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            cashPaymentDetailsEl.style.display = event.target.value === 'dinheiro' ? 'block' : 'none';
        });
    });

    valorRecebidoInput.addEventListener('input', () => {
        const valorRecebido = parseFloat(valorRecebidoInput.value) || 0;
        const troco = valorRecebido - totalPayableValue;
        trocoCalculadoEl.textContent = formatCurrency(troco);
        trocoCalculadoEl.classList.toggle('text-danger', troco < 0);
        trocoCalculadoEl.classList.toggle('text-info', troco >= 0);
    });

    // CORRIGIDO E UNIFICADO: Listener para finalizar a venda
	// Substitua sua função 'btnFinalizarVenda' por esta:

	btnFinalizarVenda.addEventListener('click', () => {
	    // 1. Manter as validações iniciais que você já tem
	    if (orderItems.length === 0) {
	        alert("A comanda está vazia. Adicione itens antes de finalizar.");
	        return;
	    }

	    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
	    if (!selectedPaymentMethod) {
	        alert("Por favor, selecione uma forma de pagamento.");
	        return;
	    }

	    if (selectedPaymentMethod.value === 'dinheiro') {
	        const valorRecebido = parseFloat(valorRecebidoInput.value) || 0;
	        if (valorRecebido < totalPayableValue) {
	            alert("O valor recebido é menor que o total a pagar.");
	            return;
	        }
	    }

	    const itensParaEnviar = orderItems.map(item => {
	        return {
	            produtoId: item.id,
	            quantidade: item.quantity
	        };
	    });
	    
	    const vendaData = {
	        clienteId: document.getElementById('selectCliente').value, // Pega o ID do cliente selecionado
	        itens: itensParaEnviar
	    };

	    console.log("Enviando para o backend:", vendaData);

	    fetch('/vendas/cadastro', {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json',
	        },
	        body: JSON.stringify(vendaData),
	    })
	    .then(response => {
	        if (!response.ok) {
	            return response.json().then(err => { 
	                throw new Error(err.message || 'Falha ao registrar a venda.'); 
	            });
	        }
	        return response.json();
	    })
	    .then(vendaSalva => {
	        alert('Venda #' + vendaSalva.id + ' finalizada com sucesso!');
	        resetApplicationState(); 
	    })
	    .catch(error => {
	        console.error('Erro ao finalizar a venda:', error);
	        alert('Não foi possível registrar a venda. Erro: ' + error.message);
	    });
	});
    // --- Modal de Cliente ---
    if (formAddClient) {
        formAddClient.addEventListener('submit', (event) => {
            event.preventDefault();
            const clienteData = {
                nome: document.getElementById('nome').value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                uf: document.getElementById('uf').value
            };

            fetch('/save/cliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData),
            })
            .then(response => {
                if (!response.ok) throw new Error('Falha na resposta da rede: ' + response.statusText);
                return response.json();
            })
            .then(novoCliente => {
                const newOption = new Option(novoCliente.nome, novoCliente.id, false, true);
                selectCliente.add(newOption);
                selectCliente.value = novoCliente.id;
                const clientModal = bootstrap.Modal.getInstance(addClientModal);
                clientModal.hide();
                formAddClient.reset();
                alert('Cliente cadastrado com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao cadastrar cliente:', error);
                alert('Ocorreu um erro ao cadastrar o cliente.');
            });
        });
    }

    // =========================================================================
    // 4. INICIALIZAÇÃO DA PÁGINA
    // =========================================================================
    renderProductsAndPagination();
    renderOrderTable();
});