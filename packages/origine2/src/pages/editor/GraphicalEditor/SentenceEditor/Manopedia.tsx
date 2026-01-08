import CommonOptions from "../components/CommonOption";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";

export default function Manopedia(props: ISentenceEditorProps) {
  const isShowManopedia = useValue(props.sentence.content !== "off");
  const submit = () => {
    const submitString = combineSubmitString(
      props.sentence.commandRaw,
      isShowManopedia.value ? "on" : "off",
      props.sentence.args,
      [],
    );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <div className={styles.editItem}>
        <CommonOptions key="manopedia" title={t`魔女图鉴显示`}>
          <TerreToggle
            title=""
            onChange={(newValue) => {
              isShowManopedia.set(newValue);
              submit();
            }}
            onText={t`显示魔女图鉴`}
            offText={t`隐藏魔女图鉴`}
            isChecked={isShowManopedia.value}
          />
        </CommonOptions>
      </div>
    </div>
  );
}
