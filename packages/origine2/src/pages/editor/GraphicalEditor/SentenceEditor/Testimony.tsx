import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import CommonOptions from "../components/CommonOption";
import CommonTips from "../components/CommonTips";
import { t } from "@lingui/macro";
import { useValue } from "../../../../hooks/useValue";
import { getArgByKey } from "../utils/getArgByKey";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";
import { Button, Input } from "@fluentui/react-components";
import { cloneDeep } from "lodash";
import ThinkingOptionsEditor, {
  formatThinkingValue,
  parseThinkingValue,
  ThinkingValue,
} from "../components/ThinkingOptionsEditor";
import { combineSubmitString } from "@/utils/combineSubmitString";
import { ColorPickerPopup } from "@/components/ColorPickerPopup/ColorPickerPopup";
import { tinycolor } from "@ctrl/tinycolor";

type TestimonyTag = {
  key: string;
  color: string;
  thinking: ThinkingValue;
};

const COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

function parseMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "string") {
    return {};
  }
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function mergeTags(
  refutes: Record<string, string>,
  colors: Record<string, string>,
): TestimonyTag[] {
  const result = new Map<string, TestimonyTag>();
  Object.keys(refutes).forEach((key) => {
    result.set(key, {
      key,
      color: "",
      thinking: parseThinkingValue(refutes[key]),
    });
  });
  Object.keys(colors).forEach((key) => {
    const existing = result.get(key);
    if (existing) {
      existing.color = colors[key];
    } else {
      result.set(key, {
        key,
        color: colors[key],
        thinking: parseThinkingValue(""),
      });
    }
  });
  return Array.from(result.values());
}

export default function Testimony(props: ISentenceEditorProps) {
  const content = useValue(props.sentence.content);
  const isLeft = useValue(!!getArgByKey(props.sentence, "left"));
  const yValueRaw = getArgByKey(props.sentence, "y");
  const yValue = useValue(yValueRaw === "" ? "" : String(yValueRaw));

  const refutesRaw = getArgByKey(props.sentence, "refutes");
  const colorsRaw = getArgByKey(props.sentence, "colors");
  const tags = useValue(mergeTags(parseMap(refutesRaw), parseMap(colorsRaw)));

  const buildRefutes = (): string => {
    const result: Record<string, string> = {};
    tags.value.forEach((tag) => {
      if (!tag.key.trim()) {
        return;
      }
      const thinkingStr = formatThinkingValue(tag.thinking, true);
      if (thinkingStr) {
        result[tag.key.trim()] = thinkingStr;
      }
    });
    return Object.keys(result).length > 0 ? JSON.stringify(result) : "";
  };

  const buildColors = (): string => {
    const result: Record<string, string> = {};
    tags.value.forEach((tag) => {
      const colorValue = tag.color.trim();
      if (!tag.key.trim() || !COLOR_REGEX.test(colorValue)) {
        return;
      }
      result[tag.key.trim()] = colorValue;
    });
    return Object.keys(result).length > 0 ? JSON.stringify(result) : "";
  };

  const submit = () => {
    const refutesValue = buildRefutes();
    const colorsValue = buildColors();
    const parsedY = yValue.value === "" ? "" : Number(yValue.value);
    const submitString = combineSubmitString(
      props.sentence.commandRaw,
      content.value,
      props.sentence.args,
      [
        { key: "left", value: isLeft.value },
        { key: "y", value: Number.isNaN(parsedY) ? "" : parsedY },
        { key: "refutes", value: refutesValue },
        { key: "colors", value: colorsValue },
      ],
    );
    props.onSubmit(submitString);
  };

  return (
    <div className={styles.sentenceEditorContent}>
      <CommonTips text={t`提示：颜色仅支持 #RRGGBB，反驳内容使用完整的 thinking 语法`} />
      <div className={styles.editItem}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%" }}>
          <CommonOptions title={t`证词文本`}>
            <Input
              value={content.value}
              onChange={(_, data) => {
                content.set(data.value);
              }}
              onBlur={submit}
              placeholder={t`输入证词文本`}
              style={{ width: "560px", minWidth: "260px" }}
            />
          </CommonOptions>
          <CommonOptions title={t`位置`}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <TerreToggle
                title=""
                onChange={(checked) => {
                  isLeft.set(checked);
                  submit();
                }}
                onText={t`左侧`}
                offText={t`默认`}
                isChecked={isLeft.value}
              />
              <Input
                type="number"
                value={yValue.value}
                onChange={(_, data) => {
                  yValue.set(data.value);
                }}
                onBlur={submit}
                placeholder={t`Y 轴位置`}
                style={{ width: "140px" }}
              />
            </div>
          </CommonOptions>
        </div>
        <div style={{ width: "100%" }}>
          <CommonOptions title={t`反驳与高亮`} disableHover>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
              {tags.value.map((tag, index) => (
                <div
                  key={`testimony-tag-${index}`}
                  className={styles.hoverCard}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Button
                      onClick={() => {
                        const nextValue = cloneDeep(tags.value);
                        nextValue.splice(index, 1);
                        tags.set(nextValue);
                        submit();
                      }}
                    >
                      {t`删除`}
                    </Button>
                    <Input
                      value={tag.key}
                      onChange={(_, data) => {
                        const nextValue = cloneDeep(tags.value);
                        nextValue[index].key = data.value;
                        tags.set(nextValue);
                      }}
                      onBlur={submit}
                      placeholder={t`匹配文本`}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <ColorPickerPopup
                        color={tag.color && COLOR_REGEX.test(tag.color) ? tag.color : "#F594A8"}
                        onChange={(newColor) => {
                          const nextValue = cloneDeep(tags.value);
                          nextValue[index].color = tinycolor(newColor).toHexString().toUpperCase();
                          tags.set(nextValue);
                          submit();
                        }}
                      />
                      <span>{tag.color || "#F594A8"}</span>
                    </div>
                  </div>
                  <div style={{ width: "100%" }}>
                    <ThinkingOptionsEditor
                      value={tag.thinking}
                      onChange={(nextValue) => {
                        const updated = cloneDeep(tags.value);
                        updated[index].thinking = nextValue;
                        tags.set(updated);
                      }}
                      onSubmit={submit}
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={() => {
                  const nextValue = cloneDeep(tags.value);
                  nextValue.push({
                    key: "",
                    color: "#F594A8",
                    thinking: parseThinkingValue(""),
                  });
                  tags.set(nextValue);
                  submit();
                }}
              >
                {t`添加关键词`}
              </Button>
            </div>
          </CommonOptions>
        </div>
      </div>
    </div>
  );
}
