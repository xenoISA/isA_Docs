import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-[var(--accent)] mb-3">404</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          The page you are looking for does not exist or has been moved.
          Check the URL or head back to the documentation home.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] rounded-md transition-colors"
          >
            Back to docs
          </Link>
        </div>
      </div>
    </div>
  )
}
