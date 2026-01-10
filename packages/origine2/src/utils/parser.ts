import SceneParser from "webgal-parser";
import type { ConfigItem } from "webgal-parser/build/types/config/scriptConfig";
import { IScene } from "webgal-parser/src/interface/sceneInterface";
import { logger } from "./logger";
import { ADD_NEXT_ARG_LIST } from "webgal-parser/src/config/scriptConfig";
import {
  normalizeSentenceCommand,
  SCRIPT_CONFIG_EXTENDED,
} from "./webgalScriptConfig";

const parser = new SceneParser((assetList) => {
}, (fileName, assetType) => {
  return fileName;
}, ADD_NEXT_ARG_LIST, SCRIPT_CONFIG_EXTENDED as unknown as ConfigItem[]);

/**
 * 场景解析器
 * @param rawScene 原始场景
 * @param sceneName 场景名称
 * @param sceneUrl 场景url
 * @return {IScene} 解析后的场景
 */
export const sceneParser = (rawScene: string, sceneName: string, sceneUrl: string): IScene => {
  const parsedScene = parser.parse(rawScene, sceneName, sceneUrl);
  const sentenceList = parsedScene.sentenceList.map(normalizeSentenceCommand);
  logger.info(`解析场景：${sceneName}，数据为：`, parsedScene);
  return {
    ...parsedScene,
    sentenceList,
  };
};
