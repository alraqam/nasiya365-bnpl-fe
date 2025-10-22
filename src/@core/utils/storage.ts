/**
 * Storage abstraction layer with SSR safety
 * Provides a safe interface for localStorage/sessionStorage operations
 */

type StorageType = 'local' | 'session'

class StorageManager {
  private isClient: boolean

  constructor() {
    this.isClient = typeof window !== 'undefined'
  }

  private getStorage(type: StorageType): Storage | null {
    if (!this.isClient) return null
    return type === 'local' ? window.localStorage : window.sessionStorage
  }

  /**
   * Get an item from storage
   */
  getItem(key: string, type: StorageType = 'local'): string | null {
    try {
      const storage = this.getStorage(type)
      return storage?.getItem(key) ?? null
    } catch (error) {
      console.error(`Error reading from ${type}Storage:`, error)
      return null
    }
  }

  /**
   * Set an item in storage
   */
  setItem(key: string, value: string, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type)
      storage?.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Error writing to ${type}Storage:`, error)
      return false
    }
  }

  /**
   * Remove an item from storage
   */
  removeItem(key: string, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type)
      storage?.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from ${type}Storage:`, error)
      return false
    }
  }

  /**
   * Clear all items from storage
   */
  clear(type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type)
      storage?.clear()
      return true
    } catch (error) {
      console.error(`Error clearing ${type}Storage:`, error)
      return false
    }
  }

  /**
   * Get and parse JSON from storage
   */
  getJSON<T>(key: string, type: StorageType = 'local'): T | null {
    try {
      const item = this.getItem(key, type)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error parsing JSON from ${type}Storage:`, error)
      return null
    }
  }

  /**
   * Stringify and set JSON in storage
   */
  setJSON<T>(key: string, value: T, type: StorageType = 'local'): boolean {
    try {
      const serialized = JSON.stringify(value)
      return this.setItem(key, serialized, type)
    } catch (error) {
      console.error(`Error stringifying JSON for ${type}Storage:`, error)
      return false
    }
  }

  /**
   * Check if a key exists in storage
   */
  has(key: string, type: StorageType = 'local'): boolean {
    return this.getItem(key, type) !== null
  }

  /**
   * Get all keys from storage
   */
  keys(type: StorageType = 'local'): string[] {
    try {
      const storage = this.getStorage(type)
      if (!storage) return []
      return Object.keys(storage)
    } catch (error) {
      console.error(`Error getting keys from ${type}Storage:`, error)
      return []
    }
  }
}

export const storage = new StorageManager()

// Convenience exports for common operations
export const getItem = (key: string) => storage.getItem(key)
export const setItem = (key: string, value: string) => storage.setItem(key, value)
export const removeItem = (key: string) => storage.removeItem(key)
export const getJSON = <T>(key: string) => storage.getJSON<T>(key)
export const setJSON = <T>(key: string, value: T) => storage.setJSON(key, value)

