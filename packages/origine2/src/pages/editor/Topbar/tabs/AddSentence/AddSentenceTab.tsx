import TopbarTab from "@/pages/editor/Topbar/components/TopbarTab";
import {TabItem} from "@/pages/editor/Topbar/components/TabItem";
import {IconWithTextItemSmall} from "@/pages/editor/Topbar/components/IconWithTextItemSmall";
import {ISentenceEditorConfig, sentenceEditorConfig} from "@/pages/editor/GraphicalEditor/SentenceEditor";
import {cloneElement} from "react";
import {eventBus} from "@/utils/eventBus";
import {t} from "@lingui/macro";

function addSentenceText(text: string) {
  console.log(text);
  eventBus.emit('topbar-add-sentence', text);
}

function pickSentenceType(indexes: Array<number>) {
  return indexes.map(index => sentenceEditorConfig[index]).filter(item => item !== undefined).map((e, index) => convertSentenceToNode(e, index));
}

function convertSentenceToNode(sentence: ISentenceEditorConfig, index: number) {
  const iconSmall = cloneElement(sentence.icon, {size: "18px"});
  return <IconWithTextItemSmall key={`sentenceAddSmall${index}`} onClick={() => addSentenceText(sentence.initialText())}
    icon={iconSmall}
    text={sentence.title()}/>;
}

export function AddSentenceTab() {

  const btsCommon1 = pickSentenceType([0, 1, 2]);
  const btsCommon2 = pickSentenceType([4, 5]);
  const btsSpecial = pickSentenceType([8, 12, 13]);
  const btsSpecial2 = pickSentenceType([6, 7, 22]);
  const btsBranch1 = pickSentenceType([9, 10, 11]);
  const btsBranch2 = pickSentenceType([28, 29]);
  const btsExtra = pickSentenceType([14, 15]);
  const btsSystem1 = pickSentenceType([16, 17, 23, 24]);
  const btsSystem2 = pickSentenceType([25, 26, 27, 18]);
  const btsControl = pickSentenceType([3, 20, 21]);

  return <TopbarTab>
    <TabItem title={t`常规演出`}>
      <div>
        {btsCommon1}
      </div>
      <div>
        {btsCommon2}
      </div>
    </TabItem>
    <TabItem title={t`舞台对象控制`}>
      <div>
        {btsControl}
      </div>
    </TabItem>
    <TabItem title={t`特殊演出`}>
      <div>
        {btsSpecial}
      </div>
      <div>
        {btsSpecial2}
      </div>
    </TabItem>
    <TabItem title={t`场景与分支`}>
      <div>
        {btsBranch1}
      </div>
      <div>
        {btsBranch2}
      </div>
    </TabItem>
    <TabItem title={t`鉴赏`}>
      <div>
        {btsExtra}
      </div>
    </TabItem>
    <TabItem title={t`游戏控制`}>
      <div>
        {btsSystem1}
      </div>
      <div>
        {btsSystem2}
      </div>
    </TabItem>
  </TopbarTab>;
}
