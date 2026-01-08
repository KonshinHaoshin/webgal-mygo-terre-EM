import { ISentence } from "webgal-parser/src/interface/sceneInterface";
import { SCRIPT_CONFIG } from "webgal-parser/src/config/scriptConfig";

export const CUSTOM_COMMAND_TYPES = {
  manopedia: 34,
} as const;

export const CUSTOM_SCRIPT_CONFIG = [
  { scriptString: "manopedia", scriptType: CUSTOM_COMMAND_TYPES.manopedia },
];

export const SCRIPT_CONFIG_EXTENDED = [
  ...SCRIPT_CONFIG,
  ...CUSTOM_SCRIPT_CONFIG,
];

const CUSTOM_COMMAND_MAP = new Map(
  CUSTOM_SCRIPT_CONFIG.map((config) => [config.scriptString, config.scriptType]),
);

export function normalizeSentenceCommand(sentence: ISentence): ISentence {
  const commandKey = sentence.commandRaw.trim();
  const overrideType = CUSTOM_COMMAND_MAP.get(commandKey);
  if (overrideType === undefined || sentence.command === overrideType) {
    return sentence;
  }

  const args = sentence.args.filter((arg) => arg.key !== "speaker");
  return {
    ...sentence,
    command: overrideType,
    args,
  };
}
