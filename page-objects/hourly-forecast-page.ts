import { expect, type Locator, type Page } from '@playwright/test';
import * as Papa from 'papaparse';

type WeatherInfo = {
  time: string;
  temperature: string;
  thermalSensation: string;
  chanceOfPrecipitation: string;
  cloudCover: string;
};

export class HourlyForecastPage {
  readonly page: Page;
  readonly cityHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cityHeader = page.locator('//lib-city-header');
  }

  async goto(city: string) {
    await this.page.goto(
      `https://www.wunderground.com/hourly/do/santo-domingo/${city}`
    );
    expect(this.page).toHaveURL(
      `https://www.wunderground.com/hourly/do/santo-domingo/${city}`
    );
  }

  async getHourlyData(): Promise<WeatherInfo[]> {
    return this.page.$$eval(
      '#hourly-forecast-table > tbody > tr',
      (all_rows) => {
        const hourlyWeatherInfo: WeatherInfo[] = [];

        all_rows.forEach((hour_row) => {
          //TODO: make selectors better and try POM.
          const time =
            hour_row.querySelector('td[class*="timeHour"] > span')
              ?.textContent ?? 'ERROR, check code.';
          const temperature =
            hour_row.querySelector(
              'td[class*="temperature"] > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          const thermalSensation =
            hour_row.querySelector(
              'td[class*="feelsLike"] > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          const chanceOfPrecipitation =
            hour_row.querySelector(
              'td[class*="precipitation"] > a > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          const cloudCover =
            hour_row.querySelector(
              'td[class*="cloudCover"] > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          hourlyWeatherInfo.push({
            time: time,
            temperature: temperature,
            thermalSensation: thermalSensation,
            chanceOfPrecipitation: chanceOfPrecipitation,
            cloudCover: cloudCover,
          });
        });
        return hourlyWeatherInfo;
      }
    );
  }

  convertToCSV(data: WeatherInfo[]): string {
    const csv = Papa.unparse(data, {
      header: true,
      quotes: true,
    });

    return csv;
  }
}
