const form = document.getElementById('transaction-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const monthInput = document.getElementById('month');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const chartCanvas = document.getElementById('chart');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Default month = current month
const now = new Date();
monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

function saveToStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getSelectedMonth() {
  return monthInput.value;
}

function filterByMonth(month) {
  return transactions.filter(tx => tx.month === month);
}

function updateDOM() {
  const month = getSelectedMonth();
  const filtered = filterByMonth(month);

  transactionList.innerHTML = '';

  let total = 0;
  const categoryTotals = {};

  filtered.forEach(tx => {
    const li = document.createElement('li');
    li.classList.add(tx.amount >= 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${tx.description} <span>${tx.amount >= 0 ? '+' : '-'}£${Math.abs(tx.amount).toFixed(2)}</span>
    `;
    transactionList.appendChild(li);

    total += tx.amount;

    const key = tx.description.toLowerCase();
    categoryTotals[key] = (categoryTotals[key] || 0) + Math.abs(tx.amount);
  });

  balanceDisplay.textContent = `£${total.toFixed(2)}`;

  updateChart(categoryTotals);
}

function updateChart(dataObj) {
  if (window.chartInstance) window.chartInstance.destroy();

  window.chartInstance = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: Object.keys(dataObj),
      datasets: [{
        label: 'Spending by Category',
        data: Object.values(dataObj),
        backgroundColor: '#e67e22'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const month = getSelectedMonth();
  const entry = {
    description: desc.value.trim(),
    amount: parseFloat(amount.value),
    month: month
  };

  if (!entry.description || isNaN(entry.amount)) return;

  transactions.push(entry);
  saveToStorage();
  updateDOM();
  form.reset();
});

monthInput.addEventListener('change', updateDOM);

updateDOM();
