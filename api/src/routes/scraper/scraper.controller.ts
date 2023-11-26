import { Controller, Get, Query } from "@nestjs/common";
import { ScraperService } from "./scraper.service";

@Controller("scraper")
export class ScraperController {

  constructor(private readonly Scraper: ScraperService) {}

  @Get("scrape")
  async scrape(@Query("city") city: string) {

    const url = `https://www.fatsoma.com/search?query=${city}`;

    return await this.Scraper.scrape(url);

  }
}
