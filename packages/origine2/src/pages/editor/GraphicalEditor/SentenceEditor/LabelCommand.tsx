import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";

function getLabelTips(commandKey: string) {
  if (commandKey === "label") {
    return t`创建标签供 jumpLabel 跳转`;
  }
  return t`跳转到指定标签`;
}

export default function LabelCommand(props: ISentenceEditorProps) {
  const commandKey = props.sentence.commandRaw.trim();
  const labelName = useValue(props.sentence.content);

  const submit = () => {
    const submitString = combineSubmitString(
      commandKey,
      labelName.value,
      props.sentence.args,
      [],
    );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={getLabelTips(commandKey)} />
      <div className={styles.editItem}>
        <CommonOptions title={t`标签名`} key="label-name">
          <input
            value={labelName.value}
            onChange={(ev) => {
              labelName.set(ev.target.value ?? "");
            }}
            onBlur={submit}
            className={styles.sayInput}
            placeholder={t`例如：label_1`}
            style={{ width: "100%" }}
          />
        </CommonOptions>
      </div>
    </div>
  );
}
