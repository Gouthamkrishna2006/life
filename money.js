function presentValueOfPremium(annualpayment, n, r) {
    let discountFactor = (1 - Math.pow(1 + r, -n)) / r;
    return annualpayment * discountFactor;
}

function presentValueOfPaymentsAfterDelay(annuity, r, T, delayYears) {
    let presentvalue = 0;
    for (let t = 1; t <= T; t++) {
        presentvalue += annuity / Math.pow(1 + r, t + delayYears);
    }
    return presentvalue;
}

function terminationPresentValue(terminationamount, r, t) {
    return terminationamount / Math.pow(1 + r, t);
}

function paymentsAfterDelayAfterWithdrawal(annuity, r2, T, withdraw) {
    let bankbalance = 0;
    let moneytaken = 0;
    for (let t = 1; t <= T; t++) {
        bankbalance += annuity;
        moneytaken += bankbalance * withdraw;
        bankbalance = bankbalance * (1 - withdraw);
        bankbalance = bankbalance * (1 + r2);
    }
    return [bankbalance , moneytaken];
}

function presentValueOfPaymentsAfterDelayAfterWithdrawal(annuity, r, r2, T, delayYears, withdraw) {
    let bankbalance = 0;
    let moneytaken = 0;
    for (let t = 1; t <= T; t++) {
        bankbalance += annuity;
        moneytaken += (bankbalance * withdraw) / Math.pow(1 + r, t + delayYears);
        bankbalance = bankbalance * (1 - withdraw);
        bankbalance = bankbalance * (1 + r2);
    }
    bankbalance = bankbalance / Math.pow(1 + r, T + delayYears);
    return [bankbalance , moneytaken];
}

function showCalculation(totalInvestment, totalInvestmentPresent, totalAnnuity, totalAnnuityPresentValue, totalAnnuityTermination, totalAnnuityPresentValueTermination, returnValue, roi) {
    const resultsDiv = document.getElementById("results");
    const theresults = `
        <p><strong>Total Investment:</strong> ${totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' })}</p>
        <p><strong>Total Investment in Present Value:</strong> ${totalInvestmentPresent.toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' })}</p>
        <p><strong>Total Return:</strong> ${totalAnnuity.toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' })}</p>
        <p><strong>Total Return in Present Value:</strong> ${totalAnnuityPresentValue.toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' })}</p>
        <p><strong>Total Return with Termination:</strong> ${totalAnnuityTermination.toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' })}</p>
        <p><strong>Total Return with Termination in Present Value:</strong> ${totalAnnuityPresentValueTermination.toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' })}</p>
        <p><strong>Total Profit:</strong> ${returnValue.toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' })}</p>
        <p><strong>ROI:</strong> ${roi}%</p>
    `;

    resultsDiv.innerHTML = theresults;
    resultsDiv.style.display = "block";
}

function calculate() {
    const planType = document.getElementById("planType").value;
    const term = parseFloat(document.getElementById("term").value);
    const no_benefit_terms = parseFloat(document.getElementById("noBenefitTerms").value);
    const premium = parseFloat(document.getElementById("premium").value);
    const gst1 = parseFloat(document.getElementById("gst1").value);
    const gstRest = parseFloat(document.getElementById("gstRest").value);
    const annuity = parseFloat(document.getElementById("annuity").value);
    const age = parseFloat(document.getElementById("age").value);
    const deathAge = parseFloat(document.getElementById("deathAge").value);
    const deathBenefit = parseFloat(document.getElementById("deathBenefit").value);
    const inflation = parseFloat(document.getElementById("inflation").value) / 100;
    const bankInterestRate = parseFloat(document.getElementById("bankInterestRate").value) / 100;
    const annualWithdrawalPercentage = parseFloat(document.getElementById("annualWithdrawalPercentage").value) / 100;

    const gst = gst1 + gstRest * (term - 1) / term;
    const totalInvestment = term * premium + gst1 + gstRest * (term - 1);
    const totalInvestmentPresent = presentValueOfPremium(premium + gst, term, inflation);
    const annuityPeriod = deathAge - age - term - no_benefit_terms;
    
    if (planType === 'flexi') {
        const [termination_bankbalance , totalAnnuity] = paymentsAfterDelayAfterWithdrawal(annuity, bankInterestRate, annuityPeriod, annualWithdrawalPercentage);
        const [termination_bankbalancepresent, totalAnnuityPresentValue] = presentValueOfPaymentsAfterDelayAfterWithdrawal(annuity, inflation, bankInterestRate, annuityPeriod, term + no_benefit_terms, annualWithdrawalPercentage);
        const totalAnnuityTermination = totalAnnuity + deathBenefit + termination_bankbalance;
        const totalAnnuityPresentValueTermination = totalAnnuityPresentValue + terminationPresentValue(deathBenefit, inflation, annuityPeriod + term + no_benefit_terms) + termination_bankbalancepresent;
        const returnValue = totalAnnuityPresentValue - totalInvestmentPresent;
        const roi = Math.round((returnValue / totalInvestmentPresent) * 10000) / 100;
        showCalculation(totalInvestment, totalInvestmentPresent, totalAnnuity, totalAnnuityPresentValue, totalAnnuityTermination, totalAnnuityPresentValueTermination, returnValue, roi);
    } else {
        const totalAnnuity = annuityPeriod * annuity;
        const totalAnnuityPresentValue = presentValueOfPaymentsAfterDelay(annuity, inflation, annuityPeriod, term + no_benefit_terms);
        const totalAnnuityTermination = totalAnnuity + deathBenefit;
        const totalAnnuityPresentValueTermination = totalAnnuityPresentValue + terminationPresentValue(deathBenefit, inflation, annuityPeriod + term + no_benefit_terms);
        const returnValue = totalAnnuityPresentValue - totalInvestmentPresent;
        const roi = Math.round((returnValue / totalInvestmentPresent) * 10000) / 100;
        showCalculation(totalInvestment, totalInvestmentPresent, totalAnnuity, totalAnnuityPresentValue, totalAnnuityTermination, totalAnnuityPresentValueTermination, returnValue, roi);
    }
}

document.getElementById('planType').addEventListener('change', function () {
    const flexiOptions = document.getElementById('flexiOptions');
    if (this.value === 'flexi') {
        flexiOptions.style.display = 'block';
    } else {
        flexiOptions.style.display = 'none';
    }
});
