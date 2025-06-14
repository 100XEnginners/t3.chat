"use client";
import React, { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFont } from "@/contexts/font-context";
import { useBlur } from "@/contexts/blur-context";

export const Customisation = () => {
  const [name, setName] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [customTrait, setCustomTrait] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isBoringTheme, setIsBoringTheme] = useState<boolean>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("boringTheme");
      return saved === "true";
    }
    return false;
  });
  const { selectedFont, setSelectedFont } = useFont();
  const { isBlurred, setIsBlurred } = useBlur();

  // Debug log when component mounts
  useEffect(() => {
    console.log("Customisation mounted, blur state:", isBlurred);
  }, [isBlurred]);

  // Apply theme on mount and when isBoringTheme changes
  useEffect(() => {
    document.documentElement.classList.toggle("boring-theme", isBoringTheme);
    localStorage.setItem("boringTheme", isBoringTheme.toString());
  }, [isBoringTheme]);

  const predefinedTraits = [
    "friendly",
    "witty",
    "concise",
    "curious",
    "empathetic",
    "creative",
    "patient",
  ] as const;

  const fonts = [
    { value: "proxima", label: "Proxima Vara" },
    { value: "inter", label: "Inter" },
    { value: "geist", label: "Geist" },
    { value: "playfair", label: "Playfair Display" },
    { value: "roboto", label: "Roboto" },
  ] as const;

  const addTrait = (trait: string) => {
    if (!selectedTraits.includes(trait)) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const removeTrait = (trait: string) => {
    setSelectedTraits(selectedTraits.filter((t) => t !== trait));
  };

  const addCustomTrait = () => {
    if (customTrait.trim() && !selectedTraits.includes(customTrait.trim())) {
      setSelectedTraits([...selectedTraits, customTrait.trim()]);
      setCustomTrait("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      addCustomTrait();
    }
  };

  return (
    <div className="bg-background text-foreground">
      <div className="">
        <h1 className="text-foreground my-4 text-2xl font-bold">
          Customize T3 Chat
        </h1>

        <div className="space-y-1">
          {/* Name Section */}
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">
              What should T3 Chat call you?
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="text-muted-foreground mt-1 text-right text-xs">
              {name.length}/50
            </div>
          </div>

          {/* Occupation Section */}
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">
              What do you do?
            </label>
            <Input
              type="text"
              placeholder="Engineer, student, etc."
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
            <div className="text-muted-foreground mt-1 text-right text-xs">
              {occupation.length}/100
            </div>
          </div>

          {/* Traits Section */}
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">
              What traits should T3 Chat have?{" "}
              <span className="text-muted-foreground text-xs">
                (up to 50, max 100 chars each)
              </span>
            </label>

            {/* Custom trait input */}
            <div className="relative mb-0">
              <div className="bg-input/30 rounded-lg border p-2">
                {selectedTraits.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedTraits.map((trait) => (
                      <span
                        key={trait}
                        className="dark:bg-input/50 bg-background text-accent-foreground inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-medium"
                      >
                        {trait}
                        <button
                          onClick={() => removeTrait(trait)}
                          className="hover:bg-accent-foreground hover:text-accent rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <Input
                  type="text"
                  className="border-none bg-transparent focus-visible:ring-0"
                  placeholder="Type a trait and press Enter or Tab..."
                  value={customTrait}
                  onChange={(e) => setCustomTrait(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <div className="text-muted-foreground mt-1 text-right text-xs">
                {customTrait.length}/100
              </div>
            </div>

            {/* Predefined trait buttons */}
            <div className="mb-3 flex flex-wrap gap-2 text-sm">
              {predefinedTraits.map((trait) => (
                <Button
                  key={trait}
                  onClick={() => addTrait(trait)}
                  disabled={selectedTraits.includes(trait)}
                  variant="outline"
                  className="bg-accent h-fit py-1.5 text-xs"
                >
                  {trait}
                  <Plus className="h-3 w-3" />
                </Button>
              ))}
            </div>

            {/* Selected traits */}
          </div>

          {/* Additional Info Section */}
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">
              Anything else T3 Chat should know about you?
            </label>
            <Textarea
              placeholder="Interests, values, or preferences to keep in mind"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
            />
            <div className="text-muted-foreground mt-1 text-right text-xs">
              {additionalInfo.length}/300
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button variant="outline">Load Legacy Data</Button>
            <Button className="ml-auto">Save Preferences</Button>
          </div>

          {/* Visual Options Section */}
          <div className="border-border mt-12">
            <h2 className="text-foreground text-xl font-semibold">
              Visual Options
            </h2>

            <div className="mt-6 flex flex-col gap-8">
              {/* Font Selection */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-foreground text-base font-semibold">
                    Font Family
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Choose your preferred font for the application.
                  </div>
                </div>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select font">
                      <span className={`font-${selectedFont}`}>
                        {fonts.find((f) => f.value === selectedFont)?.label}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={`font-${font.value}`}>
                          {font.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Boring Theme Switch */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-foreground text-base font-semibold">
                    Boring Theme
                  </div>
                  <div className="text-muted-foreground text-sm">
                    If you think the pink is too much, turn this on to tone it
                    down.
                  </div>
                </div>
                <Switch
                  checked={isBoringTheme}
                  onCheckedChange={setIsBoringTheme}
                />
              </div>
              {/* Hide Personal Information Switch */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-foreground text-base font-semibold">
                    Hide Personal Information
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Hides your name and email from the UI.
                  </div>
                </div>
                <Switch
                  checked={isBlurred}
                  onCheckedChange={(checked) => {
                    console.log("Switch changed to:", checked);
                    setIsBlurred(checked);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
