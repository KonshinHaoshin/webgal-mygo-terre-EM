import { t } from "@lingui/macro";
import { Button } from "@fluentui/react-components";
import { cloneDeep } from "lodash";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { extNameMap } from "../../ChooseFile/chooseFileConfig";
import SceneOrLabelPicker from "./SceneOrLabelPicker";
import WheelDropdown from "./WheelDropdown";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";
import styles from "../SentenceEditor/sentenceEditor.module.scss";

export interface ThinkingOption {
  text: string;
  target: string;
  icon: string;
  refute: string;
};

export interface ThinkingValue {
  image: string;
  options: ThinkingOption[];
  hasBack: boolean;
};

const BACK_TOKEN = "@back";

function normalizeThinkingRaw(raw: string): string {
  let result = raw.trim();
  if (result.endsWith(";")) {
    result = result.slice(0, -1).trim();
  }
  if (result.startsWith("thinking:")) {
    result = result.slice("thinking:".length).trim();
  }
  return result;
}

function parseOptionMeta(raw: string): { target: string; icon: string; refute: string } {
  const atIndex = raw.indexOf("@");
  const target = (atIndex === -1 ? raw : raw.slice(0, atIndex)).trim();
  const metaPart = atIndex === -1 ? "" : raw.slice(atIndex);
  const iconMatch = metaPart.match(/@icon=([^@]+)/);
  const refuteMatch = metaPart.match(/@refute=([^@]+)/);
  return {
    target,
    icon: iconMatch?.[1]?.trim() ?? "",
    refute: refuteMatch?.[1]?.trim() ?? "",
  };
}

export function parseThinkingValue(raw: string): ThinkingValue {
  const normalized = normalizeThinkingRaw(raw);
  if (!normalized) {
    return { image: "", options: [], hasBack: true };
  }

  const firstSpace = normalized.indexOf(" ");
  const firstPipe = normalized.indexOf("|");
  let delimiterIndex = -1;
  if (firstSpace === -1) {
    delimiterIndex = firstPipe;
  } else if (firstPipe === -1) {
    delimiterIndex = firstSpace;
  } else {
    delimiterIndex = Math.min(firstSpace, firstPipe);
  }

  if (delimiterIndex === -1) {
    return { image: normalized.trim(), options: [], hasBack: true };
  }

  const image = normalized.slice(0, delimiterIndex).trim();
  let optionsPart = normalized.slice(delimiterIndex + 1).trim();
  if (optionsPart.startsWith("|")) {
    optionsPart = optionsPart.slice(1).trim();
  }

  const result: ThinkingValue = {
    image,
    options: [],
    hasBack: false,
  };

  if (!optionsPart) {
    return result;
  }

  optionsPart.split("|").forEach((segment) => {
    const trimmed = segment.trim();
    if (!trimmed) {
      return;
    }
    if (trimmed === BACK_TOKEN) {
      result.hasBack = true;
      return;
    }
    const colonIndex = trimmed.indexOf(":");
    const text = colonIndex === -1 ? trimmed : trimmed.slice(0, colonIndex).trim();
    const metaRaw = colonIndex === -1 ? "" : trimmed.slice(colonIndex + 1);
    const { target, icon, refute } = parseOptionMeta(metaRaw);
    result.options.push({
      text,
      target,
      icon,
      refute,
    });
  });

  return result;
}

export function formatThinkingValue(value: ThinkingValue, includeCommand = false): string {
  const segments = value.options.map((option) => {
    const text = option.text.trim();
    const needsMeta = option.target.trim() || option.icon.trim() || option.refute.trim();
    let segment = text;
    if (needsMeta) {
      segment += `:${option.target.trim()}`;
    }
    if (option.icon.trim()) {
      segment += `@icon=${option.icon.trim()}`;
    }
    if (option.refute.trim()) {
      segment += `@refute=${option.refute.trim()}`;
    }
    return segment;
  });

  if (value.hasBack) {
    segments.push(BACK_TOKEN);
  }

  const optionsPart = segments.filter(Boolean).join("|");
  const content = [value.image.trim(), optionsPart].filter(Boolean).join(" ").trim();
  if (!content) {
    return "";
  }
  if (!includeCommand) {
    return content;
  }
  return `thinking:${content}`.trim();
}

