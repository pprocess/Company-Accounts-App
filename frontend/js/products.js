async function loadProducts() {
    const res = await fetch("/api/products");
    const products = await res.json();
    const list = document.getElementById("product-list");
    list.innerHTML = "";

    products.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${p.name} - $${p.price} - Stock: ${p.quantity}</span>
            <div>
                <button onclick="editProduct('${p.id}', '${p.name}', ${p.price}, ${p.quantity})">✏️ Edit</button>
                <button onclick="deleteProduct('${p.id}')">🗑 Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

async function deleteProduct(id) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
}

async function editProduct(id, oldName, oldPrice, oldQty) {
    const name = prompt("Enter new name:", oldName);
    const price = parseFloat(prompt("Enter new price:", oldPrice));
    const quantity = parseInt(prompt("Enter new quantity:", oldQty));

    if (!name || isNaN(price) || isNaN(quantity)) return;

    await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, quantity })
    });

    loadProducts();
}

document.getElementById("add-product-form").addEventListener("submit", async e => {
    e.preventDefault();
    const { name, price, quantity } = Object.fromEntries(new FormData(e.target));
    await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: parseFloat(price), quantity: parseInt(quantity) })
    });
    e.target.reset();
    loadProducts();
});

window.onload = loadProducts;