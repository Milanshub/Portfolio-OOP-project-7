import * as React from "react"
import { Label } from "./label"
import { Input } from "./input"
import { Textarea } from "./textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  error?: string
  type?: "text" | "email" | "password" | "textarea" | "select"
  options?: { label: string; value: string }[]
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  selectProps?: React.ComponentProps<typeof Select>
}

export function FormField({
  label,
  error,
  type = "text",
  options = [],
  className,
  inputProps,
  textareaProps,
  selectProps,
  ...props
}: FormFieldProps) {
  const id = React.useId()

  return (
    <div className={className} {...props}>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">
        {type === "textarea" ? (
          <Textarea id={id} error={error} {...textareaProps} />
        ) : type === "select" ? (
          <Select {...selectProps}>
            <SelectTrigger id={id} error={error}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input id={id} type={type} error={error} {...inputProps} />
        )}
      </div>
    </div>
  )
} 