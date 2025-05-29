const products = [
    { name: "Pizza Calabresa", price: "R$ 39,90", img: "https://source.unsplash.com/400x300/?pizza" },
    { name: "Pizza Portuguesa", price: "R$ 42,90", img: "https://source.unsplash.com/400x300/?pizza,portuguese" },
    { name: "Hambúrguer Bacon", price: "R$ 29,90", img: "https://source.unsplash.com/400x300/?burger,bacon" },
    { name: "Hambúrguer Duplo", price: "R$ 32,90", img: "https://source.unsplash.com/400x300/?double,burger" },
    { name: "Refrigerante Cola", price: "R$ 6,00", img: "https://source.unsplash.com/400x300/?soda,coke" },
    { name: "Refrigerante Guaraná", price: "R$ 6,00", img: "https://source.unsplash.com/400x300/?guarana" },
  ];
  
  const container = document.getElementById("productContainer");
  
  products.forEach((prod, index) => {
    const col = document.createElement("div");
    col.className = "col-4";
  
    const card = document.createElement("div");
    card.className = "card product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}">
      <div class="card-body text-center">${prod.name}</div>
      <div class="card-body text-center">${prod.price}</div>
    `;
  
    card.addEventListener("click", () => {
      card.classList.toggle("selected");
    });
  
    col.appendChild(card);
    container.appendChild(col);
  });
  