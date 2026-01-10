import { type ISentence, type commandType } from "webgal-parser/src/interface/sceneInterface";
import { type ConfigItem, SCRIPT_CONFIG } from "webgal-parser/src/config/scriptConfig";

export const CUSTOM_COMMAND_TYPES = {
  manopedia: 34,
  pediaUpdate: 35,
  addItem: 36,
  showItem: 37,
  clearItem: 38,
  presentTheEvidence: 39,
  judgment: 40,
  refute: 41,
  thinking: 42,
  testimony: 43,
  clearTestimony: 44,
} as const;

export type CustomCommandType = (typeof CUSTOM_COMMAND_TYPES)[keyof typeof CUSTOM_COMMAND_TYPES];
export type ExtendedCommandType = commandType | CustomCommandType;

export const CUSTOM_SCRIPT_CONFIG: Array<{
  scriptString: string;
  scriptType: CustomCommandType;
}> = [
  { scriptString: "manopedia", scriptType: CUSTOM_COMMAND_TYPES.manopedia },
  { scriptString: "pediaUpdate", scriptType: CUSTOM_COMMAND_TYPES.pediaUpdate },
  { scriptString: "addItem", scriptType: CUSTOM_COMMAND_TYPES.addItem },
  { scriptString: "showItem", scriptType: CUSTOM_COMMAND_TYPES.showItem },
  { scriptString: "clearItem", scriptType: CUSTOM_COMMAND_TYPES.clearItem },
  {
    scriptString: "presentTheEvidence",
    scriptType: CUSTOM_COMMAND_TYPES.presentTheEvidence,
  },
  { scriptString: "judgment", scriptType: CUSTOM_COMMAND_TYPES.judgment },
  { scriptString: "refute", scriptType: CUSTOM_COMMAND_TYPES.refute },
  { scriptString: "thinking", scriptType: CUSTOM_COMMAND_TYPES.thinking },
  { scriptString: "testimony", scriptType: CUSTOM_COMMAND_TYPES.testimony },
  {
    scriptString: "clearTestimony",
    scriptType: CUSTOM_COMMAND_TYPES.clearTestimony,
  },
];

export const SCRIPT_CONFIG_EXTENDED = [
  ...SCRIPT_CONFIG,
  ...CUSTOM_SCRIPT_CONFIG,
] as unknown as ConfigItem[];

const CUSTOM_COMMAND_MAP = new Map(
  CUSTOM_SCRIPT_CONFIG.map((config) => [config.scriptString, config.scriptType]),
);

export function normalizeSentenceCommand(sentence: ISentence): ISentence {
  const commandKey = sentence.commandRaw.trim();
  const overrideType = CUSTOM_COMMAND_MAP.get(commandKey);
  if (
    overrideType === undefined ||
    (sentence.command as number) === overrideType
  ) {
    return sentence;
  }

  const args = sentence.args.filter((arg) => arg.key !== "speaker");
  return {
    ...sentence,
    command: overrideType as commandType,
    args,
  };
}
