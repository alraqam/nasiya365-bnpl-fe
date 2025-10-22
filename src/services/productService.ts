/**
 * Product and Inventory Service
 * Handles all product and inventory operations
 * Generated from Nasiya BNPL API - Products & Inventory module
 */

import { api, apiClient } from 'src/configs/api'
import {
  Product,
  Category,
  Brand,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  InventoryMovement,
  PurchaseInventoryRequest,
  SellInventoryRequest,
  InventorySummary,
  ProductPerformance
} from 'src/@core/types/product'
import { PaginatedResponse } from 'src/@core/types/api'

export const productService = {
  /**
   * Get all products with pagination
   */
  getAll: (params?: ProductQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.search) query.append('search', params.search)
    if (params?.category_id) query.append('category_id', params.category_id.toString())
    if (params?.brand_id) query.append('brand_id', params.brand_id.toString())
    if (params?.is_active !== undefined) query.append('is_active', params.is_active.toString())
    if (params?.low_stock) query.append('low_stock', 'true')
    if (params?.price_min) query.append('price_min', params.price_min.toString())
    if (params?.price_max) query.append('price_max', params.price_max.toString())

    const queryString = query.toString()
    return api<PaginatedResponse<Product>>(
      `/api/products${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Get a single product by ID
   */
  getById: (id: number) =>
    api<{ data: Product }>(`/api/products/${id}`),

  /**
   * Create a new product
   */
  create: (data: CreateProductRequest) =>
    apiClient.post<{ data: Product }>('/api/products', data),

  /**
   * Update an existing product
   */
  update: (id: number, data: UpdateProductRequest) =>
    apiClient.put<{ data: Product }>(`/api/products/${id}`, data),

  /**
   * Delete a product
   */
  delete: (id: number) =>
    apiClient.delete(`/api/products/${id}`),

  /**
   * Search products
   */
  search: (searchTerm: string, params?: Omit<ProductQueryParams, 'search'>) =>
    productService.getAll({ ...params, search: searchTerm }),

  /**
   * Get low stock products
   */
  getLowStock: () =>
    api<{ data: Product[] }>('/api/products/low-stock'),

  /**
   * Get product performance statistics
   */
  getPerformance: () =>
    api<{ data: ProductPerformance[] }>('/api/products/performance'),

  /**
   * Get product statistics
   */
  getStats: () =>
    api<{ data: { total_products: number; total_value: number } }>('/api/products/stats')
}

export const categoryService = {
  /**
   * Get all categories
   */
  getAll: () =>
    api<{ data: Category[] }>('/api/categories'),

  /**
   * Get category tree (hierarchical structure)
   */
  getTree: () =>
    api<{ data: Category[] }>('/api/categories/tree'),

  /**
   * Get category breadcrumbs
   */
  getBreadcrumbs: (categoryId: number) =>
    api<{ data: Category[] }>(`/api/categories/${categoryId}/breadcrumbs`),

  /**
   * Get category statistics
   */
  getStats: (categoryId: number) =>
    api<{ data: { total_products: number; total_value: number } }>(
      `/api/categories/${categoryId}/stats`
    )
}

export const inventoryService = {
  /**
   * Get inventory summary
   */
  getSummary: () =>
    api<{ data: InventorySummary }>('/api/inventory/summary'),

  /**
   * Purchase inventory (add stock)
   */
  purchase: (data: PurchaseInventoryRequest) =>
    apiClient.post<{ data: InventoryMovement }>('/api/inventory/purchase', data),

  /**
   * Sell inventory (reduce stock)
   */
  sell: (data: SellInventoryRequest) =>
    apiClient.post<{ data: InventoryMovement }>('/api/inventory/sell', data),

  /**
   * Get inventory movements (history)
   */
  getMovements: (productId?: number) => {
    const url = productId
      ? `/api/inventory/movements?product_id=${productId}`
      : '/api/inventory/movements'
    return api<PaginatedResponse<InventoryMovement>>(url)
  },

  /**
   * Get dead stock report
   */
  getDeadStock: () =>
    api<{ data: Product[] }>('/api/inventory/dead-stock'),

  /**
   * Get inventory patterns/trends
   */
  getPatterns: () =>
    api<{ data: any }>('/api/inventory/patterns')
}

export const brandService = {
  /**
   * Get all brands
   */
  getAll: () =>
    api<{ data: Brand[] }>('/api/brands'),

  /**
   * Get products by brand
   */
  getProducts: (brandId: number) =>
    api<PaginatedResponse<Product>>(`/api/brands/${brandId}/products`)
}

