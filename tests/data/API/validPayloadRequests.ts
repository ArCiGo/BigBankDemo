export const happyPathScenarios = [
    { 
        description: 'with amount <= 2250 (flat €45 conclusion fee)', 
        amount: 2000, 
        maturity: 36 
    },
    { 
        description: 'with amount > 2250 (standard 2% conclusion fee)', 
        amount: 5000, 
        maturity: 60 
    }
];