import SceneParser from "webgal-parser";
import type { ConfigItem } from "webgal-parser/build/types/config/scriptConfig";
import { logger } from "../../../utils/logger";
import { IScene } from "webgal-parser/src/interface/sceneInterface";
import { normalizeSentenceCommand, SCRIPT_CONFIG_EXTENDED } from "../../../utils/webgalScriptConfig";


export const WebgalParser = new SceneParser(() => {
}, (fileName, assetType) => {
  return fileName;
}, [], SCRIPT_CONFIG_EXTENDED as unknown as ConfigItem[]);
/**
 * 场景解析器 - 编辑器版
 * @param rawScene 原始场景
 * @return {IScene} 解析后的场景
 */
export const parseScene = (rawScene: string): IScene => {
  const parsedScene = WebgalParser.parse(rawScene, 'editing', 'editing.txt');
  const sentenceList = parsedScene.sentenceList.map(normalizeSentenceCommand);
  if (import.meta.env.DEV) {
    logger.info(`解析场景：${'editing'}，语句数：`, parsedScene.sentenceList.length);
  }
  return { ...parsedScene, sentenceList };
};
