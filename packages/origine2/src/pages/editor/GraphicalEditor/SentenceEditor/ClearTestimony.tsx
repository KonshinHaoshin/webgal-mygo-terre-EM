import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import CommonTips from "../components/CommonTips";
import { t } from "@lingui/macro";

export default function ClearTestimony(props: ISentenceEditorProps) {
  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={t`清除当前证词展示内容`} />
    </div>
  );
}
