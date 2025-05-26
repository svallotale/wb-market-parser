import type { MarketType } from './types.ts';

/**
 * Configuration options for the WbMarketParser
 */
export type WbMarketConfig = {
  /**
   * A number of seconds after which a re-request will take place to receive issues of issuance
   * @default 24 * 60 * 60 * 1000 | 24 hours in milliseconds
   */
  cacheDuration?: number;
  /**
   * Custom logger implementation. If not provided, console will be used
   */
  logger?: MarketType.Logger;
};

/**
 * Parser for Wildberries market data
 * 
 * This class provides methods to fetch and query market data from Wildberries API.
 * It includes caching mechanism to prevent excessive API calls.
 * 
 * @example
 * ```ts
 * const parser = new WbMarketParser({
 *   cacheDuration: 3600000, // 1 hour cache
 *   logger: customLogger
 * });
 * 
 * // Get all countries
 * const countries = await parser.getCountries();
 * 
 * // Get markets for specific country
 * const markets = await parser.getByCountry('Россия');
 * ```
 */
export class WbMarketParser {
  /** Default logger implementation */
  private readonly logger: MarketType.Logger = console;

  /** Cached market data */
  private data: MarketType.Items[] = [];

  /** Timestamp of the last successful data fetch */
  private lastFetchTime: number = 0;

  /** Default cache duration in milliseconds (5 minutes) */
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  /**
   * Creates a new instance of WbMarketParser
   * 
   * @param config - Configuration options for the parser
   */
  constructor(config: WbMarketConfig) {
    if (config.cacheDuration) this.CACHE_DURATION = config.cacheDuration;
    if (config.logger) this.logger = config.logger;

    this.fetcher()
      .then(() => {
        this.logger.log(`The list of markets is updated`);
      })
      .catch((error) => {
        this.logger.error(`Error in obtaining markets`);
        this.logger.error(error);
      });
  }

  /**
   * Fetches market data from Wildberries API
   * 
   * This method implements caching logic to prevent excessive API calls.
   * Data will be fetched only if cache is expired or empty.
   * 
   * @throws {Error} If the API request fails
   * @private
   */
  private async fetcher() {
    const currentTime = Date.now();

    if (currentTime - this.lastFetchTime < this.CACHE_DURATION && this.data.length > 0) return;

    try {
      this.data = await fetch('https://static-basket-01.wb.ru/vol0/data/all-poo-fr-v8.json').then(
        (res) => {
          return res.json() as Promise<MarketType.Items[]>;
        }
      );
      this.lastFetchTime = currentTime;
    } catch (error) {
      this.logger.error('Failed to fetch market data:', error);
      throw error;
    }
  }

  /**
   * Returns a list of all available countries
   * 
   * @returns Promise resolving to an array of country names
   * @example
   * ```ts
   * const countries = await parser.getCountries();
   * console.log(countries); // ['Россия', 'Беларусь', ...]
   * ```
   */
  async getCountries(): Promise<string[]> {
    const data = await this.getUpdatedData();
    return data.map((el) => {
      return el.country;
    });
  }

  /**
   * Returns markets for a specific country
   * 
   * @param country - Country name to filter markets by
   * @returns Promise resolving to an array of markets in the specified country
   * @example
   * ```ts
   * const russianMarkets = await parser.getByCountry('Россия');
   * ```
   */
  async getByCountry(country: string): Promise<MarketType.Market[]> {
    const data = await this.getUpdatedData();
    const dataFiltered = data.filter((el) => el.country === country);
    return dataFiltered[0]?.markets || [];
  }

  /**
   * Returns markets by their ID
   * 
   * @param id - Market ID to search for
   * @returns Promise resolving to an array of markets with the specified ID
   * @example
   * ```ts
   * const market = await parser.getById(123);
   * ```
   */
  async getById(id: number): Promise<MarketType.Market[]> {
    const data = await this.getUpdatedData();
    const dataFiltered = data.filter((el) => el.markets.find((el) => el.id === id));
    return dataFiltered[0]?.markets || [];
  }

  /**
   * Returns all market data
   * 
   * @returns Promise resolving to an array of all market items
   * @example
   * ```ts
   * const allMarkets = await parser.markets();
   * ```
   */
  async markets(): Promise<MarketType.Items[]> {
    return this.getUpdatedData();
  }

  /**
   * Ensures data is up to date and returns it
   * 
   * @returns Promise resolving to the current market data
   * @private
   */
  private async getUpdatedData(): Promise<MarketType.Items[]> {
    await this.fetcher();
    return this.data;
  }
}
