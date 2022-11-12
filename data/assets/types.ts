export interface Assets<T> {
  repos: {
    base: BaseRepo;
    addons: T[];
  };
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
  default: string;
  variants: JavaAddonVariant[];
}

export interface JavaAddonVariant {
  name: string;
  id: string;
  branch?: string;
  url?: string;
  description?: string;
  "pack.png"?: string;
}