interface ThinkingOptionsEditorProps {
  value: ThinkingValue;
  onChange: (value: ThinkingValue) => void;
  onSubmit?: () => void;
}

export default function ThinkingOptionsEditor({
  value,
  onChange,
  onSubmit,
}: ThinkingOptionsEditorProps) {
  const iconOptions = new Map<string, string>([
    ["", t`无`],
    ["agree.png", t`赞同`],
    ["objection.png", t`反驳`],
    ["perjury.png", t`伪证`],
    ["question.png", t`疑问`],
  ]);

  const updateValue = (nextValue: ThinkingValue, shouldSubmit = false) => {
    onChange(nextValue);
    if (shouldSubmit) {
      onSubmit?.();
    }
  };

  const updateOption = (
    index: number,
    updater: (option: ThinkingOption) => void,
    shouldSubmit = false,
  ) => {
    const nextValue = cloneDeep(value);
    updater(nextValue.options[index]);
    updateValue(nextValue, shouldSubmit);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{t`思考图片`}</span>
        <span>{value.image || t`未选择`}</span>
        <ChooseFile
          title={t`选择思考图片`}
          basePath={["figure"]}
          selectedFilePath={value.image}
          onChange={(fileDesc) => {
            const nextValue = cloneDeep(value);
            nextValue.image = fileDesc?.name ?? "";
            updateValue(nextValue, true);
          }}
          extNames={extNameMap.get("image")}
        />
        {value.image && (
          <Button
            onClick={() => {
              const nextValue = cloneDeep(value);
              nextValue.image = "";
              updateValue(nextValue, true);
            }}
          >
            {t`清除`}
          </Button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {value.options.map((option, index) => (
          <div
            key={`thinking-option-${index}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "8px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Button
                onClick={() => {
                  const nextValue = cloneDeep(value);
                  nextValue.options.splice(index, 1);
                  updateValue(nextValue, true);
                }}
              >
                {t`删除`}
              </Button>
              <input
                value={option.text}
                onChange={(ev) => {
                  const newText = ev.target.value;
                  updateOption(index, (item) => {
                    item.text = newText;
                  });
                }}
                onBlur={onSubmit}
                className={styles.sayInput}
                placeholder={t`选项文本`}
                style={{ width: "40%", flex: 1, minWidth: 0 }}
              />
              <WheelDropdown
                options={iconOptions}
                value={option.icon}
                onValueChange={(newValue) => {
                  updateOption(index, (item) => {
                    item.icon = newValue?.toString() ?? "";
                  }, true);
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <SceneOrLabelPicker
                  value={option.target}
                  onValueChange={(newValue) => {
                    updateOption(index, (item) => {
                      item.target = newValue;
                    });
                  }}
                  onSubmit={onSubmit}
                  placeholder={t`跳转场景或标签`}
                  chooseTitle={t`选择场景文件`}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <span>{t`反驳素材`}</span>
                <span style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {option.refute || t`无`}
                </span>
                <ChooseFile
                  title={t`选择反驳素材`}
                  basePath={["figure"]}
                  selectedFilePath={option.refute}
                  onChange={(fileDesc) => {
                    updateOption(index, (item) => {
                      item.refute = fileDesc?.name ?? "";
                    }, true);
                  }}
                  extNames={[
                    ...(extNameMap.get("video") ?? []),
                    ...(extNameMap.get("image") ?? []),
                  ]}
                />
                {option.refute && (
                  <Button
                    onClick={() => {
                      updateOption(index, (item) => {
                        item.refute = "";
                      }, true);
                    }}
                  >
                    {t`清除`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={() => {
            const nextValue = cloneDeep(value);
            nextValue.options.push({
              text: "",
              target: "",
              icon: "",
              refute: "",
            });
            updateValue(nextValue, true);
          }}
        >
          {t`添加选项`}
        </Button>
      </div>
      <TerreToggle
        title=""
        onChange={(checked) => {
          const nextValue = cloneDeep(value);
          nextValue.hasBack = checked;
          updateValue(nextValue, true);
        }}
        onText={t`显示返回选项`}
        offText={t`隐藏返回选项`}
        isChecked={value.hasBack}
      />
    </div>
  );
}
