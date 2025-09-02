import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Image, FileIcon, Eye, EyeOff, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Group, Asset, AssetGroupVisibility } from "@shared/schema";

const sessionId = "session-1"; // Using test session

export default function GroupManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [bulkAction, setBulkAction] = useState<"show" | "hide" | null>(null);

  // Fetch groups for the session
  const { data: groups = [], isLoading: groupsLoading } = useQuery<Group[]>({
    queryKey: ["/api/sessions", sessionId, "groups"],
  });

  // Fetch assets for the session
  const { data: assets = [], isLoading: assetsLoading } = useQuery<Asset[]>({
    queryKey: ["/api/sessions", sessionId, "assets"],
  });

  // Fetch visibility for each group-asset combination
  const getAssetVisibilityForGroup = (assetId: string, groupId: string) => {
    return useQuery<AssetGroupVisibility | null>({
      queryKey: ["/api/assets", assetId, "visibility", groupId],
      enabled: !!assetId && !!groupId,
    });
  };

  // Update asset visibility mutation
  const updateVisibilityMutation = useMutation({
    mutationFn: async ({ assetId, groupId, visible }: { assetId: string; groupId: string; visible: boolean }) => {
      return api.assets.updateVisibility(assetId, groupId, visible, user?.id || '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      toast({
        title: "Success",
        description: "Document visibility updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update document visibility",
        variant: "destructive",
      });
    },
  });

  // Bulk update visibility mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ assetIds, groupId, visible }: { assetIds: string[]; groupId: string; visible: boolean }) => {
      return api.assets.bulkUpdateVisibility(assetIds, groupId, visible, user?.id || '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      setSelectedAssets([]);
      setBulkAction(null);
      toast({
        title: "Success",
        description: "Document visibility updated for all selected items",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update document visibility",
        variant: "destructive",
      });
    },
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "document":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "lab":
        return <FileIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  const handleAssetSelection = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets(prev => [...prev, assetId]);
    } else {
      setSelectedAssets(prev => prev.filter(id => id !== assetId));
    }
  };

  const handleBulkAction = () => {
    if (!selectedGroup || !bulkAction || selectedAssets.length === 0) return;
    
    bulkUpdateMutation.mutate({
      assetIds: selectedAssets,
      groupId: selectedGroup,
      visible: bulkAction === "show",
    });
  };

  const AssetVisibilityRow = ({ asset, group }: { asset: Asset; group: Group }) => {
    const { data: visibility } = getAssetVisibilityForGroup(asset.id, group.id);
    const isVisible = visibility?.visible || false;

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedAssets.includes(asset.id)}
            onCheckedChange={(checked) => handleAssetSelection(asset.id, checked as boolean)}
          />
          {getAssetIcon(asset.type)}
          <div>
            <p className="font-medium">{asset.filename}</p>
            <p className="text-sm text-muted-foreground capitalize">{asset.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isVisible ? "default" : "secondary"}>
            {isVisible ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Visible
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hidden
              </>
            )}
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                {isVisible ? "Hide" : "Show"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Confirm Document Visibility Change
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to {isVisible ? "hide" : "show"} "{asset.filename}" for group "{group.name}"?
                  <br />
                  <span className="text-amber-600 font-medium mt-2 block">
                    ⚠️ This action will immediately affect what students in this group can see.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateVisibilityMutation.mutate({
                    assetId: asset.id,
                    groupId: group.id,
                    visible: !isVisible,
                  })}
                  className={isVisible ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {isVisible ? "Hide Document" : "Show Document"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  };

  if (groupsLoading || assetsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005EB8] mx-auto mb-2"></div>
          <p>Loading groups and documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-[#005EB8]">Group Manager</h1>
        <p className="text-gray-600 mt-1">
          Control document visibility for different student groups with safety confirmations and audit trails.
        </p>
      </div>

      {/* Bulk Actions */}
      {selectedAssets.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Bulk Actions ({selectedAssets.length} documents selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!selectedGroup}
                    onClick={() => setBulkAction("show")}
                  >
                    Show Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Confirm Bulk Show Documents
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to show {selectedAssets.length} documents to group "{groups.find(g => g.id === selectedGroup)?.name}"?
                      <br />
                      <span className="text-amber-600 font-medium mt-2 block">
                        ⚠️ This action will immediately make these documents visible to all students in this group.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkAction}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Show Documents
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!selectedGroup}
                    onClick={() => setBulkAction("hide")}
                  >
                    Hide Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Confirm Bulk Hide Documents
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to hide {selectedAssets.length} documents from group "{groups.find(g => g.id === selectedGroup)?.name}"?
                      <br />
                      <span className="text-amber-600 font-medium mt-2 block">
                        ⚠️ This action will immediately hide these documents from all students in this group.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkAction}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Hide Documents
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Tabs */}
      <Tabs defaultValue={groups[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-auto">
          {groups.map((group) => (
            <TabsTrigger key={group.id} value={group.id} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assets.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No documents available</p>
                  ) : (
                    assets.map((asset) => (
                      <AssetVisibilityRow key={asset.id} asset={asset} group={group} />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}