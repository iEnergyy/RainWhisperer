import { expect, type Locator, type Page } from '@playwright/test';

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
  }
}
