import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/error-utils";
import type {
  ManualFileReleaseRequest,
  ManualFileReleaseResponse,
  PatientFile,
  User,
} from "@/lib/api-client-v2";

interface FileReleaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  file: PatientFile | null;
}

interface ReleaseFormState {
  selectedGroups: Set<number>;
  pageRange: string;
}

const createInitialFormState = (): ReleaseFormState => ({
  selectedGroups: new Set<number>(),
  pageRange: "",
});

export default function FileReleaseDialog({
  open,
  onOpenChange,
  patientId,
  file,
}: FileReleaseDialogProps) {
  const [formState, setFormState] = useState<ReleaseFormState>(() => createInitialFormState());
  const [formError, setFormError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: studentGroups,
    isLoading,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["instructors", "student-groups"],
    queryFn: () => apiClientV2.instructors.studentGroups.list(),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!open) {
      setFormState(createInitialFormState());
      setFormError(null);
      return;
    }

    // Reset form while preserving selected file context
    setFormState(createInitialFormState());
    setFormError(null);
  }, [open]);

  const releaseMutation = useMutation<ManualFileReleaseResponse, Error, ManualFileReleaseRequest>({
    mutationFn: (payload) => {
      if (!file) {
        throw new Error("No file selected for release.");
      }
      return apiClientV2.patients.files.release(patientId, file.id, payload);
    },
    onSuccess: (response) => {
      toast({
        title: "Access Released",
        description: `File access granted to ${response.released_to.length} student group(s).`,
      });
      queryClient.invalidateQueries({ queryKey: ["patients", patientId, "files"] });
      onOpenChange(false);
    },
    onError: (mutationError) => {
      setFormError(getErrorMessage(mutationError, "Failed to release file."));
    },
  });

  const groups = useMemo(() => studentGroups ?? [], [studentGroups]);
  const selectedCount = formState.selectedGroups.size;

  const handleToggleGroup = (groupId: number, checked: boolean | string) => {
    setFormState((prev) => {
      const next = new Set(prev.selectedGroups);
      if (checked) {
        next.add(groupId);
      } else {
        next.delete(groupId);
      }
      return { ...prev, selectedGroups: next };
    });
  };

  const handleSubmit = () => {
    if (!file) {
      setFormError("No file selected for release.");
      return;
    }

    if (selectedCount === 0) {
      setFormError("Select at least one student group to release this file to.");
      return;
    }

    if (file.requires_pagination && formState.pageRange.trim().length === 0) {
      setFormError("Provide a page range for paginated files (e.g. 1-3,5).");
      return;
    }

    setFormError(null);

    const payload: ManualFileReleaseRequest = {
      student_group_ids: Array.from(formState.selectedGroups),
    };

    if (file.requires_pagination) {
      payload.page_range = formState.pageRange.trim();
    } else if (formState.pageRange.trim().length > 0) {
      payload.page_range = formState.pageRange.trim();
    }

    releaseMutation.mutate(payload);
  };

  const dialogTitle = file ? `Release: ${file.display_name}` : "Release File";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="gap-2">
          <DialogTitle className="flex items-center gap-2">
            <span className="truncate">{dialogTitle}</span>
          </DialogTitle>
          <DialogDescription>
            Grant selected student groups immediate access to this file without requiring an
            investigation request approval.
          </DialogDescription>
        </DialogHeader>

        {!file && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No file selected. Close the dialog and try again.</AlertDescription>
          </Alert>
        )}

        {file && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Student Groups</Label>
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading student groups...
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load student groups: {getErrorMessage(error, "Unknown error")}
                  </AlertDescription>
                </Alert>
              )}

              {!isLoading && !error && groups.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No student groups available for manual release.
                  </AlertDescription>
                </Alert>
              )}

              {!isLoading && !error && groups.length > 0 && (
                <ScrollArea className="h-48 border rounded-md">
                  <div className="divide-y">
                    {groups.map((group) => {
                      const fullName = [group.first_name, group.last_name]
                        .filter(Boolean)
                        .join(" ");
                      const displayName = fullName
                        ? `${fullName} (@${group.username})`
                        : group.username;
                      const isChecked = formState.selectedGroups.has(group.id);
                      return (
                        <label
                          key={group.id}
                          className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-muted/60"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => handleToggleGroup(group.id, checked)}
                              id={`group-${group.id}`}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{displayName}</span>
                              {group.email && (
                                <span className="text-xs text-gray-500">{group.email}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">ID: {group.id}</span>
                        </label>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}

              <p className="text-xs text-muted-foreground">
                Selected groups will immediately see this file in their Patient Documents list.
              </p>
            </div>

            {file.requires_pagination && (
              <div className="space-y-2">
                <Label htmlFor="pageRange" className="text-sm font-medium text-gray-700">
                  Page Range
                </Label>
                <Input
                  id="pageRange"
                  value={formState.pageRange}
                  placeholder="e.g. 1-3,5"
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, pageRange: event.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Provide the page range students can view. Use comma separated ranges (e.g. 1-3,5).
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500">
              Manual release entries are tracked in the Approved Files list and can be revoked by
              removing the approved entry from the admin panel.
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={releaseMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !file ||
              isLoading ||
              !!error ||
              releaseMutation.isPending ||
              (file && formState.selectedGroups.size === 0)
            }
          >
            {releaseMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Releasing...
              </>
            ) : (
              "Release"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
