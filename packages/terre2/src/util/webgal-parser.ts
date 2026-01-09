import SceneParser, {
  ADD_NEXT_ARG_LIST,
  SCRIPT_CONFIG,
} from 'webgal-parser/build/cjs/index.cjs';

const CUSTOM_SCRIPT_CONFIG = [
  { scriptString: 'manopedia', scriptType: 34 },
  { scriptString: 'pediaUpdate', scriptType: 35 },
  { scriptString: 'addItem', scriptType: 36 },
  { scriptString: 'showItem', scriptType: 37 },
  { scriptString: 'clearItem', scriptType: 38 },
  { scriptString: 'presentTheEvidence', scriptType: 39 },
  { scriptString: 'judgment', scriptType: 40 },
  { scriptString: 'refute', scriptType: 41 },
];

export const webgalParser = new SceneParser(
  (assetList) => {
    return;
  },
  (fileName, assetType) => {
    return fileName;
  },
  ADD_NEXT_ARG_LIST,
  [...SCRIPT_CONFIG, ...CUSTOM_SCRIPT_CONFIG],
);
