import { test } from '@playwright/test';
import { HourlyForecastPage } from '../page-objects/hourly-forecast-page';
import fs from 'fs';
import { cities } from '../utils/cities.json';

cities.forEach((city) => {
  test(`${city.name} forecast`, async ({ page }) => {
    const HourlyForecast = new HourlyForecastPage(page);
    const todaysDate: string = new Date()
      .toLocaleDateString('en-GB')
      .split('/')
      .join('_');
    const numberOfDays: number = 10;
    const daysForecast = await HourlyForecast.getNDaysForecast(
      city.link,
      numberOfDays
    );
    const csvData = HourlyForecast.convertToCSV(daysForecast);
    // Create a directory to store the file if it doesn't exist
    const directory = './weather-forecasts';
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    // write the csv
    fs.writeFileSync(
      `${directory}/${city.name}_${todaysDate}_${numberOfDays}_day_forecast.csv`,
      csvData,
      { encoding: 'utf8' }
    );
  });
});
