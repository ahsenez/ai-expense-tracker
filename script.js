let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

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
}

function analyze() {
  const aiText = document.getElementById("aiText");

  if (expenses.length === 0) {
    aiText.innerText = "Analiz için veri yok.";
    return;
  }

  let total = expenses.reduce((sum, e) => sum + e.amount, 0);

  let categoryTotals = {};

  expenses.forEach(e => {
    if (!categoryTotals[e.category]) {
      categoryTotals[e.category] = 0;
    }
    categoryTotals[e.category] += e.amount;
  });

  let biggestCategory = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  aiText.innerText = `
Toplam Harcama: ${total}₺

En çok harcama yapılan kategori: ${biggestCategory}

AI Yorumu:
${
  categoryTotals[biggestCategory] > total * 0.5
    ? biggestCategory + " kategorisinde fazla harcama yapıyorsun."
    : "Harcama dağılımın dengeli görünüyor."
}
`;
}

document.addEventListener("DOMContentLoaded", render);
