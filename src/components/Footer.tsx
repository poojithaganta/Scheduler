import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container-px mx-auto py-8 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="text-lg font-semibold text-brand-700">TARDUS Inc</div>
          <p className="mt-2 text-sm text-gray-600">© {new Date().getFullYear()} TARDUS Inc. All rights reserved.</p>
        </div>
        <div className="text-sm text-gray-600" />
      </div>
    </footer>
  );
}

