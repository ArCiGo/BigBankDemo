export const vaikelaenData = {
    url: 'https://taotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS',
    initial: {
        // headerLaenusumma: '5000 €',
        headerLaenusumma: '500 €',
    },
    update: {
        laenusumma: '4546.45',
        periood: '40',
        headerLaenusumma: '4546.45 €',
        modalLaenusumma: '4,546.45',
        modalPeriood: '40',
    },
    slider: {
        laenusumma: 15000,
        periood: 84,
        headerLaenusumma: '15000 €',
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