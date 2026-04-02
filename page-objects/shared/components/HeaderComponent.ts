import { Page } from '@playwright/test';

export class HeaderComponent {
    // Constructor
    constructor(public readonly page: Page) { }

    // Actions
    async verifyLaenusumma() {
        return await this.page.locator('div[data-testid="bb-edit-amount__amount"]').innerText();
    }

    async clickOnEditButton() {
        await this.page.locator('button[data-testid="bb-edit-amount"]').click();
    }
}
