import { Assets, BedrockAddon } from "./types.ts";

export const ASSETS: Assets<BedrockAddon> = {
  "repos": {
    "base": {
      "mc_versions": "1.19",
      "pack_format": "9",
      "tag": "1.2.0",
      "release_url":
        "https://github.com/Love-and-Tolerance/Love-and-Tolerance/releases/download/{tag}/{filename}",
      "version": "1.2.0-bedrock",
      "filename": "L-T_{version}.mcpack",
      "url": "https://github.com/Love-and-Tolerance/Love-and-Tolerance-Bedrock",
    },
    "addons": [
      {
        "name": "Seasonal Addon",
        "filename": "L-T_{version}-Seasons.mcpack",
        "url":
          "https://github.com/Love-and-Tolerance/Seasonal-Textures-Addon-Bedrock",
      },
      {
        "name": "Music Addon",
        "filename": "L-T_{version}-Music.mcpack",
        "url": "https://github.com/Love-and-Tolerance/Music-Addon-Bedrock",
      },
      {
        "name": "Holiday Addon",
        "filename": "L-T_{version}-Holiday.mcpack",
        "url":
          "https://github.com/Love-and-Tolerance/Holiday-Textures-Addon-Bedrock",
      },
      {
        "name": "Classic Addon",
        "filename": "L-T_{version}-Classic.mcpack",
        "url":
          "https://github.com/Love-and-Tolerance/Classic-Textures-Addon-Bedrock",
      },
      {
        "name": "Bronydog Addon",
        "filename": "L-T_{version}-Bronydog.mcpack",
        "url":
          "https://github.com/Love-and-Tolerance/Bronydog-Textures-Addon-Bedrock",
      },
    ],
  },
};
