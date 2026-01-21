export interface ColourOption {
  value: string;
  label: string;
  color: string;
}

export const colourOptions: readonly ColourOption[] = [
  { value: "amber", label: "Amber", color: "#F3C300" },
  { value: "Lipstick", label: "Lipstick", color: "#AD0057" },
  { value: "Deep Fir", label: "Deep Fir", color: "#0E2E00" },
  { value: "Perano", label: "Perano", color: "#9BC7F0" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];
