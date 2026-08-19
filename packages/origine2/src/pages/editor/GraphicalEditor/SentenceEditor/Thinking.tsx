import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { t } from "@lingui/macro";
import { useValue } from "../../../../hooks/useValue";
import {
  formatThinkingValue,
  parseThinkingValue,
} from "../components/ThinkingOptionsEditor";
import ThinkingOptionsEditor from "../components/ThinkingOptionsEditor";
import { combineSubmitString } from "@/utils/combineSubmitString";

export default function Thinking(props: ISentenceEditorProps) {
  const thinkingValue = useValue(parseThinkingValue(props.sentence.content));

  const submit = () => {
    const contentStr = formatThinkingValue(thinkingValue.value);
    const submitString = combineSubmitString(
      props.sentence.commandRaw,
      contentStr,
        props.sentence.args,
        [],
        props.sentence.inlineComment,
      );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips
        text={t`提示：每个选项的跳转目标支持场景文件或标签名，思考图片放在thinking文件夹内，选项图标放在thinking_button文件夹内`}
      />
      <div className={styles.editItem}>
        <div style={{ width: "100%" }}>
          <CommonOptions title={t`思考内容`}>
            <ThinkingOptionsEditor
              value={thinkingValue.value}
              onChange={(nextValue) => {
                thinkingValue.set(nextValue);
              }}
              onSubmit={submit}
            />
          </CommonOptions>
        </div>
      </div>
    </div>
  );
}
