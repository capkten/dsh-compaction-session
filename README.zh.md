# 会话压缩修复（DSH 0.2.1-rc.5）

[安装步骤](INSTALL.md) · [下载安装包](https://github.com/capkten/dsh-compaction-session/releases) · [English](README.md)

当前为预发布版本，已通过隔离测试，但真实供应商和 Electron 界面仍待验收。
通过 Release 的 `.tgz` 安装，不需要从 npm 注册表安装本插件。

本插件基于官方 MIT 许可实现，增加会话 reasoning 继承、独立的 thresholdTokens 触发值，以及自动压缩失败时明确停止。只支持 rc.5，不包含新的宿主核心库。

模型适配器的 contextWindow 表示总上下文上限；压缩插件的 thresholdTokens 表示期望的输入触发值。例如分别配置 272000 和 256000。实际触发值不会高于“总上下文减去聊天/摘要输出预算与 headroomTokens”，因此输出预算较大时会提前压缩。模型实际支持的容量必须另行确认。

modelPolicies 可按供应商和模型分别配置。未配置绝对阈值的模型继续沿用官方比例规则。摘要与聊天使用同一供应商和模型时继承最近一次聊天请求的 reasoning；指定其他摘要模型时使用该模型自己的默认值。

SSH/Docker preset 需要 dsh-ssh 的可选 compactionProvider 与 compactionConfig 配置；每个执行域使用独立实例。已超长旧会话的恢复、真实供应商接口以及 Desktop 界面仍须单独验收。详见英文 README。
