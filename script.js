// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize global variables
    let transactions = [];
    let categories = {
        income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'],
        expense: ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Personal Care', 'Other Expenses']
    };
    let budgets = {};
    let charts = {};
    
    // DOM Elements
    const transactionsBody = document.getElementById('transactionsBody');
    const filterDateFrom = document.getElementById('filterDateFrom');
    const filterDateTo = document.getElementById('filterDateTo');
    const filterType = document.getElementById('filterType');
    const filterCategory = document.getElementById('filterCategory');
    const noTransactionsMsg = document.getElementById('noTransactionsMsg');
    const transactionForm = document.getElementById('transactionForm');
    const transactionId = document.getElementById('transactionId');
    const transactionDate = document.getElementById('transactionDate');
    const transactionType = document.getElementById('transactionType');
    const transactionCategory = document.getElementById('transactionCategory');
    const transactionAmount = document.getElementById('transactionAmount');
    const transactionDescription = document.getElementById('transactionDescription');
    const transactionModalTitle = document.getElementById('transactionModalTitle');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const totalBalance = document.getElementById('totalBalance');
    const budgetStatus = document.getElementById('budgetStatus');
    const budgetCategories = document.getElementById('budgetCategories');
    const themeSwitch = document.getElementById('checkbox');
    
    // Initialize the app
    function initApp() {
        // Set fixed heights and proper styles for chart containers
        document.querySelectorAll('.card-body').forEach(container => {
            if (container.querySelector('canvas')) {
                container.style.height = '300px';
                container.style.position = 'relative';
                container.style.padding = '20px';
                container.style.overflow = 'hidden'; // Prevent content from spilling outside
            }
        });
        
        // Set default date filter to current month
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        filterDateFrom.valueAsDate = firstDay;
        filterDateTo.valueAsDate = lastDay;
        
        // Set today's date for new transactions
        transactionDate.valueAsDate = today;
        
        // Load data from localStorage
        loadFromLocalStorage();
        
        // Initialize category dropdowns
        populateCategoryDropdowns();
        
        // Initialize theme
        initTheme();
        
        // Display transactions
        displayTransactions();
        
        // Initialize charts
        initCharts();
        
        // Update summary
        updateSummary();
        
        // Update budget status
        updateBudgetStatus();
    }
    
    // Save data to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('budgets', JSON.stringify(budgets));
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }
    
    // Load data from localStorage
    function loadFromLocalStorage() {
        if (localStorage.getItem('transactions')) {
            transactions = JSON.parse(localStorage.getItem('transactions'));
            
            // Ensure date objects are properly converted
            transactions.forEach(transaction => {
                transaction.date = new Date(transaction.date);
            });
        }
        
        if (localStorage.getItem('budgets')) {
            budgets = JSON.parse(localStorage.getItem('budgets'));
        }
    }
    
    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeSwitch.checked = true;
        } else {
            document.body.classList.add('light-theme');
            themeSwitch.checked = false;
        }
    }
    
    // Populate category dropdowns
    function populateCategoryDropdowns() {
        // Transaction category dropdown
        transactionCategory.innerHTML = '<option value="">Select Category</option>';
        
        // Filter category dropdown
        filterCategory.innerHTML = '<option value="all">All Categories</option>';
        
        // Add income categories
        categories.income.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            option.dataset.type = 'income';
            
            const filterOption = option.cloneNode(true);
            
            filterCategory.appendChild(filterOption);
        });
        
        // Add expense categories
        categories.expense.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            option.dataset.type = 'expense';
            
            const filterOption = option.cloneNode(true);
            
            filterCategory.appendChild(filterOption);
        });
        
        // Update transaction category based on selected type
        updateCategoryDropdown();
    }
    
    // Update category dropdown based on selected transaction type
    function updateCategoryDropdown() {
        const selectedType = transactionType.value;
        
        // Clear dropdown
        transactionCategory.innerHTML = '<option value="">Select Category</option>';
        
        if (!selectedType) return;
        
        // Add categories based on selected type
        categories[selectedType].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            
            transactionCategory.appendChild(option);
        });
    }
    
    // Display transactions with optional filters
    function displayTransactions() {
        // Get filter values
        const fromDate = filterDateFrom.valueAsDate;
        const toDate = filterDateTo.valueAsDate;
        const typeFilter = filterType.value;
        const categoryFilter = filterCategory.value;
        
        // Set end of day for toDate
        if (toDate) {
            toDate.setHours(23, 59, 59, 999);
        }
        
        // Filter transactions
        const filteredTransactions = transactions.filter(transaction => {
            // Date filter
            if (fromDate && transaction.date < fromDate) return false;
            if (toDate && transaction.date > toDate) return false;
            
            // Type filter
            if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
            
            // Category filter
            if (categoryFilter !== 'all' && transaction.category !== categoryFilter) return false;
            
            return true;
        });
        
        // Sort transactions by date (newest first)
        const sortedTransactions = [...filteredTransactions].sort((a, b) => b.date - a.date);
        
        // Clear table
        transactionsBody.innerHTML = '';
        
        // Show message if no transactions
        if (sortedTransactions.length === 0) {
            noTransactionsMsg.classList.remove('d-none');
        } else {
            noTransactionsMsg.classList.add('d-none');
            
            // Add transactions to table
            sortedTransactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.className = 'transaction-row';
                
                const formattedDate = transaction.date.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                const amountClass = transaction.type === 'income' ? 'income-text' : 'expense-text';
                const amountPrefix = transaction.type === 'income' ? '+' : '-';
                const badgeClass = transaction.type === 'income' ? 'bg-success' : 'bg-danger';
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.category}</td>
                    <td><span class="badge ${badgeClass}">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span></td>
                    <td class="${amountClass}">${amountPrefix}₹${transaction.amount.toFixed(2)}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${transaction.id}" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${transaction.id}" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                
                transactionsBody.appendChild(row);
            });
            
            // Add event listeners to the buttons
            addButtonListeners();
        }
    }
    
    // Add event listeners to edit and delete buttons
    function addButtonListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                editTransaction(id);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                document.getElementById('deleteTransactionId').value = id;
                const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
                deleteModal.show();
            });
        });
    }
    
    // Edit transaction
    function editTransaction(id) {
        const transaction = transactions.find(t => t.id == id);
        
        if (!transaction) return;
        
        transactionId.value = transaction.id;
        transactionDate.valueAsDate = new Date(transaction.date);
        transactionType.value = transaction.type;
        updateCategoryDropdown();
        transactionCategory.value = transaction.category;
        transactionAmount.value = transaction.amount;
        transactionDescription.value = transaction.description;
        
        transactionModalTitle.textContent = 'Edit Transaction';
        
        const modal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
        modal.show();
    }
    
    // Delete transaction
    function deleteTransaction(id) {
        const index = transactions.findIndex(t => t.id == id);
        
        if (index === -1) return;
        
        transactions.splice(index, 1);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Update UI
        displayTransactions();
        updateSummary();
        updateBudgetStatus();
        updateCharts();
        
        // Show toast
        showToast('Success', 'Transaction deleted successfully.');
    }
    
    // Add or update transaction
    function saveTransaction() {
        // Validate form
        if (!transactionForm.checkValidity()) {
            transactionForm.classList.add('was-validated');
            return;
        }
        
        const id = transactionId.value || Date.now().toString();
        const date = new Date(transactionDate.value);
        const type = transactionType.value;
        const category = transactionCategory.value;
        const amount = parseFloat(transactionAmount.value);
        const description = transactionDescription.value;
        
        const transaction = {
            id,
            date,
            type,
            category,
            amount,
            description
        };
        
        if (transactionId.value) {
            // Update existing transaction
            const index = transactions.findIndex(t => t.id == id);
            if (index !== -1) {
                transactions[index] = transaction;
            }
        } else {
            // Add new transaction
            transactions.push(transaction);
        }
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Reset form
        transactionForm.reset();
        transactionForm.classList.remove('was-validated');
        transactionId.value = '';
        transactionDate.valueAsDate = new Date();
        transactionModalTitle.textContent = 'Add Transaction';
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
        modal.hide();
        
        // Update UI
        displayTransactions();
        updateSummary();
        updateBudgetStatus();
        updateCharts();
        
        // Show toast
        showToast('Success', transactionId.value ? 'Transaction updated successfully.' : 'Transaction added successfully.');
    }
    
    // Update summary values
    function updateSummary() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Filter transactions for current month
        const monthlyTransactions = transactions.filter(transaction => {
            const transactionMonth = transaction.date.getMonth();
            const transactionYear = transaction.date.getFullYear();
            
            return transactionMonth === currentMonth && transactionYear === currentYear;
        });
        
        // Calculate totals
        const incomeTotal = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const expenseTotal = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const balance = incomeTotal - expenseTotal;
        
        // Update UI
        totalIncome.textContent = `₹${incomeTotal.toFixed(2)}`;
        totalExpense.textContent = `₹${expenseTotal.toFixed(2)}`;
        
        if (balance >= 0) {
            totalBalance.textContent = `₹${balance.toFixed(2)}`;
            totalBalance.className = 'income-text';
        } else {
            totalBalance.textContent = `-₹${Math.abs(balance).toFixed(2)}`;
            totalBalance.className = 'expense-text';
        }
    }
    
    // Update budget status
    function updateBudgetStatus() {
        budgetStatus.innerHTML = '';
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Get monthly expenses by category
        const expenses = {};
        
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                const transactionMonth = transaction.date.getMonth();
                const transactionYear = transaction.date.getFullYear();
                
                if (transactionMonth === currentMonth && transactionYear === currentYear) {
                    if (!expenses[transaction.category]) {
                        expenses[transaction.category] = 0;
                    }
                    
                    expenses[transaction.category] += transaction.amount;
                }
            }
        });
        
        // Check if any budgets are set
        if (Object.keys(budgets).length === 0) {
            budgetStatus.innerHTML = '<p class="text-muted text-center">No budgets set yet.</p>';
            return;
        }
        
        // Create budget progress bars
        Object.keys(budgets).forEach(category => {
            if (budgets[category] <= 0) return;
            
            const spent = expenses[category] || 0;
            const budget = budgets[category];
            const percentage = Math.min(Math.round((spent / budget) * 100), 100);
            
            let progressClass = 'progress-good';
            
            if (percentage >= 80 && percentage < 100) {
                progressClass = 'progress-warning';
            } else if (percentage >= 100) {
                progressClass = 'progress-danger';
            }
            
            const budgetItem = document.createElement('div');
            budgetItem.className = 'budget-item';
            budgetItem.innerHTML = `
                <div class="budget-label">
                    <span>${category}</span>
                    <span>₹${spent.toFixed(2)} / ₹${budget.toFixed(2)}</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${progressClass}" role="progressbar" style="width: ${percentage}%" 
                        aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            
            budgetStatus.appendChild(budgetItem);
        });
    }
    
    // Initialize charts
    function initCharts() {
        // Income vs. Expense Chart
        const incomeExpenseCtx = document.getElementById('incomeExpenseChart').getContext('2d');
        // Set a fixed height for the chart canvas
        incomeExpenseCtx.canvas.parentNode.style.height = '300px';
        charts.incomeExpenseChart = new Chart(incomeExpenseCtx, {
            type: 'bar',
            data: {
                labels: [''],
                datasets: [
                    {
                        label: 'Income',
                        backgroundColor: 'rgba(14, 159, 110, 0.8)',
                        data: [0]
                    },
                    {
                        label: 'Expenses',
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        data: [0]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: {
                        left: 10,
                        right: 30,
                        top: 10,
                        bottom: 10
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
        
        // Category Chart
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        // Set a fixed height for the chart canvas
        categoryCtx.canvas.parentNode.style.height = '300px';
        charts.categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(199, 199, 199, 0.8)',
                        'rgba(83, 102, 255, 0.8)',
                        'rgba(40, 159, 64, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: 20
                },
                plugins: {
                    legend: {
                        position: 'right',
                        // Make legend more compact
                        labels: {
                            boxWidth: 12,
                            padding: 10
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        // Trend Chart
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        // Set a fixed height for the chart canvas
        trendCtx.canvas.parentNode.style.height = '300px';
        charts.trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Income',
                        borderColor: 'rgba(14, 159, 110, 1)',
                        backgroundColor: 'rgba(14, 159, 110, 0.1)',
                        data: [],
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        data: [],
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: {
                        left: 10,
                        right: 30,
                        top: 10,
                        bottom: 10
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
        
        // Initial chart update
        updateCharts();
    }
    
    // Update charts
    function updateCharts() {
        // Ensure chart containers have proper boundaries
        document.querySelectorAll('.card-body').forEach(container => {
            if (container.querySelector('canvas')) {
                // Make sure each chart respects its container
                const canvas = container.querySelector('canvas');
                canvas.style.maxWidth = '100%';
                canvas.style.maxHeight = '100%';
            }
        });
        
        const currentYear = new Date().getFullYear();
        
        // Get monthly data for the current year
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            return {
                month: i,
                income: 0,
                expense: 0
            };
        });
        
        transactions.forEach(transaction => {
            const transactionYear = transaction.date.getFullYear();
            const transactionMonth = transaction.date.getMonth();
            
            if (transactionYear === currentYear) {
                if (transaction.type === 'income') {
                    monthlyData[transactionMonth].income += transaction.amount;
                } else {
                    monthlyData[transactionMonth].expense += transaction.amount;
                }
            }
        });
        
        // Get current month's data for the category chart
        const currentMonth = new Date().getMonth();
        const categoryData = {};
        
        transactions.forEach(transaction => {
            const transactionYear = transaction.date.getFullYear();
            const transactionMonth = transaction.date.getMonth();
            
            if (transactionYear === currentYear && transactionMonth === currentMonth && transaction.type === 'expense') {
                if (!categoryData[transaction.category]) {
                    categoryData[transaction.category] = 0;
                }
                
                categoryData[transaction.category] += transaction.amount;
            }
        });
        
        // Month names for labels
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Update Income vs. Expense Chart
        charts.incomeExpenseChart.data.datasets[0].data = [monthlyData[currentMonth].income];
        charts.incomeExpenseChart.data.datasets[1].data = [monthlyData[currentMonth].expense];
        charts.incomeExpenseChart.update();
        
        // Update Category Chart
        const categories = Object.keys(categoryData);
        const categoryValues = categories.map(category => categoryData[category]);
        
        charts.categoryChart.data.labels = categories;
        charts.categoryChart.data.datasets[0].data = categoryValues;
        charts.categoryChart.update();
        
        // Update Trend Chart
        charts.trendChart.data.labels = monthNames;
        charts.trendChart.data.datasets[0].data = monthlyData.map(data => data.income);
        charts.trendChart.data.datasets[1].data = monthlyData.map(data => data.expense);
        charts.trendChart.update();
    }
    
    // Generate budget form
    function generateBudgetForm() {
        budgetCategories.innerHTML = '';
        
        categories.expense.forEach(category => {
            const budgetValue = budgets[category] || 0;
            
            const div = document.createElement('div');
            div.className = 'mb-3';
            div.innerHTML = `
                <label for="budget-${category}" class="form-label">${category}</label>
                <div class="input-group">
                    <span class="input-group-text">₹</span>
                    <input type="number" class="form-control" id="budget-${category}" 
                           value="${budgetValue}" min="0" step="0.01">
                </div>
            `;
            
            budgetCategories.appendChild(div);
        });
    }
    
    // Save budgets
    function saveBudgets() {
        categories.expense.forEach(category => {
            const input = document.getElementById(`budget-${category}`);
            const value = parseFloat(input.value) || 0;
            
            if (value > 0) {
                budgets[category] = value;
            } else {
                delete budgets[category];
            }
        });
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Update UI
        updateBudgetStatus();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('budgetModal'));
        modal.hide();
        
        // Show toast
        showToast('Success', 'Budgets saved successfully.');
    }
    
    // Export transactions to CSV
    function exportToCSV() {
        if (transactions.length === 0) {
            showToast('Info', 'No transactions to export.');
            return;
        }
        
        // Create CSV content
        let csvContent = 'Date,Type,Category,Amount,Description\n';
        
        transactions.forEach(transaction => {
            const formattedDate = transaction.date.toLocaleDateString('en-IN');
            const formattedAmount = transaction.amount.toFixed(2);
            
            csvContent += `${formattedDate},${transaction.type},${transaction.category},${formattedAmount},"${transaction.description}"\n`;
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `finance-tracker-export-${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show toast
        showToast('Success', 'Transactions exported successfully.');
    }
    
    // Show toast notification
    function showToast(title, message) {
        const toastEl = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Add Transaction button
        document.getElementById('saveTransactionBtn').addEventListener('click', saveTransaction);
        
        // Transaction Type change
        transactionType.addEventListener('change', updateCategoryDropdown);
        
        // Apply Filters button
        document.getElementById('applyFiltersBtn').addEventListener('click', displayTransactions);
        
        // Delete Confirmation button
        document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
            const id = document.getElementById('deleteTransactionId').value;
            deleteTransaction(id);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            modal.hide();
        });
        
        // Manage Budgets button
        document.getElementById('setBudgetBtn').addEventListener('click', function() {
            generateBudgetForm();
        });
        
        // Save Budgets button
        document.getElementById('saveBudgetBtn').addEventListener('click', saveBudgets);
        
        // Export to CSV button
        document.getElementById('exportCSVBtn').addEventListener('click', exportToCSV);
        
        // Theme switch
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
            }
            
            saveToLocalStorage();
            updateCharts();
        });
        
        // Add Transaction Modal shown event
        document.getElementById('addTransactionModal').addEventListener('shown.bs.modal', function() {
            if (!transactionId.value) {
                transactionDate.valueAsDate = new Date();
                transactionModalTitle.textContent = 'Add Transaction';
            }
        });
        
        // Add Transaction Modal hidden event
        document.getElementById('addTransactionModal').addEventListener('hidden.bs.modal', function() {
            transactionForm.reset();
            transactionForm.classList.remove('was-validated');
            transactionId.value = '';
        });
    }
    
    // Initialize the app
    initApp();
    
    // Set up event listeners
    setupEventListeners();
});