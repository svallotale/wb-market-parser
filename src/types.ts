export namespace MarketType {
  export type Market = {
    workTime: string;
    photos: string[];
    address: string;
    id: number;
    typePoint: number;
    coordinates: number[];
    dtype: number;
    isWb: boolean;
    pickupType: number;
    dest: number;
    dest3: number;
    sign: string;
  };

  export type Items = {
    country: string;
    markets: Market[];
  };

  export interface Logger {
    log(message: any, options?: any): void;

    error(message: any, options?: any): void;

    debug(message: any, options?: any): void;
  }
}
