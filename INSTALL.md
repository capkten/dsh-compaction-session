# 安装与配置（Windows Desktop）

仅支持 DeepSeek Harness Desktop **0.2.2-rc.1**。升级 DSH 前应先检查兼容性。
本插件包含该版本四种本地 preset 的完整定义；有自定义 preset 的用户应先比较
`cordis.patch.yml`，在隔离 Profile 验证。不要覆盖自己的整份 Profile 或供应商配置。

## 1. 下载和备份

从本仓库 Releases 下载 `dsh-compaction-session-0.1.1.tgz` 和 `SHA256SUMS.txt`。
不要使用页面自动生成的 Source code ZIP 代替安装包。

完全退出 DSH（包括托盘），备份 `%USERPROFILE%\.dsh\profiles\desktop` 中的
`package.json`、`cordis.patch.yml`、`pnpm-lock.yaml` 和 `pnpm-workspace.yaml`。
建议先复制一份 Profile 做隔离验证。聊天和供应商凭据不应上传到 GitHub。

将安装包放在稳定目录，例如 `%USERPROFILE%\.dsh\deploy`。
使用 `Get-FileHash <安装包路径> -Algorithm SHA256` 与下载的校验文件比对。

## 2. 注册依赖和 bundle

在 Profile 的 `package.json` 中合并以下字段；保留原有所有依赖及 bundle。
把示例中的 `YOUR_NAME` 替换为实际 Windows 用户目录，路径使用 `/`：

```json
{
  "dependencies": {
    "dsh-compaction-session": "file:C:/Users/YOUR_NAME/.dsh/deploy/dsh-compaction-session-0.1.1.tgz"
  },
  "dsh": {
    "profile": {
      "bundles": ["dsh-compaction-session"]
    }
  }
}
```

使用该 DSH 随附的 Node/pnpm 在 Profile 目录运行 `pnpm install --ignore-scripts`，
生成并保留新的 lockfile。宿主核心包通过 peer dependencies 共享，不能自行打包另一份核心库。
此步骤可能需要联网解析宿主依赖；公开注册表的全新安装尚未验证。
若安装报缺失核心包，停止并恢复备份，不要用其他版本核心包凑齐。

## 3. 设置两个容量

在已有模型条目中设置 `contextWindow: 272000`，不要替换整个 providers 配置。
供应商实际容量需要自行确认。然后在 `cordis.patch.yml` 的顶层补丁列表中加入：

```yaml
- id: session-compaction-settings
  config:
    thresholdTokens: 256000
    headroomTokens: 1024
    maxTokens: 8192
```

这里的 `maxTokens` 是摘要输出上限，不是聊天输出上限。实际触发值为：

```text
min(压缩阈值, 上下文容量 - max(聊天输出预留, 摘要输出预留) - 安全余量)
```

例如聊天输出预留为 32768 时，有效触发值为 238208，而非 256000。
未配置绝对阈值的模型保留原比例规则；多模型可通过 `modelPolicies` 分别设置，见 README。
请勿为小容量模型统一设置超过其容量的阈值。

## 4. SSH / Docker（可选）

需要使用支持 `compactionProvider` / `compactionConfig` 的配套 dsh-ssh。
仅安装此插件不会自动修改旧版 dsh-ssh 的远程 preset：

```yaml
- id: ssh-remote
  config:
    compactionProvider: dsh-compaction-session
```

## 5. 验证与回滚

重启后确认插件运行，先在专用测试聊天手动触发压缩，再验证自动阈值。
同供应商同模型摘要应继承会话 reasoning；失败应显示实际原因并停止继续请求。
不要把插件运行状态当作真实供应商压缩已通过。已超长旧聊天不保证恢复。

回滚时退出 DSH，恢复备份的四个配置/依赖文件，再使用匹配 pnpm 按旧 lockfile
安装依赖。保留下载包及配置备份，不需要修改 app.asar 或删除聊天数据。
