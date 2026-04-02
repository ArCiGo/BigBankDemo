import { test, expect } from '@playwright/test';
import { VaikelaenPage } from '../../page-objects/VaikelaenPage';
import { HeaderComponent } from '../../page-objects/shared/components/HeaderComponent';
import { vaikelaenData } from '../data/UI/vaikelaenData';

let vaikelaenPage: VaikelaenPage;
let headerComponent: HeaderComponent;

test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('Console log:', msg.text()));

    await test.step('STEP 0: Open the Väikelaen page', async () => {
        await page.goto('/?amount=5000&period=60&productName=SMALL_LOAN&...&lang=ee');
    });
});

test.describe('Väikelaen calculator modal', () => {
    test('The user should save and edit the loan values in the väikelaen calculator modal', async ({ page }) => {
        vaikelaenPage = new VaikelaenPage(page);
        headerComponent = new HeaderComponent(page);

        await test.step('STEP 1: Save the prefilled values in the modal', async () => {
            await vaikelaenPage.clickOnJatkaButton();
        });

        await test.step('STEP 2: Verify the loan amount in the header', async () => {
            expect(await headerComponent.verifyLaenusumma()).toBe(vaikelaenData.initial.headerLaenusumma);
        });

        await test.step('STEP 3: Open the calculator modal to update the values ', async () => {
            await headerComponent.clickOnEditButton();
            await vaikelaenPage.fillVaikelaenForm({ 
                laenusumma: vaikelaenData.update.laenusumma, 
                periood: vaikelaenData.update.periood 
            });
            await vaikelaenPage.clickOnJatkaButton();

            expect(await headerComponent.verifyLaenusumma()).toBe(vaikelaenData.update.headerLaenusumma);
        });

        /**
         * This is a demo step. It shows how to use the sliders to update the values.
         * Uncomment it to see the sliders in action.
         */
        // await test.step('STEP 3.1: Open the calculator modal. Update the values using the sliders', async () => {
        //     await header.clickOnEditButton();
        //     await calculator.slideVaikelaenForm({ 
        //         laenusumma: vaikelaenData.slider.laenusumma, 
        //         periood: vaikelaenData.slider.periood 
        //     });
        //     await calculator.clickOnJatkaButton();
        //     expect(await header.verifyLaenusumma()).toBe(vaikelaenData.slider.headerLaenusumma);
        // });

        await test.step('STEP 4: Open the modal to verify that the values were saved correctly', async () => {
            await headerComponent.clickOnEditButton();

            expect((await vaikelaenPage.vaikelaenCalculatorModalValidation()).laenusumma).toBe(vaikelaenData.update.modalLaenusumma);
            expect((await vaikelaenPage.vaikelaenCalculatorModalValidation()).periood).toBe(vaikelaenData.update.modalPeriood);
        });
    });

    test('Verify clamping behavior when user inputs values outside the ranges defined in the calculator', async ({ page }) => {
        vaikelaenPage = new VaikelaenPage(page);
        headerComponent = new HeaderComponent(page);

        await test.step('STEP 1: Update the `laenusumma` and `periood` with values below the minimum', async () => {
            await vaikelaenPage.fillVaikelaenForm({ 
                laenusumma: vaikelaenData.clamping.min.inputLaenusumma, 
                periood: vaikelaenData.clamping.min.inputPeriood 
            });
        });

        await test.step('STEP 2: Verify that `laenusumma` and `periood` are clamped to the valid minimum values', async () => {
            await expect.poll(async () => {
                return await vaikelaenPage.vaikelaenCalculatorModalValidation();
            }).toEqual(expect.objectContaining({
                laenusumma: vaikelaenData.clamping.min.expectedLaenusumma,
                periood: vaikelaenData.clamping.min.expectedPeriood
            }));
        });

        await test.step('STEP 3: Update the `laenusumma` and `periood` with values above the maximum', async () => {
            await vaikelaenPage.fillVaikelaenForm({ 
                laenusumma: vaikelaenData.clamping.max.inputLaenusumma, 
                periood: vaikelaenData.clamping.max.inputPeriood 
            });
        });

        await test.step('STEP 4: Verify that `laenusumma` and `periood` are clamped to the valid maximum values', async () => {
            await expect.poll(async () => {
                return await vaikelaenPage.vaikelaenCalculatorModalValidation();
            }).toEqual(expect.objectContaining({
                laenusumma: vaikelaenData.clamping.max.expectedLaenusumma,
                periood: vaikelaenData.clamping.max.expectedPeriood
            }));
        });
    });
});