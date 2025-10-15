import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText } from "lucide-react";
import { apiClientV2 } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageLayout from "@/components/layout/page-layout";

export default function GoogleForms() {
  const {
    data: googleForms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/patients/google-forms"],
    queryFn: () => apiClientV2.googleFormLinks.list(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load Google Forms. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!googleForms || googleForms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Available</h3>
        <p className="text-gray-500">
          There are currently no Google Forms available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <PageLayout
      title="Google Forms"
      description="Forms will open in a new tab. Please ensure you have completed all required fields before submitting."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {googleForms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-hospital-blue flex-shrink-0" />
                {form.title}
              </CardTitle>
              {form.description && (
                <CardDescription className="mt-2">{form.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <div className="mt-auto">
                <Button
                  onClick={() => window.open(form.url, "_blank", "noopener,noreferrer")}
                  className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Form
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
