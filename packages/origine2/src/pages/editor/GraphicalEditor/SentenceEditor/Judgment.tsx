import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";
import { getArgByKey } from "../utils/getArgByKey";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { extNameMap } from "../../ChooseFile/chooseFileConfig";

export default function Judgment(props: ISentenceEditorProps) {
  const commandKey = props.sentence.commandRaw.trim();
  const isBegins = useValue(props.sentence.content !== "concluded");
  const timerFromArgs = getArgByKey(props.sentence, "timer");
  const timeoutFromArgs = getArgByKey(props.sentence, "timeout");
  const timer = useValue(((timerFromArgs === 0 ? "" : timerFromArgs) ?? "").toString());
  const timeout = useValue(((timeoutFromArgs === 0 ? "" : timeoutFromArgs) ?? "").toString());

  const submit = () => {
    const content = isBegins.value ? "begins" : "concluded";
    const timerValue = isBegins.value ? timer.value : "";
    const timeoutValue = isBegins.value ? timeout.value : "";
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
          <TerreToggle
            title=""
            onChange={(newValue) => {
              isBegins.set(newValue);
              submit();
            }}
            onText={t`开始审判`}
            offText={t`结束审判`}
            isChecked={isBegins.value}
          />
        </CommonOptions>
        {isBegins.value && (
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
              <>
                {timeout.value}
                {"\u00a0"}
                <ChooseFile
                  title={t`选择场景文件`}
                  basePath={["scene"]}
                  selectedFilePath={timeout.value}
                  onChange={(file) => {
                    timeout.set(file?.name ?? "");
                    submit();
                  }}
                  extNames={extNameMap.get("scene")}
                />
              </>
            </CommonOptions>
          </>
        )}
      </div>
    </div>
  );
}
