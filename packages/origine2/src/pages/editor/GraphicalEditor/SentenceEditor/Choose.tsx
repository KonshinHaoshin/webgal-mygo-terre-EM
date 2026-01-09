import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import { cloneDeep } from "lodash";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { Button } from "@fluentui/react-components";
import {t} from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";
import { extNameMap } from "../../ChooseFile/chooseFileConfig";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";

type ChooseItem = {
  label: string;
  target: string;
  skeleton: boolean;
};

function parseChooseItems(content: string): ChooseItem[] {
  if (!content.trim()) {
    return [];
  }
  return content.split("|").map((item) => {
    const trimmed = item.trim();
    const colonIndex = trimmed.indexOf(":");
    const label = colonIndex === -1 ? trimmed : trimmed.slice(0, colonIndex).trim();
    let targetRaw = colonIndex === -1 ? "" : trimmed.slice(colonIndex + 1);
    let skeleton = false;
    if (targetRaw.includes("@skeleton")) {
      skeleton = true;
      targetRaw = targetRaw.replace(/\s*@skeleton\s*/g, " ");
    }
    const target = targetRaw.trim();
    return {
      label,
      target,
      skeleton,
    };
  });
}

function formatChooseItems(items: ChooseItem[]): string {
  return items
    .map((item) => {
      const skeletonSuffix = item.skeleton ? " @skeleton" : "";
      return `${item.label}:${item.target}${skeletonSuffix}`;
    })
    .join("|");
}

export default function Choose(props: ISentenceEditorProps) {
  const chooseItems = useValue(parseChooseItems(props.sentence.content));

  const submit = () => {
    const contentStr = formatChooseItems(chooseItems.value);
    const submitString = combineSubmitString(
      props.sentence.commandRaw,
      contentStr,
      props.sentence.args,
      [],
    );
    props.onSubmit(submitString);
  };

  const chooseList = chooseItems.value.map((item, i) => {
    return <div style={{ display: "flex", width:'100%', alignItems: "center", padding:'0 0 4px 0', gap: "6px" }} key={i}>
      <Button
        onClick={()=>{
          const newList = cloneDeep(chooseItems.value);
          newList.splice(i,1);
          chooseItems.set(newList);
          submit();
        }}
      >
        {t`删除本句`}
      </Button>
      <input value={item.label}
        onChange={(ev) => {
          const newValue = ev.target.value;
          const newList = cloneDeep(chooseItems.value);
          newList[i].label = newValue;
          chooseItems.set(newList);
        }}
        onBlur={submit}
        className={styles.sayInput}
        placeholder={t`选项名称`}
        style={{ width: "40%" }}
      />
      {
        item.target + "\u00a0"
      }
      <ChooseFile title={t`选择场景文件`} basePath={['scene']} selectedFilePath={item.target} onChange={(newFile) => {
        const newValue = newFile?.name ?? "";
        const newList = cloneDeep(chooseItems.value);
        newList[i].target = newValue;
        chooseItems.set(newList);
        submit();
      }} extNames={extNameMap.get('scene')} />
      <TerreToggle
        title=""
        onChange={(newValue) => {
          const newList = cloneDeep(chooseItems.value);
          newList[i].skeleton = newValue;
          chooseItems.set(newList);
          submit();
        }}
        onText={t`骷髅`}
        offText={t`正常`}
        isChecked={item.skeleton}
      />
    </div>;
  });
  return <div className={styles.sentenceEditorContent}>
    {chooseList}
    <Button
      onClick={() => {
        const newList = cloneDeep(chooseItems.value);
        newList.push({ label: t`选项`, target: t`选择场景文件`, skeleton: false });
        chooseItems.set(newList);
        submit();
      }}>
      {t`添加语句`}
    </Button>
  </div>;
}
