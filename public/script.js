let trendsChart = null;
let categoryChart = null;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        showDashboard();
    }

    document.getElementById("login-form").addEventListener("submit", handleLogin);
    document.getElementById("register-form").addEventListener("submit", handleRegister);
    document.getElementById("logout-btn").addEventListener("click", handleLogout);

    // Auth View Toggles
    document.getElementById("to-register").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("login-form-wrapper").classList.add("hidden");
        document.getElementById("register-form-wrapper").classList.remove("hidden");
    });

    document.getElementById("to-login").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("register-form-wrapper").classList.add("hidden");
        document.getElementById("login-form-wrapper").classList.remove("hidden");
    });

    // Modal Listeners
    document.getElementById("add-record-btn").addEventListener("click", openModal);
    document.getElementById("cancel-modal").addEventListener("click", closeModal);
    document.getElementById("record-form").addEventListener("submit", handleSubmitRecord);

    // Screen Switching
    document.getElementById("show-dash-btn").addEventListener("click", () => showScreen("dashboard-view"));
    document.getElementById("show-users-btn").addEventListener("click", () => showScreen("user-management-screen"));

    // Mobile Filter Toggle
    document.getElementById("toggle-filters").addEventListener("click", () => {
        document.getElementById("filter-wrapper").classList.toggle("show");
    });

    // Filter Listeners (Dash Only)
    const filters = ["filter-type", "filter-start", "filter-end"];
    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("change", fetchStats);
    });

    let searchTimeout;
    const filterSearch = document.getElementById("filter-search");
    if (filterSearch) {
        filterSearch.addEventListener("input", () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(fetchStats, 500);
        });
    }
});

function showScreen(screenId) {
    document.querySelectorAll("main > section").forEach(s => s.classList.add("hidden"));
    document.getElementById(screenId).classList.remove("hidden");

    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    if (screenId === "dashboard-screen") {
        document.getElementById("show-dash-btn").classList.add("active");
        fetchStats();
    } else {
        document.getElementById("show-users-btn").classList.add("active");
        fetchUsers();
    }
}

async function fetchUsers() {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch("/api/v1/users", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) renderUsersTable(result.data);
    } catch (err) {
        console.error("Fetch users failed", err);
    }
}

function renderUsersTable(users) {
    const tbody = document.querySelector("#user-table tbody");
    tbody.innerHTML = "";
    users.forEach(u => {
        const row = `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>
                    <select class="role-select" onchange="handleUpdateUser('${u._id}', {role: this.value})">
                        <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        <option value="Analyst" ${u.role === 'Analyst' ? 'selected' : ''}>Analyst</option>
                        <option value="Viewer" ${u.role === 'Viewer' ? 'selected' : ''}>Viewer</option>
                    </select>
                </td>
                <td><span class="badge ${u.status.toLowerCase()}">${u.status}</span></td>
                <td>
                    <button class="status-btn" onclick="handleUpdateUser('${u._id}', {status: '${u.status === 'Active' ? 'Inactive' : 'Active'}'})">
                        ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}

async function handleUpdateUser(id, data) {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`/api/v1/users/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) fetchUsers();
    } catch (err) {
        alert("Update failed");
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const role = document.getElementById("reg-role").value;
    const errorDiv = document.getElementById("login-error");

    try {
        const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
        });

        const result = await response.json();
        if (result.success) {
            alert("Account created! Please login.");
            document.getElementById("to-login").click();
        } else {
            errorDiv.textContent = result.message || "Registration failed";
        }
    } catch (err) {
        errorDiv.textContent = "Server error";
    }
}

function openModal() {
    document.getElementById("modal-container").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal-container").classList.add("hidden");
    document.getElementById("record-form").reset();
}

async function handleSubmitRecord(e) {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const recordData = {
        amount: parseFloat(document.getElementById("record-amount").value),
        type: document.getElementById("record-type").value,
        category: document.getElementById("record-category").value,
        notes: document.getElementById("record-notes").value
    };

    try {
        const response = await fetch("/api/v1/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(recordData),
        });

        const result = await response.json();
        if (result.success) {
            closeModal();
            fetchStats(); // Refresh dashboard
        } else {
            alert(result.message || "Failed to create record");
        }
    } catch (err) {
        alert("Server error");
    }
}

