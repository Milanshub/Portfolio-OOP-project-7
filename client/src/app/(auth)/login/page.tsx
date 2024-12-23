'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth/useAuth'
import { useZodForm } from '@/hooks/form/useZodForm'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useLoading } from '@/contexts/LoadingContext'
import { toastError, toastSuccess } from '@/lib/utils/error'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { withLoading } = useLoading()

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useZodForm<LoginFormData>({
    schema: loginSchema,
    onSubmit: async (data) => {
      try {
        await withLoading(
          login(data),
          'Signing in...'
        )
        toastSuccess('Welcome back!', 'You have successfully signed in.')
        router.push('/dashboard')
      } catch (err) {
        toastError(err)
      }
    }
  })

  return (
    <>
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

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-2">
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={values.password || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : undefined}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
          </div>
          {touched.password && errors.password && (
            <p id="password-error" className="mt-1 text-sm text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/reset-password"
              className="font-medium text-primary hover:text-primary/80"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm">
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Create an account
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </>
  )
} 