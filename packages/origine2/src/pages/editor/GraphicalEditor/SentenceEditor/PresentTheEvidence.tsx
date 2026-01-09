import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";
import ItemIdSelect from "@/pages/editor/GraphicalEditor/components/ItemIdSelect";

function parseEvidenceContent(content: string) {
  const trimmed = content.trim();
  const match = trimmed.match(/^(.*?)(?:\s+@([^\s]+))?$/);
  const main = (match?.[1] ?? "").trim();
  const itemId = (match?.[2] ?? "").trim();
  const separatorIndex = main.indexOf("|");
  if (separatorIndex === -1) {
    return {
      successTarget: main,
      failTarget: "",
      itemId,
    };
  }
  return {
    successTarget: main.slice(0, separatorIndex).trim(),
    failTarget: main.slice(separatorIndex + 1).trim(),
    itemId,
  };
}

export default function PresentTheEvidence(props: ISentenceEditorProps) {
  const commandKey = props.sentence.commandRaw.trim();
  const parsed = parseEvidenceContent(props.sentence.content ?? "");
  const successTarget = useValue(parsed.successTarget);
  const failTarget = useValue(parsed.failTarget);
  const itemId = useValue(parsed.itemId);

  const submit = () => {
    const successValue = successTarget.value.trim();
    const failValue = failTarget.value.trim();
    const itemValue = itemId.value.trim();
    const targetContent = `${successValue}|${failValue}`;
    const content = itemValue ? `${targetContent} @${itemValue}` : targetContent;
    const submitString = combineSubmitString(
      commandKey,
      content,
      props.sentence.args,
      [],
    );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={t`强制弹出魔女图鉴，选择证物后跳转`} />
      <div className={styles.editItem}>
        <CommonOptions title={t`正确触发`} key="evidence-success">
          <input
            value={successTarget.value}
            onChange={(ev) => {
              successTarget.set(ev.target.value ?? "");
            }}
            onBlur={submit}
            className={styles.sayInput}
            placeholder={t`场景文件或标签名`}
            style={{ width: "100%" }}
          />
        </CommonOptions>
        <CommonOptions title={t`错误触发`} key="evidence-fail">
          <input
            value={failTarget.value}
            onChange={(ev) => {
              failTarget.set(ev.target.value ?? "");
            }}
            onBlur={submit}
            className={styles.sayInput}
            placeholder={t`场景文件或标签名`}
            style={{ width: "100%" }}
          />
        </CommonOptions>
        <CommonOptions title={t`证物 ID`} key="evidence-item">
          <ItemIdSelect
            value={itemId.value}
            onChange={(newValue) => {
              itemId.set(newValue);
              submit();
            }}
            placeholder={t`选择证物`}
          />
        </CommonOptions>
      </div>
    </div>
  );
}
