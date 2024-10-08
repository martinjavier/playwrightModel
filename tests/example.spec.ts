import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {

  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // Close the browser
  await page.close()
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  // Close the browser
  await page.close()
});

test('List product titles', async ({ page }) => {

  // Open Browser
  await page.goto("https://www.mercadolibre.com.co/");

  // Input value on search field
  await page.locator('input[id="cb1-edit"]').fill("iphone");

  // Press Enter key
  await page.keyboard.press("Enter");

  // Search one element into the page
  await expect(page.locator('//ol[contains(@class,"ui-search-layout")]')).toBeVisible();
  
  // Get all titles
  const titles = await page.locator('//ol[contains(@class,"ui-search-layout")]//li//h2').allInnerTexts()

  // Show the amout of titles
  console.log('The total number of results are: ', titles.length)

  // Show all titles
  for(let title of titles){
    console.log('the title is: ', title)
  }

  // Close the browser
  await page.close()
});

test('search for a product and select it', async ({ page }) => {

  // Open Browser
  await page.goto("https://www.mercadolibre.com.co/");

  // Get By Placeholder
  await page.locator('input[id="cb1-edit"]').fill("iphone");

  // Press Enter key
  await page.keyboard.press("Enter");

  // Get By Role
  await page.getByRole('link', {name: 'Apple iPhone 11 (128 GB) - Negro - Distribuidor Autorizado'}).click();

  // Get By Role
  await page.getByRole('link', {name: 'Mis compras'}).click();

  // Get By Role
  await expect(page.getByRole('button', {name: 'Continuar', exact: true})).toBeVisible()

  // Close the browser
  await page.close()
});
