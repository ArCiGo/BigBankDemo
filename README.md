# BigBank Demo assessment

A technical assessment for the [Quality Engineer position](https://jobs.bigbank.eu/open-positions/quality-engineer-2/).

Review [here](./docs/TestPlan.md) the test plan.

## The project 💻.

The following project was made using TS + Playwright. Review [here](./docs/Quality%20Engineer%20exercise.pdf) the assessment proposed.

## Tools 🛠️.

* **playwright/test** v1.58.2
* **@types/node** v25.5.0
* **playwright-schema-validator** v1.0.0

## Main project structure 🗂️.

```bash
.
├── .github/
│   └── workflows/
│       └── playwright.yml
├── page-objects/
│   ├── shared/
│   │   └── components/
│   │       └── HeaderComponent.ts
│   └── VaikelaenPage.ts
├── tests/
│   ├── API/
│   │   ├── helpers/
│   │   │   └── APIHelpers.ts
│   │   └── vaikelaen.spec.ts
│   ├── data/
│   │   ├── API/
│   │   │   ├── schemas/
│   │   │   │   └── responseSchema.json
│   │   │   ├── errorPayloadResponse.ts
│   │   │   └── validPayloadRequests.ts
│   │   └── UI/
│   │       └── vaikelaenData.ts
│   └── UI/
│       └── vaikelaen.spec.ts
├── package-lock.json
├── package.json
└── playwright.config.ts
```

## Setup ⚙️.

1. Open your favorite terminal (or you can use the terminal provided by your favorite IDE).
   1. Clone the repository on your computer at any path you prefer.-
        
        ```bash
        > git clone https://github.com/ArCiGo/BigBankDemo.git
        ```
2. In the path you cloned the repository, open the project folder and install the packages.-
   ```bash
   > cd BigBankDemo
   > npm i
   ```

## Executing the tests ⚡️.

```bash
# If you want to execute the tests using the Playwright GUI, you can execute the following command.-
> npm run test:open:ui
# If you just want to execute the tests using the CLI, you can execute the following command.-
> npm run test
```

If you want to open the report after the tests have been executed, you can execute the following command.-

```bash
> npm run test:report
```
## CI/CD 🔄.

The CI/CD pipeline is configured using **GitHub Actions**. The pipeline is triggered when a push or pull request is made to the main or master branch. The pipeline will execute the tests and generates a report. The report is uploaded as an artifact.

This step can be found in the `.github/workflows/playwright.yml` file.