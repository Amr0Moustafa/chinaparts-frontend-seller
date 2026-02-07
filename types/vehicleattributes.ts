// Brand Types
export interface Brand {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandListResponse {
  success: boolean;
  data: Brand[];
  total?: number;
}

// Tag Types
export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagListResponse {
  success: boolean;
  data: Tag[];
  total?: number;
}

// Vehicle Type Types
export interface VehicleType {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleTypeListResponse {
  success: boolean;
  data: VehicleType[];
  total?: number;
}

// Vehicle Model Types
export interface VehicleModel {
  id: number;
  name: string;
  brandId: number;
  brandName?: string;
  year?: number;
  type?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleModelListResponse {
  success: boolean;
  data: VehicleModel[];
  total?: number;
}

// Vehicle Body Type Types
export interface VehicleBodyType {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleBodyTypeListResponse {
  success: boolean;
  data: VehicleBodyType[];
  total?: number;
}

// Error Response
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}