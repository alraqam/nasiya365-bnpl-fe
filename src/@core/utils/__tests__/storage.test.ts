import { storage } from '../storage'

// Mock localStorage before importing
const mockGetItem = jest.fn()
const mockSetItem = jest.fn()
const mockRemoveItem = jest.fn()
const mockClear = jest.fn()

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
    clear: mockClear,
    length: 0,
    key: jest.fn(),
  },
  writable: true,
})

describe('Storage Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetItem.mockReturnValue(null)
  })

  describe('getItem', () => {
    it('should return null for non-existent key', () => {
      mockGetItem.mockReturnValue(null)
      const result = storage.getItem('nonexistent')
      expect(result).toBeNull()
      expect(mockGetItem).toHaveBeenCalledWith('nonexistent')
    })

    it('should return stored value', () => {
      mockGetItem.mockReturnValue('test-value')
      const result = storage.getItem('test-key')
      expect(result).toBe('test-value')
      expect(mockGetItem).toHaveBeenCalledWith('test-key')
    })
  })

  describe('setItem', () => {
    it('should store value', () => {
      const result = storage.setItem('test-key', 'test-value')
      expect(mockSetItem).toHaveBeenCalledWith('test-key', 'test-value')
      expect(result).toBe(true)
    })
  })

  describe('removeItem', () => {
    it('should remove value', () => {
      const result = storage.removeItem('test-key')
      expect(mockRemoveItem).toHaveBeenCalledWith('test-key')
      expect(result).toBe(true)
    })
  })

  describe('getJSON', () => {
    it('should parse and return JSON', () => {
      const testData = { foo: 'bar', baz: 123 }
      mockGetItem.mockReturnValue(JSON.stringify(testData))
      
      const result = storage.getJSON('test-key')
      expect(result).toEqual(testData)
    })

    it('should return null for invalid JSON', () => {
      mockGetItem.mockReturnValue('invalid json')
      
      const result = storage.getJSON('test-key')
      expect(result).toBeNull()
    })
  })

  describe('setJSON', () => {
    it('should stringify and store JSON', () => {
      const testData = { foo: 'bar', baz: 123 }
      const result = storage.setJSON('test-key', testData)
      
      expect(mockSetItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData))
      expect(result).toBe(true)
    })
  })

  describe('has', () => {
    it('should return true if key exists', () => {
      mockGetItem.mockReturnValue('value')
      expect(storage.has('test-key')).toBe(true)
    })

    it('should return false if key does not exist', () => {
      mockGetItem.mockReturnValue(null)
      expect(storage.has('test-key')).toBe(false)
    })
  })
})

