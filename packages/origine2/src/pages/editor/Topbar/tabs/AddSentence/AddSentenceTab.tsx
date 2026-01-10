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

function pickSentenceTypeWithKey(indexes: Array<number>, keyPrefix: string) {
  return indexes
    .map(index => sentenceEditorConfig[index])
    .filter(item => item !== undefined)
    .map((e, index) => convertSentenceToNode(e, `${keyPrefix}-${index}`));
}

function chunkList<T>(items: Array<T>, size: number): Array<Array<T>> {
  const result: Array<Array<T>> = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function convertSentenceToNode(sentence: ISentenceEditorConfig, index: number | string) {
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
  const btsSystemAll = pickSentenceTypeWithKey([16, 17, 23, 24, 25, 26, 27, 30, 31, 32, 33, 34, 18], "system");
  const btsSystemColumns = chunkList(btsSystemAll, 3);
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
      {btsSystemColumns.map((column, index) => (
        <div key={`system-col-${index}`}>
          {column}
        </div>
      ))}
    </TabItem>
  </TopbarTab>;
}
