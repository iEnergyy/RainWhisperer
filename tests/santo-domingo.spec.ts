import { test, expect } from '@playwright/test';
import { HourlyForecastPage } from '../page-objects/hourly-forecast-page';
import fs from 'fs';

test('weather', async ({ page }) => {
  const HourlyForecast = new HourlyForecastPage(page);
  const city: string = 'ISANTO172';
  const todaysDate: string = new Date()
    .toLocaleDateString('en-GB')
    .split('/')
    .join('_');
  const threeDayForecast = await HourlyForecast.getThreeDaysForecast();
  const csvData = HourlyForecast.convertToCSV(threeDayForecast);
  // Create a directory to store the file if it doesn't exist
  const directory = './weather-forecasts';
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  // write the csv
  fs.writeFileSync(
    `${directory}/santo_domingo_${todaysDate}_3_day_forecast.csv`,
    csvData
  );
});
