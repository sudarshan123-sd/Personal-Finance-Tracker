// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeToggle.checked = true;
} else {
    body.classList.remove('dark');
    themeToggle.checked = false;
}

// Toggle theme on click
themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

// Initialize transactions from local storage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');

// Format number as INR
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Update summary
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    totalIncomeEl.textContent = formatINR(income);
    totalExpensesEl.textContent = formatINR(expenses);
    balanceEl.textContent = formatINR(balance);
}

// Render transactions
function renderTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.className = `p-2 border-b flex justify-between ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`;
        li.innerHTML = `
            ${t.description} - ${formatINR(t.amount)} (${t.type}) - ${t.date}
            <button onclick="deleteTransaction(${index})" class="text-red-500 hover:underline">Delete</button>
        `;
        transactionList.appendChild(li);
    });
    updateSummary();
}

// Add transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;

    if (description && amount > 0 && date) {
        const transaction = { description, amount, type, date };
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        form.reset();
        renderTransactions();
    } else {
        alert('Please fill in all fields with valid values.');
    }
});

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
}

// Initial render
renderTransactions();