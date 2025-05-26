import { WbMarketParser } from './market';
import type { MarketType } from './types';

// Mock fetch
(global as any).fetch = jest.fn();

describe('WbMarketParser', () => {
  let parser: WbMarketParser;
  const mockData: MarketType.Items[] = [
    {
      country: 'Russia',
      markets: [
        {
          workTime: '10:00-22:00',
          photos: ['photo1.jpg'],
          address: 'Moscow, Red Square 1',
          id: 1,
          typePoint: 1,
          coordinates: [55.7558, 37.6173],
          dtype: 1,
          isWb: true,
          pickupType: 1,
          dest: 1,
          dest3: 1,
          sign: 'WB',
        },
      ],
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    ((global as any).fetch as unknown as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockData),
    });

    // Create new parser instance for each test
    parser = new WbMarketParser({});
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      expect(parser).toBeInstanceOf(WbMarketParser);
    });

    it('should initialize with custom config', () => {
      const customLogger = {
        log: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
      };
      const parserWithConfig = new WbMarketParser({
        cacheDuration: 1000,
        logger: customLogger,
      });
      expect(parserWithConfig).toBeInstanceOf(WbMarketParser);
    });
  });

  describe('getCountries', () => {
    it('should return list of countries', async () => {
      const countries = await parser.getCountries();
      expect(countries).toEqual(['Russia']);
    });
  });

  describe('getByCountry', () => {
    it('should return markets for specific country', async () => {
      const markets = await parser.getByCountry('Russia');
      expect(markets).toEqual(mockData[0]!.markets);
    });

    it('should return empty array for non-existent country', async () => {
      const markets = await parser.getByCountry('NonExistent');
      expect(markets).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return markets containing specific id', async () => {
      const markets = await parser.getById(1);
      expect(markets).toEqual(mockData[0]!.markets);
    });

    it('should return empty array for non-existent id', async () => {
      const markets = await parser.getById(999);
      expect(markets).toEqual([]);
    });
  });

  describe('markets', () => {
    it('should return all market data', async () => {
      const markets = await parser.markets();
      expect(markets).toEqual(mockData);
    });
  });

  describe('caching', () => {
    it('should use cache when data is fresh', async () => {
      // First call to populate cache
      await parser.markets();

      // Second call should use cache
      await parser.markets();

      // Fetch should be called only once
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache when expired', async () => {
      // First call to populate cache
      await parser.markets();

      // Mock Date.now to simulate time passing
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 6 * 60 * 1000); // 6 minutes later

      // Second call should refresh cache
      await parser.markets();

      // Fetch should be called twice
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // Restore original Date.now
      Date.now = originalDateNow;
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors', async () => {
      const error = new Error('Network error');
      ((global as any).fetch as unknown as jest.Mock).mockRejectedValueOnce(error);

      const customLogger = {
        log: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
      };

      const parserWithLogger = new WbMarketParser({ logger: customLogger });

      // Wait for the initial fetch to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(customLogger.error).toHaveBeenCalledWith('Error in obtaining markets');
      expect(customLogger.error).toHaveBeenCalledWith(error);
    });
  });
});
