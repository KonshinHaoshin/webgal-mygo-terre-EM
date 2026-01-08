import SceneParser from "webgal-parser";
import { logger } from "../../../utils/logger";
import { IScene } from "webgal-parser/src/interface/sceneInterface";
import {
  normalizeSentenceCommand,
  SCRIPT_CONFIG_EXTENDED,
} from "../../../utils/webgalScriptConfig";

export const WebgalParser = new SceneParser(() => {
}, (fileName, assetType) => {
  return fileName;
}, [], SCRIPT_CONFIG_EXTENDED);
/**
 * 场景解析器 - 编辑器版
 * @param rawScene 原始场景
 * @return {IScene} 解析后的场景
 */
export const parseScene = (rawScene: string): IScene => {
  const parsedScene = WebgalParser.parse(rawScene, 'editing', 'editing.txt');
  const sentenceList = parsedScene.sentenceList.map(normalizeSentenceCommand);
  logger.info(`解析场景：${'editing'}，数据为：`, parsedScene);
  return {
    ...parsedScene,
    sentenceList,
  };
};
