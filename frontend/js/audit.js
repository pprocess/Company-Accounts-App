async function loadAudit() {
    const res = await fetch("/api/audit");
    const logs = await res.json();
    const list = document.getElementById("audit-list");
    list.innerHTML = "";
    logs.forEach(l => {
        const li = document.createElement("li");
        li.textContent = `[${l.timestamp}] ${l.eventType}: ${l.message}`;
        list.appendChild(li);
    });
}

window.onload = loadAudit;