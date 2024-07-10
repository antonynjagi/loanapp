function calculateLoan() {
    const principal = parseFloat(document.getElementById('principal').value);
    const interestRate = parseFloat(document.getElementById('interest').value) / 100 / 12;
    const selectedCurrency = document.getElementById('currency').value;
    const tenureMonths = parseInt(document.getElementById('tenure').value);

    let remainingBalance = principal;
    let paymentSchedule = [];
    let totalInterestPaid = 0; // Declare totalInterestPaid in the proper scope

    // Calculate the fixed monthly payment based on the first payment
    const initialMonthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -tenureMonths));

    for (let month = 1; month <= tenureMonths; month++) {
        const interestPayment = remainingBalance * interestRate;
        const principalPayment = initialMonthlyPayment - interestPayment;

        remainingBalance -= principalPayment;
        totalInterestPaid += interestPayment;

        paymentSchedule.push({
            month,
            principalPayment: formatNumber(principalPayment),
            interestPayment: formatNumber(interestPayment),
            remainingBalance: formatNumber(remainingBalance),
            currency: selectedCurrency,
        });
    }

    // Calculate total amount paid (principal + total interest)
    const totalAmountPaid = principal + totalInterestPaid;

    // Display the payment schedule and calculated values in the summary
    displayPaymentSummary(paymentSchedule, initialMonthlyPayment, tenureMonths, totalInterestPaid, totalAmountPaid);

    
}


function displayPaymentSummary(schedule, fixedMonthlyPayment, tenureMonths) {
    const principal = parseFloat(document.getElementById('principal').value);
    const resultElement = document.getElementById('result');
    const exportButton = `<button onclick="exportToPDF()">Export to PDF</button>`;
    resultElement.innerHTML = `
                                <table>
                                <tr>
                <th colspan="4" ><h2>Loan Payment Schedule</h2></th>
            </tr>
            <tr>
                <td colspan="4" ><b>Currency:</b> ${schedule[0].currency} </td>
            </tr>
            <tr>
                <td colspan="4"><b>Principal Amount:</b> ${formatNumber(principal)} </td>
            </tr>
            <tr>
                <td colspan="4"><b>Monthly Payment:</b>  ${formatNumber(fixedMonthlyPayment)} </td>
            </tr>
            <tr>
                <td colspan="4"><b>Payment Period (months):</b> ${tenureMonths}</td>
            </tr>
            <tr>
                <td colspan="4"><b>Total Interest Paid:</b> ${schedule[0].currency} ${formatNumber(totalInterestPaid)}</td>
            </tr>
            <tr>
                <td colspan="4"><b>Total Amount Paid:</b> ${schedule[0].currency} ${formatNumber(totalAmountPaid)}</td>
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
    const roundedNumber = Math.round(number * 100) / 100;
    const [integerPart, decimalPart] = roundedNumber.toString().split('.');

    if (!decimalPart) {
        // If there is no decimal part, add two decimal places
        return `${integerPart}.00`;
    } else if (decimalPart.length === 1) {
        // If there is only one digit in the decimal part, add an additional zero
        return `${integerPart}.${decimalPart}0`;
    } else {
        // If there are already two or more digits in the decimal part, keep as is
        return roundedNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
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

