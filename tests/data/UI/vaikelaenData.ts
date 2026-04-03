export const vaikelaenData = {
    urlParams: {
        amount: '9434.34',
        period: '60',
        // The modal renders the amount with a thousands separator
        modalLaenusumma: '9,434.34',
        modalPeriood: '60',
    },
    url: 'https://taotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS',
    initial: {
        headerLaenusumma: '5000 €',
    },
    update: {
        laenusumma: '19610.56',
        periood: '30',
        headerLaenusumma: '19610.56 €',
        modalLaenusumma: '19,610.56',
        modalPeriood: '30',
    },
    slider: {
        laenusumma: 20010,
        periood: 45,
        headerLaenusumma: '20,010 €',
    },
    clamping: {
        min: {
            inputLaenusumma: '499',
            inputPeriood: '5',
            expectedLaenusumma: '500',
            expectedPeriood: '6',
        },
        max: {
            inputLaenusumma: '30001',
            inputPeriood: '121',
            expectedLaenusumma: '30,000',
            expectedPeriood: '120',
        }
    }
};