/**
 * Product and Inventory types
 * Generated from Nasiya BNPL API - Products & Inventory module
 */

export interface Product {
  id: number
  name: string
  description?: string
  category_id: number
  brand_id?: number
  price: number
  cost_price?: number
  sku?: string
  barcode?: string
  stock_quantity: number
  min_stock_level?: number
  max_stock_level?: number
  is_active: boolean
  is_serialized: boolean
  images?: string[]
  created_at: string
  updated_at: string
  category?: Category
  brand?: Brand
}

export interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  children?: Category[]
}

export interface Brand {
  id: number
  name: string
  description?: string
  logo?: string
  is_active: boolean
}

export interface CreateProductRequest {
  name: string
  category_id: number
  price: number
  cost_price?: number
  stock_quantity: number
  description?: string
  sku?: string
  barcode?: string
  brand_id?: number
  min_stock_level?: number
  is_serialized?: boolean
}

export type UpdateProductRequest = Partial<CreateProductRequest>

export interface ProductQueryParams {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
  brand_id?: number
  is_active?: boolean
  low_stock?: boolean
  price_min?: number
  price_max?: number
}

export interface InventoryMovement {
  id: number
  product_id: number
  type: 'purchase' | 'sale' | 'adjustment' | 'return'
  quantity: number
  cost_per_unit?: number
  reference_id?: number
  notes?: string
  created_by: number
  created_at: string
}

export interface PurchaseInventoryRequest {
  product_id: number
  quantity: number
  cost_per_unit: number
  supplier_id?: number
  notes?: string
}

export interface SellInventoryRequest {
  product_id: number
  quantity: number
  order_id?: number
  notes?: string
}

export interface InventorySummary {
  total_products: number
  total_stock_value: number
  low_stock_items: number
  out_of_stock_items: number
  categories_count: number
}

export interface ProductPerformance {
  product_id: number
  product_name: string
  total_sold: number
  total_revenue: number
  average_sale_price: number
}

