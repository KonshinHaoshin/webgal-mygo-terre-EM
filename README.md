# WebGAL 魔裁专版可视化编辑器

## 新增大量自定义指令，并拥有可视化的编辑器
<img width="950" height="797" alt="image" src="https://github.com/user-attachments/assets/de3ed4ea-c3dd-4111-b03b-689c65a925ac" />

<img width="2559" height="1364" alt="image" src="https://github.com/user-attachments/assets/8bd61df7-bbe1-4eaa-803a-92908539f6ff" />

![屏幕录制](https://github.com/user-attachments/assets/2eba076e-76d6-46c2-8ec9-467ffbf29de3)

## 用法

### 新增指令与用法

#### manopedia：图鉴显示/隐藏
用于控制“魔女图鉴”界面的显示状态。
```txt
manopedia:on;
manopedia:off;
```

#### pediaUpdate：图鉴更新提示
弹出图鉴更新提示，无参数。
```txt
pediaUpdate:;
```

#### addItem / showItem / clearItem：证物管理
`ID` 为 `Item/<ID>` 文件夹名。
```txt
addItem:<ID>;   # 添加证物
showItem:<ID>;  # 展示证物
clearItem:;       # 清空所有证物（无参数）
```

#### presentTheEvidence：出示证物
强制打开图鉴并要求选择证物。`@<itemId>` 为正确证物 ID。  
`success` / `fail` 支持 `label` 或 `.txt` 场景文件；允许留空以形成循环。
```txt
presentTheEvidence:1.txt|2.txt @SAPPHO;
presentTheEvidence:|uika @SAPPHO;
presentTheEvidence:<success>|<fail> @<itemId>;
```

#### judgment：审判流程控制
`begins` 开始审判，`concluded` 结束审判，`exit` 退出且不播放动画。  
`-timeout` 支持 `label` 或 `.txt`。
```txt
judgment:begins -timer=13:20:000 -timeout=1.txt;
judgment:concluded;
judgment:exit;
```

#### refute：反驳素材
素材来自 `figure` 目录，`-goto` 支持 `label` 或 `.txt`。
```txt
refute:refute/soyo.webm -goto=label_or_scene;
```

#### thinking：思考选项
`thinking:<image>` 中 `<image>` 来自 `thinking` 目录。  
`@icon` 使用 `thinking_button` 下的图片，`@refute` 使用 `figure` 素材。  
`@back` 为显示返回选项。
```txt
thinking:soyo.png 选项文本:label@icon=agree.png@refute=refute/soyo.webm|@back;
```

#### testimony：证词
位置参数：`-left` / `-right` / 省略（居中）。  
`-y` 为 Y 轴位置。  
`-refutes`：JSON，关键词 -> thinking 语法。  
`-colors`：JSON，关键词 -> `#RRGGBB`。  
语音参数为 `-<vocalFile>`（来自 `vocal` 目录，无需 `vocal=`）。
允许一句话中插入多个关键词。
```txt
testimony:证词文本 -left -y=400 -refutes={"关键词":"thinking:soyo.png 文本:label@icon=objection.png|@back"} -colors={"关键词":"#BB9955"} -voice.mp3;
```

#### clearTestimony：清除证词
清除屏幕上正在显示的证词。
```txt
clearTestimony:;
```

### 原版指令增强

#### 选择项新增骷髅标记
```txt
choose:选项A:scene_a @skeleton|选项B:scene_b;
```

#### 背景切换新增 -type
blinds是百叶窗切换效果
```txt
changeBg:RGB/Background_e02_001.png -type=blinds;
```

---

以下为原仓库README.md文件

---

![WebGAL Terre Slogan CN](https://github.com/OpenWebGAL/WebGAL_Terre/assets/30483415/69919753-9068-4465-8b11-a0de89b5a244)


<a href="https://www.producthunt.com/posts/webgal?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-webgal" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=443280&theme=light" alt="WebGAL - Galgame&#0032;Editing&#0046;&#0032;Redefined | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

### [English](README_EN.md) | [日本語](README_JP.md)

## 这是 WebGAL 可视化编辑器项目。如果你想要查看 WebGAL 的源代码，请前往 [WebGAL代码仓库](https://github.com/OpenWebGAL/WebGAL)

# WebGAL_Terre

**重新定义Galgame的制作方式**

以最快捷的方式创建属于你自己的 Galgame，并支持导出为网页和 Windows 可执行文件。

方便地上传、管理和预览你的游戏素材。

多标签页的编辑器，可以让你快速在多个剧本间切换。

## 立即体验

##### 下载链接

https://github.com/OpenWebGAL/WebGAL_Terre/releases

## 使用说明

https://docs.openwebgal.com/

## 参与贡献

[WebGAL Terre 贡献指南](https://docs.openwebgal.com/developers/terre.html)

### 赞助

WebGAL 是一款开源软件，因此你可以免费在 MPL-2.0 开源协议的范畴下使用本软件，并可用于商业使用。

但即便如此，你的赞助也可以给予开发者前进的动力，让这个项目变得更好。

[赞助本项目](https://docs.openwebgal.com/sponsor/)


# Sponsors

<a href="https://openwebgal.com/">
<img alt="Sponsor" src="https://raw.githubusercontent.com/OpenWebGAL/static/main/sponsors.png">
</a>
