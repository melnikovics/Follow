import type { FallbackRender } from "@sentry/react"
import { ErrorBoundary } from "@sentry/react"
import type { FC, PropsWithChildren } from "react"
import { createElement, useCallback } from "react"

import type { ErrorComponentType } from "../errors"
import { getErrorFallback } from "../errors"

export interface AppErrorBoundaryProps extends PropsWithChildren {
  height?: number | string
  errorType: ErrorComponentType
}

export const AppErrorBoundary: FC<
  Omit<AppErrorBoundaryProps, "errorType"> & {
    errorType: ErrorComponentType[] | ErrorComponentType
  }
> = ({ errorType, children }) => {
  if (Array.isArray(errorType)) {
    return (
      <>
        {errorType.reduceRight(
          (acc, type) => (
            <AppErrorBoundaryItem key={type} errorType={type}>
              {acc}
            </AppErrorBoundaryItem>
          ),
          children,
        )}
      </>
    )
  }

  return <AppErrorBoundaryItem errorType={errorType}>{children}</AppErrorBoundaryItem>
}

type ErrorFallbackProps = Parameters<FallbackRender>["0"]
export type AppErrorFallbackProps = ErrorFallbackProps & {}
const AppErrorBoundaryItem: FC<AppErrorBoundaryProps> = ({ errorType, children }) => {
  const fallbackRender = useCallback(
    (fallbackProps: ErrorFallbackProps) =>
      createElement(getErrorFallback(errorType), fallbackProps),
    [errorType],
  )

  const onError = useCallback((error: unknown, componentStack?: string) => {
    console.error("Uncaught error:", error, componentStack)
  }, [])

  return (
    <ErrorBoundary fallback={fallbackRender} onError={onError}>
      {children}
    </ErrorBoundary>
  )
}
