import { useState, useCallback, ChangeEvent } from 'react'

/**
 * Generic form state management hook
 * Provides state management and handlers for form inputs
 */
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [formState, setFormState] = useState<T>(initialState)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = useCallback((field: keyof T) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: any } }
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    setIsDirty(true)
  }, [])

  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
    setIsDirty(true)
  }, [])

  const setValues = useCallback((values: Partial<T>) => {
    setFormState(prev => ({
      ...prev,
      ...values
    }))
    setIsDirty(true)
  }, [])

  const reset = useCallback((newState?: T) => {
    setFormState(newState || initialState)
    setIsDirty(false)
  }, [initialState])

  const resetField = useCallback((field: keyof T) => {
    setFormState(prev => ({
      ...prev,
      [field]: initialState[field]
    }))
  }, [initialState])

  return {
    formState,
    handleChange,
    setValue,
    setValues,
    reset,
    resetField,
    isDirty
  }
}

