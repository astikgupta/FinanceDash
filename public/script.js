let trendsChart = null;

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
});

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
    window.location.reload();
}

async function showDashboard() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("dashboard-screen").classList.remove("hidden");
    document.getElementById("user-name").textContent = localStorage.getItem("userName");

    await fetchStats();
}

async function fetchStats() {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch("/api/v1/dashboard", {
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
    const { summary, categoryStats, monthlyTrends, recentTransactions } = data;

    // Stats Cards
    document.getElementById("total-income").textContent = `$${summary.totalIncome.toFixed(2)}`;
    document.getElementById("total-expenses").textContent = `$${summary.totalExpense.toFixed(2)}`;
    document.getElementById("net-balance").textContent = `$${summary.netBalance.toFixed(2)}`;

    // Recent Table
    const tableBody = document.querySelector("#recent-table tbody");
    tableBody.innerHTML = "";
    recentTransactions.forEach(tx => {
        const row = `
            <tr>
                <td>${new Date(tx.date).toLocaleDateString()}</td>
                <td>${tx.category}</td>
                <td><span class="type-badge ${tx.type}">${tx.type}</span></td>
                <td>$${tx.amount.toFixed(2)}</td>
                <td>
                    <button class="delete-btn" onclick="handleDeleteRecord('${tx._id}')">🗑️</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Chart
    renderChart(monthlyTrends);
}

function renderChart(trends) {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    
    // Process trends for chart
    const labels = [...new Set(trends.map(t => `${t._id.month}/${t._id.year}`))];
    const incomeData = labels.map(label => {
        const entry = trends.find(t => `${t._id.month}/${t._id.year}` === label && t._id.type === 'income');
        return entry ? entry.total : 0;
    });
    const expenseData = labels.map(label => {
        const entry = trends.find(t => `${t._id.month}/${t._id.year}` === label && t._id.type === 'expense');
        return entry ? entry.total : 0;
    });

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
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#f87171',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: '#334155' }, 
                    ticks: { color: '#94a3b8' } 
                },
                x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}
