async function loadInvoices() {
    const res = await fetch("/api/invoices");
    const invoices = await res.json();
    const list = document.getElementById("invoice-list");
    list.innerHTML = "";
    invoices.forEach(inv => {
        const li = document.createElement("li");
        li.textContent = `Invoice ${inv.id} | Total: $${inv.total}`;
        list.appendChild(li);
    });
}

document.getElementById("create-invoice-form").addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const customerId = form.get("customerId");
    const items = JSON.parse(form.get("items"));

    await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, items })
    });
    loadInvoices();
});

window.onload = loadInvoices;