# Official 4.6.4 migration manifest

Frozen upstream: `OpenWebGAL/WebGAL_Terre@40242b8ca504c0e210d8ced5371b635947655c86`.

The `upstream` remote is the official repository. `mygo-source` is provenance-only and must not be merged as upstream.

| Area | Migration result |
| --- | --- |
| Parser extension | Official parser 4.6.3 retained; custom editor-only command IDs use 1001–1011 to avoid official `callSteam=34` and `return=35`. |
| Graphical editor | All custom commands restored on the official 4.6.4 editor architecture. Unknown args and inline comments survive edits. |
| Visual options | Official Spine/Live2D/effect fields retained; Mano type/pose, LUT and legacy blinds controls added. |
| LSP and highlighting | Official multiline/return/local-variable features retained and custom commands/arguments appended. |
| Preview | Official editor-preview protocol retained; deleted legacy websocket protocol files removed. |
| Local engine integration | `WEBGAL_ENGINE_DIR` optionally points to a built engine dist, engine package directory or engine repository. Without it, npm `webgal-engine@4.6.4` remains the default. |
| Templates | The Terre template is regenerated with `update-webgal.ts`; no package or lock-file swapping is required. |

Verification commands:

```text
yarn workspace webgal-origine-2 build
yarn workspace webgal-terre-2 test --runInBand
yarn workspace webgal-terre-2 build
yarn workspace webgal-terre-2 build-standalone
yarn tsx scripts/verify-custom-roundtrip.ts
```

For local integration, set `WEBGAL_ENGINE_DIR` before the Terre build. Example on PowerShell:

```powershell
$env:WEBGAL_ENGINE_DIR='C:\path\to\WebGAL'
yarn workspace webgal-terre-2 build-standalone
```

Interactive loading of a real customized game remains the final release gate.
