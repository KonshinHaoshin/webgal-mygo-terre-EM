import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import CommonTips from "../components/CommonTips";
import { t } from "@lingui/macro";

export default function PediaUpdate(props: ISentenceEditorProps) {
  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={t`此指令将显示魔女图鉴更新`} />
    </div>
  );
}
