'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth/useAuth'
import { useZodForm } from '@/hooks/form/useZodForm'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { useLoading } from '@/contexts'
import { toastError, toastSuccess } from '@/lib/utils/error'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { withLoading } = useLoading()

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useZodForm<RegisterFormData>({
    schema: registerSchema,
    onSubmit: async (data) => {
      try {
        await withLoading(
          register(data),
          'Creating your account...'
        )
        toastSuccess(
          'Account created!',
          'Your account has been created successfully. Welcome aboard!'
        )
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
          <Label htmlFor="name">Full Name</Label>
          <div className="mt-2">
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={values.name || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name ? errors.name : undefined}
              placeholder="Enter your full name"
              autoComplete="name"
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          </div>
          {touched.name && errors.name && (
            <p id="name-error" className="mt-1 text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>

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
              placeholder="Create a password"
              autoComplete="new-password"
              aria-describedby="password-requirements"
            />
          </div>
          <p id="password-requirements" className="mt-1 text-xs text-muted-foreground">
            Password must be at least 8 characters long and contain at least one uppercase letter,
            one lowercase letter, one number, and one special character.
          </p>
          {touched.password && errors.password && (
            <p id="password-error" className="mt-1 text-sm text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div className="text-sm">
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Already have an account? Sign in
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </>
  )
} 