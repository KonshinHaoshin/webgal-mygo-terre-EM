import SceneParser from "webgal-parser";
import type { ConfigItem } from "webgal-parser/build/types/config/scriptConfig";
import {
  normalizeSentenceCommand,
  SCRIPT_CONFIG_EXTENDED,
} from "../packages/origine2/src/utils/webgalScriptConfig";
import { combineSubmitString } from "../packages/origine2/src/utils/combineSubmitString";

const parser = new SceneParser(
  () => undefined,
  (name: string) => name,
  [],
  SCRIPT_CONFIG_EXTENDED as unknown as ConfigItem[],
);

const samples = [
  "manopedia:on; keep",
  "pediaUpdate:; updated",
  "addItem:SAPPHO -custom=kept; note",
  "showItem:SAPPHO; show",
  "clearItem:; clear inventory",
  "presentTheEvidence:ok|fail @SAPPHO; evidence",
  "judgment:begins -timer=13:20:000 -timeout=label_1; court",
  "refute:refute.webm -goto=next; refute",
  "thinking:avatar.png option:label|@back; think",
  'testimony:text -left -refutes={"word":"target"} -colors={"word":"#fff"} -y=400; testimony',
  "clearTestimony:; clear",
];

for (const source of samples) {
  const sentence = normalizeSentenceCommand(
    parser.parse(source, "editing", "editing.txt").sentenceList[0],
  );
  const output = combineSubmitString(
    sentence.commandRaw,
    sentence.content,
    sentence.args,
    [],
    sentence.inlineComment,
  );
  const reparsed = normalizeSentenceCommand(
    parser.parse(output, "editing", "editing.txt").sentenceList[0],
  );
  const preserved =
    sentence.commandRaw === reparsed.commandRaw &&
    sentence.content === reparsed.content &&
    JSON.stringify(sentence.args) === JSON.stringify(reparsed.args) &&
    sentence.inlineComment === reparsed.inlineComment;
  if (!preserved) {
    throw new Error(`round-trip mismatch: ${source} -> ${output}`);
  }
}

console.log(`custom round-trip verified: ${samples.length} commands`);
