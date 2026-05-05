let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
