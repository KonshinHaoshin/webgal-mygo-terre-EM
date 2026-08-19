import { commandType, ISentence } from "webgal-parser/src/interface/sceneInterface";
import Say from "./Say";
import { FC, ReactElement, ReactNode } from "react";
import {
  Acoustic,
  AddMusic,
  AddPicture,
  AlignLeftTwo,
  AlignTextBottomOne,
  AutoWidth,
  Avatar,
  Code,
  CommentOne,
  CornerRightUp,
  Effects,
  EnterTheKeyboard,
  Erase,
  ListCheckbox,
  Logout,
  GameHandle,
  Hourglass,
  Music,
  NewPicture,
  People,
  SwitchThemes, Transform,
  VideoTwo,
  RightSmallUp,
  TrendingUp
  ,Audit, BookOne, BookOpen, Clear, DeleteOne, Gavel, AddItem, NotebookAndPen, Reject, ViewList, ThinkingProblem
} from "@icon-park/react";
import ChangeBg from "./ChangeBg";
import ChangeFigure from "./ChangeFigure";
import Bgm from "./Bgm";
import PlayVideo from "./PlayVideo";
import Unrecognized from "./Unrecognized";
import PixiPerform from "./PixiPerform";
import Intro from "./Intro";
import End from "./End";
import MiniAvatar from "./MiniAvatar";
import Comment from "./Comment";
import PlayEffect from "./PlayEffect";
import SetTextbox from "./SetTextbox";
import UnlockExtra from "./UnlockExtra";
import SetAnimation from "./SetAnimation";
import ChangeCallScene from "./ChangeCallScene";
import Choose from "./Choose";
import SetTransition from "@/pages/editor/GraphicalEditor/SentenceEditor/SetTransition";
import SetTransform from "@/pages/editor/GraphicalEditor/SentenceEditor/SetTransform";
import styles from "./sentenceEditor.module.scss";
import GetUserInput from "@/pages/editor/GraphicalEditor/SentenceEditor/GetUserInput";
import CallSteam from "@/pages/editor/GraphicalEditor/SentenceEditor/CallSteam";
import SetTempAnimation from "@/pages/editor/GraphicalEditor/SentenceEditor/SetTempAnimation";
import Wait from "@/pages/editor/GraphicalEditor/SentenceEditor/Wait";
import BasicCommands from "@/pages/editor/GraphicalEditor/SentenceEditor/BasicCommands";
import { t } from "@lingui/macro";
import Manopedia from "./Manopedia";
import PediaUpdate from "./PediaUpdate";
import ItemCommand from "./ItemCommand";
import ClearItem from "./ClearItem";
import PresentTheEvidence from "./PresentTheEvidence";
import Judgment from "./Judgment";
import Refute from "./Refute";
import Thinking from "./Thinking";
import Testimony from "./Testimony";
import ClearTestimony from "./ClearTestimony";
import LabelCommand from "./LabelCommand";
import { CUSTOM_COMMAND_TYPES, type ExtendedCommandType } from "@/utils/webgalScriptConfig";

export interface ISentenceEditorProps {
  sentence: ISentence;
  onSubmit: (newSentence: string) => void;
  index:number;
  targetPath: string;
  sceneLabels?: string[];
  extraOptions?: ReactNode;
}

export interface ISentenceEditorConfig {
  type: ExtendedCommandType,
  title: () => string,
  initialText: () => string,
  component: FC<ISentenceEditorProps>,
  icon: ReactElement,
  descText: () => string,
}


export const sentenceEditorDefault: ISentenceEditorConfig = {
  type: commandType.say,
  title: () => t`未识别`,
  initialText: () => "",
  component: Unrecognized,
  icon: <CommentOne theme="outline" size="24" className={styles.iconParkIcon}/>,
  descText: () => ""
};

