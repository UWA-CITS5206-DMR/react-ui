import React from "react";

interface PageLayoutProps {
  title: string;
  description?: string;
  useContainerLayout?: boolean;
  extraBottomPadding?: boolean;
  children: React.ReactNode;
}

export default function PageLayout({
  title,
  description,
  useContainerLayout = true,
  extraBottomPadding = false,
  children,
}: PageLayoutProps) {
  const content = (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold leading-none tracking-tight mb-2">{title}</h2>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>

      {children}
    </div>
  );

  return useContainerLayout ? (
    <div className={`max-w-7xl mx-auto space-y-6 relative ${extraBottomPadding ? "pb-20" : ""}`}>
      {content}
    </div>
  ) : (
    content
  );
}
