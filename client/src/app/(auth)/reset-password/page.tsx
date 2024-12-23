'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth/useAuth'
import { useZodForm } from '@/hooks/form/useZodForm'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'
import { useLoading } from '@/contexts/LoadingContext'
import { toastError, toastSuccess } from '@/lib/utils/error'

export default function ResetPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const { withLoading } = useLoading()
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useZodForm<ResetPasswordFormData>({
    schema: resetPasswordSchema,
    onSubmit: async (data) => {
      try {
        await withLoading(
          requestPasswordReset(data.email),
          'Sending reset link...'
        )
        setShowSuccess(true)
        toastSuccess(
          'Reset link sent',
          'Check your email for instructions to reset your password.'
        )
      } catch (err) {
        toastError(err)
      }
    }
  })

  return (
    <>
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium">Reset your password</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {showSuccess ? (
        <div className="text-center space-y-6" role="alert">
          <div className="text-sm text-primary">
            Check your email for a link to reset your password. If you don't see it,
            check your spam folder.
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Return to login</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={values.email || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                placeholder="Enter your email"
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {touched.email && errors.email && (
              <p id="email-error" className="mt-1 text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="text-sm">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Back to login
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
          </Button>
        </form>
      )}
    </>
  )
} 