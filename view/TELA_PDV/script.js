document.addEventListener('DOMContentLoaded', () => {
    // A lista `initialProducts` permanece a mesma de antes.
    const initialProducts = [
        { id: 1, name: "Pizza Calabresa Especial da Casa", price: 39.90, img: "https://media.istockphoto.com/id/1469855262/pt/foto/sliced-pepperoni-pizza-on-wooden-board-on-concrete-table-top-view.jpg?s=612x612&w=0&k=20&c=FpfjWJHbVogm9qaODxCTr_ivBYa--f_qShLRrdPYikk=", code: "P001" },
        { id: 2, name: "Pizza Portuguesa Clássica", price: 42.90, img: "https://as1.ftcdn.net/jpg/04/79/24/34/1000_F_479243487_FFjhZmUNfHKPAtf8A9Pu3trhzjtJd3VS.jpg", code: "P002" },
        { id: 3, name: "Hambúrguer Super Bacon Artesanal", price: 29.90, img: "https://st2.depositphotos.com/3957801/5642/i/450/depositphotos_56423065-stock-photo-bacon-burger.jpg", code: "H001" },
        { id: 4, name: "Hambúrguer Duplo Cheddar Monstro", price: 32.90, img: "https://source.unsplash.com/400x300/?double,burger", code: "H002" },
        { id: 5, name: "Refrigerante Cola Geladíssimo 350ml", price: 6.00, img: "https://source.unsplash.com/400x300/?soda,coke", code: "B001" },
        { id: 6, name: "Refrigerante Guaraná Amazônico Puro", price: 6.00, img: "https://source.unsplash.com/400x300/?guarana", code: "B002" },
        { id: 7, name: "Batata Frita Crocante Média", price: 15.00, img: "https://source.unsplash.com/400x300/?french,fries", code: "A001" },
        { id: 8, name: "Suco de Laranja Natural 500ml", price: 9.50, img: "https://source.unsplash.com/400x300/?orange,juice", code: "B003" },
        { id: 9, name: "Pizza Margherita Individual", price: 35.00, img: "https://source.unsplash.com/400x300/?margherita,pizza", code: "P003" },
        { id: 10, name: "Água Mineral Sem Gás 500ml", price: 4.00, img: "https://source.unsplash.com/400x300/?water,bottle", code: "B004" },
        { id: 11, name: "Brownie de Chocolate com Nozes", price: 12.00, img: "https://source.unsplash.com/400x300/?chocolate,brownie", code: "S001" },
        { id: 12, name: "Salada Caesar com Frango Grelhado", price: 25.00, img: "https://source.unsplash.com/400x300/?caesar,salad", code: "L001" },
    ];
    let currentProducts = [...initialProducts];
    let selectedProduct = null;
    let orderItems = [];
    const productsPerPage = 6;
    let currentPage = 1;
    let totalPayableValue = 0; // Armazena o valor total a ser pago

    // Mapeamento de todos os elementos do DOM (sem alterações, apenas os novos abaixo)
    const productContainer = document.getElementById("productContainer");
    const paginationControls = document.getElementById("paginationControls");
    const searchInput = document.getElementById('searchInput');
    const decreaseQuantityButton = document.getElementById('decreaseQuantity');
    const increaseQuantityButton = document.getElementById('increaseQuantity');
    const itemQuantityInput = document.getElementById('itemQuantity');
    const btnAddSelectedItemToOrder = document.getElementById('btnAddSelectedItemToOrder');
    const orderTableBody = document.getElementById('orderTableBody');
    const totalItemsCountEl = document.getElementById('totalItemsCount');
    const orderSubtotalEl = document.getElementById('orderSubtotal');
    const discountInput = document.getElementById('discountInput');
    const totalPayableEl = document.getElementById('totalPayable');
    const btnAddByCode = document.getElementById('btnAddByCode');
    const inputCodigoProduto = document.getElementById('inputCodigoProduto');
    const btnGoToPayment = document.getElementById('btnGoToPayment');
    
    // Novos elementos do Modal de Pagamento
    const paymentModalEl = document.getElementById('paymentModal');
    const paymentModalTotalEl = document.getElementById('paymentModalTotal');
    const cashPaymentDetailsEl = document.getElementById('cashPaymentDetails');
    const valorRecebidoInput = document.getElementById('valorRecebido');
    const trocoCalculadoEl = document.getElementById('trocoCalculado');
    const btnFinalizarVenda = document.getElementById('btnFinalizarVenda');


    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Todas as funções de renderização de produtos, paginação e adição de itens
    // permanecem as mesmas da versão anterior. Nenhuma alteração necessária nelas.
    // ... (copie e cole todas as funções de `renderProducts` até `updateOrderSummary` aqui)
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
            card.className = "card product-card";
            card.dataset.productId = prod.id;
            card.innerHTML = `<img src="${prod.img}" class="card-img-top" alt="${prod.name}"><div class="card-body"><h5 class="product-name">${prod.name}</h5><p class="product-price">${formatCurrency(prod.price)}</p></div>`;
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
                if (!isDisabled) {
                    currentPage = page;
                    renderProductsAndPagination();
                }
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
        const existingItemIndex = orderItems.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            orderItems[existingItemIndex].quantity += quantity;
        } else {
            orderItems.push({ ...product, quantity });
        }
        renderOrderTable();
        updateOrderSummary();
    }

    // No seu arquivo script.js, substitua a função renderOrderTable por esta:

