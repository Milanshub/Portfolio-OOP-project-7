import { useState } from 'react'
import { z } from 'zod'

interface UseZodFormOptions<T> {
  schema: z.ZodSchema<T>
  onSubmit: (data: T) => Promise<void>
  initialValues?: Partial<T>
}

interface UseZodFormReturn<T> {
  values: Partial<T>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  setFieldValue: (field: keyof T, value: any) => void
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void
  resetForm: () => void
}

export function useZodForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  initialValues = {}
}: UseZodFormOptions<T>): UseZodFormReturn<T> {
  const [values, setValues] = useState<Partial<T>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (field: keyof T, value: any) => {
    try {
      const fieldSchema = z.object({ [field]: (schema as any).shape[field] })
      fieldSchema.parse({ [field]: value })
      setErrors(prev => ({ ...prev, [field]: '' }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message
        setErrors(prev => ({ ...prev, [field]: fieldError }))
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validateField(name as keyof T, value)
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name as keyof T, value)
  }

  const validateForm = (): boolean => {
    try {
      schema.parse(values)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values as T)
    } finally {
      setIsSubmitting(false)
    }
  }

  const setFieldValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (touched[field as string]) {
      validateField(field, value)
    }
  }

  const setFieldTouched = (field: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }))
    if (isTouched) {
      validateField(field, values[field])
    }
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm
  }
} 