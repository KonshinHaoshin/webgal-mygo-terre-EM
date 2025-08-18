import CommonOptions from "../components/CommonOption";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { useValue } from "@/hooks/useValue";
import { getArgByKey } from "../utils/getArgByKey";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";
import { useEffect, useState } from "react";
import { EffectEditor } from "@/pages/editor/GraphicalEditor/components/EffectEditor";
import CommonTips from "@/pages/editor/GraphicalEditor/components/CommonTips";
import axios from "axios";
import { TerrePanel } from "@/pages/editor/GraphicalEditor/components/TerrePanel";
import { Button, Input } from "@fluentui/react-components";
import useEditorStore from "@/store/useEditorStore";
import { t } from "@lingui/macro";
import WheelDropdown from "@/pages/editor/GraphicalEditor/components/WheelDropdown";
import { combineSubmitString } from "@/utils/combineSubmitString";
import { extNameMap } from "../../ChooseFile/chooseFileConfig";
import SearchableCascader from "@/pages/editor/GraphicalEditor/components/SearchableCascader";
import { useEaseTypeOptions } from "@/hooks/useEaseTypeOptions";

type FigurePosition = "" | "left" | "right";
type AnimationFlag = "" | "on";
type LoopMode = "true" | "false" | "disappear";

// eslint-disable-next-line complexity
export default function ChangeFigure(props: ISentenceEditorProps) {
  const gameDir = useEditorStore.use.subPage();
  const updateExpand = useEditorStore.use.updateExpand();

  const isGoNext = useValue(!!getArgByKey(props.sentence, "next"));
  const figureFile = useValue(props.sentence.content);
  const figurePosition = useValue<FigurePosition>("");
  const isNoFile = props.sentence.content === "";
  const id = useValue(getArgByKey(props.sentence, "id").toString() ?? "");
  const json = useValue<string>(getArgByKey(props.sentence, "transform") as string);
  const duration = useValue<number | string>(getArgByKey(props.sentence, "duration") as number);

  const mouthOpen = useValue(getArgByKey(props.sentence, "mouthOpen").toString() ?? "");
  const mouthHalfOpen = useValue(getArgByKey(props.sentence, "mouthHalfOpen").toString() ?? "");
  const mouthClose = useValue(getArgByKey(props.sentence, "mouthClose").toString() ?? "");
  const eyesOpen = useValue(getArgByKey(props.sentence, "eyesOpen").toString() ?? "");
  const eyesClose = useValue(getArgByKey(props.sentence, "eyesClose").toString() ?? "");
  const animationFlag = useValue(getArgByKey(props.sentence, "animationFlag").toString() ?? "");
  const bounds = useValue(getArgByKey(props.sentence, "bounds").toString() ?? "");
  const zIndex = useValue(String(getArgByKey(props.sentence, "zIndex") ?? ""));
  const loopMode = useValue<LoopMode>(
    ((getArgByKey(props.sentence, "loop") as string) || "true") as LoopMode
  );

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [l2dMotionsList, setL2dMotionsList] = useState<string[]>([]);
  const [l2dExpressionsList, setL2dExpressionsList] = useState<string[]>([]);
  const [isSpineJsonFormat, setIsSpineJsonFormat] = useState(false);
  const [isJsonlFormat, setIsJsonlFormat] = useState(false);

  const currentMotion = useValue(getArgByKey(props.sentence, "motion").toString() ?? "");
  const currentExpression = useValue(getArgByKey(props.sentence, "expression").toString() ?? "");

  const figurePositions = new Map<FigurePosition, string>([
    ["", t`中间`],
    ["left", t`左侧`],
    ["right", t`右侧`],
  ]);

  const animationFlags = new Map<AnimationFlag, string>([
    ["", "OFF"],
    ["on", "ON"],
  ]);
  const loopModes = new Map<LoopMode, string>([
    ["true",     t`循环播放`],
    ["false",    t`播放一次并停在最后一帧`],
    ["disappear",t`播放一次后消失`],
  ]);

  const ease = useValue(getArgByKey(props.sentence, "ease").toString() ?? "");
  const easeTypeOptions = useEaseTypeOptions();

  const isJsonlPath = (p: string) => p?.toLowerCase()?.endsWith(".jsonl");

  const isVideoLike = (p: string) => {
    const s = (p || "").toLowerCase();
    return s.endsWith(".webm") || s.endsWith(".mp4") || s.endsWith(".mov") || s.endsWith(".gif");
  };

  function parseJsonlSummary(text: string): { motions: string[]; expressions: string[] } {
    const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const obj = JSON.parse(lines[i]);
        if (obj && (obj.motions || obj.expressions)) {
          let motions: string[] = [];
          if (Array.isArray(obj.motions)) motions = obj.motions.map(String);
          else if (obj.motions && typeof obj.motions === "object") motions = Object.keys(obj.motions);

          let expressions: string[] = [];
          if (Array.isArray(obj.expressions)) expressions = obj.expressions.map(String);
          else if (obj.expressions && typeof obj.expressions === "object") expressions = Object.keys(obj.expressions);

          // 去重 + 排序
          motions = Array.from(new Set(motions)).sort((a, b) => a.localeCompare(b));
          expressions = Array.from(new Set(expressions)).sort((a, b) => a.localeCompare(b));

          return { motions, expressions };
        }
      } catch {
        // ignore this line
      }
    }
    return { motions: [], expressions: [] };
  }

  // 载入 motions / expressions（支持 .jsonl / .json / spine）
  useEffect(() => {
    // reset
    setIsJsonlFormat(false);
    setIsSpineJsonFormat(false);
    setL2dMotionsList([]);
    setL2dExpressionsList([]);

    const pathRaw = figureFile.value || "";
    const pathLower = pathRaw.toLowerCase();

    if (!pathRaw || pathRaw === "none") return;

    // JSONL
    if (isJsonlPath(pathRaw)) {
      setIsJsonlFormat(true);
      const url = `/games/${gameDir}/game/figure/${pathRaw}`;
      axios
        .get(url, { responseType: "text" })
        .then((resp) => {
          const { motions, expressions } = parseJsonlSummary(resp.data || "");
          setL2dMotionsList(motions);
          setL2dExpressionsList(expressions);
        })
        .catch(() => {
          setL2dMotionsList([]);
          setL2dExpressionsList([]);
        });
      return;
    }

    // JSON（Live2D v2/v3 或 Spine JSON）
    if (pathLower.endsWith(".json") || pathLower.includes(".json?")) {
      const url = `/games/${gameDir}/game/figure/${pathRaw}`;
      axios.get(url).then((resp) => {
        const data = resp.data;

        // Spine JSON
        if (data?.animations) {
          setIsSpineJsonFormat(true);
          const animations = Object.keys(data.animations || {});
          setL2dMotionsList(animations.sort((a, b) => a.localeCompare(b)));
          setL2dExpressionsList([]); // Spine 没有表情
          return;
        }

        // Live2D v2
        if (data?.motions) {
          const motions = Object.keys(data.motions);
          setL2dMotionsList(motions.sort((a, b) => a.localeCompare(b)));
        }
        if (data?.expressions) {
          const exps: string[] = (data.expressions as Array<{ name: string }>)?.map((e) => e.name);
          setL2dExpressionsList((exps || []).sort((a, b) => a.localeCompare(b)));
        }

        // Live2D v3
        if (data?.["FileReferences"]?.["Motions"]) {
          const motions = Object.keys(data["FileReferences"]["Motions"]);
          setL2dMotionsList(motions.sort((a, b) => a.localeCompare(b)));
        }
        if (data?.["FileReferences"]?.["Expressions"]) {
          const exps: string[] = (data["FileReferences"]["Expressions"] as Array<{ Name: string }>)?.map(
            (e) => e.Name
          );
          setL2dExpressionsList((exps || []).sort((a, b) => a.localeCompare(b)));
        }
      });
    }
  }, [figureFile.value, gameDir]);

  useEffect(() => {
    // 初始化立绘位置
    if (getArgByKey(props.sentence, "left")) {
      figurePosition.set("left");
    }
    if (getArgByKey(props.sentence, "right")) {
      figurePosition.set("right");
    }
  }, []);

  useEffect(() => {
    setIsAccordionOpen(animationFlag.value === "on");
  }, [animationFlag.value]);

  const submit = () => {
    const submitString = combineSubmitString(
      props.sentence.commandRaw,
      figureFile.value,
      props.sentence.args,
      [
        { key: "left", value: figurePosition.value === "left" },
        { key: "right", value: figurePosition.value === "right" },
        { key: "id", value: id.value },
        { key: "transform", value: json.value },
        { key: "duration", value: duration.value },

        ...(animationFlag.value !== ""
          ? [
            { key: "animationFlag", value: animationFlag.value },
            { key: "eyesOpen", value: eyesOpen.value },
            { key: "eyesClose", value: eyesClose.value },
            { key: "mouthOpen", value: mouthOpen.value },
            { key: "mouthHalfOpen", value: mouthHalfOpen.value },
            { key: "mouthClose", value: mouthClose.value },
          ]
          : [
            { key: "animationFlag", value: "" },
            { key: "eyesOpen", value: "" },
            { key: "eyesClose", value: "" },
            { key: "mouthOpen", value: "" },
            { key: "mouthHalfOpen", value: "" },
            { key: "mouthClose", value: "" },
          ]),

        { key: "motion", value: currentMotion.value },
        { key: "expression", value: currentExpression.value },
        { key: "bounds", value: bounds.value },
        { key: "ease", value: ease.value },
        { key: "zIndex", value: zIndex.value },
        { key: "loop", value: loopMode.value },
        { key: "next", value: isGoNext.value },
      ]
    );
    props.onSubmit(submitString);
  };

  // 是否展示动作/表情区域：json / jsonl / spine
  const fileLower = (figureFile.value || "").toLowerCase();
  const isModelMetaFile =
      fileLower.endsWith(".json") || fileLower.endsWith(".jsonl") || fileLower.includes(".json?");

  return (
    <div className={styles.sentenceEditorContent}>
      <div className={styles.editItem}>
        <CommonOptions key="isNoDialog" title={t`关闭立绘`}>
          <TerreToggle
            title=""
            onChange={(newValue) => {
              if (!newValue) {
                figureFile.set(t`选择立绘文件`);
              } else figureFile.set("none");
              submit();
            }}
            onText={t`关闭立绘`}
            offText={t`显示立绘`}
            isChecked={isNoFile}
          />
        </CommonOptions>

        {!isNoFile && (
          <CommonOptions key="1" title={t`立绘文件`}>
            <>
              {figureFile.value + "\u00a0\u00a0"}
              <ChooseFile
                title={t`选择立绘文件`}
                basePath={["figure"]}
                selectedFilePath={figureFile.value}
                onChange={(fileDesc) => {
                  figureFile.set(fileDesc?.name ?? "");
                  submit();
                }}
                // 允许 .jsonl
                extNames={[...(extNameMap.get("image") ?? []), ...(extNameMap.get("json") ?? []), ".jsonl"]}
              />
            </>
          </CommonOptions>
        )}

        <CommonOptions key="2" title={t`连续执行`}>
          <TerreToggle
            title=""
            onChange={(newValue) => {
              isGoNext.set(newValue);
              submit();
            }}
            onText={t`本句执行后执行下一句`}
            offText={t`本句执行后等待`}
            isChecked={isGoNext.value}
          />
        </CommonOptions>

        <CommonOptions title={t`z-index`} key="z-index">
          <input
            value={zIndex.value}
            onChange={(ev) => {
              const newValue = ev.target.value;
              zIndex.set(newValue ?? "");
            }}
            onBlur={submit}
            className={styles.sayInput}
            placeholder={t`1, 2, 3, ...`}
            style={{ width: "100%" }}
          />
        </CommonOptions>

        {!isNoFile && isVideoLike(figureFile.value) && (
          <CommonOptions title={t`循环模式（仅视频/GIF 立绘）`} key="loop-mode">
            <WheelDropdown
              options={loopModes}
              value={loopMode.value}
              onValueChange={(newValue) => {
                loopMode.set((newValue?.toString() as LoopMode) ?? "true");
                submit();
              }}
            />
          </CommonOptions>
        )}

        {isModelMetaFile && (
          <>
            <CommonOptions
              key="24"
              title={isSpineJsonFormat ? t`Spine 动画` : isJsonlFormat ? t`JSONL 动作` : t`Live2D 动作`}
            >
              <SearchableCascader
                optionList={l2dMotionsList}
                value={currentMotion.value}
                onValueChange={(newValue) => {
                  newValue && currentMotion.set(newValue);
                  submit();
                }}
              />
            </CommonOptions>

            {!isSpineJsonFormat && (
              <CommonOptions key="25" title={isJsonlFormat ? t`JSONL 表情` : t`Live2D 表情`}>
                <SearchableCascader
                  optionList={l2dExpressionsList}
                  value={currentExpression.value}
                  onValueChange={(newValue) => {
                    newValue && currentExpression.set(newValue);
                    submit();
                  }}
                />
              </CommonOptions>
            )}

            <CommonOptions title={isJsonlFormat ? t`自定义绘制范围` : t`自定义 Live2D 绘制范围`} key="bounds">
              <input
                value={bounds.value}
                onChange={(ev) => {
                  const newValue = ev.target.value;
                  bounds.set(newValue ?? "");
                }}
                onBlur={submit}
                className={styles.sayInput}
                placeholder={t`例如：-100,-100,100,100`}
                style={{ width: "100%" }}
              />
            </CommonOptions>
          </>
        )}

        <CommonOptions title={t`立绘位置`} key="3">
          <WheelDropdown
            options={figurePositions}
            value={figurePosition.value}
            onValueChange={(newValue) => {
              figurePosition.set((newValue?.toString() as FigurePosition) ?? "");
              submit();
            }}
          />
        </CommonOptions>

        <CommonOptions title={t`立绘ID（可选）`} key="4">
          <input
            value={id.value}
            onChange={(ev) => {
              const newValue = ev.target.value;
              id.set(newValue ?? "");
            }}
            onBlur={submit}
            className={styles.sayInput}
            placeholder={t`立绘 ID`}
            style={{ width: "100%" }}
          />
        </CommonOptions>

        <CommonOptions key="5" title={t`缓动类型`}>
          <WheelDropdown
            options={easeTypeOptions}
            value={ease.value}
            onValueChange={(newValue) => {
              ease.set(newValue?.toString() ?? "");
              submit();
            }}
          />
        </CommonOptions>

        <CommonOptions key="23" title={t`显示效果`}>
          <Button
            onClick={() => {
              updateExpand(props.index);
            }}
          >
            {t`打开效果编辑器`}
          </Button>
        </CommonOptions>

        <TerrePanel
          title={t`效果编辑器`}
          sentenceIndex={props.index}
          bottomBarChildren={[
            <CommonOptions key="10" title={t`过渡时间（单位为毫秒）`}>
              <div>
                <Input
                  placeholder={t`过渡时间（单位为毫秒）`}
                  value={duration.value.toString()}
                  onChange={(_, data) => {
                    const newDuration = Number(data.value);
                    if (isNaN(newDuration) || data.value === "") duration.set("");
                    else duration.set(newDuration);
                  }}
                  onBlur={submit}
                />
              </div>
            </CommonOptions>,
            <CommonOptions title={t`唇形同步与眨眼`} key="5">
              <WheelDropdown
                options={animationFlags}
                value={animationFlag.value}
                onValueChange={(newValue) => {
                  animationFlag.set(newValue?.toString() ?? "");
                  submit();
                }}
              />
            </CommonOptions>,
            <div key="mouth-open" style={{ display: animationFlag.value === "on" ? "flex" : "none" }}>
              <CommonOptions key="6" title={t`张开嘴`}>
                <>
                  {mouthOpen.value + "\u00a0\u00a0"}
                  <ChooseFile
                    title={t`选择立绘文件`}
                    basePath={["figure"]}
                    selectedFilePath={mouthOpen.value}
                    onChange={(fileDesc) => {
                      mouthOpen.set(fileDesc?.name ?? "");
                      submit();
                    }}
                    extNames={extNameMap.get("image")}
                  />
                </>
              </CommonOptions>
            </div>,
            <div key="mouth-half-open" style={{ display: animationFlag.value === "on" ? "flex" : "none" }}>
              <CommonOptions key="7" title={t`半张嘴`}>
                <>
                  {mouthHalfOpen.value + "\u00a0\u00a0"}
                  <ChooseFile
                    title={t`选择立绘文件`}
                    basePath={["figure"]}
                    selectedFilePath={mouthHalfOpen.value}
                    onChange={(fileDesc) => {
                      mouthHalfOpen.set(fileDesc?.name ?? "");
                      submit();
                    }}
                    extNames={extNameMap.get("image")}
                  />
                </>
              </CommonOptions>
            </div>,
            <div key="mouth-close" style={{ display: animationFlag.value === "on" ? "flex" : "none" }}>
              <CommonOptions key="8" title={t`闭上嘴`}>
                <>
                  {mouthClose.value + "\u00a0\u00a0"}
                  <ChooseFile
                    title={t`选择立绘文件`}
                    basePath={["figure"]}
                    selectedFilePath={mouthClose.value}
                    onChange={(fileDesc) => {
                      mouthClose.set(fileDesc?.name ?? "");
                      submit();
                    }}
                    extNames={extNameMap.get("image")}
                  />
                </>
              </CommonOptions>
            </div>,
            <div key="eyes-open" style={{ display: animationFlag.value === "on" ? "flex" : "none" }}>
              <CommonOptions key="9" title={t`睁开眼睛`}>
                <>
                  {eyesOpen.value + "\u00a0\u00a0"}
                  <ChooseFile
                    title={t`选择立绘文件`}
                    basePath={["figure"]}
                    selectedFilePath={eyesOpen.value}
                    onChange={(fileDesc) => {
                      eyesOpen.set(fileDesc?.name ?? "");
                      submit();
                    }}
                    extNames={extNameMap.get("image")}
                  />
                </>
              </CommonOptions>
            </div>,
            <div key="eyes-close" style={{ display: animationFlag.value === "on" ? "flex" : "none" }}>
              <CommonOptions key="10" title={t`闭上眼睛`}>
                <>
                  {eyesClose.value + "\u00a0\u00a0"}
                  <ChooseFile
                    title={t`选择立绘文件`}
                    basePath={["figure"]}
                    selectedFilePath={eyesClose.value}
                    onChange={(fileDesc) => {
                      eyesClose.set(fileDesc?.name ?? "");
                      submit();
                    }}
                    extNames={extNameMap.get("image")}
                  />
                </>
              </CommonOptions>
            </div>,
          ]}
        >
          <CommonTips
            text={t`提示：效果只有在切换到不同立绘或关闭之前的立绘再重新添加时生效。如果你要为现有的立绘设置效果，请使用单独的设置效果命令`}
          />
          <EffectEditor
            json={json.value.toString()}
            onChange={(newJson) => {
              json.set(newJson);
              submit();
            }}
          />
        </TerrePanel>
      </div>
    </div>
  );
}
