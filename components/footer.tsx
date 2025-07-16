import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t mt-auto">
      <div className="container mx-auto py-6 px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm mb-4 sm:mb-0">© {new Date().getFullYear()} Financial Calculators. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/suggested-resources" className="text-sm hover:text-primary transition-colors">
            Suggested Resources
          </Link>
          <Link href="/acceptable-use" className="text-sm hover:text-primary transition-colors">
            Acceptable Use
          </Link>
          <Link href="/terms-of-service" className="text-sm hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="/change-log" className="text-sm hover:text-primary transition-colors">
            Change Log
          </Link>
        </nav>
      </div>
    </footer>
  )
}
