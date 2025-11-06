const { execSync } = require('child_process');
const { existsSync } = require('fs');

// 检查 makensis 是否可用
function checkMakensis() {
  try {
    // 尝试运行 makensis 查看版本
    execSync('makensis /VERSION', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

if (!checkMakensis()) {
  console.error('错误: 未找到 makensis 命令。');
  console.error('请安装 NSIS (Nullsoft Scriptable Install System) 并将其添加到 PATH 环境变量中。');
  console.error('下载地址: https://nsis.sourceforge.io/Download');
  process.exit(1);
}

