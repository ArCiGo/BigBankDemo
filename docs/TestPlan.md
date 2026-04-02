# BigBank Demo Test Plan

For the practical purposes of this assessment, the focus will be only on functional testing of the UI and API.

This document outlines the testing activities for the **Väikelaen** calculator. It covers both UI & API validations for the `/api/v1/loan/calculate` endpoint.

## Scenario: Väikelaen calculator modal UI Validations

### Assumptions

* The **Väikelaen** calculator is deployed to production and accessible for everyone without any registration.
* The form registration, after saving the loan quote, is out of the scope for this assessment.

#### Nota bene!

For the purposes of this technical assessment, non-strict validation of the final results can be conducted. But, consider updating the test cases when the fixed values change.

## Scenario: Väikelaen calculator API Validations

### Assumptions

* The following properties in the payload request have these fixed values.-
    ```json
    {
        "currency": "EUR",
        "productType": "SMALL_LOAN_EE01",
        "administrationFee": 3.99,
        "monthlyPaymentDay": 15,
        "interestRate": 7.9
    }
    ```
* `amount` and `maturity` properties are `Laenusumma` and `Periood` in the UI respectively.
* `conclusionFee`, in the payload request, is calculated as it follows: `conclusionFee = amount * 0.02`. But, when the amount is <= 2250, the `conclusionFee` is `45`.
* It is OK to just use the following header parameters.-
    ```json
    {
        "content-type": "application/json",
        "accept": "application/json, text/plain, */*"
    }
    ```
* Logic behind the `apr` and `monthlyPayment` properties in the payload response is out of scope (so, no strict validation will be performed on these properties).
* `totalRepayableAmount` property, in the payload response, is calculated as it follows: `totalRepayableAmount = monthlyPayment * maturity`.

#### Nota bene!

The fixed values for the properties in the payload request may change over time. For example, the `interestRate` property may change from _16.8_ (**30th of March**) to another value (_7.9_ for **31st of March**). For the purposes of this technical assessment, non-strict validation of the final results can be conducted.

But, consider updating the test cases when the fixed values change.

### Preconditions

* The following URL should be used for the API calls: `https://taotlus.bigbank.ee/api/v1/loan/calculate`.
* Use the fixed values for the properties in the payload request (see **Assumptions** section).
* Use the header parameters mentioned in the **Assumptions** section.

## Discoveries.-

In addition to the issues found in the test cases for the API, I would like to mention the following.-

* There is no close button for the calculator modal. What if the user wants to close it to go back to the previous page?
* If I press the `Enter` key after filling any of the inputs of the form, the modal closes. Is this the expected behavior? If not, this condition from the assessment is not met: _«Calculator changes should not be saved until the "Jätka" button is clicked»_.