// No seu arquivo script.js, SUBSTITUA a função renderOrderTable inteira por esta:

function renderOrderTable() {
    orderTableBody.innerHTML = ""; // Limpa a tabela atual

    // Se a comanda estiver vazia, mostra a mensagem padrão
    if (orderItems.length === 0) {
        orderTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted p-4">Nenhum item na comanda.</td></tr>`;
        updateOrderSummary(); // Garante que o resumo de totais seja zerado
        return;
    }

    // Cria uma linha para cada item na comanda
    orderItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        const row = orderTableBody.insertRow();
        
        // Esta é a parte que cria o HTML da linha, incluindo o campo de input
        row.innerHTML = `
            <td>${item.name}</td>
            <td class="text-end">${formatCurrency(item.price)}</td>
            <td class="text-center">
                <input 
                    type="number" 
                    class="form-control form-control-sm quantity-input-comanda" 
                    value="${item.quantity}" 
                    min="1" 
                    data-index="${index}"
                >
            </td>
            <td class="text-end fw-medium subtotal-cell">${formatCurrency(subtotal)}</td>
            <td class="text-center">
                <button class="btn btn-outline-danger btn-sm btn-delete-item" data-index="${index}" title="Remover item">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        `;
    });
    
    // Adiciona o evento de clique para os botões de deletar
    document.querySelectorAll('.btn-delete-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemIndex = parseInt(this.dataset.index);
            orderItems.splice(itemIndex, 1);
            renderOrderTable(); // Redesenha a tabela após remover um item
        });
    });

    // Adiciona o evento de input para os campos de quantidade
    document.querySelectorAll('.quantity-input-comanda').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.dataset.index);
            let newQuantity = parseInt(this.value);

            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1;
                this.value = 1;
            }
            
            orderItems[index].quantity = newQuantity;

            const item = orderItems[index];
            const newSubtotal = item.price * newQuantity;
            const row = this.closest('tr');
            const subtotalCell = row.querySelector('.subtotal-cell');
            subtotalCell.textContent = formatCurrency(newSubtotal);

            updateOrderSummary();
        });
    });
}

    function updateOrderSummary() {
        let itemsCount = 0;
        let subtotal = 0;
        orderItems.forEach(item => {
            itemsCount += item.quantity;
            subtotal += item.price * item.quantity;
        });
        const discountPercent = parseFloat(discountInput.value) || 0;
        const discountAmount = (subtotal * discountPercent) / 100;
        totalPayableValue = subtotal - discountAmount;
        totalItemsCountEl.textContent = itemsCount;
        orderSubtotalEl.textContent = formatCurrency(subtotal);
        totalPayableEl.textContent = formatCurrency(totalPayableValue);
    }
    
    // --- LÓGICA DO MODAL DE PAGAMENTO ---

    // Abre o modal e atualiza o valor a pagar
    btnGoToPayment.addEventListener('click', () => {
        if (orderItems.length === 0) {
            // Previne a abertura do modal se a comanda estiver vazia
            const paymentModal = bootstrap.Modal.getInstance(paymentModalEl);
            if(paymentModal) paymentModal.hide(); // Garante que está escondido
            alert("Adicione itens à comanda antes de prosseguir para o pagamento.");
            // Impede o toggle do Bootstrap
            event.stopImmediatePropagation();
        } else {
            paymentModalTotalEl.textContent = formatCurrency(totalPayableValue);
            // Reseta o modal para o estado inicial toda vez que é aberto
            cashPaymentDetailsEl.style.display = 'none';
            valorRecebidoInput.value = '';
            trocoCalculadoEl.textContent = formatCurrency(0);
            document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => radio.checked = false);
        }
    });

    // Controla a exibição dos detalhes de pagamento em dinheiro
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.value === 'dinheiro') {
                cashPaymentDetailsEl.style.display = 'block';
            } else {
                cashPaymentDetailsEl.style.display = 'none';
            }
        });
    });

    // Calcula o troco em tempo real
    valorRecebidoInput.addEventListener('input', () => {
        const valorRecebido = parseFloat(valorRecebidoInput.value) || 0;
        const troco = valorRecebido - totalPayableValue;
        
        if(valorRecebido === 0) {
             trocoCalculadoEl.textContent = formatCurrency(0);
        } else {
             trocoCalculadoEl.textContent = formatCurrency(troco);
        }

        if(troco < 0) {
            trocoCalculadoEl.classList.remove('text-info');
            trocoCalculadoEl.classList.add('text-danger');
        } else {
            trocoCalculadoEl.classList.remove('text-danger');
            trocoCalculadoEl.classList.add('text-info');
        }
    });

    // Finaliza a venda
    btnFinalizarVenda.addEventListener('click', () => {
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selectedPaymentMethod) {
            alert("Por favor, selecione uma forma de pagamento.");
            return;
        }

        // Validação para pagamento em dinheiro
        if (selectedPaymentMethod.value === 'dinheiro') {
            const valorRecebido = parseFloat(valorRecebidoInput.value) || 0;
            if (valorRecebido < totalPayableValue) {
                alert("O valor recebido é menor que o total a pagar.");
                return;
            }
        }
        
        // Simulação de finalização
        alert(`Venda finalizada com sucesso! \nMétodo de Pagamento: ${selectedPaymentMethod.value.toUpperCase()}`);
        
        // Resetar o estado da aplicação para uma nova venda
        resetApplicationState();
    });

    function resetApplicationState() {
        // Fecha o modal de pagamento
        const paymentModalInstance = bootstrap.Modal.getInstance(paymentModalEl);
        if(paymentModalInstance) paymentModalInstance.hide();
        
        // Limpa a comanda
        orderItems = [];
        renderOrderTable();
        updateOrderSummary();

        // Reseta campos
        discountInput.value = 0;
        document.getElementById('selectCliente').value = 0;

        // Reseta a busca e a paginação de produtos
        searchInput.value = '';
        currentProducts = [...initialProducts];
        currentPage = 1;
        renderProductsAndPagination();
    }

    // --- EVENT LISTENERS GERAIS (sem alterações) ---
    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.toLowerCase();
        currentProducts = initialProducts.filter(prod => prod.name.toLowerCase().includes(searchTerm));
        currentPage = 1;
        renderProductsAndPagination();
    });
    decreaseQuantityButton.addEventListener('click', () => { if (parseInt(itemQuantityInput.value) > 1) itemQuantityInput.value = parseInt(itemQuantityInput.value) - 1; });
    increaseQuantityButton.addEventListener('click', () => { itemQuantityInput.value = parseInt(itemQuantityInput.value) + 1; });
    btnAddSelectedItemToOrder.addEventListener('click', () => { if (selectedProduct) { addProductToOrder(selectedProduct, parseInt(itemQuantityInput.value)); const card = productContainer.querySelector('.product-card.selected'); if(card) card.classList.remove('selected'); selectedProduct = null; itemQuantityInput.value = 1; } else { alert("Por favor, selecione um produto da lista."); } });
    btnAddByCode.addEventListener('click', () => { const code = inputCodigoProduto.value.trim(); if (!code) return; const product = initialProducts.find(p => p.code.toLowerCase() === code.toLowerCase()); if (product) { addProductToOrder(product, 1); inputCodigoProduto.value = ""; } else { alert(`Produto com código "${code}" não encontrado.`); } });
    discountInput.addEventListener('input', updateOrderSummary);
    document.getElementById('btnCancelOrder').addEventListener('click', () => { if (confirm("Tem certeza que deseja cancelar este pedido e limpar a comanda?")) { orderItems = []; renderOrderTable(); updateOrderSummary(); discountInput.value = 0; } });
    
    // --- INICIALIZAÇÃO ---
    renderProductsAndPagination();
    renderOrderTable();
});