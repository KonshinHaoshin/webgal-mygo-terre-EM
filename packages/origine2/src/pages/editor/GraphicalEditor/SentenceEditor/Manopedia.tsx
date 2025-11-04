import CommonOptions from "../components/CommonOption";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";
import { t } from "@lingui/macro";
import { combineSubmitString } from "@/utils/combineSubmitString";

export default function Manopedia(props: ISentenceEditorProps) {
    const isManopediaOn = useValue(props.sentence.content === "on");
    const submit = () => {
        const submitString = combineSubmitString(
            props.sentence.commandRaw,
            isManopediaOn.value ? "on" : "off",
            props.sentence.args,
            [],
        );
        props.onSubmit(submitString);
    };

    return <div className={styles.sentenceEditorContent}>
        <div className={styles.editItem}>
            <CommonOptions key="manopedia" title={t`是否要开启魔女图鉴`}>
                <TerreToggle title="" onChange={(newValue) => {
                    isManopediaOn.set(newValue);
                    submit();
                }} onText={t`开启`} offText={t`关闭`} isChecked={isManopediaOn.value} />
            </CommonOptions>
        </div>
    </div>;
}
