export interface Assets<T> {
  repos: {
    base: BaseRepo;
    addons: T[];
  };
}

export interface ConditionalBranch {
  // Can be set to "DEFAULT" for fallback value
  trigger: string;
  value: string;
}

export interface BaseRepo {
  mc_versions: string;
  pack_format: string;
  tag: string;
  release_url: string;
  version: string;
  filename: string;
  url: string;
}

export interface BedrockAddon {
  name: string;
  filename: string;
  url: string;
}

export interface JavaAddon {
  name: string;
  id_pos: number;
  apply_order: number;
  default: string;
  variants: JavaAddonVariant[];
}

export interface JavaAddonVariant {
  name: string;
  id: string;
  url?: string;
  branch?: string | ConditionalBranch[];
  description?: string;
  "pack.png"?: string;
  enable_trigger?: string;
}
