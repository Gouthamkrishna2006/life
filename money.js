function presentValueOfPremium(annualpayment, n, r) {
    let discountFactor = (1 - Math.pow(1 + r, -n)) / r;
    let presentvalue = annualpayment * discountFactor;
    presentvalue = Math.round(presentvalue * 100) / 100;
    return presentvalue;
}

function presentValueOfPaymentsAfterDelay(annuity, r, T, delayYears) {
    let presentvalue = 0;
    for (let t = 1; t <= T; t++) {
        presentvalue += annuity / Math.pow(1 + r, t + delayYears);
    }
    presentvalue = Math.round(presentvalue * 100) / 100;
    return presentvalue;
}

function terminationPresentValue(terminationamount, r, t) {
    let presentvalue = terminationamount / Math.pow(1 + r, t);
    presentvalue = Math.round(presentvalue * 100) / 100;
    return presentvalue;
}

function calculate() {
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

    const gst = gst1 + gstRest * (term - 1) / term;
    const totalInvestment = term * premium + gst1 + gstRest * (term - 1);
    const totalInvestmentPresent = presentValueOfPremium(premium + gst, term, inflation);
    const annuityPeriod = deathAge - age;
    const totalAnnuity = annuityPeriod * annuity;
    const totalAnnuityPresentValue = presentValueOfPaymentsAfterDelay(annuity, inflation, annuityPeriod, term + no_benefit_terms);
    const totalAnnuityTermination = totalAnnuity + deathBenefit;
    const totalAnnuityPresentValueTermination = totalAnnuityPresentValue + terminationPresentValue(deathBenefit, inflation, annuityPeriod);
    const returnValue = totalAnnuityPresentValueTermination - totalInvestmentPresent;
    const roi = (returnValue / totalInvestmentPresent) * 100;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <p><strong>Total Investment:</strong> ${totalInvestment}</p>
        <p><strong>Total Investment in Present Value:</strong> ${totalInvestmentPresent}</p>
        <p><strong>Total Return:</strong> ${totalAnnuityTermination}</p>
        <p><strong>Total Return in Present Value:</strong> ${totalAnnuityPresentValueTermination}</p>
        <p><strong>Total Profit:</strong> ${returnValue}</p>
        <p><strong>ROI:</strong> ${roi}%</p>
    `;
    resultsDiv.style.display = "block";
}
