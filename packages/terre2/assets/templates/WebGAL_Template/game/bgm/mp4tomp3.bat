@echo off
Title MP4 转 MP3 小工具

echo 开始批量转换 mp4 → mp3...
echo.

for %%a in (*.mp4) do (
    echo 正在转换: %%~nxa
    ffmpeg -i "%%~a" -vn -acodec libmp3lame -q:a 2 "%%~na.mp3"
    echo 已完成: %%~na.mp3
    echo.
)

echo.
echo 全部转换完成！
pause