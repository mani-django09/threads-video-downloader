import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-app flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-2">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </section>
  );
}
