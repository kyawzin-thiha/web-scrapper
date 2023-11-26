import { Body, Controller, Get } from "@nestjs/common";
import { ScraperService } from "./scraper.service";

@Controller("scraper")
export class ScraperController {

  constructor(private readonly Scraper: ScraperService) {}

  @Get("scrape")
  async scrape(@Body() data: { city: string }) {

    const url = `https://www.fatsoma.com/search?query=${data.city}`;

    return await this.Scraper.scrape(url);

  }
}
