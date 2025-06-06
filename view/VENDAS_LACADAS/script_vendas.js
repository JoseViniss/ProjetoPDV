const vendas = [
  {
    cliente: "João Silva",
    total: "R$ 89,90",
    itens: [
      { codigo: "P001", nome: "Pizza Calabresa", qtd: 1, valor: "R$ 39,90" },
      { codigo: "R001", nome: "Refrigerante", qtd: 2, valor: "R$ 10,00" }
    ]
  },
  {
    cliente: "Maria Souza",
    total: "R$ 72,00",
    itens: [
      { codigo: "H002", nome: "Hambúrguer Duplo", qtd: 2, valor: "R$ 60,00" },
      { codigo: "R001", nome: "Refrigerante", qtd: 1, valor: "R$ 6,00" }
    ]
  }
];

const salesTable = document.getElementById("salesTable");

vendas.forEach((venda, index) => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${venda.cliente}</td>
    <td>${venda.total}</td>
    <td>
      <button class="btn btn-primary action-btn me-1" onclick="toggleDetails(${index})">
        <i class="bi bi-search"></i>
      </button>
      <button class="btn btn-danger action-btn" onclick="deleteSale(${index})">
        <i class="bi bi-x-lg"></i>
      </button>
    </td>
  `;

  const detailRow = document.createElement("tr");
  detailRow.className = "details-row d-none";
  detailRow.id = `details-${index}`;

  const itemDetails = venda.itens.map(item => `
    <tr>
      <td>${item.codigo}</td>
      <td>${item.nome}</td>
      <td>${item.qtd}</td>
      <td>${item.valor}</td>
    </tr>
  `).join("");

  detailRow.innerHTML = `
    <td colspan="3">
      <table class="table table-sm mb-0 details-table">
        <thead>
          <tr class="table-secondary">
            <th>Código</th>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          ${itemDetails}
        </tbody>
      </table>
    </td>
  `;

  salesTable.appendChild(row);
  salesTable.appendChild(detailRow);
});

function toggleDetails(index) {
  const row = document.getElementById(`details-${index}`);
  row.classList.toggle("d-none");
}

function deleteSale(index) {
  alert(`Função de exclusão da venda ${index} chamada (mock).`);
}
