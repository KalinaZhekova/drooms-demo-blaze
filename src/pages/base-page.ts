import { Page } from '@playwright/test';

export class BasePage {
  public page: Page;
  protected urlPart?: string; // Optional URL fragment to verify

  constructor(page: Page) {
    this.page = page;
  }
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }
}