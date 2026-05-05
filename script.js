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
