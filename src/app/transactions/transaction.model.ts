export interface Location {
  address: string;
  city: string;
  country: string;
  lat: string;
  lon: string;
  postal_code: string;
  region: string;
}

export interface Category {
  category: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: Category[];
  date: string;
  name: string;
  location: Location;
}
