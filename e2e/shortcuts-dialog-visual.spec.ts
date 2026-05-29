/**
 * Visual regression spec — keybinds dialog styling.
 *
 * Regression: Wave 5 accidentally placed the .keybinds-dialog CSS block inside
 * @media (hover: none), making it invisible on all desktop browsers.
 *
 * This spec uses a static HTML proof page (keybinds-css-proof.html) that
 * loads styles.css directly via a <link> tag and renders the dialog DOM
 * skeleton in the visible state. No TS module imports are needed — the test
 * purely validates that the CSS rules are not gated behind a media query.
 */
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('DesktopUiPlugin — keybinds dialog CSS (no @media gate)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/e2e/keybinds-css-proof.html');
        await page.waitForFunction(() => (window as any).__cssProofReady === true, { timeout: 10_000 });
        // Give the stylesheet a moment to be applied.
        await page.waitForLoadState('networkidle');
    });

    test('keybinds dialog scrim background is applied on desktop (non-hover:none)', async ({ page }) => {
        const overlay = page.locator('#nmplayer-keybinds-dialog');
        await expect(overlay).toBeVisible();

        const bg = await overlay.evaluate((el: HTMLElement) =>
            window.getComputedStyle(el).backgroundColor
        );
        expect(bg, 'scrim rgba(0,0,0,0.85) must be applied — not trapped behind @media (hover:none)')
            .not.toBe('rgba(0, 0, 0, 0)');
        expect(bg).not.toBe('transparent');
    });

    test('keybinds card background is applied', async ({ page }) => {
        const card = page.locator('.keybinds-card');
        await expect(card).toBeVisible();

        const bg = await card.evaluate((el: HTMLElement) =>
            window.getComputedStyle(el).backgroundColor
        );
        expect(bg, 'card dark background must be applied').not.toBe('rgba(0, 0, 0, 0)');
        expect(bg).not.toBe('transparent');
    });

    test('keybinds grid uses 3-column layout', async ({ page }) => {
        const grid = page.locator('.keybinds-grid');
        await expect(grid).toBeVisible();

        const columns = await grid.evaluate((el: HTMLElement) =>
            window.getComputedStyle(el).gridTemplateColumns
        );
        const colCount = columns.trim().split(/\s+/).length;
        expect(colCount, 'keybinds-grid must have 3 columns').toBe(3);
    });

    test('kbd.keybinds-key has styled background', async ({ page }) => {
        const kbd = page.locator('kbd.keybinds-key').first();
        await expect(kbd).toBeVisible();

        const bg = await kbd.evaluate((el: HTMLElement) =>
            window.getComputedStyle(el).backgroundColor
        );
        expect(bg, 'kbd keys must have styled background').not.toBe('rgba(0, 0, 0, 0)');
        expect(bg).not.toBe('transparent');
    });

    test('keybinds dialog screenshot', async ({ page }) => {
        const screenshotDir = path.resolve(__dirname, '../../../scripts/screenshots');
        fs.mkdirSync(screenshotDir, { recursive: true });

        await page.locator('#player').screenshot({
            path: path.join(screenshotDir, 'keybinds-dialog-visual.png'),
        });
    });
});