async function handleDeleteRecord(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`/api/v1/records/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (result.success) {
            fetchStats();
        } else {
            alert(result.message || "Delete failed");
        }
    } catch (err) {
        alert("Server error");
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("login-error");

    try {
        const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem("accessToken", result.data.accessToken);
            localStorage.setItem("userName", result.data.user.name);
            localStorage.setItem("userRole", result.data.user.role);
            showDashboard();
        } else {
            errorDiv.textContent = result.message || "Login failed";
        }
    } catch (err) {
        errorDiv.textContent = "Server connection error";
    }
}

function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    window.location.reload();
}

async function showDashboard() {
    const role = localStorage.getItem("userRole");
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("dashboard-screen").classList.remove("hidden");
    document.getElementById("user-name").textContent = `${localStorage.getItem("userName")} (${role})`;

    // Handle Admin-only UI (Users, Deletion)
    const adminElements = document.querySelectorAll(".admin-only");
    if (role === "Admin") {
        adminElements.forEach(el => el.classList.remove("hidden"));
    } else {
        adminElements.forEach(el => el.classList.add("hidden"));
    }

    // Handle Creator UI (Add Record)
    const creatorElements = document.querySelectorAll(".creator-only");
    if (role === "Admin" || role === "Analyst") {
        creatorElements.forEach(el => el.classList.remove("hidden"));
    } else {
        creatorElements.forEach(el => el.classList.add("hidden"));
    }

    await fetchStats();
}

async function fetchStats() {
    const token = localStorage.getItem("accessToken");

    // Collect Filters
    const search = document.getElementById("filter-search").value;
    const type = document.getElementById("filter-type").value;
    const start = document.getElementById("filter-start").value;
    const end = document.getElementById("filter-end").value;

    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (type) query.append("type", type);
    if (start) query.append("startDate", start);
    if (end) query.append("endDate", end);

    try {
        const response = await fetch(`/api/v1/dashboard?${query.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();

        if (result.success) {
            updateUI(result.data);
        } else if (response.status === 401) {
            handleLogout();
        }
    } catch (err) {
        console.error("Failed to fetch dash data", err);
    }
}

function updateUI(data) {
    console.log("Dashboard Data Received:", data);
    const { summary, categoryStats = [], monthlyTrends = [], recentTransactions = [] } = data;

    // Stats Cards - Safe Access with fallback to 0
    const income = summary?.totalIncome || 0;
    const expense = summary?.totalExpense || 0;
    const balance = summary?.netBalance || 0;

    document.getElementById("total-income").textContent = `$${income.toFixed(2)}`;
    document.getElementById("total-expenses").textContent = `$${expense.toFixed(2)}`;
    document.getElementById("net-balance").textContent = `$${balance.toFixed(2)}`;

    // Recent Table
    const tableBody = document.querySelector("#recent-table tbody");
    if (tableBody) {
        const role = localStorage.getItem("userRole");
        tableBody.innerHTML = "";
        
        recentTransactions.forEach(tx => {
            const actionCell = (role === "Admin" || role === "Analyst")
                ? `<td><button class="delete-btn" onclick="handleDeleteRecord('${tx._id}')">🗑️</button></td>` 
                : ""; 

            const row = `
                <tr>
                    <td>${new Date(tx.date).toLocaleDateString()}</td>
                    <td>${tx.category || 'Other'}</td>
                    <td><span class="type-badge ${tx.type}">${tx.type}</span></td>
                    <td>$${(tx.amount || 0).toFixed(2)}</td>
                    ${actionCell}
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // Charts
    if (monthlyTrends.length > 0) renderChart(monthlyTrends);
    if (categoryStats.length > 0) renderCategoryChart(categoryStats);
}

function renderCategoryChart(categoryStats) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (categoryChart) categoryChart.destroy();

    const labels = categoryStats.map(s => s._id || 'Unknown');
    const data = categoryStats.map(s => s.total || 0);

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20, usePointStyle: true, font: { family: 'Outfit', size: 11 } } },
                tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 12, displayColors: false }
            },
            cutout: '70%'
        }
    });
}

function renderChart(trends) {
    const canvas = document.getElementById('trendsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = [...new Set(trends.map(t => `${t._id.month}/${t._id.year}`))];
    const incomeData = labels.map(label => {
        const entry = trends.find(t => `${t._id.month}/${t._id.year}` === label && t._id.type === 'income');
        return entry ? entry.total : 0;
    });
    const expenseData = labels.map(label => {
        const entry = trends.find(t => `${t._id.month}/${t._id.year}` === label && t._id.type === 'expense');
        return entry ? entry.total : 0;
    });

    const incomeGrad = ctx.createLinearGradient(0, 0, 0, 400);
    incomeGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    incomeGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

    const expenseGrad = ctx.createLinearGradient(0, 0, 0, 400);
    expenseGrad.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
    expenseGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');

    if (trendsChart) trendsChart.destroy();

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#10b981',
                    backgroundColor: incomeGrad,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    borderWidth: 3
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#f43f5e',
                    backgroundColor: expenseGrad,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    borderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 }, usePointStyle: true, padding: 20 } }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}
