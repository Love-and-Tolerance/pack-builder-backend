import { Assets, JavaAddon } from "./types.ts";

export const ASSETS: Assets<JavaAddon> = {
  "repos": {
    "base": {
      "mc_versions": "1.19",
      "pack_format": "9",
      "tag": "1.2.0",
      "release_url":
        "https://github.com/Love-and-Tolerance/Love-and-Tolerance/releases/download/{tag}/{filename}",
      "version": "1.2.0-format.9",
      "filename": "L-T_{version}-{ids}.zip",
      "url": "https://github.com/Love-and-Tolerance/Love-and-Tolerance",
    },
    "addons": [
      {
        "name": "Seasonal",
        "id_pos": 1,
        "default": "x",
        "variants": [
          {
            "name": "None",
            "id": "x",
          },
          {
            "name": "Autumn",
            "id": "a",
            "url": "https://github.com/Love-and-Tolerance/Autumn-Addon",
          },
          {
            "name": "Spring",
            "id": "s",
            "url": "https://github.com/Love-and-Tolerance/Spring-Addon",
          },
          {
            "name": "Winter",
            "id": "w",
            "url": "https://github.com/Love-and-Tolerance/Winter-Addon",
          },
        ],
      },
      {
        "name": "Music",
        "id_pos": 2,
        "default": "a",
        "variants": [
          { "name": "None", "id": "x" },
          {
            "name": "Side A",
            "id": "a",
            "pack.png":
              "https://raw.githubusercontent.com/Love-and-Tolerance/pack-release-builder/mane/assets/pack-music-a.png",
            "description":
              "Side A of the music disc's for the Love & Tolerance resource pack.",
          },
          {
            "name": "Side B",
            "id": "b",
            "url": "https://github.com/Love-and-Tolerance/Music-side-B",
          },
        ],
      },
      {
        "name": "3D models",
        "id_pos": 3,
        "default": "s",
        "variants": [
          { "name": "None", "id": "x" },
          {
            "name": "Simple",
            "id": "s",
            "branch": "simple",
            "url": "https://github.com/Love-and-Tolerance/3d-Models-Addon",
          },
          {
            "name": "Complex",
            "id": "c",
            "branch": "complex",
            "url": "https://github.com/Love-and-Tolerance/3d-Models-Addon",
          },
        ],
      },
      {
        "name": "Holiday",
        "id_pos": 4,
        "default": "x",
        "variants": [
          { "name": "None", "id": "x" },
          {
            "name": "Hearts & Hooves",
            "id": "h",
            "url":
              "https://github.com/Love-and-Tolerance/Hearts-and-Hooves-Addon",
          },
          {
            "name": "Nightmare Night",
            "id": "n",
            "url":
              "https://github.com/Love-and-Tolerance/Nightmare-Night-Addon",
          },
        ],
      },
      {
        "name": "Classic",
        "id_pos": 5,
        "default": "x",
        "variants": [
          { "name": "None", "id": "x" },
          {
            "name": "Classic",
            "id": "c",
            "url":
              "https://github.com/Love-and-Tolerance/Classic-Textures-Addon",
          },
        ],
      },
      {
        "name": "Bronydog",
        "id_pos": 6,
        "default": "x",
        "variants": [
          { "name": "None", "id": "x" },
          {
            "name": "Bronydog",
            "id": "b",
            "url":
              "https://github.com/Love-and-Tolerance/Bronydog-Textures-Addon",
          },
        ],
      },
    ],
  },
};