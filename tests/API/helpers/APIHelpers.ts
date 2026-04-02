function generateCalculatePayload(amount: number, maturity: number) {
    // Review with the team if this calculation assumption is correct
    const conclusionFee = amount <= 2250 ? 45 : Number((amount * 0.02).toFixed(2));
    
    return {
        currency: "EUR",
        productType: "SMALL_LOAN_EE01",
        maturity,
        administrationFee: 3.99,
        conclusionFee,
        amount,
        monthlyPaymentDay: 15,
        interestRate: 7.9
    };
}

export { generateCalculatePayload };