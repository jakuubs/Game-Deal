export interface Game {
  gameID: number;
  steamAppID: number;
  cheapest: number;
  cheapestDealID: string;
  external: string;
  thumb: string;
}

export interface GameInfo {
  storeID: string;
  gameID: string;
  name: string;
  steamAppID: string;
  salePrice: number;
  retailPrice: number;
  steamRatingText: string;
  steamRatingPercent: number;
  steamRatingCount: number;
  metacriticScore: number;
  metacriticLink: string;
  releaseDate: Date;
  publisher: string;
  steamworks: string;
  thumb: string;
}

export interface Store {
  dealID: string;
  storeID: string;
  salePrice: number;
  retailPrice: number;
}

export interface CheapestPrice {
  price: number;
  date: Date;
}

export interface Deal {
  gameInfo: GameInfo;
  cheaperStores: Store[];
  cheapestPrice: CheapestPrice;
}

export interface Images {
  banner: string;
  logo: string;
  icon: string;
}

export interface StoreInfo {
  storeID: number;
  storeName: string;
  isActive: boolean;
  images: Images;
}
