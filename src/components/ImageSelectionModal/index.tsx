import React, { useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Drawer } from 'vaul';
import { useGetUserRecipesQuery } from '@/types/generated/client/hooks';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { RecipeSelector } from '@/components/forms/RecipeSelector/RecipeSelector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ImageSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
  maxFiles?: number;
  onAddMoreImages?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  message: string;
  setMessage: (message: string) => void;
  selectedRecipeId?: string;
  onRecipeSelect?: (recipeId: string) => void;
}

const PLACEHOLDER_TEXT = `Optional question or note for the AI
- Age of starter?
- Taste/texture?
- Concerns?`;

export function ImageSelectionModal({
  open,
  onOpenChange,
  selectedFiles,
  onRemoveFile,
  onSubmit,
  maxFiles = 4,
  onAddMoreImages,
  message,
  setMessage,
  selectedRecipeId,
  onRecipeSelect,
}: ImageSelectionModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId } = useAuth();
  const { data: recipesData, loading: isLoadingRecipes } = useGetUserRecipesQuery({
    variables: {
      userId,
    },
    skip: !userId,
  });

  const remainingSlots = maxFiles - selectedFiles.length;
  const isDisabled = selectedFiles.length === 0 || isLoadingRecipes;

  const handleAddMoreClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRecipeSelect = (recipeId: string) => {
    if (onRecipeSelect) {
      onRecipeSelect(recipeId);
    }
  };

  const handleRecipeAdd = (recipeId?: string) => {
    if (recipeId && onRecipeSelect) {
      onRecipeSelect(recipeId);
    }
  };

  const recipes = recipesData?.recipes || [];

  const renderContent = () => (
    <>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {remainingSlots > 0
            ? `You can add ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}`
            : 'Maximum number of images reached'}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative overflow-hidden rounded-md border border-border">
              <div className="relative aspect-square">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected image ${index + 1}`}
                  className="aspect-square object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full"
                onClick={() => onRemoveFile(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {remainingSlots > 0 && (
            <div
              className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/50 hover:bg-muted"
              onClick={handleAddMoreClick}
            >
              <Plus className="mb-2 h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add More</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <RecipeSelector
            recipes={recipes}
            selectedRecipeId={selectedRecipeId}
            onRecipeSelect={handleRecipeSelect}
            onRecipeAdd={handleRecipeAdd}
            placeholder="Select recipe (optional)"
            buttonType="outline"
            triggerText={
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Recipe
              </span>
            }
          />
        </div>

        <Textarea
          placeholder={PLACEHOLDER_TEXT}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-28 bg-white text-black"
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onAddMoreImages}
        accept="image/png, image/jpeg, image/jpg"
        multiple
        className="hidden"
        aria-hidden="true"
      />
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Selected Images</DialogTitle>
            <DialogDescription>
              Review your selected images before submitting for crumb analysis.
            </DialogDescription>
          </DialogHeader>

          {renderContent()}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isDisabled}>
              Analyze {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-20 flex max-h-[92dvh] flex-col rounded-t-[10px] bg-background">
          <div className="mx-auto w-full max-w-md overflow-auto rounded-t-[10px] px-4 pb-16">
            <Drawer.Handle className="mx-auto my-3 h-1.5 w-12 rounded-full bg-gray-300" />
            <div className="pb-4 pt-2 text-left">
              <h2 className="text-lg font-medium">Selected Images</h2>
              <p className="text-sm text-muted-foreground">
                Review your selected images before submitting for crumb analysis.
              </p>
            </div>

            {renderContent()}

            <div className="mb-4 mt-8 flex flex-col gap-2">
              <Button onClick={onSubmit} disabled={isDisabled}>
                Analyze {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
            <div className="h-safe-bottom">&nbsp;</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
