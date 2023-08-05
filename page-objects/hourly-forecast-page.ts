import { expect, type Locator, type Page } from '@playwright/test';
import * as Papa from 'papaparse';

type WeatherInfo = {
  date: string;
  time: string;
  conditions: string;
  temperature: string;
  thermalSensation: string;
  chanceOfPrecipitation: string;
  liquidPrecipitation: string;
  cloudCover: string;
  dewPoint: string;
  humidity: string;
  wind: string;
  pressure: string;
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
      { timeout: 60000, waitUntil: 'domcontentloaded' };
    await this.cityHeader.waitFor();
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
          const conditions =
            hour_row.querySelector(
              'td[class*="conditions"]  span > span[class="show-for-medium conditions"]'
            )?.textContent ?? 'ERROR, check code.';
          const liquidPrecipitation =
            hour_row.querySelector(
              'td[class*="liquidPrecipitation"] > a > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          const dewPoint =
            hour_row.querySelector(
              'td[class*="dewPoint"] > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          const humidity =
            hour_row.querySelector(
              'td[class*="humidity"] > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          const wind =
            hour_row.querySelector(
              'td[class*="wind"] > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          const pressure =
            hour_row.querySelector(
              'td[class*="pressure"] > lib-display-unit > span'
            )?.textContent ?? 'ERROR, check code.';
          hourlyWeatherInfo.push({
            date: 'TBD',
            time: time,
            conditions: conditions,
            temperature: temperature,
            thermalSensation: thermalSensation,
            chanceOfPrecipitation: chanceOfPrecipitation,
            liquidPrecipitation: liquidPrecipitation,
            cloudCover: cloudCover,
            dewPoint: dewPoint,
            humidity: humidity,
            wind: wind,
            pressure: pressure,
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
  async getThreeDaysForecast(city: string): Promise<WeatherInfo[]> {
    // gets today forecast
    const todaysDate: string = new Date().toISOString().slice(0, 10); //utc is making fun of me on js.
    await this.page.goto(`${city}/date/${todaysDate}`),
      { timeout: 60000, waitUntil: 'domcontentloaded' };
    await this.cityHeader.waitFor();

    const todaysForecast = await this.getHourlyData(todaysDate);

    // gets tomorrow forecast
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowsDate: string = tomorrow.toISOString().slice(0, 10);
    await this.page.goto(`${city}/date/${tomorrowsDate}`),
      { timeout: 60000, waitUntil: 'domcontentloaded' };
    await this.cityHeader.waitFor();

    const tomorrowsForecast = await this.getHourlyData(tomorrowsDate);

    // gets after tomorrow forecast
    const afterTomorrow = new Date();
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);
    const afterTomorrowsDate: string = afterTomorrow.toISOString().slice(0, 10);
    await this.page.goto(`${city}/date/${afterTomorrowsDate}`),
      { timeout: 60000, waitUntil: 'domcontentloaded' };
    await this.cityHeader.waitFor();

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
    // Map the original data to a modified version with custom headers
    const modifiedData = data.map((item) => ({
      Date: item.date,
      Time: item.time,
      Conditions: item.conditions,
      'Temp.': item.temperature,
      'Feels Like': item.thermalSensation,
      Precip: item.chanceOfPrecipitation,
      Amount: item.liquidPrecipitation,
      'Cloud Cover': item.cloudCover,
      'Dew Point': item.dewPoint,
      Humidity: item.humidity,
      Wind: item.wind,
      Pressure: item.pressure,
    }));

    const csv = Papa.unparse(modifiedData, {
      header: true,
      quotes: true,
    });

    return csv;
  }
}
