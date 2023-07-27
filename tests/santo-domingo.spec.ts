import { test, expect } from '@playwright/test';
import { HourlyForecastPage } from '../page-objects/hourly-forecast-page';
import fs from 'fs';
import * as Papa from 'papaparse';

test('weather', async ({ page }) => {
  const HourlyForecast = new HourlyForecastPage(page);
  const city: string = 'ISANTO172';
  await HourlyForecast.goto(city);
  const dayForecast = await HourlyForecast.getHourlyData();
  // const csvData = HourlyForecast.convertToCSV(dayForecast);
  // fs.writeFileSync('weather_forecast.csv', csvData);
});
