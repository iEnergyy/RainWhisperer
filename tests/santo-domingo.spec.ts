import { test, expect } from '@playwright/test';
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
    const threeDayForecast = await HourlyForecast.getThreeDaysForecast(
      city.link
    );
    const csvData = HourlyForecast.convertToCSV(threeDayForecast);
    // Create a directory to store the file if it doesn't exist
    const directory = './weather-forecasts';
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    // write the csv
    fs.writeFileSync(
      `${directory}/${city.name}_${todaysDate}_3_day_forecast.csv`,
      csvData,
      { encoding: 'utf8' }
    );
  });
});
