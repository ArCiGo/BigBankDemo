# BigBank Demo Test Plan

This document outlines the testing activities for the **Väikelaen** calculator modal. Review [here](docs/TestCases.xlsx) the test cases created for the following scenarios.

## Objective

Test the correctness of the **Väikelaen** calculator UI and API.

## Scope

* For the purposes of this assessment, the focus will be only on functional testing of the UI and API.
* Non-functional testing (like performance, security, etcetera) is out of scope for this assessment.
* It is out of scope to test the whole workflow for the väikelaen application.
* Strict validation of calculated fields is out of scope.
* The time the calculator remains open for the user is also out of scope.

## How many different test scenarios would be necessary to test the Väikelaen calculator modal?

In my judgment, the following scenarios are necessary to verify that the calculator modal works as expected.-

1. Default state validation (when no URL parameters are provided).
2. URL parameter handling.
3. Input validation: Boundary values for **Laenusumma**.
4. Input validation: Boundary values for **Periood**.
5. Slider synchronization with inputs.
6. Quote persistence after user clicks on **Jätka** button.
7. API happy path calculations.
8. API boundary enforcement (out of range values).
9. API schema validation (missing/wrong type fields).

Approximately 9 scenario groups, which map to the 21 test cases documented in the Excel file.

## Test strategy

I applied boundary value analysis and equivalence partitioning for both UI and API testing, since the inputs (**Laenusumma**-**amount** and **Periood**-**maturity**) have clearly defined numeric ranges (decimal and integer respectively). For the UI, I complemented this with exploratory testing to uncover unexpected behaviors (like saving the quote when pressing **Enter** key instead of clicking on **Jätka** button).

Expanding a little bit more about API testing, my approach focuses on three things.-

* **Happy path validation**: Confirming that valid inputs produce structurally correct responses with approximate expected values.
* **Boundary enforcement at the API layer**: Even though the UI clamps values, I deliberately sent out of range amounts and maturities directly to the API to verify whether server-side validation exists independently of the UI. This is important because a user could call the API directly. **TC-API-004** through **TC-API-007** are specifically designed for this.
* **Schema robustness**: Testing missing and wrong type fields (**TC-API-008** through **TC-API-010**) to confirm the API returns meaningful error messages rather than silently failing or returning garbage data.

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
* `conclusionFee`, in the payload request, is calculated as it follows: `conclusionFee = amount * 0.02`. But, when the amount is *<= 2250*, the `conclusionFee` is *45*.
* It is OK to just use the following header parameters.-
    ```json
    {
        "content-type": "application/json",
        "accept": "application/json, text/plain, */*"
    }
    ```
* Logic behind the `apr` (**APRC**) and `monthlyPayment` properties in the payload response is out of scope (so, it is OK to perform non-strict validation on these properties).
* `totalRepayableAmount` property, in the payload response, is calculated as it follows: `totalRepayableAmount = monthlyPayment * maturity`.
* The API should return proper error messages if the payload request is missing any of the required properties or if the values are out of range or of the wrong type. It should return a `400` status and it should not perform any changes in the database.

#### Nota bene!

* The fixed values for the properties in the payload request may change over time. For example, the `interestRate` property may change from _16.8_ (**30th of March**) to another value (_7.9_ for **31st of March**). For the purposes of this technical assessment, non-strict validation of the final results can be conducted. But, consider updating the test cases accordingly when the fixed values change.

## Automation

I created the following tests for the UI to validate the calculator modal's correct functionality:

* Validation of parametrised URL parameters, explicitly validating the default state of the page: the calculator modal should open automatically when the user navigates to the resource.
* Updating, saving and validating values in the calculator modal and header.
* Validation of boundary values in the calculator modal inputs.

For the API, I created the following tests:

* Validation of data submission with a `conclusionFee` of *45*.
* Validation of data submission with a `conclusionFee` calculated using the following formula: `conclusionFee = amount * 0.02`, when the amount is greater than *2250*.
* Validation of the server's response when a property is missing in the payload request.

### Justification for these automated test cases

For the UI, I automated four cases. The first one is when the user updates the parameters in the URL, navigates to the updated resource and checks if the calculator modal loads with the parametrised values (**TC-UI-002**). The second one is the save and edit flow: It covers **TC-UI-009** and **TC-UI-003**. Both cases explicitly test the default state of the page: the calculator modal should open automatically when the user navigates to the page. 

The last two cases cover clamping behavior (**TC-UI-004**, **TC-UI-005**, **TC-UI-007**, **TC-UI-008**): I handled all four boundary cases in a single test because the logic is the same for both fields: Type an out of range value, blur the input, and verify the field snaps back.

I left **TC-UI-006** (no decimals in **Periood**), and **TC-UI-011** (invalid strings) as «manual». They are all single-step verifications that are faster to check visually than to maintain a test for. The slider test (**TC-UI-010**) exists in the code as a commented-out demo step.

