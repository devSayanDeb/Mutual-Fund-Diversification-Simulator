// Enhanced Date Picker Class
class DatePicker {
    constructor(inputId, pickerId) {
        this.input = document.getElementById(inputId);
        this.picker = document.getElementById(pickerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.isOpen = false;

        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        this.init();
    }

    init() {
        this.input.addEventListener('click', () => this.toggle());
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Month navigation buttons
        const prevBtn = this.picker.querySelector('.nav-btn:nth-child(2)');
        const nextBtn = this.picker.querySelector('.nav-btn:nth-child(4)');
        prevBtn.addEventListener('click', () => this.previousMonth());
        nextBtn.addEventListener('click', () => this.nextMonth());

        // Year navigation buttons
        const prevYearBtn = this.picker.querySelector('.year-nav:first-child');
        const nextYearBtn = this.picker.querySelector('.year-nav:last-child');
        prevYearBtn.addEventListener('click', () => this.previousYear());
        nextYearBtn.addEventListener('click', () => this.nextYear());

        const todayBtn = this.picker.querySelector('.today-btn');
        const clearBtn = this.picker.querySelector('.clear-btn');
        todayBtn.addEventListener('click', () => this.selectToday());
        clearBtn.addEventListener('click', () => this.clear());

        this.render();
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.picker.classList.add('show');
        this.isOpen = true;
        this.render();
    }

    close() {
        this.picker.classList.remove('show');
        this.isOpen = false;
    }

    handleOutsideClick(e) {
        if (this.isOpen && !this.picker.contains(e.target) && !this.input.contains(e.target)) {
            this.close();
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    previousYear() {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.render();
    }

    nextYear() {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.render();
    }

    selectToday() {
        const today = new Date();
        this.selectedDate = new Date(today);
        this.currentDate = new Date(today);
        this.updateInput();
        this.render();
        this.close();
        this.input.dispatchEvent(new Event('change'));
    }

    clear() {
        this.selectedDate = null;
        this.input.value = '';
        this.render();
        this.close();
        this.input.dispatchEvent(new Event('change'));
    }

    selectDate(date) {
        this.selectedDate = new Date(date);
        this.updateInput();
        this.render();
        this.close();
        this.input.dispatchEvent(new Event('change'));
    }

    updateInput() {
        if (this.selectedDate) {
            const day = this.selectedDate.getDate().toString().padStart(2, '0');
            const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = this.selectedDate.getFullYear();
            this.input.value = `${day}/${month}/${year}`;
        }
    }

    render() {
        const monthYearDisplay = this.picker.querySelector('.current-month-year');
        monthYearDisplay.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        const grid = this.picker.querySelector('.calendar-grid');
        grid.innerHTML = '';

        this.dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            grid.appendChild(header);
        });

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayButton = document.createElement('button');
            dayButton.type = 'button';
            dayButton.className = 'calendar-day';
            dayButton.textContent = date.getDate();

            if (date.getMonth() !== this.currentDate.getMonth()) {
                dayButton.classList.add('other-month');
            }

            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                dayButton.classList.add('today');
            }

            if (this.selectedDate && date.toDateString() === this.selectedDate.toDateString()) {
                dayButton.classList.add('selected');
            }

            dayButton.addEventListener('click', () => this.selectDate(date));
            grid.appendChild(dayButton);
        }
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    setSelectedDate(date) {
        this.selectedDate = new Date(date);
        this.currentDate = new Date(date);
        this.updateInput();
        this.render();
    }
}

class MutualFundSimulator {
    constructor() {
        this.chart = null;
        this.currentSWPYear = 1;
        this.swpDataByYear = {};
        this.totalSimulationYears = 10;

        // Initialize date pickers
        this.startDatePicker = new DatePicker('startDate', 'startDatePicker');
        this.swpDatePicker = new DatePicker('swpStartDate', 'swpStartDatePicker');

        // this.initializeDates();
        this.bindEvents();
        this.initializeTabs();
        this.initializeToggle();
        this.initializeSWPNavigation();
        this.showPlaceholder();
        this.calculate();
    }

