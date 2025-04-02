# Personal Finance Tracker

A clean, responsive web application for tracking personal finances, managing budgets, and visualizing spending patterns.

## Preview Images Uploading Soon.....

## Features

- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budget Tracking**: Set monthly budgets for different expense categories
- **Visual Analytics**: View income vs. expenses, category-wise spending, and monthly trends
- **Data Filtering**: Filter transactions by date range, type, and category
- **Data Export**: Export transactions to CSV for external analysis
- **Responsive Design**: Works on desktops, tablets, and mobile devices
- **Dark/Light Theme**: Toggle between light and dark themes based on preference
- **Local Storage**: All data is stored locally in the browser

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- [Bootstrap 5](https://getbootstrap.com/) - For responsive UI components
- [Chart.js](https://www.chartjs.org/) - For data visualization
- [Bootstrap Icons](https://icons.getbootstrap.com/) - For UI icons

## Installation

Since this is a client-side application, no server setup is required. You can use it in multiple ways:

### Option 1: Direct Download

1. Download the repository
2. Open `index.html` in your web browser

### Option 2: Using a Local Server

If you have Node.js installed, you can use tools like `http-server`:

```bash
# Install http-server globally
npm install -g http-server

# Navigate to the project directory
cd finance-tracker

# Start the server
http-server

# Access the application at http://localhost:8080
```

### Option 3: GitHub Pages

You can also deploy this application to GitHub Pages for free hosting:

1. Fork this repository
2. Go to repository settings
3. Navigate to Pages section
4. Select the main branch as the source
5. Your application will be available at `https://[your-username].github.io/finance-tracker/`

## Usage Guide

### Managing Transactions

1. Click the "Add Transaction" button to record a new transaction
2. Fill in the date, type (income/expense), category, amount, and description
3. Click "Save" to add the transaction to your records
4. To edit or delete a transaction, use the corresponding buttons in the transactions table

### Setting Budgets

1. Click the "Manage Budgets" button
2. Set monthly budget amounts for different expense categories
3. Click "Save Budgets" to update your budget settings

### Filtering Transactions

1. Use the date range, type, and category filters in the transactions section
2. Click "Apply Filters" to view filtered transactions

### Exporting Data

1. Click the "Export to CSV" button to download all your transaction data in CSV format
2. The CSV file can be opened in Excel, Google Sheets, or other spreadsheet applications

### Switching Themes

- Toggle the theme switch in the top-right corner to switch between light and dark themes

## Data Privacy

All your financial data is stored locally in your browser's localStorage. This means:

- No data is sent to any server
- Your financial information remains private on your device
- Data persists between sessions until you clear your browser data

## Browser Compatibility

- Chrome: Latest version
- Firefox: Latest version
- Safari: Latest version
- Edge: Latest version
- Opera: Latest version

## Known Limitations

- Data is stored in the browser's localStorage, which has a size limit (typically 5-10MB)
- Data is tied to the browser; using a different browser or device will not show the same data
- No cloud backup functionality (by design, for privacy)

## Future Enhancements

- [ ] Import data from CSV/Excel files
- [ ] Recurring transactions
- [ ] Multiple currency support
- [ ] Customizable categories
- [ ] Report generation
- [ ] Data visualization enhancements
- [ ] Optional cloud sync with encryption

## Contributing

Contributions are welcome! If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for the responsive framework
- [Chart.js](https://www.chartjs.org/) for the beautiful charts
- [Bootstrap Icons](https://icons.getbootstrap.com/) for the icon set
- [Google Fonts](https://fonts.google.com/) for the Poppins font family

---

Created with ❤️ by Prathamesh Vattamwar
