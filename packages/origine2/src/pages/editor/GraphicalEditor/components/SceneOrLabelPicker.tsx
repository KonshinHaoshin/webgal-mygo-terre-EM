import { t } from "@lingui/macro";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { extNameMap } from "../../ChooseFile/chooseFileConfig";
import styles from "../SentenceEditor/sentenceEditor.module.scss";

interface SceneOrLabelPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  chooseTitle?: string;
}

export default function SceneOrLabelPicker({
  value,
  onValueChange,
  onSubmit,
  placeholder,
  chooseTitle,
}: SceneOrLabelPickerProps) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}>
      <input
        value={value}
        onChange={(ev) => {
          onValueChange(ev.target.value ?? "");
        }}
        onBlur={onSubmit}
        className={styles.sayInput}
        placeholder={placeholder ?? t`场景文件或标签名`}
        style={{ width: "100%" }}
      />
      <div style={{ flexShrink: 0 }}>
        <ChooseFile
          title={chooseTitle ?? t`选择场景文件`}
          basePath={["scene"]}
          selectedFilePath={value}
          onChange={(file) => {
            onValueChange(file?.name ?? "");
            onSubmit?.();
          }}
          extNames={extNameMap.get("scene")}
        />
      </div>
    </div>
  );
}
