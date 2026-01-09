import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import CommonTips from "../components/CommonTips";
import { t } from "@lingui/macro";

export default function ClearItem(props: ISentenceEditorProps) {
  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={t`清除魔女图鉴中的所有证物`} />
    </div>
  );
}
