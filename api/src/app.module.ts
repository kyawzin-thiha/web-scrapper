import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScraperModule } from './routes/scraper/scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScraperModule
  ]
})
export class AppModule {}
