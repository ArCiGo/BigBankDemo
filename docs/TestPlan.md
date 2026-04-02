# BigBank Demo Test Plan

This document outlines the testing activities for the **Väikelaen** calculator. Review [here](docs/TestCases.xlsx) the test cases created for the following scenarios.

## Objective

Test the correctness of the **Väikelaen** calculator UI and API.

## Scope

* For the practical purposes of this assessment, the focus will be only on functional testing of the UI and API.
* Non-functional testing (like performance, security, etcétera) is out of scope for this assessment.
* It is out of scope to test the whole workflow for the väikelaen application.
* Strict validation of calculated fields is outside the scope.
* The time the calculator remains open for the user is also outside the scope

## Scenario: Väikelaen calculator modal UI Validations

In the Excel file, please review the **UI (part 1)** and **UI (part 2)** sheets.

### Assumptions

* The **Väikelaen** calculator is deployed to production and accessible for everyone without any registration.
* The form registration, after saving the loan quote, is out of the scope for this assessment.

#### Nota bene!

For the purposes of this technical assessment, it is OK to conduct non-strict validation of the final results. But, consider updating the test cases accordingly when the fixed values change.

## Scenario: Väikelaen calculator API Validations

In the Excel file, please review the **API** sheet.

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
* Logic behind the `apr` and `monthlyPayment` properties in the payload response is out of scope (so, it is OK to perform non-strict validation on these properties).
* `totalRepayableAmount` property, in the payload response, is calculated as it follows: `totalRepayableAmount = monthlyPayment * maturity`.

#### Nota bene!

* The fixed values for the properties in the payload request may change over time. For example, the `interestRate` property may change from _16.8_ (**30th of March**) to another value (_7.9_ for **31st of March**). For the purposes of this technical assessment, non-strict validation of the final results can be conducted. But, consider updating the test cases accordingly when the fixed values change.

## Automation

For the purposes of this technical assessment, I created the following tests in the UI section to validate the calculator modal's correct functionality:

* Validation of the default state.
* Updating and saving values in the calculator modal.
* Validation of boundary values in the calculator modal inputs.

In the API section, I created the following tests:

* Validation of data submission with a `conclusionFee` of *45*.
* Validation of data submission with a `conclusionFee` calculated using the following formula: `conclusionFee = amount * 0.02`, when the amount is greater than *2250*.
* Validation of the server's response when a property is missing in the payload request.

## Discoveries

When I did the exploratory session and automation scripting, I found the following.-

* There is no close button for the calculator modal. What if the user wants to close it to go back to the previous page?
* If I press the `Enter` key after filling any of the inputs of the form, or when I use the sliders, the modal closes. Is this an expected behavior? If not, this condition from the assessment is not met: _«Calculator changes should not be saved until the "Jätka" button is clicked»_.
* Based on what Ave Algpeus answered me via email, I did not conducted a strict validation of calculated fields. Before that, I was trying to figure out how the `conclusionFee`, `apr`, `monthlyPayment` and `totalRepayableAmount` properties were calculated. I thought I had sorted out the logic behind `conclusionFee` and `totalRepayableAmount`, but I found that the formula I had come up with to calculate `totalRepayableAmount` was not entirely accurate. For example: When the user sends `amount = 2000` and `maturity = 36`, using the formula I had come up with gives a result of `2407.32`, but the API returns `2407.17`.
* As you can see in the **API** sheet, I reported some test cases that did not meet the expectations (based on my judgment). I am not sure what is the logic behind the calculations, but for me it makes` sense that if there is a range limit for **periood** and **laenusumma**, the service should return an error message if the user sends a value outside these boundaries.