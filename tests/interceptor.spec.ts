import { test, expect } from '@playwright/test';
import { LoginPage } from './pageobjects/LoginPage'

test('purchase one item interceptor', async ({ page }, testInfo) => {

    // Using interceptor, show all request urls
    await page.on("request", req => {
    //    console.log(req.url())
    })

    // Using regular expressions
    await page.route("**/*.{png,jpg,jpeg,svg}", (route) => route.abort())

    // Open Browser
    await page.goto('https://www.saucedemo.com/')
  
    // Create a new instance a new loginpage object
    const loginPage = new LoginPage(page)

    // Call login method
    await loginPage.loginWithCredentials('standard_user','secret_sauce')

    // Check successful login
    await loginPage.checkSucessfulLogin()

    await page.screenshot({path: 'screenshots/successful_login.png', fullPage: true})

    await page.close()

})

test('interceptor test', async ({ page }, testInfo) => {

    // Using regular expressions
    await page.route(
        "https://demoqa.com/BookStore/v1/Books",
        (route) => {
          route.fulfill({
            status: 304,
            headers:{
                'Content-Type': 'application/json'
            },
            body: `
    {
    "books": [
        {
            "isbn": "9781449325862",
            "title": "El Libro Que Martín Nuca Escribió",
            "subTitle": "A Working Introduction",
            "author": "Richard E. Silverman",
            "publish_date": "2020-06-04T08:48:39.000Z",
            "publisher": "O'Reilly Media",
            "pages": 500,
            "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
            "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
        },
        ]
    }
    `
        })
    })

    // Open Browser
    await page.goto('https://demoqa.com/books')

    await page.pause()

    await page.screenshot({path: 'screenshots/modificado.png', fullPage: true})

    await page.close()

})