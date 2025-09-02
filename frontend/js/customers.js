async function loadCustomers() {
    const res = await fetch("/api/customers");
    const customers = await res.json();

    const productRes = await fetch("/api/products");
    const products = await productRes.json();

    const list = document.getElementById("customer-list");
    list.innerHTML = "";

    customers.forEach(c => {
        const li = document.createElement("li");
        let prodInfo = "";
        if (c.products && c.products.length > 0) {
            prodInfo = "<br><strong>Products:</strong> " + c.products.map(p => {
                const prod = products.find(pr => pr.id === p.productId);
                return `${prod ? prod.name : "Unknown"} (+${p.profitMargin}%)`;
            }).join(", ");
        }

        li.innerHTML = `
            <span>${c.name} (${c.email}) ${prodInfo}</span>
            <div>
                <button onclick="editCustomer('${c.id}', '${c.name}', '${c.email}')">✏️ Edit</button>
                <button onclick="deleteCustomer('${c.id}')">🗑 Delete</button>
                <button onclick="assignProduct('${c.id}')">➕ Add Product</button>
            </div>
        `;
        list.appendChild(li);
    });
}

async function deleteCustomer(id) {
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    loadCustomers();
}

async function editCustomer(id, oldName, oldEmail) {
    const name = prompt("Enter new name:", oldName);
    const email = prompt("Enter new email:", oldEmail);

    if (!name || !email) return;

    await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    loadCustomers();
}

async function assignProduct(customerId) {
    const productRes = await fetch("/api/products");
    const products = await productRes.json();

    if (products.length === 0) {
        alert("No products available.");
        return;
    }

    const prodChoices = products.map((p, i) => `${i+1}. ${p.name}`).join("\n");
    const choice = parseInt(prompt(`Choose product:\n${prodChoices}`));
    if (isNaN(choice) || choice < 1 || choice > products.length) return;

    const product = products[choice - 1];
    const margin = parseFloat(prompt(`Enter profit margin (%) for ${product.name}:`, 10));
    if (isNaN(margin)) return;

    // load customers, update selected one
    const res = await fetch("/api/customers");
    const customers = await res.json();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    customer.products.push({ productId: product.id, profitMargin: margin });

    await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    });

    loadCustomers();
}

document.getElementById("add-customer-form").addEventListener("submit", async e => {
    e.preventDefault();
    const { name, email } = Object.fromEntries(new FormData(e.target));
    await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });
    e.target.reset();
    loadCustomers();
});

window.onload = loadCustomers;