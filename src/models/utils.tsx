import type { Model } from "./types";
import { ModelProvider } from "./types";
import { MODELS } from "./constants";
import { DiamondIcon, StarIcon, CircleIcon } from "lucide-react";
import React from "react";


export function getModelProviderIcon(model: Model): React.ReactNode {
  switch (model.provider) {
    case ModelProvider.OPENAI:
      return <DiamondIcon className="h-4 w-4 text-green-500" />; // OpenAI
    case ModelProvider.GOOGLE:
      return <CircleIcon className="h-4 w-4 text-blue-500" />; // Google
    case ModelProvider.ANTHROPIC:
      return <StarIcon className="h-4 w-4 text-purple-500" />; // Anthropic Claude
    default:
      return <DiamondIcon className="h-4 w-4 text-gray-500" />; // Default
  }
}


export function estimateCost(modelId: string, tokenCount: number): number {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) return 0;

  return (tokenCount / 1000) * model.pricePer1kTokens;
}


export function isModelCompatibleWithFeature(
  modelId: string,
  feature: string,
): boolean {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) return false;


  return true;
}


export function getModelsByProvider(provider: ModelProvider): Model[] {
  return MODELS.filter(
    (model) => model.provider === provider && model.isAvailable !== false,
  );
}
