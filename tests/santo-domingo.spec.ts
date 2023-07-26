import { test, expect } from '@playwright/test';
import { HourlyForecastPage } from '../page-objects/hourly-forecast-page';

test('weather', async ({ page }) => {
  const HourlyForecast = new HourlyForecastPage(page);
  const city: string = 'ISANTO172';
  await HourlyForecast.goto(city);
  const rows = await page.$$eval(
    '#hourly-forecast-table > tbody > tr',
    (all_rows) => {
      all_rows.forEach((hour_row) => {
        //TODO: make selectors better and try POM.
        const time = hour_row.querySelector(
          'td[class*="timeHour"] > span'
        )?.textContent;
        const temperature = hour_row.querySelector(
          'td[class*="temperature"] > lib-display-unit > span'
        )?.textContent;
        const thermalSensation = hour_row.querySelector(
          'td[class*="feelsLike"] > lib-display-unit > span'
        )?.textContent;
        const chanceOfPrecipitation = hour_row.querySelector(
          'td[class*="precipitation"] > a > lib-display-unit > span'
        )?.textContent;
        const cloudCover = hour_row.querySelector(
          'td[class*="cloudCover"] > lib-display-unit > span'
        )?.textContent;
        console.log(
          `Time: ${time}, Temperature: ${temperature}, Thermal Sensation - Feels Like: ${thermalSensation}, Chance of Precipitation: ${chanceOfPrecipitation}, Cloud Cover: ${cloudCover}`
        );
      });
    }
  );
});
