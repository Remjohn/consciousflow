Title: Policy engine | Gemini CLI

Source: https://geminicli.com/docs/reference/policy-engine

---

[Skip to content](https://geminicli.com/docs/reference/policy-engine#_top)
[Gemini CLI](https://geminicli.com/)
[Plans](https://geminicli.com/plans/)
[Home](https://geminicli.com/)
[Extensions](https://geminicli.com/extensions/)
[Gallery](https://geminicli.com/extensions/)
[About Extensions](https://geminicli.com/extensions/about)
[Docs](https://geminicli.com/docs/)
[Reference](https://geminicli.com/docs/reference/commands)
[Resources](https://geminicli.com/docs/resources/quota-and-pricing)
[Changelog](https://geminicli.com/docs/changelogs/)
[Feedback](https://github.com/google-gemini/gemini-cli/issues/new?template=website_issue.yml&url=https%3A%2F%2Fgeminicli.com%2Fdocs%2Freference%2Fpolicy-engine%2F)
[GitHub    GitHub](https://github.com/google-gemini/gemini-cli)
-     Get started        [Overview](https://geminicli.com/docs/)  [Quickstart](https://geminicli.com/docs/get-started/)  [Installation](https://geminicli.com/docs/get-started/installation/)  [Authentication](https://geminicli.com/docs/get-started/authentication/)  [CLI cheatsheet](https://geminicli.com/docs/cli/cli-reference/)  [Gemini 3 on Gemini CLI](https://geminicli.com/docs/get-started/gemini-3/)     
-  [Overview](https://geminicli.com/docs/) 
-  [Quickstart](https://geminicli.com/docs/get-started/) 
-  [Installation](https://geminicli.com/docs/get-started/installation/) 
-  [Authentication](https://geminicli.com/docs/get-started/authentication/) 
-  [CLI cheatsheet](https://geminicli.com/docs/cli/cli-reference/) 
-  [Gemini 3 on Gemini CLI](https://geminicli.com/docs/get-started/gemini-3/) 
-     Use Gemini CLI        [File management](https://geminicli.com/docs/cli/tutorials/file-management/)  [Get started with Agent skills](https://geminicli.com/docs/cli/tutorials/skills-getting-started/)  [Manage context and memory](https://geminicli.com/docs/cli/tutorials/memory-management/)  [Execute shell commands](https://geminicli.com/docs/cli/tutorials/shell-commands/)  [Manage sessions and history](https://geminicli.com/docs/cli/tutorials/session-management/)  [Plan tasks with todos](https://geminicli.com/docs/cli/tutorials/task-planning/)  [Use Plan Mode with model steering 🔬](https://geminicli.com/docs/cli/tutorials/plan-mode-steering/)  [Web search and fetch](https://geminicli.com/docs/cli/tutorials/web-tools/)  [Set up an MCP server](https://geminicli.com/docs/cli/tutorials/mcp-setup/)  [Automate tasks](https://geminicli.com/docs/cli/tutorials/automation/)     
-  [File management](https://geminicli.com/docs/cli/tutorials/file-management/) 
-  [Get started with Agent skills](https://geminicli.com/docs/cli/tutorials/skills-getting-started/) 
-  [Manage context and memory](https://geminicli.com/docs/cli/tutorials/memory-management/) 
-  [Execute shell commands](https://geminicli.com/docs/cli/tutorials/shell-commands/) 
-  [Manage sessions and history](https://geminicli.com/docs/cli/tutorials/session-management/) 
-  [Plan tasks with todos](https://geminicli.com/docs/cli/tutorials/task-planning/) 
-  [Use Plan Mode with model steering 🔬](https://geminicli.com/docs/cli/tutorials/plan-mode-steering/) 
-  [Web search and fetch](https://geminicli.com/docs/cli/tutorials/web-tools/) 
-  [Set up an MCP server](https://geminicli.com/docs/cli/tutorials/mcp-setup/) 
-  [Automate tasks](https://geminicli.com/docs/cli/tutorials/automation/)

-     Features           Extensions        [Overview](https://geminicli.com/docs/extensions/)  [User guide: Install and manage](https://geminicli.com/docs/extensions/#manage-extensions)  [Developer guide: Build extensions](https://geminicli.com/docs/extensions/writing-extensions/)  [Developer guide: Best practices](https://geminicli.com/docs/extensions/best-practices/)  [Developer guide: Releasing](https://geminicli.com/docs/extensions/releasing/)  [Developer guide: Reference](https://geminicli.com/docs/extensions/reference/)      [Agent Skills](https://geminicli.com/docs/cli/skills/)  [Checkpointing](https://geminicli.com/docs/cli/checkpointing/)  [Headless mode](https://geminicli.com/docs/cli/headless/)  [Git worktrees 🔬](https://geminicli.com/docs/cli/git-worktrees/)     Hooks        [Overview](https://geminicli.com/docs/hooks/)  [Reference](https://geminicli.com/docs/hooks/reference/)         IDE integration        [Overview](https://geminicli.com/docs/ide-integration/)  [Developer guide: ACP mode](https://geminicli.com/docs/cli/acp-mode/)      [MCP servers](https://geminicli.com/docs/tools/mcp-server/)  [Model routing](https://geminicli.com/docs/cli/model-routing/)  [Model selection](https://geminicli.com/docs/cli/model/)  [Model steering 🔬](https://geminicli.com/docs/cli/model-steering/)  [Notifications 🔬](https://geminicli.com/docs/cli/notifications/)  [Plan mode](https://geminicli.com/docs/cli/plan-mode/)  [Subagents](https://geminicli.com/docs/core/subagents/)  [Remote subagents](https://geminicli.com/docs/core/remote-agents/)  [Rewind](https://geminicli.com/docs/cli/rewind/)  [Sandboxing](https://geminicli.com/docs/cli/sandbox/)  [Settings](https://geminicli.com/docs/cli/settings/)  [Telemetry](https://geminicli.com/docs/cli/telemetry/)  [Token caching](https://geminicli.com/docs/cli/token-caching/)     
-     Extensions        [Overview](https://geminicli.com/docs/extensions/)  [User guide: Install and manage](https://geminicli.com/docs/extensions/#manage-extensions)  [Developer guide: Build extensions](https://geminicli.com/docs/extensions/writing-extensions/)  [Developer guide: Best practices](https://geminicli.com/docs/extensions/best-practices/)  [Developer guide: Releasing](https://geminicli.com/docs/extensions/releasing/)  [Developer guide: Reference](https://geminicli.com/docs/extensions/reference/)     
-  [Overview](https://geminicli.com/docs/extensions/) 
-  [User guide: Install and manage](https://geminicli.com/docs/extensions/#manage-extensions) 
-  [Developer guide: Build extensions](https://geminicli.com/docs/extensions/writing-extensions/) 
-  [Developer guide: Best practices](https://geminicli.com/docs/extensions/best-practices/) 
-  [Developer guide: Releasing](https://geminicli.com/docs/extensions/releasing/) 
-  [Developer guide: Reference](https://geminicli.com/docs/extensions/reference/) 
-  [Agent Skills](https://geminicli.com/docs/cli/skills/) 
-  [Checkpointing](https://geminicli.com/docs/cli/checkpointing/) 
-  [Headless mode](https://geminicli.com/docs/cli/headless/) 
-  [Git worktrees 🔬](https://geminicli.com/docs/cli/git-worktrees/) 
-     Hooks        [Overview](https://geminicli.com/docs/hooks/)  [Reference](https://geminicli.com/docs/hooks/reference/)     
-  [Overview](https://geminicli.com/docs/hooks/) 
-  [Reference](https://geminicli.com/docs/hooks/reference/) 
-     IDE integration        [Overview](https://geminicli.com/docs/ide-integration/)  [Developer guide: ACP mode](https://geminicli.com/docs/cli/acp-mode/)     
-  [Overview](https://geminicli.com/docs/ide-integration/) 
-  [Developer guide: ACP mode](https://geminicli.com/docs/cli/acp-mode/) 
-  [MCP servers](https://geminicli.com/docs/tools/mcp-server/) 
-  [Model routing](https://geminicli.com/docs/cli/model-routing/) 
-  [Model selection](https://geminicli.com/docs/cli/model/) 
-  [Model steering 🔬](https://geminicli.com/docs/cli/model-steering/) 
-  [Notifications 🔬](https://geminicli.com/docs/cli/notifications/) 
-  [Plan mode](https://geminicli.com/docs/cli/plan-mode/) 
-  [Subagents](https://geminicli.com/docs/core/subagents/) 
-  [Remote subagents](https://geminicli.com/docs/core/remote-agents/) 
-  [Rewind](https://geminicli.com/docs/cli/rewind/) 
-  [Sandboxing](https://geminicli.com/docs/cli/sandbox/) 
-  [Settings](https://geminicli.com/docs/cli/settings/) 
-  [Telemetry](https://geminicli.com/docs/cli/telemetry/) 
-  [Token caching](https://geminicli.com/docs/cli/token-caching/)

-     Configuration        [Custom commands](https://geminicli.com/docs/cli/custom-commands/)  [Enterprise configuration](https://geminicli.com/docs/cli/enterprise/)  [Ignore files (.geminiignore)](https://geminicli.com/docs/cli/gemini-ignore/)  [Model configuration](https://geminicli.com/docs/cli/generation-settings/)  [Project context (GEMINI.md)](https://geminicli.com/docs/cli/gemini-md/)  [Settings](https://geminicli.com/docs/cli/settings/)  [System prompt override](https://geminicli.com/docs/cli/system-prompt/)  [Themes](https://geminicli.com/docs/cli/themes/)  [Trusted folders](https://geminicli.com/docs/cli/trusted-folders/)     
-  [Custom commands](https://geminicli.com/docs/cli/custom-commands/) 
-  [Enterprise configuration](https://geminicli.com/docs/cli/enterprise/) 
-  [Ignore files (.geminiignore)](https://geminicli.com/docs/cli/gemini-ignore/) 
-  [Model configuration](https://geminicli.com/docs/cli/generation-settings/) 
-  [Project context (GEMINI.md)](https://geminicli.com/docs/cli/gemini-md/) 
-  [Settings](https://geminicli.com/docs/cli/settings/) 
-  [System prompt override](https://geminicli.com/docs/cli/system-prompt/) 
-  [Themes](https://geminicli.com/docs/cli/themes/) 
-  [Trusted folders](https://geminicli.com/docs/cli/trusted-folders/) 
-     Development        [Contribution guide](https://geminicli.com/docs/contributing/)  [Integration testing](https://geminicli.com/docs/integration-tests/)  [Issue and PR automation](https://geminicli.com/docs/issue-and-pr-automation/)  [Local development](https://geminicli.com/docs/local-development/)  [NPM package structure](https://geminicli.com/docs/npm/)     
-  [Contribution guide](https://geminicli.com/docs/contributing/) 
-  [Integration testing](https://geminicli.com/docs/integration-tests/) 
-  [Issue and PR automation](https://geminicli.com/docs/issue-and-pr-automation/) 
-  [Local development](https://geminicli.com/docs/local-development/) 
-  [NPM package structure](https://geminicli.com/docs/npm/) 
-  [Overview](https://geminicli.com/docs/) 
-  [Quickstart](https://geminicli.com/docs/get-started/) 
-  [Installation](https://geminicli.com/docs/get-started/installation/) 
-  [Authentication](https://geminicli.com/docs/get-started/authentication/) 
-  [CLI cheatsheet](https://geminicli.com/docs/cli/cli-reference/) 
-  [Gemini 3 on Gemini CLI](https://geminicli.com/docs/get-started/gemini-3/) 
[Overview](https://geminicli.com/docs/)
[Quickstart](https://geminicli.com/docs/get-started/)
[Installation](https://geminicli.com/docs/get-started/installation/)
[Authentication](https://geminicli.com/docs/get-started/authentication/)
[CLI cheatsheet](https://geminicli.com/docs/cli/cli-reference/)
[Gemini 3 on Gemini CLI](https://geminicli.com/docs/get-started/gemini-3/)
-  [File management](https://geminicli.com/docs/cli/tutorials/file-management/) 
-  [Get started with Agent skills](https://geminicli.com/docs/cli/tutorials/skills-getting-started/) 
-  [Manage context and memory](https://geminicli.com/docs/cli/tutorials/memory-management/) 
-  [Execute shell commands](https://geminicli.com/docs/cli/tutorials/shell-commands/) 
-  [Manage sessions and history](https://geminicli.com/docs/cli/tutorials/session-management/) 
-  [Plan tasks with todos](https://geminicli.com/docs/cli/tutorials/task-planning/) 
-  [Use Plan Mode with model steering 🔬](https://geminicli.com/docs/cli/tutorials/plan-mode-steering/) 
-  [Web search and fetch](https://geminicli.com/docs/cli/tutorials/web-tools/) 
-  [Set up an MCP server](https://geminicli.com/docs/cli/tutorials/mcp-setup/) 
-  [Automate tasks](https://geminicli.com/docs/cli/tutorials/automation/) 
[File management](https://geminicli.com/docs/cli/tutorials/file-management/)
[Get started with Agent skills](https://geminicli.com/docs/cli/tutorials/skills-getting-started/)
[Manage context and memory](https://geminicli.com/docs/cli/tutorials/memory-management/)
[Execute shell commands](https://geminicli.com/docs/cli/tutorials/shell-commands/)
[Manage sessions and history](https://geminicli.com/docs/cli/tutorials/session-management/)
[Plan tasks with todos](https://geminicli.com/docs/cli/tutorials/task-planning/)
[Use Plan Mode with model steering 🔬](https://geminicli.com/docs/cli/tutorials/plan-mode-steering/)
[Web search and fetch](https://geminicli.com/docs/cli/tutorials/web-tools/)
[Set up an MCP server](https://geminicli.com/docs/cli/tutorials/mcp-setup/)

[Automate tasks](https://geminicli.com/docs/cli/tutorials/automation/)
-     Extensions        [Overview](https://geminicli.com/docs/extensions/)  [User guide: Install and manage](https://geminicli.com/docs/extensions/#manage-extensions)  [Developer guide: Build extensions](https://geminicli.com/docs/extensions/writing-extensions/)  [Developer guide: Best practices](https://geminicli.com/docs/extensions/best-practices/)  [Developer guide: Releasing](https://geminicli.com/docs/extensions/releasing/)  [Developer guide: Reference](https://geminicli.com/docs/extensions/reference/)     
-  [Overview](https://geminicli.com/docs/extensions/) 
-  [User guide: Install and manage](https://geminicli.com/docs/extensions/#manage-extensions) 
-  [Developer guide: Build extensions](https://geminicli.com/docs/extensions/writing-extensions/) 
-  [Developer guide: Best practices](https://geminicli.com/docs/extensions/best-practices/) 
-  [Developer guide: Releasing](https://geminicli.com/docs/extensions/releasing/) 
-  [Developer guide: Reference](https://geminicli.com/docs/extensions/reference/) 
-  [Agent Skills](https://geminicli.com/docs/cli/skills/) 
-  [Checkpointing](https://geminicli.com/docs/cli/checkpointing/) 
-  [Headless mode](https://geminicli.com/docs/cli/headless/) 
-  [Git worktrees 🔬](https://geminicli.com/docs/cli/git-worktrees/) 
-     Hooks        [Overview](https://geminicli.com/docs/hooks/)  [Reference](https://geminicli.com/docs/hooks/reference/)     
-  [Overview](https://geminicli.com/docs/hooks/) 
-  [Reference](https://geminicli.com/docs/hooks/reference/) 
-     IDE integration        [Overview](https://geminicli.com/docs/ide-integration/)  [Developer guide: ACP mode](https://geminicli.com/docs/cli/acp-mode/)     
-  [Overview](https://geminicli.com/docs/ide-integration/) 
-  [Developer guide: ACP mode](https://geminicli.com/docs/cli/acp-mode/) 
-  [MCP servers](https://geminicli.com/docs/tools/mcp-server/) 
-  [Model routing](https://geminicli.com/docs/cli/model-routing/) 
-  [Model selection](https://geminicli.com/docs/cli/model/) 
-  [Model steering 🔬](https://geminicli.com/docs/cli/model-steering/) 
-  [Notifications 🔬](https://geminicli.com/docs/cli/notifications/) 
-  [Plan mode](https://geminicli.com/docs/cli/plan-mode/) 
-  [Subagents](https://geminicli.com/docs/core/subagents/) 
-  [Remote subagents](https://geminicli.com/docs/core/remote-agents/) 
-  [Rewind](https://geminicli.com/docs/cli/rewind/) 
-  [Sandboxing](https://geminicli.com/docs/cli/sandbox/) 
-  [Settings](https://geminicli.com/docs/cli/settings/) 
-  [Telemetry](https://geminicli.com/docs/cli/telemetry/) 
-  [Token caching](https://geminicli.com/docs/cli/token-caching/) 
-  [Overview](https://geminicli.com/docs/extensions/) 
-  [User guide: Install and manage](https://geminicli.com/docs/extensions/#manage-extensions) 
-  [Developer guide: Build extensions](https://geminicli.com/docs/extensions/writing-extensions/) 
-  [Developer guide: Best practices](https://geminicli.com/docs/extensions/best-practices/) 
-  [Developer guide: Releasing](https://geminicli.com/docs/extensions/releasing/) 
-  [Developer guide: Reference](https://geminicli.com/docs/extensions/reference/) 
[Overview](https://geminicli.com/docs/extensions/)
[User guide: Install and manage](https://geminicli.com/docs/extensions/#manage-extensions)
[Developer guide: Build extensions](https://geminicli.com/docs/extensions/writing-extensions/)
[Developer guide: Best practices](https://geminicli.com/docs/extensions/best-practices/)
[Developer guide: Releasing](https://geminicli.com/docs/extensions/releasing/)
[Developer guide: Reference](https://geminicli.com/docs/extensions/reference/)
[Agent Skills](https://geminicli.com/docs/cli/skills/)
[Checkpointing](https://geminicli.com/docs/cli/checkpointing/)
[Headless mode](https://geminicli.com/docs/cli/headless/)
[Git worktrees 🔬](https://geminicli.com/docs/cli/git-worktrees/)
-  [Overview](https://geminicli.com/docs/hooks/) 
-  [Reference](https://geminicli.com/docs/hooks/reference/) 
[Overview](https://geminicli.com/docs/hooks/)
[Reference](https://geminicli.com/docs/hooks/reference/)
-  [Overview](https://geminicli.com/docs/ide-integration/) 
-  [Developer guide: ACP mode](https://geminicli.com/docs/cli/acp-mode/) 
[Overview](https://geminicli.com/docs/ide-integration/)
[Developer guide: ACP mode](https://geminicli.com/docs/cli/acp-mode/)
[MCP servers](https://geminicli.com/docs/tools/mcp-server/)

[Model routing](https://geminicli.com/docs/cli/model-routing/)
[Model selection](https://geminicli.com/docs/cli/model/)
[Model steering 🔬](https://geminicli.com/docs/cli/model-steering/)
[Notifications 🔬](https://geminicli.com/docs/cli/notifications/)
[Plan mode](https://geminicli.com/docs/cli/plan-mode/)
[Subagents](https://geminicli.com/docs/core/subagents/)
[Remote subagents](https://geminicli.com/docs/core/remote-agents/)
[Rewind](https://geminicli.com/docs/cli/rewind/)
[Sandboxing](https://geminicli.com/docs/cli/sandbox/)
[Settings](https://geminicli.com/docs/cli/settings/)
[Telemetry](https://geminicli.com/docs/cli/telemetry/)
[Token caching](https://geminicli.com/docs/cli/token-caching/)
-  [Custom commands](https://geminicli.com/docs/cli/custom-commands/) 
-  [Enterprise configuration](https://geminicli.com/docs/cli/enterprise/) 
-  [Ignore files (.geminiignore)](https://geminicli.com/docs/cli/gemini-ignore/) 
-  [Model configuration](https://geminicli.com/docs/cli/generation-settings/) 
-  [Project context (GEMINI.md)](https://geminicli.com/docs/cli/gemini-md/) 
-  [Settings](https://geminicli.com/docs/cli/settings/) 
-  [System prompt override](https://geminicli.com/docs/cli/system-prompt/) 
-  [Themes](https://geminicli.com/docs/cli/themes/) 
-  [Trusted folders](https://geminicli.com/docs/cli/trusted-folders/) 
[Custom commands](https://geminicli.com/docs/cli/custom-commands/)
[Enterprise configuration](https://geminicli.com/docs/cli/enterprise/)
[Ignore files (.geminiignore)](https://geminicli.com/docs/cli/gemini-ignore/)
[Model configuration](https://geminicli.com/docs/cli/generation-settings/)
[Project context (GEMINI.md)](https://geminicli.com/docs/cli/gemini-md/)
[Settings](https://geminicli.com/docs/cli/settings/)
[System prompt override](https://geminicli.com/docs/cli/system-prompt/)
[Themes](https://geminicli.com/docs/cli/themes/)
[Trusted folders](https://geminicli.com/docs/cli/trusted-folders/)
-  [Contribution guide](https://geminicli.com/docs/contributing/) 
-  [Integration testing](https://geminicli.com/docs/integration-tests/) 
-  [Issue and PR automation](https://geminicli.com/docs/issue-and-pr-automation/) 
-  [Local development](https://geminicli.com/docs/local-development/) 
-  [NPM package structure](https://geminicli.com/docs/npm/) 
[Contribution guide](https://geminicli.com/docs/contributing/)
[Integration testing](https://geminicli.com/docs/integration-tests/)
[Issue and PR automation](https://geminicli.com/docs/issue-and-pr-automation/)
[Local development](https://geminicli.com/docs/local-development/)
[NPM package structure](https://geminicli.com/docs/npm/)
[GitHub](https://github.com/google-gemini/gemini-cli)
-     Reference        [Command reference](https://geminicli.com/docs/reference/commands/)  [Configuration reference](https://geminicli.com/docs/reference/configuration/)  [Keyboard shortcuts](https://geminicli.com/docs/reference/keyboard-shortcuts/)  [Memory import processor](https://geminicli.com/docs/reference/memport/)  [Policy engine](https://geminicli.com/docs/reference/policy-engine/)  [Tools reference](https://geminicli.com/docs/reference/tools/)     
-  [Command reference](https://geminicli.com/docs/reference/commands/) 
-  [Configuration reference](https://geminicli.com/docs/reference/configuration/) 
-  [Keyboard shortcuts](https://geminicli.com/docs/reference/keyboard-shortcuts/) 
-  [Memory import processor](https://geminicli.com/docs/reference/memport/) 
-  [Policy engine](https://geminicli.com/docs/reference/policy-engine/) 
-  [Tools reference](https://geminicli.com/docs/reference/tools/) 
-  [Command reference](https://geminicli.com/docs/reference/commands/) 
-  [Configuration reference](https://geminicli.com/docs/reference/configuration/) 
-  [Keyboard shortcuts](https://geminicli.com/docs/reference/keyboard-shortcuts/) 
-  [Memory import processor](https://geminicli.com/docs/reference/memport/) 
-  [Policy engine](https://geminicli.com/docs/reference/policy-engine/) 
-  [Tools reference](https://geminicli.com/docs/reference/tools/) 
[Command reference](https://geminicli.com/docs/reference/commands/)
[Configuration reference](https://geminicli.com/docs/reference/configuration/)
[Keyboard shortcuts](https://geminicli.com/docs/reference/keyboard-shortcuts/)
[Memory import processor](https://geminicli.com/docs/reference/memport/)
[Policy engine](https://geminicli.com/docs/reference/policy-engine/)

[Tools reference](https://geminicli.com/docs/reference/tools/)
[GitHub](https://github.com/google-gemini/gemini-cli)
-     Resources        [FAQ](https://geminicli.com/docs/resources/faq/)  [Quota and pricing](https://geminicli.com/docs/resources/quota-and-pricing/)  [Terms and privacy](https://geminicli.com/docs/resources/tos-privacy/)  [Troubleshooting](https://geminicli.com/docs/resources/troubleshooting/)  [Uninstall](https://geminicli.com/docs/resources/uninstall/)     
-  [FAQ](https://geminicli.com/docs/resources/faq/) 
-  [Quota and pricing](https://geminicli.com/docs/resources/quota-and-pricing/) 
-  [Terms and privacy](https://geminicli.com/docs/resources/tos-privacy/) 
-  [Troubleshooting](https://geminicli.com/docs/resources/troubleshooting/) 
-  [Uninstall](https://geminicli.com/docs/resources/uninstall/) 
-  [FAQ](https://geminicli.com/docs/resources/faq/) 
-  [Quota and pricing](https://geminicli.com/docs/resources/quota-and-pricing/) 
-  [Terms and privacy](https://geminicli.com/docs/resources/tos-privacy/) 
-  [Troubleshooting](https://geminicli.com/docs/resources/troubleshooting/) 
-  [Uninstall](https://geminicli.com/docs/resources/uninstall/) 
[FAQ](https://geminicli.com/docs/resources/faq/)
[Quota and pricing](https://geminicli.com/docs/resources/quota-and-pricing/)
[Terms and privacy](https://geminicli.com/docs/resources/tos-privacy/)
[Troubleshooting](https://geminicli.com/docs/resources/troubleshooting/)
[Uninstall](https://geminicli.com/docs/resources/uninstall/)
[GitHub](https://github.com/google-gemini/gemini-cli)
-     Releases        [Release notes](https://geminicli.com/docs/changelogs/)  [Stable release](https://geminicli.com/docs/changelogs/latest/)  [Preview release](https://geminicli.com/docs/changelogs/preview/)     
-  [Release notes](https://geminicli.com/docs/changelogs/) 
-  [Stable release](https://geminicli.com/docs/changelogs/latest/) 
-  [Preview release](https://geminicli.com/docs/changelogs/preview/) 
-  [Release notes](https://geminicli.com/docs/changelogs/) 
-  [Stable release](https://geminicli.com/docs/changelogs/latest/) 
-  [Preview release](https://geminicli.com/docs/changelogs/preview/) 
[Release notes](https://geminicli.com/docs/changelogs/)
[Stable release](https://geminicli.com/docs/changelogs/latest/)
[Preview release](https://geminicli.com/docs/changelogs/preview/)
[GitHub](https://github.com/google-gemini/gemini-cli)
-  [Introduction](https://geminicli.com/docs/reference/policy-engine#_top)  
-  [Quick start](https://geminicli.com/docs/reference/policy-engine#quick-start)  
-  [Core concepts](https://geminicli.com/docs/reference/policy-engine#core-concepts)   [Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)   [Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)   [Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)   [Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)     
-  [Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)  
-  [Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)  
-  [Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)  
-  [Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)  
-  [Rule matching](https://geminicli.com/docs/reference/policy-engine#rule-matching)  
-  [Configuration](https://geminicli.com/docs/reference/policy-engine#configuration)   [Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)   [TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)   [Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)   [Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)   [Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)     
-  [Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)  
-  [TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)  
-  [Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)  
-  [Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)

-  [Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)  
-  [Default policies](https://geminicli.com/docs/reference/policy-engine#default-policies)  
[Introduction](https://geminicli.com/docs/reference/policy-engine#_top)
[Quick start](https://geminicli.com/docs/reference/policy-engine#quick-start)
[Core concepts](https://geminicli.com/docs/reference/policy-engine#core-concepts)
-  [Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)  
-  [Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)  
-  [Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)  
-  [Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)  
[Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)
[Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)
[Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)
[Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)
[Rule matching](https://geminicli.com/docs/reference/policy-engine#rule-matching)
[Configuration](https://geminicli.com/docs/reference/policy-engine#configuration)
-  [Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)  
-  [TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)  
-  [Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)  
-  [Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)  
-  [Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)  
[Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)
[TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)
[Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)
[Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)
[Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)
[Default policies](https://geminicli.com/docs/reference/policy-engine#default-policies)

-  [Introduction](https://geminicli.com/docs/reference/policy-engine#_top)  
-  [Quick start](https://geminicli.com/docs/reference/policy-engine#quick-start)  
-  [Core concepts](https://geminicli.com/docs/reference/policy-engine#core-concepts)   [Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)   [Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)   [Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)   [Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)     
-  [Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)  
-  [Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)  
-  [Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)  
-  [Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)  
-  [Rule matching](https://geminicli.com/docs/reference/policy-engine#rule-matching)  
-  [Configuration](https://geminicli.com/docs/reference/policy-engine#configuration)   [Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)   [TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)   [Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)   [Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)   [Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)     
-  [Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)  
-  [TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)  
-  [Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)  
-  [Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)  
-  [Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)  
-  [Default policies](https://geminicli.com/docs/reference/policy-engine#default-policies)  
[Introduction](https://geminicli.com/docs/reference/policy-engine#_top)
[Quick start](https://geminicli.com/docs/reference/policy-engine#quick-start)
[Core concepts](https://geminicli.com/docs/reference/policy-engine#core-concepts)
-  [Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)  
-  [Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)  
-  [Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)  
-  [Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)  
[Conditions](https://geminicli.com/docs/reference/policy-engine#conditions)
[Decisions](https://geminicli.com/docs/reference/policy-engine#decisions)
[Priority system and tiers](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)
[Approval modes](https://geminicli.com/docs/reference/policy-engine#approval-modes)
[Rule matching](https://geminicli.com/docs/reference/policy-engine#rule-matching)
[Configuration](https://geminicli.com/docs/reference/policy-engine#configuration)
-  [Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)  
-  [TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)  
-  [Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)  
-  [Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)  
-  [Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)  
[Policy locations](https://geminicli.com/docs/reference/policy-engine#policy-locations)
[TOML rule schema](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)
[Using arrays (lists)](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)
[Special syntax for run_shell_command](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)
[Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)

[Default policies](https://geminicli.com/docs/reference/policy-engine#default-policies)

The Gemini CLI includes a powerful policy engine that provides fine-grained control over tool execution. It allows users and administrators to define rules that determine whether a tool call should be allowed, denied, or require user confirmation.

## Quick start
[Section titled “Quick start”](https://geminicli.com/docs/reference/policy-engine#quick-start)
To create your first policy:
1. 
Create the policy directory if it doesn’t exist:
macOS/Linux
Terminal windowmkdir -p ~/.gemini/policies
Windows (PowerShell)
Terminal windowNew-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.gemini\policies"

2. 
Create a new policy file (e.g., ~/.gemini/policies/my-rules.toml). You
can use any filename ending in .toml; all such files in this directory
will be loaded and combined:
[[rule]]toolName = "run_shell_command"commandPrefix = "git status"decision = "allow"priority = 100

3. 
Run a command that triggers the policy (e.g., ask Gemini CLI to
git status). The tool will now execute automatically without prompting for
confirmation.

Create the policy directory if it doesn’t exist:
macOS/Linux

```
mkdir -p ~/.gemini/policies
```


```
mkdir -p ~/.gemini/policies
```

Windows (PowerShell)

```
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.gemini\policies"
```


```
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.gemini\policies"
```

Create a new policy file (e.g., ~/.gemini/policies/my-rules.toml). You can use any filename ending in .toml; all such files in this directory will be loaded and combined:

```
~/.gemini/policies/my-rules.toml
```


```
.toml
```


```
[[rule]]toolName = "run_shell_command"commandPrefix = "git status"decision = "allow"priority = 100
```


```
[[rule]]toolName = "run_shell_command"commandPrefix = "git status"decision = "allow"priority = 100
```

Run a command that triggers the policy (e.g., ask Gemini CLI to git status). The tool will now execute automatically without prompting for confirmation.

```
git status
```

## Core concepts
[Section titled “Core concepts”](https://geminicli.com/docs/reference/policy-engine#core-concepts)
The policy engine operates on a set of rules. Each rule is a combination of conditions and a resulting decision. When a large language model wants to execute a tool, the policy engine evaluates all rules to find the highest-priority rule that matches the tool call.
A rule consists of the following main components:
- Conditions: Criteria that a tool call must meet for the rule to apply.
This can include the tool’s name, the arguments provided to it, or the current
approval mode.
- Decision: The action to take if the rule matches (allow, deny, or
ask_user).
- Priority: A number that determines the rule’s precedence. Higher numbers
win.

```
allow
```


```
deny
```


```
ask_user
```

For example, this rule will ask for user confirmation before executing any git command.

```
git
```


```
[[rule]]toolName = "run_shell_command"commandPrefix = "git"decision = "ask_user"priority = 100
```


```
[[rule]]toolName = "run_shell_command"commandPrefix = "git"decision = "ask_user"priority = 100
```

### Conditions
[Section titled “Conditions”](https://geminicli.com/docs/reference/policy-engine#conditions)
Conditions are the criteria that a tool call must meet for a rule to apply. The primary conditions are the tool’s name and its arguments.

#### Tool Name
[Section titled “Tool Name”](https://geminicli.com/docs/reference/policy-engine#tool-name)
The toolName in the rule must match the name of the tool being called.

```
toolName
```

- Wildcards: You can use wildcards to match multiple tools.

*: Matches any tool (built-in or MCP).
mcp_server_*: Matches any tool from a specific MCP server.
mcp_*_toolName: Matches a specific tool name across all MCP servers.
mcp_*: Matches any tool from any MCP server.


- *: Matches any tool (built-in or MCP).
- mcp_server_*: Matches any tool from a specific MCP server.
- mcp_*_toolName: Matches a specific tool name across all MCP servers.
- mcp_*: Matches any tool from any MCP server.
- *: Matches any tool (built-in or MCP).
- mcp_server_*: Matches any tool from a specific MCP server.
- mcp_*_toolName: Matches a specific tool name across all MCP servers.
- mcp_*: Matches any tool from any MCP server.

```
*
```


```
mcp_server_*
```


```
mcp_*_toolName
```


```
mcp_*
```

Recommendation: While FQN wildcards are supported, the recommended approach for MCP tools is to use the mcpName field in your TOML rules. See [Special syntax for MCP tools](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools).

```
mcpName
```


#### Arguments pattern
[Section titled “Arguments pattern”](https://geminicli.com/docs/reference/policy-engine#arguments-pattern)
If argsPattern is specified, the tool’s arguments are converted to a stable JSON string, which is then tested against the provided regular expression. If the arguments don’t match the pattern, the rule does not apply.

```
argsPattern
```


#### Execution environment
[Section titled “Execution environment”](https://geminicli.com/docs/reference/policy-engine#execution-environment)
If interactive is specified, the rule will only apply if the CLI’s execution environment matches the specified boolean value:

```
interactive
```

- true: The rule applies only in interactive mode.
- false: The rule applies only in non-interactive (headless) mode.

```
true
```


```
false
```

If omitted, the rule applies to both interactive and non-interactive environments.

### Decisions
[Section titled “Decisions”](https://geminicli.com/docs/reference/policy-engine#decisions)
There are three possible decisions a rule can enforce:
- allow: The tool call is executed automatically without user interaction.
- deny: The tool call is blocked and is not executed. For global rules (those
without an argsPattern), tools that are denied are completely excluded
from the model’s memory. This means the model will not even see the tool as
an option, which is more secure and saves context window space.
- ask_user: The user is prompted to approve or deny the tool call. (In
non-interactive mode, this is treated as deny.)

```
allow
```


```
deny
```


```
argsPattern
```


```
ask_user
```


```
deny
```

Note
The deny decision is the recommended way to exclude tools. The legacy tools.exclude setting in settings.json is deprecated in favor of policy rules with a deny decision.

```
deny
```


```
tools.exclude
```


```
settings.json
```


```
deny
```

### Priority system and tiers
[Section titled “Priority system and tiers”](https://geminicli.com/docs/reference/policy-engine#priority-system-and-tiers)
The policy engine uses a sophisticated priority system to resolve conflicts when multiple rules match a single tool call. The core principle is simple: the rule with the highest priority wins.
To provide a clear hierarchy, policies are organized into three tiers. Each tier has a designated number that forms the base of the final priority calculation.
Within a TOML policy file, you assign a priority value from 0 to 999. The engine transforms this into a final priority using the following formula:
final_priority = tier_base + (toml_priority / 1000)

```
final_priority = tier_base + (toml_priority / 1000)
```

This system guarantees that:
- Admin policies always override User, Workspace, and Default policies.
- User policies override Workspace and Default policies.
- Workspace policies override Default policies.
- You can still order rules within a single tier with fine-grained control.
For example:
- A priority: 50 rule in a Default policy file becomes 1.050.
- A priority: 10 rule in a Workspace policy policy file becomes 2.010.
- A priority: 100 rule in a User policy file becomes 3.100.
- A priority: 20 rule in an Admin policy file becomes 4.020.

```
priority: 50
```


```
1.050
```


```
priority: 10
```


```
2.010
```


```
priority: 100
```


```
3.100
```


```
priority: 20
```


```
4.020
```

### Approval modes
[Section titled “Approval modes”](https://geminicli.com/docs/reference/policy-engine#approval-modes)
Approval modes allow the policy engine to apply different sets of rules based on the CLI’s operational mode. A rule can be associated with one or more modes (e.g., yolo, autoEdit, plan). The rule will only be active if the CLI is running in one of its specified modes. If a rule has no modes specified, it is always active.

```
yolo
```


```
autoEdit
```


```
plan
```

- default: The standard interactive mode where most write tools require
confirmation.
- autoEdit: Optimized for automated code editing; some write tools may be
auto-approved.
- plan: A strict, read-only mode for research and design. See
[Customizing Plan Mode Policies](https://geminicli.com/docs/cli/plan-mode#customizing-policies).
- yolo: A mode where all tools are auto-approved (use with extreme caution).

```
default
```


```
autoEdit
```


```
plan
```

[Customizing Plan Mode Policies](https://geminicli.com/docs/cli/plan-mode#customizing-policies)

```
yolo
```

## Rule matching
[Section titled “Rule matching”](https://geminicli.com/docs/reference/policy-engine#rule-matching)
When a tool call is made, the engine checks it against all active rules, starting from the highest priority. The first rule that matches determines the outcome.
A rule matches a tool call if all of its conditions are met:
1. Tool name: The toolName in the rule must match the name of the tool
being called.

Wildcards: You can use wildcards like *, mcp_server_*, or
mcp_*_toolName to match multiple tools. See [Tool Name](https://geminicli.com/docs/reference/policy-engine#tool-name) for
details.


2. Wildcards: You can use wildcards like *, mcp_server_*, or
mcp_*_toolName to match multiple tools. See [Tool Name](https://geminicli.com/docs/reference/policy-engine#tool-name) for
details.
3. Arguments pattern: If argsPattern is specified, the tool’s arguments
are converted to a stable JSON string, which is then tested against the
provided regular expression. If the arguments don’t match the pattern, the
rule does not apply.

```
toolName
```

- Wildcards: You can use wildcards like *, mcp_server_*, or
mcp_*_toolName to match multiple tools. See [Tool Name](https://geminicli.com/docs/reference/policy-engine#tool-name) for
details.

```
*
```


```
mcp_server_*
```


```
mcp_*_toolName
```

[Tool Name](https://geminicli.com/docs/reference/policy-engine#tool-name)

```
argsPattern
```

## Configuration
[Section titled “Configuration”](https://geminicli.com/docs/reference/policy-engine#configuration)
Policies are defined in .toml files. The CLI loads these files from Default, User, and (if configured) Admin directories.

```
.toml
```

[Section titled “Policy locations”](https://geminicli.com/docs/reference/policy-engine#policy-locations)

```
~/.gemini/policies/*.toml
```


```
$WORKSPACE_ROOT/.gemini/policies/*.toml
```


#### System-wide policies (Admin)
[Section titled “System-wide policies (Admin)”](https://geminicli.com/docs/reference/policy-engine#system-wide-policies-admin)
Administrators can enforce system-wide policies (Tier 4) that override all user and default settings. These policies can be loaded from standard system locations or supplemental paths.

##### Standard Locations
[Section titled “Standard Locations”](https://geminicli.com/docs/reference/policy-engine#standard-locations)
These are the default paths the CLI searches for admin policies:

```
/etc/gemini-cli/policies
```


```
/Library/Application Support/GeminiCli/policies
```


```
C:\ProgramData\gemini-cli\policies
```


##### Supplemental Admin Policies
[Section titled “Supplemental Admin Policies”](https://geminicli.com/docs/reference/policy-engine#supplemental-admin-policies)
Administrators can also specify supplemental policy paths using:
- The --admin-policy command-line flag.
- The adminPolicyPaths setting in a system settings file.

```
--admin-policy
```


```
adminPolicyPaths
```

These supplemental policies are assigned the same Admin tier (Base 4) as policies in standard locations.
Security Guard: Supplemental admin policies are ignored if any .toml policy files are found in the standard system location. This prevents flag-based overrides when a central system policy has already been established.

```
.toml
```


#### Security Requirements
[Section titled “Security Requirements”](https://geminicli.com/docs/reference/policy-engine#security-requirements)
To prevent privilege escalation, the CLI enforces strict security checks on the standard system policy directory. If checks fail, the policies in that directory are ignored.
- Linux / macOS: Must be owned by root (UID 0) and NOT writable by group
or others (e.g., chmod 755).
- Windows: Must be in C:\ProgramData. Standard users (Users, Everyone)
must NOT have Write, Modify, or Full Control permissions. If you see a
security warning, use the folder properties to remove write permissions for
non-admin groups. You may need to “Disable inheritance” in Advanced Security
Settings.

```
root
```


```
chmod 755
```


```
C:\ProgramData
```


```
Users
```


```
Everyone
```


```
Write
```


```
Modify
```


```
Full Control
```

Note
Supplemental admin policies (provided via --admin-policy or adminPolicyPaths settings) are NOT subject to these strict ownership checks, as they are explicitly provided by the user or administrator in their current execution context.

```
--admin-policy
```


```
adminPolicyPaths
```

[Section titled “TOML rule schema”](https://geminicli.com/docs/reference/policy-engine#toml-rule-schema)
Here is a breakdown of the fields available in a TOML policy rule:

```
[[rule]]# A unique name for the tool, or an array of names.toolName = "run_shell_command" # (Optional) The name of a subagent. If provided, the rule only applies to tool# calls made by this specific subagent.subagent = "generalist" # (Optional) The name of an MCP server. Can be combined with toolName# to form a composite FQN internally like "mcp_mcpName_toolName".mcpName = "my-custom-server" # (Optional) Metadata hints provided by the tool. A rule matches if all# key-value pairs provided here are present in the tool's annotations.toolAnnotations = { readOnlyHint = true } # (Optional) A regex to match against the tool's arguments.argsPattern = '"command":"(git|npm)' # (Optional) A string or array of strings that a shell command must start with.# This is syntactic sugar for `toolName = "run_shell_command"` and an# `argsPattern`.commandPrefix = "git" # (Optional) A regex to match against the entire shell command.# This is also syntactic sugar for `toolName = "run_shell_command"`.# Note: This pattern is tested against the JSON representation of the arguments# (e.g., `{"command":"<your_command>"}`). Because it prepends `"command":"`,# it effectively matches from the start of the command.# Anchors like `^` or `$` apply to the full JSON string,# so `^` should usually be avoided here.# You cannot use commandPrefix and commandRegex in the same rule.commandRegex = "git (commit|push)" # The decision to take. Must be "allow", "deny", or "ask_user".decision = "ask_user" # The priority of the rule, from 0 to 999.priority = 10 # (Optional) A custom message to display when a tool call is denied by this# rule. This message is returned to the model and user,# useful for explaining *why* it was denied.denyMessage = "Deletion is permanent" # (Optional) An array of approval modes where this rule is active.modes = ["autoEdit"] # (Optional) A boolean to restrict the rule to interactive (true) or# non-interactive (false) environments.# If omitted, the rule applies to both.interactive = true # (Optional) If true, lets shell commands use redirection operators# (>, >>, <, <<, <<<). By default, the policy engine asks for confirmation# when redirection is detected, even if a rule matches the command.# This permission is granular; it only applies to the specific rule it's# defined in. In chained commands (e.g., cmd1 > file && cmd2), each# individual command rule must permit redirection if it's used.allowRedirection = true
```

### TOML rule schema
```
[[rule]]# A unique name for the tool, or an array of names.toolName = "run_shell_command" # (Optional) The name of a subagent. If provided, the rule only applies to tool# calls made by this specific subagent.subagent = "generalist" # (Optional) The name of an MCP server. Can be combined with toolName# to form a composite FQN internally like "mcp_mcpName_toolName".mcpName = "my-custom-server" # (Optional) Metadata hints provided by the tool. A rule matches if all# key-value pairs provided here are present in the tool's annotations.toolAnnotations = { readOnlyHint = true } # (Optional) A regex to match against the tool's arguments.argsPattern = '"command":"(git|npm)' # (Optional) A string or array of strings that a shell command must start with.# This is syntactic sugar for `toolName = "run_shell_command"` and an# `argsPattern`.commandPrefix = "git" # (Optional) A regex to match against the entire shell command.# This is also syntactic sugar for `toolName = "run_shell_command"`.# Note: This pattern is tested against the JSON representation of the arguments# (e.g., `{"command":"<your_command>"}`). Because it prepends `"command":"`,# it effectively matches from the start of the command.# Anchors like `^` or `$` apply to the full JSON string,# so `^` should usually be avoided here.# You cannot use commandPrefix and commandRegex in the same rule.commandRegex = "git (commit|push)" # The decision to take. Must be "allow", "deny", or "ask_user".decision = "ask_user" # The priority of the rule, from 0 to 999.priority = 10 # (Optional) A custom message to display when a tool call is denied by this# rule. This message is returned to the model and user,# useful for explaining *why* it was denied.denyMessage = "Deletion is permanent" # (Optional) An array of approval modes where this rule is active.modes = ["autoEdit"] # (Optional) A boolean to restrict the rule to interactive (true) or# non-interactive (false) environments.# If omitted, the rule applies to both.interactive = true # (Optional) If true, lets shell commands use redirection operators# (>, >>, <, <<, <<<). By default, the policy engine asks for confirmation# when redirection is detected, even if a rule matches the command.# This permission is granular; it only applies to the specific rule it's# defined in. In chained commands (e.g., cmd1 > file && cmd2), each# individual command rule must permit redirection if it's used.allowRedirection = true
```

### Using arrays (lists)
[Section titled “Using arrays (lists)”](https://geminicli.com/docs/reference/policy-engine#using-arrays-lists)
To apply the same rule to multiple tools or command prefixes, you can provide an array of strings for the toolName and commandPrefix fields.

```
toolName
```


```
commandPrefix
```

Example:
This single rule will apply to both the write_file and replace tools.

```
write_file
```


```
replace
```


```
[[rule]]toolName = ["write_file", "replace"]decision = "ask_user"priority = 10
```


```
[[rule]]toolName = ["write_file", "replace"]decision = "ask_user"priority = 10
```

### Special syntax for run_shell_command
```
run_shell_command
```

[Section titled “Special syntax for run_shell_command”](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-run_shell_command)
To simplify writing policies for run_shell_command, you can use commandPrefix or commandRegex instead of the more complex argsPattern.

```
run_shell_command
```


```
commandPrefix
```


```
commandRegex
```


```
argsPattern
```

- commandPrefix: Matches if the command argument starts with the given
string.
- commandRegex: Matches if the command argument matches the given regular
expression.

```
commandPrefix
```


```
command
```


```
commandRegex
```


```
command
```

Example:
This rule will ask for user confirmation before executing any git command.

```
git
```


```
[[rule]]toolName = "run_shell_command"commandPrefix = "git"decision = "ask_user"priority = 100
```


```
[[rule]]toolName = "run_shell_command"commandPrefix = "git"decision = "ask_user"priority = 100
```

[Section titled “Special syntax for MCP tools”](https://geminicli.com/docs/reference/policy-engine#special-syntax-for-mcp-tools)
You can create rules that target tools from Model Context Protocol (MCP) servers using the mcpName field. This is the recommended approach for defining MCP policies, as it is much more robust than manually writing Fully Qualified Names (FQNs) or string wildcards.

```
mcpName
```

Caution
Do not use underscores (_) in your MCP server names (e.g., use my-server rather than my_server). The policy parser splits Fully Qualified Names (mcp_server_tool) on the first underscore following the mcp_ prefix. If your server name contains an underscore, the parser will misinterpret the server identity, which can cause wildcard rules and security policies to fail silently.

```
_
```


```
my-server
```


```
my_server
```


```
mcp_server_tool
```


```
mcp_
```

1. Targeting a specific tool on a server
Combine mcpName and toolName to target a single operation. When using mcpName, the toolName field should strictly be the simple name of the tool (e.g., search), not the Fully Qualified Name (e.g., mcp_server_search).

```
mcpName
```


```
toolName
```


```
mcpName
```


```
toolName
```


```
search
```


```
mcp_server_search
```


```
# Allows the `search` tool on the `my-jira-server` MCP[[rule]]mcpName = "my-jira-server"toolName = "search"decision = "allow"priority = 200
```


```
# Allows the `search` tool on the `my-jira-server` MCP[[rule]]mcpName = "my-jira-server"toolName = "search"decision = "allow"priority = 200
```

2. Targeting all tools on a specific server
Specify only the mcpName to apply a rule to every tool provided by that server.

```
mcpName
```

Note: This applies to all decision types (allow, deny, ask_user).

```
allow
```


```
deny
```


```
ask_user
```


```
# Denies all tools from the `untrusted-server` MCP[[rule]]mcpName = "untrusted-server"decision = "deny"priority = 500denyMessage = "This server is not trusted by the admin."
```


```
# Denies all tools from the `untrusted-server` MCP[[rule]]mcpName = "untrusted-server"decision = "deny"priority = 500denyMessage = "This server is not trusted by the admin."
```

3. Targeting all MCP servers
Use mcpName = "*" to create a rule that applies to all tools from any registered MCP server. This is useful for setting category-wide defaults.

```
mcpName = "*"
```


```
# Ask user for any tool call from any MCP server[[rule]]toolName = "*"mcpName = "*"decision = "ask_user"priority = 10
```


```
# Ask user for any tool call from any MCP server[[rule]]toolName = "*"mcpName = "*"decision = "ask_user"priority = 10
```

4. Targeting a tool name across all servers
Use mcpName = "*" with a specific toolName to target that operation regardless of which server provides it.

```
mcpName = "*"
```


```
toolName
```


```
# Allow the `search` tool across all connected MCP servers[[rule]]mcpName = "*"toolName = "search"decision = "allow"priority = 50
```


```
# Allow the `search` tool across all connected MCP servers[[rule]]mcpName = "*"toolName = "search"decision = "allow"priority = 50
```

[Section titled “Default policies”](https://geminicli.com/docs/reference/policy-engine#default-policies)
The Gemini CLI ships with a set of default policies to provide a safe out-of-the-box experience.
- Read-only tools (like read_file, glob) are generally allowed.
- Agent delegation defaults to ask_user to ensure remote agents can
prompt for confirmation, but local sub-agent actions are executed silently and
checked individually.
- Write tools (like write_file, run_shell_command) default to
ask_user.
- In yolo mode, a high-priority rule allows all tools.
- In autoEdit mode, rules allow certain write operations to happen without
prompting.

```
read_file
```


```
glob
```


```
ask_user
```


```
write_file
```


```
run_shell_command
```


```
ask_user
```


```
yolo
```


```
autoEdit
```

[cookies](https://policies.google.com/technologies/cookies)
[Terms](https://geminicli.com/terms)
[Privacy](https://policies.google.com/privacy)

