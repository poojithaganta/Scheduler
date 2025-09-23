export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-6 sm:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tardus Inc</h3>
          <p className="text-sm text-gray-600 mt-2">Building reliable software with care.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Offices</h4>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>Irving, TX</li>
            <li>McKinney, TX</li>
            <li>Santa Clara, CA</li>
            <li>Tampa, FL</li>
            <li>Pittsburgh, PA</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Contact</h4>
          <p className="text-sm text-gray-600 mt-2">hello@tardus.xyz</p>
          <p className="text-sm text-gray-600">(555) 555-5555</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-4 border-t">© {new Date().getFullYear()} Tardus Inc. All rights reserved.</div>
    </footer>
  );
}