For the API, I automated the two branches of the **conclusionFee** logic: **amount** <= *2250* uses a flat fee of *45*, and **amount** > 2250 uses `amount * 0.02`. That is the one concrete business rule I could test without needing to understand the full calculation internals, and both branches run through the same schema validation against **responseSchema.json**. The missing property test (**TC-API-008**) was also a clear automation candidate: The expected response is a fixed, well-defined JSON structure stored in **errorPayloadResponse.ts**, so the assertion is deterministic and would not drift. 

**TC-API-004** through **TC-API-007** and **TC-API-010** are all currently failing against what I consider the correct expected behavior, so automating them before the team confirms whether those are actual bugs or intentional behavior would just give me a permanently red suite with no actionable signal.

### My own vision about the «perfect» automation framework

In my opinion, a good test automation framework should be scalable, readable, and easy to maintain. Separation of concerns is the foundation of that: UI and API tests should live in dedicated folders and never be mixed together. That said, it is perfectly fine to call API requests from UI tests when it helps reduce execution time (for example, setting up state before a UI flow instead of doing it through the browser).

I prefer to start with API tests and expand to UI tests afterwards. API tests are faster to write, faster to execute, and less prone to breaking due to UI changes, so they give you a reliable baseline before you layer in the more fragile browser interactions.

Beyond structure, a framework should have:

* Helpers and utilities for reusable automation logic that would otherwise be duplicated across tests.
* Page objects (for UI) to keep locator definitions and interactions out of the **\*.spec** files.
* Dedicated data files, so test values are never hardcoded inline. If something changes, you update it in one place.
* Stable locators to reduce test brittleness when the UI evolves. I prefer to handle `data-testid` attributes rather than `id` or `class` attributes that developer can change, or even remove, for their own purposes.
* **.env** files for sensitive or environment-specific values that should not be committed to the repository.
* A dedicated folder for reports, so the output is always predictable and easy to find.
* A CI/CD pipeline that is simple enough to read, extend, and debug without needing to be a DevOps/SRE expert.
* Documentation that explains how to set up, run, and extend the project (including what each folder is for).

The goal is that someone new to the project can clone the repository, read the README, and be running tests within a few minutes.

## Discoveries

When I did the exploratory session and automation scripting, I found the following.-

* There is no close button for the calculator modal. What if the user wants to close it to go back to the previous page?
* Pressing the **Enter** key after filling any of the inputs, or while using the sliders, closes the modal and saves the values (without clicking **Jätka**). This looks like a bug to me, because it directly breaks the following requirement mentioned in the assessment: *«Calculator changes should not be saved until the "Jätka" button is clicked»*. I flagged it **in TC-UI-009** and **TC-UI-010**, but the team should confirm whether this is intentional or not before I raise a formal bug ticket.
* Based on what Ave Algpeus answered me via email, I did not conducted a strict validation of calculated fields. Before that, I was trying to figure out how the `conclusionFee`, `apr`, `monthlyPayment` and `totalRepayableAmount` properties were calculated. I thought I had sorted out the logic behind `conclusionFee` and `totalRepayableAmount`, but I found that the formula I had come up with to calculate `totalRepayableAmount` was not entirely accurate. For example: When the user sends `amount = 2000` and `maturity = 36`, using the formula I had come up with gives a result of *2407.32*, but the API returns *2407.17*.
* **APRC** is not displayed in the UI. This looks like a bug to me. Based on the assessment: *«[...] then the new monthly payment amount and APRC (Annual Percentage Rate of Charge) will be calculated by the "calculate" endpoint and displayed to the user».*. By checking the Network traces in the browser, I can see that the `calculate` endpoint returns the `apr` (**APRC**) property.
* I noticed that some HTML elements have their own `data-testid` attributes (and that is good!), but their values are not unique and meaningful. For example: For the **Laenusumma**, I can see the `data-testid` value is `bb-input__input`, but for the `id` is `header-calculator-amount`. There are more than 8 HTML elements in the page referencing to the same `data-testid` value. I would suggest to use more specific and unique `data-testid` values for each element.
  * For further reading, these resources explain well why `data-testid` attributes are better for automation testing:
    * [Why Should You Use data-testid Attributes?](https://bugbug.io/blog/software-testing/data-testid-attributes/).
    * [data-testid: Bridging the Gap between QA Engineering and Front End Dev](https://dev.to/johnnyv5g/data-testid-bridging-the-gap-between-qa-engineering-and-front-end-dev-gja).
* As you can see in the **API** sheet, I reported some test cases that did not meet the expectations (based on my judgment). I am not sure what is the logic behind the calculations, but for me it makes sense that if there is a range limit for **Periood** and **Laenusumma**, the service should return an error message if the user sends a value outside these boundaries.