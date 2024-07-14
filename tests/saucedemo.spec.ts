import { test, expect } from '@playwright/test';
import { LoginPage } from './pageobjects/LoginPage'

test('purchase one item', async ({ page }) => {

    // Open Browser
    await page.goto("https://www.saucedemo.com/");
  
    // Instance a new loginpage object
    const loginPage = new LoginPage(page)

    // Call login method
    await loginPage.loginWithCredentials('standard_user','secret_sauce')

    // Get all products in a list
    const itemsContainer = await page.locator('#inventory_container .inventory_item').all()

    // Generate a random number
    const randomIndex = Math.floor(Math.random() * itemsContainer.length)

    // Get one random item of the list
    const randomItem = itemsContainer[randomIndex]

    // Get information about the product
    const expectedDescription = await randomItem.locator('.inventory_item_desc').innerText()
    const expectedName = await randomItem.locator('.inventory_item_name').innerText()
    const expectedPrice = await randomItem.locator('.inventory_item_price').innerText()

    // Print product information
    console.log(`Price: ${expectedPrice} Name: ${expectedName} Description: ${expectedDescription}`)

    // Click on 'Add To Cart' button
    await randomItem.getByRole('button', {name: 'Add to cart'}).click()

    // Go to the cart
    await page.locator('a.shopping_cart_link').click()

    // Verify the Checkout button
    expect(await page.getByRole('button', {name:'Checkout'})).toBeVisible()

    // Get the product information
    const actualName = await page.locator('.inventory_item_name').innerText()
    const actualDescription = await page.locator('.inventory_item_desc').innerText()
    const actualPrice = await page.locator('.inventory_item_price').innerText()

    // Compare values
    expect(actualName).toEqual(expectedName)
    expect(actualDescription).toEqual(expectedDescription)
    expect(actualPrice).toEqual(expectedPrice)

    // Click on Checkout button
    await page.getByRole('button', {name:'Checkout'}).click();

    // Input user information
    await page.getByRole('textbox', {name:'First Name'}).fill("User Name");
    await page.getByRole('textbox', {name:'Last Name'}).fill("User Lastname");
    await page.getByRole('textbox', {name:'Zip/Postal Code'}).fill("90210");

    // Verify Continue button
    await expect(page.getByRole('button', {name:'Continue'})).toBeVisible()

    // Click on Continue button
    await page.getByRole('button', {name:'Continue'}).click();

    // Verify Checkout title
    expect(await page.locator('span.title')).toBeVisible()

    // Click on Finish button    
    await page.getByRole('button', {name:'Finish'}).click();

    // Verify final message
    await expect(page.getByRole('heading', {name:'Thank you for your order!'})).toBeVisible()

    // Close the browser
    await page.close()

  });