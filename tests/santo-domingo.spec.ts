import { test, expect } from '@playwright/test';
import { HourlyForecastPage } from '../page-objects/hourly-forecast-page';

test('weather', async ({ page }) => {
  const HourlyForecast = new HourlyForecastPage(page);
  const city: string = 'ISANTO172';
  await HourlyForecast.goto(city);
  const dayForecast = await HourlyForecast.getHourlyData(); //good const.
  // dayForecast.forEach((x) => {
  //   console.log(`lol${x.time}, ${x.chanceOfPrecipitation}`);
  // });
});
