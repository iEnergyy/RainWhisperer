import { expect, type Locator, type Page } from '@playwright/test';
import * as Papa from 'papaparse';

type WeatherInfo = {
  date: string;
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
    ),
      { timeout: 60000 };
    await this.page.waitForURL(
      `https://www.wunderground.com/hourly/do/santo-domingo/${city}`
    );
    // TODO: add good assert..
  }

  async getHourlyData(dateOfDay: string): Promise<WeatherInfo[]> {
    const hourlyDataArray: Promise<WeatherInfo[]> = this.page.$$eval(
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
            date: 'TBD',
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
    const hourlyWeatherData = (await hourlyDataArray).map((data) => {
      if (data.date == 'TBD') {
        data.date = dateOfDay;
      }
      return data;
    });
    return hourlyWeatherData;
  }

  // Method that gets forecast for 3 days, get help with the getHourly and use date inputs to run it.
  async getThreeDaysForecast(): Promise<WeatherInfo[]> {
    // gets today forecast
    const todaysDate: string = new Date().toISOString().slice(0, 10);
    await this.page.goto(
      `https://www.wunderground.com/hourly/do/santo-domingo/ISANTO172/date/${todaysDate}`
    ),
      { timeout: 60000 };

    const todaysForecast = await this.getHourlyData(todaysDate);

    // gets tomorrow forecast
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowsDate: string = tomorrow.toISOString().slice(0, 10);
    await this.page.goto(
      `https://www.wunderground.com/hourly/do/santo-domingo/ISANTO172/date/${tomorrowsDate}`
    ),
      { timeout: 60000 };

    const tomorrowsForecast = await this.getHourlyData(tomorrowsDate);

    // gets after tomorrow forecast
    const afterTomorrow = new Date();
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);
    const afterTomorrowsDate: string = afterTomorrow.toISOString().slice(0, 10);
    await this.page.goto(
      `https://www.wunderground.com/hourly/do/santo-domingo/ISANTO172/date/${afterTomorrowsDate}`
    ),
      { timeout: 60000 };

    const afterTomorrowsForecast = await this.getHourlyData(afterTomorrowsDate);

    const totalForecasts = [
      ...todaysForecast,
      ...tomorrowsForecast,
      ...afterTomorrowsForecast,
    ];
    return totalForecasts;
  }
  // TODO: move this method to another class.
  convertToCSV(data: WeatherInfo[]): string {
    const csv = Papa.unparse(data, {
      header: true,
      quotes: true,
    });

    return csv;
  }
}
