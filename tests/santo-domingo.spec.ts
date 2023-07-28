import { test, expect } from '@playwright/test';
import { HourlyForecastPage } from '../page-objects/hourly-forecast-page';
import fs from 'fs';
// import * as Papa from 'papaparse';

test('weather', async ({ page }) => {
  const HourlyForecast = new HourlyForecastPage(page);
  const city: string = 'ISANTO172';
  const todaysDate: string = new Date()
    .toLocaleDateString('en-GB')
    .split('/')
    .join('_');
  await HourlyForecast.goto(city);
  const dayForecast = await HourlyForecast.getHourlyData();
  const csvData = HourlyForecast.convertToCSV(dayForecast);
  // Create a directory to store the file if it doesn't exist
  const directory = './weather-forecasts';
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  fs.writeFileSync(
    `${directory}/santo_domingo_${todaysDate}_forecast.csv`,
    csvData
  );
});
