# Server-side resourcepack builder

A pretty simple Deno server for handling building resourcepacks with addons.

## Installation

1. Clone this repo
2. Install [Deno](https://deno.land/#installation)
3. And simply run the server:

```bash
./clean-run.sh
```

## Running the server

You may want to run the server by running `./clean-run.sh` for the first time but after that you should use two other scripts: `./pull.sh` and `./run.sh`.

- `./pull.sh` generates the addons tree and pulls the repos code using data from `data/assets/java.ts`. Also cleans archives cache located in `addons/packed`.
- `./run.sh` just runs the server.
- `./clean-run.sh` updates your local clone of this repo, cleans the addons tree and runs the server

## Endpoints

- `/resourcepacks/assets/bedrock.json` - return info about Bedrock Edition addons.
- `/resourcepacks/assets/java.json` - return info about Java Edition addons.
- `/resourcepacks/java/:filename` - builds the pack, caches the result and returns it.

## Addons tree

Addons resources are stored on file system using this path template: `addons/raw/{addon.id_pos}/{variant.id}`
