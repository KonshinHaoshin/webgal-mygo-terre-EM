import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";
import { getArgByKey } from "../utils/getArgByKey";
import WheelDropdown from "../components/WheelDropdown";
import SceneOrLabelPicker from "../components/SceneOrLabelPicker";

export default function Judgment(props: ISentenceEditorProps) {
  const commandKey = props.sentence.commandRaw.trim();
  const initialMode =
    props.sentence.content === "concluded" || props.sentence.content === "exit"
      ? props.sentence.content
      : "begins";
  const mode = useValue(initialMode);
  const modeOptions = new Map<string, string>([
    ["begins", t`开始审判`],
    ["concluded", t`结束审判 (会播放动画)`],
    ["exit", t`退出审判 (不会播放动画)`],
  ]);
  const timerFromArgs = getArgByKey(props.sentence, "timer");
  const timeoutFromArgs = getArgByKey(props.sentence, "timeout");
  const timer = useValue(((timerFromArgs === 0 ? "" : timerFromArgs) ?? "").toString());
  const timeout = useValue(((timeoutFromArgs === 0 ? "" : timeoutFromArgs) ?? "").toString());

  const submit = () => {
    const content = mode.value || "begins";
    const isBeginsMode = content === "begins";
    const timerValue = isBeginsMode ? timer.value : "";
    const timeoutValue = isBeginsMode ? timeout.value : "";
    const submitString = combineSubmitString(
      commandKey,
      content,
      props.sentence.args,
      [
        { key: "timer", value: timerValue },
        { key: "timeout", value: timeoutValue },
      ],
    );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={t`审判流程控制`} />
      <div className={styles.editItem}>
        <CommonOptions title={t`审判状态`} key="judgment-mode">
          <WheelDropdown
            options={modeOptions}
            value={mode.value}
            onValueChange={(newValue) => {
              mode.set(newValue?.toString() ?? "begins");
              submit();
            }}
            style={{ width: "200px" }}
          />
        </CommonOptions>
        {mode.value === "begins" && (
          <>
            <CommonOptions title={t`审判时间`} key="judgment-timer">
              <input
                value={timer.value}
                onChange={(ev) => {
                  timer.set(ev.target.value ?? "");
                }}
                onBlur={submit}
                className={styles.sayInput}
                placeholder={t`例如：13:20:000`}
                style={{ width: "100%" }}
              />
            </CommonOptions>
            <CommonOptions title={t`超时跳转`} key="judgment-timeout">
              <div style={{ width: "260px" }}>
                <SceneOrLabelPicker
                  value={timeout.value}
                  onValueChange={(newValue) => {
                    timeout.set(newValue);
                  }}
                  onSubmit={submit}
                  placeholder={t`跳转场景或标签`}
                  chooseTitle={t`选择场景文件`}
                />
              </div>
            </CommonOptions>
          </>
        )}
      </div>
    </div>
  );
}