    // Add this method to show the placeholder
    showPlaceholder() {
        const placeholder = document.getElementById('chartPlaceholder');
        if (placeholder) {
            placeholder.classList.remove('hidden');
        }
    }

    // Add this method to hide the placeholder
    hidePlaceholder() {
        const placeholder = document.getElementById('chartPlaceholder');
        if (placeholder) {
            placeholder.classList.add('hidden');
        }
    }

    // Add this method to check if basic inputs are filled
    hasBasicInputs() {
        const investedAmount = parseFloat(document.getElementById('investedAmount').value) || 0;
        const simulationYears = parseInt(document.getElementById('simulationYears').value) || 0;
        const debtPercent = parseFloat(document.getElementById('debtPercent').value) || 0;
        const equityPercent = parseFloat(document.getElementById('equityPercent').value) || 0;

        return investedAmount > 0 && simulationYears > 0 && (debtPercent > 0 || equityPercent > 0);
    }

    initializeDates() {
        const today = new Date();
        const oneYearLater = new Date(today);
        oneYearLater.setFullYear(today.getFullYear() + 1);

        // Set initial dates using the new date pickers
        this.startDatePicker.setSelectedDate(today);
        this.swpDatePicker.setSelectedDate(oneYearLater);
    }

    bindEvents() {
        const inputs = ['investedAmount', 'simulationYears',
            'debtPercent', 'equityPercent', 'debtReturn', 'equityReturn',
            'enableSWP', 'swpAmount', 'swpIncrease'];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element.type === 'checkbox') {
                element.addEventListener('change', () => this.calculate());
            } else {
                element.addEventListener('input', () => this.calculate());
            }
        });

        // Add date picker change events
        document.getElementById('startDate').addEventListener('change', () => this.calculate());
        document.getElementById('swpStartDate').addEventListener('change', () => this.calculate());
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    initializeToggle() {
        const toggle = document.getElementById('swpToggle');
        const checkbox = document.getElementById('enableSWP');
        const swpInputs = document.getElementById('swpInputs');

        // Set initial state
        if (checkbox.checked) {
            toggle.classList.add('active');
        } else {
            this.toggleSWPInputs(false);
        }

        toggle.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            toggle.classList.toggle('active');
            this.toggleSWPInputs(checkbox.checked);
            this.calculate();
        });
    }

    toggleSWPInputs(enabled) {
        const swpInputs = document.querySelectorAll('#swpInputs input');
        swpInputs.forEach(input => {
            input.disabled = !enabled;
        });
    }

    initializeSWPNavigation() {
        const prevBtn = document.getElementById('prevYearBtn');
        const nextBtn = document.getElementById('nextYearBtn');

        prevBtn.addEventListener('click', () => {
            if (this.currentSWPYear > 1) {
                this.currentSWPYear--;
                this.updateSWPTable();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (this.currentSWPYear < this.totalSimulationYears) {
                this.currentSWPYear++;
                this.updateSWPTable();
            }
        });
    }

    validateInputs() {
        const debtPercent = parseFloat(document.getElementById('debtPercent').value) || 0;
        const equityPercent = parseFloat(document.getElementById('equityPercent').value) || 0;
        const errorElement = document.getElementById('allocationError');
        const dateErrorElement = document.getElementById('dateError');

        if (debtPercent + equityPercent !== 100) {
            errorElement.textContent = 'Debt + Equity allocation must equal 100%';
            return false;
        } else {
            errorElement.textContent = '';
        }

        const startDate = this.startDatePicker.getSelectedDate();
        const swpStartDate = this.swpDatePicker.getSelectedDate();

        if (!startDate || !swpStartDate) {
            dateErrorElement.textContent = 'Please select both investment start date and SWP start date';
            return false;
        } else if (swpStartDate < startDate) {
            dateErrorElement.textContent = 'SWP start date must be on or after investment start date';
            return false;
        } else {
            dateErrorElement.textContent = '';
        }

        return true;
    }

    calculate() {
        // Check if we have basic inputs to show/hide placeholder
        if (this.hasBasicInputs()) {
            this.hidePlaceholder();
        } else {
            this.showPlaceholder();
            return; // Don't proceed with calculations if no basic inputs
        }

        if (!this.validateInputs()) return;

        const inputs = this.getInputs();
        this.totalSimulationYears = inputs.simulationYears;

        // Reset current year if it exceeds new simulation years
        if (this.currentSWPYear > this.totalSimulationYears) {
            this.currentSWPYear = 1;
        }

        const results = this.runSimulation(inputs);

        this.updateSummary(results);
        this.updateChart(results);
        this.updateTables(results);
        this.updateNavigationButtons();
    }

    getInputs() {
        return {
            investedAmount: parseFloat(document.getElementById('investedAmount').value) || 0,
            startDate: this.startDatePicker.getSelectedDate() || new Date(),
            swpStartDate: this.swpDatePicker.getSelectedDate() || new Date(),
            simulationYears: parseInt(document.getElementById('simulationYears').value) || 0,
            debtPercent: parseFloat(document.getElementById('debtPercent').value) || 0,
            equityPercent: parseFloat(document.getElementById('equityPercent').value) || 0,
            debtReturn: parseFloat(document.getElementById('debtReturn').value) || 0,
            equityReturn: parseFloat(document.getElementById('equityReturn').value) || 0,
            enableSWP: document.getElementById('enableSWP').checked,
            swpAmount: parseFloat(document.getElementById('swpAmount').value) || 0,
            swpIncrease: parseFloat(document.getElementById('swpIncrease').value) || 0
        };
    }

    runSimulation(inputs) {
        const initialDebtAmount = inputs.investedAmount * (inputs.debtPercent / 100);
        const initialEquityAmount = inputs.investedAmount * (inputs.equityPercent / 100);

        let debtBalance = initialDebtAmount;
        let equityBalance = initialEquityAmount;
        let totalTaxesPaid = 0;
        let totalSWPWithdrawn = 0;
        let totalCapitalGains = 0;

        const yearlyResults = [];
        this.swpDataByYear = {}; // Reset SWP data
        const annualTaxSummary = [];
        const monthlyDebtReturn = inputs.debtReturn / 100 / 12;
        const annualEquityReturn = inputs.equityReturn / 100;

        let costBasisPerUnit = 1;
        let totalUnits = initialDebtAmount;

        for (let year = 1; year <= inputs.simulationYears; year++) {
            let yearlyCapitalGains = 0;
            let yearlyTaxLTCG = 0;
            let yearlyTaxSTCG = 0;
            let yearlySWP = 0;

            this.swpDataByYear[year] = []; // Initialize array for this year

            const currentSWPAmount = inputs.swpAmount * Math.pow(1 + inputs.swpIncrease / 100, year - 1);

            for (let month = 1; month <= 12; month++) {
                const growthFactor = (1 + monthlyDebtReturn);
                debtBalance = debtBalance * growthFactor;

                const currentValue = debtBalance / totalUnits;

                if (inputs.enableSWP && debtBalance >= currentSWPAmount) {
                    const swpDate = new Date(inputs.swpStartDate);
                    swpDate.setFullYear(swpDate.getFullYear() + year - 1);
                    swpDate.setMonth(swpDate.getMonth() + month - 1);

                    if (swpDate >= inputs.swpStartDate) {
                        const holdingPeriodMonths = this.getHoldingPeriod(inputs.startDate, swpDate);
                        const isLTCG = holdingPeriodMonths >= 12;

                        const unitsWithdrawn = currentSWPAmount / currentValue;
                        const costBasisWithdrawn = unitsWithdrawn * costBasisPerUnit;
                        const capitalGain = Math.max(0, currentSWPAmount - costBasisWithdrawn);

                        let taxAmount = 0;
                        let taxRate = 0;

                        if (capitalGain > 0) {
                            if (isLTCG) {
                                taxAmount = capitalGain * 0.125;
                                taxRate = 12.5;
                                yearlyTaxLTCG += taxAmount;
                            } else {
                                taxAmount = capitalGain * 0.30;
                                taxRate = 30;
                                yearlyTaxSTCG += taxAmount;
                            }
                        }

                        debtBalance -= currentSWPAmount;
                        totalUnits -= unitsWithdrawn;
                        totalSWPWithdrawn += currentSWPAmount;
                        yearlySWP += currentSWPAmount;
                        totalTaxesPaid += taxAmount;
                        yearlyCapitalGains += capitalGain;
                        totalCapitalGains += capitalGain;

                        // Store SWP data for this year
                        this.swpDataByYear[year].push({
                            date: swpDate.toLocaleDateString('en-IN'),
                            amount: currentSWPAmount,
                            holdingPeriod: `${holdingPeriodMonths} months`,
                            capitalGains: capitalGain,
                            taxRate: taxRate,
                            taxAmount: taxAmount
                        });
                    }
                }
            }

            equityBalance = equityBalance * (1 + annualEquityReturn);

            const totalPortfolioValue = debtBalance + equityBalance;
            const netPortfolioValue = totalPortfolioValue - totalTaxesPaid;

            yearlyResults.push({
                year: year,
                debtBalance: debtBalance,
                equityBalance: equityBalance,
                annualSWP: yearlySWP,
                capitalGainsTax: yearlyTaxLTCG + yearlyTaxSTCG,
                totalPortfolioValue: totalPortfolioValue,
                netPortfolioValue: netPortfolioValue
            });

            const fyStart = new Date(inputs.startDate.getFullYear() + year - 1, 3, 1);
            const fyEnd = new Date(inputs.startDate.getFullYear() + year, 2, 31);

            annualTaxSummary.push({
                financialYear: `FY ${fyStart.getFullYear()}-${(fyEnd.getFullYear()).toString().slice(-2)}`,
                totalWithdrawals: yearlySWP,
                totalCapitalGains: yearlyCapitalGains,
                ltcgTax: yearlyTaxLTCG,
                stcgTax: yearlyTaxSTCG,
                totalTax: yearlyTaxLTCG + yearlyTaxSTCG
            });
        }

        return {
            yearlyResults,
            annualTaxSummary,
            finalPortfolioValue: yearlyResults[yearlyResults.length - 1].totalPortfolioValue,
            totalSWPWithdrawn,
            totalTaxesPaid,
            totalCapitalGains,
            netPortfolioValue: yearlyResults[yearlyResults.length - 1].netPortfolioValue
        };
    }

    getHoldingPeriod(startDate, currentDate) {
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(diffDays / 30);
    }

    updateSummary(results) {
        document.getElementById('finalPortfolioValue').textContent = this.formatCurrency(results.finalPortfolioValue);
        document.getElementById('totalSWPWithdrawn').textContent = this.formatCurrency(results.totalSWPWithdrawn);
        document.getElementById('totalTaxesPaid').textContent = this.formatCurrency(results.totalTaxesPaid);
        document.getElementById('netPortfolioValue').textContent = this.formatCurrency(results.netPortfolioValue);
    }

    updateChart(results) {
        const ctx = document.getElementById('portfolioChart').getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        const years = results.yearlyResults.map(r => `Year ${r.year}`);
        const debtBalances = results.yearlyResults.map(r => r.debtBalance);
        const equityBalances = results.yearlyResults.map(r => r.equityBalance);
        const totalValues = results.yearlyResults.map(r => r.totalPortfolioValue);
        const netValues = results.yearlyResults.map(r => r.netPortfolioValue);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Debt Fund Balance',
                        data: debtBalances,
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'Equity Fund Balance',
                        data: equityBalances,
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'Total Portfolio Value',
                        data: totalValues,
                        borderColor: '#45B7D1',
                        backgroundColor: 'rgba(69, 183, 209, 0.1)',
                        tension: 0.4,
                        borderWidth: 3
                    },
                    {
                        label: 'Net Value (After Tax)',
                        data: netValues,
                        borderColor: '#FFA726',
                        backgroundColor: 'rgba(255, 167, 38, 0.1)',
                        tension: 0.4,
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Portfolio Growth Projection',
                        color: '#FFFFFF',
                        font: {
                            size: 16,
                            weight: '600'
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#FFFFFF',
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'line'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#F2F2F2'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            color: '#F2F2F2',
                            callback: function (value) {
                                return '₹' + (value / 100000).toFixed(1) + 'L';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    updateTables(results) {
        // Update portfolio summary table
        const portfolioTableBody = document.querySelector('#portfolioTable tbody');
        portfolioTableBody.innerHTML = '';

        results.yearlyResults.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                        <td>${row.year}</td>
                        <td class="currency">${this.formatCurrency(row.debtBalance)}</td>
                        <td class="currency">${this.formatCurrency(row.equityBalance)}</td>
                        <td class="currency">${this.formatCurrency(row.annualSWP)}</td>
                        <td class="currency">${this.formatCurrency(row.capitalGainsTax)}</td>
                        <td class="currency">${this.formatCurrency(row.netPortfolioValue)}</td>
                    `;
            portfolioTableBody.appendChild(tr);
        });

        // Update annual tax summary table
        const annualTaxTableBody = document.querySelector('#annualTaxTable tbody');
        annualTaxTableBody.innerHTML = '';

        results.annualTaxSummary.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                        <td>${row.financialYear}</td>
                        <td class="currency">${this.formatCurrency(row.totalWithdrawals)}</td>
                        <td class="currency">${this.formatCurrency(row.totalCapitalGains)}</td>
                        <td class="currency">${this.formatCurrency(row.ltcgTax)}</td>
                        <td class="currency">${this.formatCurrency(row.stcgTax)}</td>
                        <td class="currency">${this.formatCurrency(row.totalTax)}</td>
                    `;
            annualTaxTableBody.appendChild(tr);
        });

        // Update SWP table for current year
        this.updateSWPTable();
    }

    updateSWPTable() {
        const swpTableBody = document.querySelector('#swpTable tbody');
        const currentYearLabel = document.getElementById('currentYearLabel');
        const swpTableSlide = document.getElementById('swpTableSlide');

        // Update year label
        currentYearLabel.textContent = `SWP Schedule: Year ${this.currentSWPYear}`;

        // Clear existing rows
        swpTableBody.innerHTML = '';

        // Add animation class
        swpTableSlide.style.animation = 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

        // Get data for current year
        const yearData = this.swpDataByYear[this.currentSWPYear] || [];

        if (yearData.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                        <td colspan="6" style="text-align: center; color: #F2F2F2; font-style: italic;">
                            No SWP withdrawals for this year
                        </td>
                    `;
            swpTableBody.appendChild(tr);
        } else {
            yearData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                            <td>${row.date}</td>
                            <td class="currency">${this.formatCurrency(row.amount)}</td>
                            <td>${row.holdingPeriod}</td>
                            <td class="currency">${this.formatCurrency(row.capitalGains)}</td>
                            <td>${row.taxRate}%</td>
                            <td class="currency">${this.formatCurrency(row.taxAmount)}</td>
                        `;
                swpTableBody.appendChild(tr);
            });
        }

        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevYearBtn');
        const nextBtn = document.getElementById('nextYearBtn');

        // Update button states
        if (this.currentSWPYear <= 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }

        if (this.currentSWPYear >= this.totalSimulationYears) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    }
}

// Initialize the simulator
const simulator = new MutualFundSimulator();