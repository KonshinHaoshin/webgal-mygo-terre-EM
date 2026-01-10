import useEditorStore from "@/store/useEditorStore";
import { api } from "@/api";
import useSWR from "swr";
import { useMemo } from "react";
import { IFile } from "@/components/Assets/Assets";
import WheelDropdown from "./WheelDropdown";
import { t } from "@lingui/macro";

interface ItemIdSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyPlaceholder?: string;
}

export default function ItemIdSelect({
  value,
  onChange,
  placeholder,
  emptyPlaceholder,
}: ItemIdSelectProps) {
  const gameDir = useEditorStore.use.subPage();
  const itemRootPath = ["games", gameDir, "game", "Item"].join("/");

  const { data: itemDirs } = useSWR(itemRootPath, async () => {
    const res = await api.assetsControllerReadAssets(itemRootPath);
    const data = res.data as unknown as { dirInfo?: IFile[] };
    return data?.dirInfo ?? [];
  });

  const itemOptions = useMemo(() => {
    const options = new Map<string, string>();
    (itemDirs ?? []).forEach((item) => {
      if (item.isDir) {
        options.set(item.name, item.name);
      }
    });
    if (value && !options.has(value)) {
      options.set(value, value);
    }
    return options;
  }, [itemDirs, value]);

  const hasOptions = itemOptions.size > 0;

  return (
    <WheelDropdown
      options={itemOptions}
      value={value}
      onValueChange={(newValue) => onChange(newValue ?? "")}
      placeholder={
        hasOptions
          ? placeholder ?? t`选择物品`
          : emptyPlaceholder ?? t`未找到 Item 文件夹`
      }
      disabled={!hasOptions}
    />
  );
}
