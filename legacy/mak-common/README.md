# WX-COMMON

Common pure Typescript code for Winex. No React/React Native.

## Yarn Linking and package.json

To avoid recompiles and upgrades on client code, use `yarn link`. The documentation is shit, but here's the basic idea:
1. In the root of this project do a `yarn link`. It picks up the name in `package.json` and adds it to the global packages on the Mac.
2. In the client app: `yarn link @winex/ts-common`. BUT make sure the right package.json is being used, specifically the "main" needs to be set to `./src/index.ts` not `./dist/index.js`. That way you won't have to recompile.
3. If there is a need to unlink, do NOT follow the Yarn instructions, they are wrong. Unlink the client first, then this package.

There are 2 `package.jsons` because of this. On that specifies a main and types field as being in the `./dist` and one that does not. If we need to distribute the package outside of linking, use the build version.
