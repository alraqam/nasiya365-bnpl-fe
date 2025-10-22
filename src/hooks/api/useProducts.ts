/**
 * Product-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { productService, categoryService, inventoryService } from 'src/services/productService'
import {
  Product,
  Category,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams
} from 'src/@core/types/product'
import toast from 'react-hot-toast'

/**
 * Hook to fetch all products with pagination
 */
export function useProducts(params?: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<any>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productService.getAll(params)
      setProducts(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [
    params?.page,
    params?.per_page,
    params?.search,
    params?.category_id,
    params?.brand_id,
    params?.is_active,
    params?.low_stock,
    params?.price_min,
    params?.price_max
  ])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, meta, refetch: fetchProducts }
}

/**
 * Hook to fetch a single product
 */
export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productService.getById(id)
      setProduct(response.data)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id, fetchProduct])

  return { product, loading, error, refetch: fetchProduct }
}

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await categoryService.getAll()
        setCategories(response.data)
      } catch (err) {
        setError(err as Error)
        toast.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

/**
 * Hook to fetch category tree
 */
export function useCategoryTree() {
  const [tree, setTree] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await categoryService.getTree()
        setTree(response.data)
      } catch (err) {
        setError(err as Error)
        toast.error('Failed to load category tree')
      } finally {
        setLoading(false)
      }
    }

    fetchTree()
  }, [])

  return { tree, loading, error }
}

/**
 * Hook to fetch inventory summary
 */
export function useInventorySummary() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await inventoryService.getSummary()
        setSummary(response.data)
      } catch (err) {
        setError(err as Error)
        toast.error('Failed to load inventory summary')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  return { summary, loading, error }
}

