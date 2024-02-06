function calculateLoan() {
    const principal = parseFloat(document.getElementById('principal').value);
    const interestRate = parseFloat(document.getElementById('interest').value) / 100 / 12;
    const selectedCurrency = document.getElementById('currency').value;
    let tenureMonths = parseFloat(document.getElementById('tenure').value);

    let remainingBalance = principal;
    let paymentSchedule = [];
    let month = 1;

    // Calculate the fixed monthly payment based on the first payment
    const initialMonthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -tenureMonths));

    while (remainingBalance > 0) {
        const interestPayment = remainingBalance * interestRate;
        const principalPayment = initialMonthlyPayment - interestPayment;

        if (principalPayment >= remainingBalance) {
            // Last payment
            remainingBalance = 0;
        } else {
            remainingBalance -= principalPayment;
        }

        paymentSchedule.push({
            month,
            principalPayment: formatNumber(principalPayment),
            interestPayment: formatNumber(interestPayment),
            remainingBalance: formatNumber(remainingBalance),
            currency: selectedCurrency,
        });

        month++;
    }

    // Update the tenure based on the number of calculated months
    tenureMonths = paymentSchedule.length;

    // Display the payment schedule and calculated fixed monthly payment
    //displayPaymentSummary(paymentSchedule, initialMonthlyPayment, tenureMonths);
    displayPaymentSummary(paymentSchedule, initialMonthlyPayment, tenureMonths);

    // Save input values to localStorage
   // saveInputToLocalStorage();
}

function displayPaymentSummary(schedule, fixedMonthlyPayment, tenureMonths) {
    const principal = parseFloat(document.getElementById('principal').value);
    const resultElement = document.getElementById('result');
    const exportButton = `<button onclick="exportToPDF()">Export to PDF</button>`;
    resultElement.innerHTML = `
                                <table>
                                <tr>
                                <th colspan="4" ><h2>Loan Payment Schedule</h2></th>
                                <tr>
                                <tr>
                                <td colspan="4" ><b>Currency:</b> ${schedule[0].currency} </td>
                                <tr>
                                <td colspan="4"><b>Principal Amount: </b> ${formatNumber(principal)} </td>
                                </tr>
                                <tr>
                                <td colspan="4"><b> Monthly Payment:</b>  ${formatNumber(fixedMonthlyPayment)} </td>
                                </tr>
                                <tr>
                                <td colspan="4"><b>Payment Period (months)</b>: ${tenureMonths}</td>
                                </tr>
                                    <tr>
                                        <th>Month</th>
                                        <th>Principal Payment</th>
                                        <th>Interest Payment</th>
                                        <th>Remaining Balance</th>
                                    </tr>
                                    ${schedule.map(entry => `
                                        <tr>
                                            <td>${entry.month}</td>
                                            <td>  ${entry.principalPayment}</td>
                                            <td>   ${entry.interestPayment}</td>
                                            <td> ${entry.remainingBalance}</td>
                                        </tr>`).join('')}
                                </table>
                                ${exportButton}`;
}

function formatNumber(number) {
    return number.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function exportToPDF() {
    const resultElement = document.getElementById('result');
    const elementToExport = resultElement.querySelector('table');
   // const elementToExport = resultElement;

    const pdfOptions = {
        margin: 10,
        filename: 'loan_payment_schedule.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf(elementToExport, pdfOptions);
}

