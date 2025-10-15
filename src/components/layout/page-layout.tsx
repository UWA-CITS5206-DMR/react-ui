import React from "react";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold leading-none tracking-tight mb-2">{title}</h2>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>

      {children}
    </div>
  );
}
