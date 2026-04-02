import { Page } from '@playwright/test';

export class VaikelaenPage {
    // Constructor  
    constructor(public readonly page: Page) { }

    // Actions
    async fillVaikelaenForm({ laenusumma, periood, enterKey }: { laenusumma?: string, periood?: string, enterKey?: boolean } = {}) {
        const laenusummaInput = this.page.locator('input[id="header-calculator-amount"]');
        const perioodInput = this.page.locator('input[id="header-calculator-period"]');

        if (laenusumma !== undefined) {
            await laenusummaInput.clear();
            await laenusummaInput.fill(laenusumma);
            await laenusummaInput.blur();
        }

        if (periood !== undefined) {
            await perioodInput.clear();
            await perioodInput.fill(periood);
            await perioodInput.blur();
        }

        // Review with the team if pressing `Enter` is a valid way to save values.
        // It triggers after typing whichever fields were provided.
        if (enterKey) {
            await this.page.keyboard.press('Enter');
        }
    }

    async slideVaikelaenForm({ laenusumma, periood, enterKey }: { laenusumma?: number, periood?: number, enterKey?: boolean } = {}) {
        if (laenusumma !== undefined) {
            await this.setSliderValue('Laenusumma', laenusumma);
        }

        if (periood !== undefined) {
            await this.setSliderValue('Periood', periood);
        }

        // Review with the team if pressing `Enter` is a valid way to save values.
        // It triggers after typing whichever fields were provided.
        if (enterKey) {
            await this.page.keyboard.press('Enter');
        }
    }

    async clickOnJatkaButton() {
        await this.page.getByRole('button', { name: 'JÄTKA' }).click();
    }

    async vaikelaenCalculatorModalValidation() {
        const laenusumma = await this.page
            .locator('input[id="header-calculator-amount"]')
            .inputValue()
        const periood = await this.page
            .locator('input[id="header-calculator-period"]')
            .inputValue();

        return { laenusumma, periood };
    }

    private async setSliderValue(ariaLabel: string, targetValue: number) {
        const rootLocator = this.page.locator(`div[aria-label="${ariaLabel}"]`);
        const track = rootLocator.locator('.vue-slider-rail');
        const handle = rootLocator.locator('div[role="slider"]');
        
        const minStr = await handle.getAttribute('aria-valuemin');
        const maxStr = await handle.getAttribute('aria-valuemax');
        
        if (minStr && maxStr) {
            const min = parseFloat(minStr);
            const max = parseFloat(maxStr);
            const clampedValue = Math.max(min, Math.min(max, targetValue));
            const percentage = (clampedValue - min) / (max - min);
            
            const handleBox = await handle.boundingBox();
            const trackBox = await track.boundingBox();
            
            if (handleBox && trackBox) {
                // 1. Drag the mouse to get as close as the screen's pixel resolution allows
                await this.page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
                await this.page.mouse.down();
                
                const targetX = trackBox.x + (trackBox.width * percentage);
                const targetY = trackBox.y + (trackBox.height / 2);
                await this.page.mouse.move(targetX, targetY, { steps: 5 });
                await this.page.mouse.up();
                
                // 2. Focus the slider handle so we can use keyboard events on it
                await handle.focus();
                await this.page.waitForTimeout(100);

                // 3. Fine-tune exactly to the target value using Arrow Keys! 
                // Just like a human tapping the keyboard.
                let lastValStr = '';
                let direction = 0; // 1 = moving right, -1 = moving left
                
                for (let i = 0; i < 150; i++) { // Prevent infinite loops
                    const currentStr = await handle.getAttribute('aria-valuenow');
                    if (!currentStr || currentStr === lastValStr) break; 
                    
                    const val = parseFloat(currentStr);
                    if (val === targetValue) break; // Success! We hit the exact value.
                    
                    // Stop if we overshoot (meaning the exact targetValue isn't a multiple of the slider's step)
                    if (direction === 1 && val > targetValue) break;
                    if (direction === -1 && val < targetValue) break;

                    // Tap the respective arrow key to tick up or down
                    if (val < targetValue) {
                        direction = 1;
                        await this.page.keyboard.press('ArrowRight');
                    } else {
                        direction = -1;
                        await this.page.keyboard.press('ArrowLeft');
                    }
                    
                    lastValStr = currentStr;
                }
            } else {
                throw new Error(`No bounding box obtained for the slider ${ariaLabel}`);
            }
        } else {
            throw new Error(`aria-valuemin and/or aria-valuemax attributes not found on slider ${ariaLabel}`);
        }
    }
}
