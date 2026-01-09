import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";
import ItemIdSelect from "@/pages/editor/GraphicalEditor/components/ItemIdSelect";

function getItemTips(commandKey: string) {
  switch (commandKey) {
    case "addItem":
      return t`将物品加入魔女图鉴`;
    case "showItem":
      return t`展示魔女图鉴中的物品`;
    default:
      return t`编辑魔女图鉴物品`;
  }
}

export default function ItemCommand(props: ISentenceEditorProps) {
  const commandKey = props.sentence.commandRaw.trim();
  const itemId = useValue(props.sentence.content);
  const submit = () => {
    const submitString = combineSubmitString(
      commandKey,
      itemId.value,
      props.sentence.args,
      [],
    );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={getItemTips(commandKey)} />
      <div className={styles.editItem}>
        <CommonOptions title={t`物品 ID`} key="item-id">
          <ItemIdSelect
            value={itemId.value}
            onChange={(newValue) => {
              itemId.set(newValue);
              submit();
            }}
          />
        </CommonOptions>
      </div>
    </div>
  );
}
