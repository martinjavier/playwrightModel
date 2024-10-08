import { test, expect } from '@playwright/test';

test('test web table', async ({ page }) => {

    // Open Browser
    await page.goto('https://cosmocode.io/automation-practice-webtable')

    const tableContainer = await page.locator("xpath=//table[@id='countries']")

    await page.screenshot({path: 'screenshots/countries_table.png', fullPage: true})

    const rows = await tableContainer.locator("xpath=.//tr").all()

    const countries: Country[] = []

    // console.log("Cantidad:",rows.length)

    for(let row of rows){
        let country: Country = {
            name: await row.locator('xpath=.//td[2]').innerText(),
            capital: await row.locator('xpath=.//td[3]').innerText(),
            currency: await row.locator('xpath=.//td[4]').innerText(),
            primaryLanguage: await row.locator('xpath=.//td[5]').innerText(),
        }
        countries.push(country)
    }

    /*
    for(let country of countries){
        console.log(country)
    }
        */

    const countriesWherePeopleSpeaksPortuguese = countries.filter(country => country.primaryLanguage === 'Portuguese')

    // console.log("Portugues: ", countriesWherePeopleSpeaksPortuguese)

    // Close the browser
    await page.close()

  })

  interface Country{
    name:string
    capital: string
    currency: string
    primaryLanguage: string
  }