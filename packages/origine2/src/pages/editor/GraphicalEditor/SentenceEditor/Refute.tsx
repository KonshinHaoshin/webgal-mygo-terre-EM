import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";
import { getArgByKey } from "../utils/getArgByKey";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { extNameMap } from "../../ChooseFile/chooseFileConfig";

export default function Refute(props: ISentenceEditorProps) {
  const commandKey = props.sentence.commandRaw.trim();
  const refuteFile = useValue(props.sentence.content);
  const gotoFromArgs = getArgByKey(props.sentence, "goto");
  const gotoTarget = useValue(((gotoFromArgs === 0 ? "" : gotoFromArgs) ?? "").toString());

  const submit = () => {
    const submitString = combineSubmitString(
      commandKey,
      refuteFile.value,
      props.sentence.args,
      [{ key: "goto", value: gotoTarget.value }],
    );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={t`播放反驳素材并跳转`} />
      <div className={styles.editItem}>
        <CommonOptions title={t`反驳素材`} key="refute-file">
          <>
            {refuteFile.value}
            {"\u00a0"}
            <ChooseFile
              title={t`选择素材文件`}
              basePath={["figure"]}
              selectedFilePath={refuteFile.value}
              onChange={(file) => {
                refuteFile.set(file?.name ?? "");
                submit();
              }}
              extNames={[
                ...(extNameMap.get("video") ?? []),
                ...(extNameMap.get("image") ?? []),
              ]}
            />
          </>
        </CommonOptions>
        <CommonOptions title={t`跳转目标`} key="refute-goto">
          <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}>
            <input
              value={gotoTarget.value}
              onChange={(ev) => {
                gotoTarget.set(ev.target.value ?? "");
              }}
              onBlur={submit}
              className={styles.sayInput}
              placeholder={t`场景文件或标签名`}
              style={{ width: "100%" }}
            />
            <ChooseFile
              title={t`选择场景文件`}
              basePath={["scene"]}
              selectedFilePath={gotoTarget.value}
              onChange={(file) => {
                gotoTarget.set(file?.name ?? "");
                submit();
              }}
              extNames={extNameMap.get("scene")}
            />
          </div>
        </CommonOptions>
      </div>
    </div>
  );
}
