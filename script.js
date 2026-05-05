let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

document.addEventListener("DOMContentLoaded", () => {
  render();
  updateSummary();
  renderChart();
});

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function addExpense() {
  const title = document.getElementById("title").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!title || !amount) {
    alert("Lütfen tüm alanları doldur!");
    return;
  }

  expenses.push({ title, amount, category });
  saveExpenses();

  render();
  updateSummary();
  renderChart();

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
}

function render() {
  const list = document.getElementById("list");

  if (expenses.length === 0) {
    list.innerHTML = `<p class="empty">Henüz harcama eklenmedi.</p>`;
    return;
  }

  list.innerHTML = "";

  expenses.forEach((e, index) => {
    const div = document.createElement("div");
    div.className = "expense-item";
    div.innerHTML = `
      <strong>${e.title}</strong><br>
      ${e.amount}₺ - ${e.category}
      <button onclick="deleteExpense(${index})">Sil</button>
    `;
    list.appendChild(div);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  render();
  updateSummary();
  renderChart();
}

function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;

  let categoryTotals = {};
  expenses.forEach(e => {
    if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
    categoryTotals[e.category] += e.amount;
  });

  let topCategory = "-";
  if (Object.keys(categoryTotals).length > 0) {
    topCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );
  }

  document.getElementById("totalAmount").innerText = total + "₺";
  document.getElementById("expenseCount").innerText = count;
  document.getElementById("topCategory").innerText = topCategory;
}

function analyze() {
  const aiText = document.getElementById("aiText");

  if (expenses.length === 0) {
    aiText.innerText = "Analiz için veri yok.";
    return;
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  let categoryTotals = {};
  expenses.forEach(e => {
    if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
    categoryTotals[e.category] += e.amount;
  });

  let biggest = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  aiText.innerText = `
Toplam Harcama: ${total}₺

En çok harcama: ${biggest}

AI Yorumu:
${
  categoryTotals[biggest] > total * 0.5
    ? biggest + " kategorisinde fazla harcama yapıyorsun."
    : "Harcama dağılımın dengeli görünüyor."
}
`;
}

function renderChart() {
  const ctx = document.getElementById("expenseChart");

  if (!ctx) return;

  let categoryTotals = {};
  expenses.forEach(e => {
    if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
    categoryTotals[e.category] += e.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#22c55e",
            "#3b82f6",
            "#f59e0b",
            "#ef4444",
            "#a855f7",
            "#14b8a6"
          ]
        }
      ]
    }
  });
}
