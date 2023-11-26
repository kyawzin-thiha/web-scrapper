import type { Browser } from "puppeteer";
import * as puppeteer from "puppeteer";
import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class ScraperService {

  private browser: Browser;

  constructor() {
    this.initializeBrowser();
  }

  public async scrape(url: string): Promise<Event[]> {
    try {
      if (!this.browser) {
        await this.initializeBrowser();
      }

      const page = await this.browser.newPage();

      await page.setViewport({
        width: 1280,
        height: 8000
      });

      page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const selector = "._product_xz4oby";
      await page.waitForSelector(selector, { visible: true });

      const events = await page.evaluate(() => {
        const data = Array.from(document.querySelectorAll("._product_xz4oby"));

        return data.map(el => {
          const titleElement = el.querySelector("._title_xz4oby");
          const linkElement = el.querySelector("._link_xz4oby");
          const imageElement = el.querySelector("div._img-box_xz4oby > div._img-bg_xz4oby");
          const date = el.querySelector("._meta_xz4oby");
          const price = el.querySelector("._price_xz4oby");

          let imageUrl = "";
          console.log(imageElement);
          if (imageElement) {
            const style = imageElement.getAttribute("style");
            console.log(style);
            const match = style?.match(/url\("([^"]+)"\)/);
            imageUrl = match ? match[1] : "";
          }

          return {
            title: titleElement ? titleElement.textContent.trim() : "",
            link: linkElement ? `https://www.fatsoma.com/${linkElement.getAttribute("href")}` : "",
            image: imageUrl,
            date: date ? date.textContent.replace(/\s+/g, " ").trim() : "",
            price: price ? price.textContent.trim() : ""
          };
        });
      });

      this.closeBrowser();
      return events;
    } catch (error) {
      throw new HttpException("Error scraping events", 500);
    }
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async initializeBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: "new"
    });
  }
}

type Event = {
  title: string;
  link: string;
  image: string;
  date: string;
  price: string;
}