export const sentenceEditorConfig: ISentenceEditorConfig[] = [
  {
    type: commandType.say,
    title: () => t`普通对话`,
    initialText: () => t`角色名，留空以继承上句:对话;`,
    component: Say,
    icon: <CommentOne className={styles.iconSvg} theme="multi-color" size="24"/>,
    descText: () => t`添加一句对话，可以附带语音`
  },
  {
    type: commandType.changeBg,
    title: () => t`切换背景`,
    initialText: () => t`changeBg: 选择背景图片;`,
    component: ChangeBg,
    icon: <NewPicture theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`切换背景图片`
  },
  {
    type: commandType.changeFigure,
    title: () => t`切换立绘`,
    initialText: () => t`changeFigure:选择立绘文件;`,
    component: ChangeFigure,
    icon: <People theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`添加或切换指定位置的立绘`
  },
  {
    type: commandType.setAnimation,
    title: () => t`调用动画`,
    initialText: () => t`setAnimation:选择动画文件;`,
    component: SetAnimation,
    icon: <AutoWidth theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`为立绘或背景图片调用动画效果`
  },
  {
    type: commandType.setComplexAnimation,
    title: () => t`复杂动画`,
    initialText: () => t`setComplexAnimation:universalSoftIn -target=fig-center;`,
    component: BasicCommands,
    icon: <AutoWidth theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`调用引擎内置复杂动画`
  },
  {
    type: commandType.bgm,
    title: () => t`背景音乐`,
    initialText: () => t`bgm:选择背景音乐;`,
    component: Bgm,
    icon: <Music theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`启动、切换或停止背景音乐的播放`
  },
  {
    type: commandType.video,
    title: () => t`播放视频`,
    initialText: () => t`playVideo:选择视频文件;`,
    component: PlayVideo,
    icon: <VideoTwo theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`播放一小段视频`
  },
  {
    type: commandType.pixi,
    title: () => t`使用特效`,
    initialText: () => t`pixiPerform:snow;`,
    component: PixiPerform,
    icon: <Effects theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`为当前的舞台添加特殊效果`
  },
  {
    type: commandType.pixiInit,
    title: () => t`清除特效`,
    initialText: () => t`pixiInit;`,
    component: PixiPerform,
    icon: <Erase theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`清除当前舞台的特殊效果`
  },
  {
    type: commandType.intro,
    title: () => t`全屏文字`,
    initialText: () => t`intro:;`,
    component: Intro,
    icon: <AlignLeftTwo theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`全屏显示一段文字，用于独白或引出场景`
  },
  {
    type: commandType.callScene,
    title: () => t`调用场景`,
    initialText: () => t`callScene:选择场景文件;`,
    component: ChangeCallScene,
    icon: <CornerRightUp theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`调用一段场景文件，在结束后返回父场景`
  },
  {
    type: commandType.return,
    title: () => t`场景返回`,
    initialText: () => t`return:;`,
    component: BasicCommands,
    icon: <Logout theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`提前结束被调用的场景并回到调用处，可带回一个返回值`
  },
  {
    type: commandType.changeScene,
    title: () => t`切换场景`,
    initialText: () => t`changeScene:选择场景文件;`,
    component: ChangeCallScene,
    icon: <SwitchThemes theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`切换到另一个场景文件，并清除当前场景`
  },
  {
    type: commandType.choose,
    title: () => t`分支选择`,
    initialText: () => t`choose:选项:选择场景文件;`,
    component: Choose,
    icon: <ListCheckbox theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`通过选项进入不同的场景`
  },
  {
    type: commandType.label,
    title: () => t`标签`,
    initialText: () => t`label:label_1;`,
    component: LabelCommand,
    icon: <Code theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`在当前场景内创建跳转标签`
  },
  {
    type: commandType.jumpLabel,
    title: () => t`跳转标签`,
    initialText: () => t`jumpLabel:label_1;`,
    component: LabelCommand,
    icon: <CornerRightUp theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`跳转到当前场景内的标签`
  },
  {
    type: commandType.setVar,
    title: () => t`设置变量`,
    initialText: () => t`setVar:a=1;`,
    component: BasicCommands,
    icon: <Code theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`设置普通变量或全局变量`
  },
  {
    type: commandType.miniAvatar,
    title: () => t`角落头像`,
    initialText: () => t`miniAvatar:选择小头像;`,
    component: MiniAvatar,
    icon: <Avatar theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`在对话框的左下角显示一个小头像`
  },
  {
    type: commandType.playEffect,
    title: () => t`效果声音`,
    initialText: () => t`playEffect:选择效果音文件;`,
    component: PlayEffect,
    icon: <Acoustic theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`播放一段效果音`
  },
  {
    type: commandType.unlockCg,
    title: () => t`鉴赏图片`,
    initialText: () => t`unlockCg:;`,
    component: UnlockExtra,
    icon: <AddPicture theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`添加一张图片到 CG 鉴赏界面`
  },
  {
    type: commandType.unlockBgm,
    title: () => t`鉴赏音乐`,
    initialText: () => t`unlockBgm:;`,
    component: UnlockExtra,
    icon: <AddMusic theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`添加一首音乐到音乐鉴赏界面`
  },
  {
    type: commandType.setTextbox,
    title: () => t`文本显示`,
    initialText: () => t`setTextbox:hide;`,
    component: SetTextbox,
    icon: <AlignTextBottomOne theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`控制是否要显示文本框`
  },
  {
    type: commandType.showVars,
    title: () => t`显示变量`,
    initialText: () => t`showVars;`,
    component: BasicCommands,
    icon: <Code theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`在游戏中显示当前变量`
  },
  {
    type: commandType.filmMode,
    title: () => t`电影模式`,
    initialText: () => t`filmMode:enable;`,
    component: BasicCommands,
    icon: <SwitchThemes theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`打开或关闭电影模式`
  },
  {
    type: commandType.end,
    title: () => t`结束游戏`,
    initialText: () => t`end;`,
    component: End,
    icon: <Logout theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`结束当前游戏并回到标题画面`
  },
  {
    type: commandType.comment,
    title: () => t`单行注释`,
    initialText: () => t`;注释`,
    component: Comment,
    icon: <Code theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`添加一行注释`
  },
  {
    type: commandType.setTransition,
    title: () => t`进出场动画`,
    initialText: () => t`setTransition:;`,
    component: SetTransition,
    icon: <Transform theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`设置立绘或背景的进出场动画`
  },
  {
    type:commandType.setTransform,
    title:() => t`单段动画`,
    initialText: () => t`setTransform: -duration=0;`,
    component:SetTransform,
    icon: <RightSmallUp theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`为立绘或背景图片设置单段动画效果`
  },
  {
    type:commandType.getUserInput,
    title:() => t`获取输入`,
    initialText: () => t`getUserInput:;`,
    component:GetUserInput,
    icon: <EnterTheKeyboard theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`获取来自用户的字符输入`
  },
  {
    type: commandType.applyStyle,
    title: () => t`应用样式`,
    initialText: () => t`applyStyle:TextBox_ShowName_Background->TextBox_ShowName_Background_Red;`,
    component: BasicCommands,
    icon: <Code theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`替换 UI 样式标签`
  },
  {
    type: commandType.wait,
    title: () => t`等待`,
    initialText: () => t`wait:1000;`,
    component: Wait,
    icon: <Hourglass theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`等待一段时间`
  },
  {
    type: commandType.callSteam,
    title: () => t`调用 Steam`,
    initialText: () => t`callSteam: -achievementId=;`,
    component: CallSteam,
    icon: <GameHandle theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`调用 Steam 接口，支持多参数`
  },
  {
    type: commandType.setTempAnimation,
    title: () => t`多段动画`,
    initialText: () => t`setTempAnimation:[{"duration":0},{"duration":500}];`,
    component: SetTempAnimation,
    icon: <TrendingUp theme="multi-color" className={styles.iconSvg} size="24"/>,
    descText: () => t`为立绘或背景图片设置多段动画效果`
  },
  { type: CUSTOM_COMMAND_TYPES.manopedia, title: () => t`魔女图鉴`, initialText: () => "manopedia:on;", component: Manopedia, icon: <BookOpen className={styles.iconSvg} size="24"/>, descText: () => t`控制魔女图鉴` },
  { type: CUSTOM_COMMAND_TYPES.pediaUpdate, title: () => t`图鉴更新`, initialText: () => "pediaUpdate:;", component: PediaUpdate, icon: <BookOne className={styles.iconSvg} size="24"/>, descText: () => t`显示图鉴更新提示` },
  { type: CUSTOM_COMMAND_TYPES.addItem, title: () => t`添加证物`, initialText: () => "addItem:SAPPHO;", component: ItemCommand, icon: <AddItem className={styles.iconSvg} size="24"/>, descText: () => t`添加证物到图鉴` },
  { type: CUSTOM_COMMAND_TYPES.showItem, title: () => t`展示证物`, initialText: () => "showItem:SAPPHO;", component: ItemCommand, icon: <ViewList className={styles.iconSvg} size="24"/>, descText: () => t`展示证物` },
  { type: CUSTOM_COMMAND_TYPES.clearItem, title: () => t`清除证物`, initialText: () => "clearItem:;", component: ClearItem, icon: <DeleteOne className={styles.iconSvg} size="24"/>, descText: () => t`清除全部证物` },
  { type: CUSTOM_COMMAND_TYPES.presentTheEvidence, title: () => t`出示证物`, initialText: () => "presentTheEvidence:target;", component: PresentTheEvidence, icon: <Audit className={styles.iconSvg} size="24"/>, descText: () => t`打开证物选择` },
  { type: CUSTOM_COMMAND_TYPES.judgment, title: () => t`庭审`, initialText: () => "judgment:begins -timer=13:20:000 -timeout=1.txt;", component: Judgment, icon: <Gavel className={styles.iconSvg} size="24"/>, descText: () => t`控制庭审流程` },
  { type: CUSTOM_COMMAND_TYPES.refute, title: () => t`反驳`, initialText: () => "refute:refute.webm -goto=next;", component: Refute, icon: <Reject className={styles.iconSvg} size="24"/>, descText: () => t`播放反驳并跳转` },
  { type: CUSTOM_COMMAND_TYPES.thinking, title: () => t`思考`, initialText: () => "thinking:avatar.png 选项:label;", component: Thinking, icon: <ThinkingProblem className={styles.iconSvg} size="24"/>, descText: () => t`编辑思考选项` },
  { type: CUSTOM_COMMAND_TYPES.testimony, title: () => t`证言`, initialText: () => "testimony:证言文本 -left;", component: Testimony, icon: <NotebookAndPen className={styles.iconSvg} size="24"/>, descText: () => t`编辑证言与反驳` },
  { type: CUSTOM_COMMAND_TYPES.clearTestimony, title: () => t`清除证言`, initialText: () => "clearTestimony:;", component: ClearTestimony, icon: <Clear className={styles.iconSvg} size="24"/>, descText: () => t`清除证言` },
];
