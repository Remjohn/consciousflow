Title: Build Gemini CLI extensions | Gemini CLI

Source: https://geminicli.com/docs/extensions/writing-extensions

---

[Skip to content](https://geminicli.com/docs/extensions/writing-extensions#_top)
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
[Feedback](https://github.com/google-gemini/gemini-cli/issues/new?template=website_issue.yml&url=https%3A%2F%2Fgeminicli.com%2Fdocs%2Fextensions%2Fwriting-extensions%2F)
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
-  [Introduction](https://geminicli.com/docs/extensions/writing-extensions#_top)  
-  [Prerequisites](https://geminicli.com/docs/extensions/writing-extensions#prerequisites)  
-  [Extension features](https://geminicli.com/docs/extensions/writing-extensions#extension-features)  
-  [Step 1: Create a new extension](https://geminicli.com/docs/extensions/writing-extensions#step-1-create-a-new-extension)  
-  [Step 2: Understand the extension files](https://geminicli.com/docs/extensions/writing-extensions#step-2-understand-the-extension-files)   [gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)   [example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)   [package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)     
-  [gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)  
-  [example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)  
-  [package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)  
-  [Step 3: Add extension settings](https://geminicli.com/docs/extensions/writing-extensions#step-3-add-extension-settings)  
-  [Step 4: Link your extension](https://geminicli.com/docs/extensions/writing-extensions#step-4-link-your-extension)  
-  [Step 5: Add a custom command](https://geminicli.com/docs/extensions/writing-extensions#step-5-add-a-custom-command)  
-  [Step 6: Add a custom GEMINI.md](https://geminicli.com/docs/extensions/writing-extensions#step-6-add-a-custom-geminimd)  
-  [(Optional) Step 7: Add an Agent Skill](https://geminicli.com/docs/extensions/writing-extensions#optional-step-7-add-an-agent-skill)  
-  [Step 8: Release your extension](https://geminicli.com/docs/extensions/writing-extensions#step-8-release-your-extension)  
-  [Next steps](https://geminicli.com/docs/extensions/writing-extensions#next-steps)  
[Introduction](https://geminicli.com/docs/extensions/writing-extensions#_top)

[Prerequisites](https://geminicli.com/docs/extensions/writing-extensions#prerequisites)
[Extension features](https://geminicli.com/docs/extensions/writing-extensions#extension-features)
[Step 1: Create a new extension](https://geminicli.com/docs/extensions/writing-extensions#step-1-create-a-new-extension)
[Step 2: Understand the extension files](https://geminicli.com/docs/extensions/writing-extensions#step-2-understand-the-extension-files)
-  [gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)  
-  [example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)  
-  [package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)  
[gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)
[example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)
[package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)
[Step 3: Add extension settings](https://geminicli.com/docs/extensions/writing-extensions#step-3-add-extension-settings)
[Step 4: Link your extension](https://geminicli.com/docs/extensions/writing-extensions#step-4-link-your-extension)
[Step 5: Add a custom command](https://geminicli.com/docs/extensions/writing-extensions#step-5-add-a-custom-command)
[Step 6: Add a custom GEMINI.md](https://geminicli.com/docs/extensions/writing-extensions#step-6-add-a-custom-geminimd)
[(Optional) Step 7: Add an Agent Skill](https://geminicli.com/docs/extensions/writing-extensions#optional-step-7-add-an-agent-skill)
[Step 8: Release your extension](https://geminicli.com/docs/extensions/writing-extensions#step-8-release-your-extension)
[Next steps](https://geminicli.com/docs/extensions/writing-extensions#next-steps)

-  [Introduction](https://geminicli.com/docs/extensions/writing-extensions#_top)  
-  [Prerequisites](https://geminicli.com/docs/extensions/writing-extensions#prerequisites)  
-  [Extension features](https://geminicli.com/docs/extensions/writing-extensions#extension-features)  
-  [Step 1: Create a new extension](https://geminicli.com/docs/extensions/writing-extensions#step-1-create-a-new-extension)  
-  [Step 2: Understand the extension files](https://geminicli.com/docs/extensions/writing-extensions#step-2-understand-the-extension-files)   [gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)   [example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)   [package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)     
-  [gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)  
-  [example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)  
-  [package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)  
-  [Step 3: Add extension settings](https://geminicli.com/docs/extensions/writing-extensions#step-3-add-extension-settings)  
-  [Step 4: Link your extension](https://geminicli.com/docs/extensions/writing-extensions#step-4-link-your-extension)  
-  [Step 5: Add a custom command](https://geminicli.com/docs/extensions/writing-extensions#step-5-add-a-custom-command)  
-  [Step 6: Add a custom GEMINI.md](https://geminicli.com/docs/extensions/writing-extensions#step-6-add-a-custom-geminimd)  
-  [(Optional) Step 7: Add an Agent Skill](https://geminicli.com/docs/extensions/writing-extensions#optional-step-7-add-an-agent-skill)  
-  [Step 8: Release your extension](https://geminicli.com/docs/extensions/writing-extensions#step-8-release-your-extension)  
-  [Next steps](https://geminicli.com/docs/extensions/writing-extensions#next-steps)  
[Introduction](https://geminicli.com/docs/extensions/writing-extensions#_top)
[Prerequisites](https://geminicli.com/docs/extensions/writing-extensions#prerequisites)
[Extension features](https://geminicli.com/docs/extensions/writing-extensions#extension-features)
[Step 1: Create a new extension](https://geminicli.com/docs/extensions/writing-extensions#step-1-create-a-new-extension)
[Step 2: Understand the extension files](https://geminicli.com/docs/extensions/writing-extensions#step-2-understand-the-extension-files)
-  [gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)  
-  [example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)  
-  [package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)  
[gemini-extension.json](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)
[example.js](https://geminicli.com/docs/extensions/writing-extensions#examplejs)
[package.json](https://geminicli.com/docs/extensions/writing-extensions#packagejson)
[Step 3: Add extension settings](https://geminicli.com/docs/extensions/writing-extensions#step-3-add-extension-settings)
[Step 4: Link your extension](https://geminicli.com/docs/extensions/writing-extensions#step-4-link-your-extension)
[Step 5: Add a custom command](https://geminicli.com/docs/extensions/writing-extensions#step-5-add-a-custom-command)
[Step 6: Add a custom GEMINI.md](https://geminicli.com/docs/extensions/writing-extensions#step-6-add-a-custom-geminimd)
[(Optional) Step 7: Add an Agent Skill](https://geminicli.com/docs/extensions/writing-extensions#optional-step-7-add-an-agent-skill)
[Step 8: Release your extension](https://geminicli.com/docs/extensions/writing-extensions#step-8-release-your-extension)
[Next steps](https://geminicli.com/docs/extensions/writing-extensions#next-steps)

Gemini CLI extensions let you expand the capabilities of Gemini CLI by adding custom tools, commands, and context. This guide walks you through creating your first extension, from setting up a template to adding custom functionality and linking it for local development.

## Prerequisites
[Section titled “Prerequisites”](https://geminicli.com/docs/extensions/writing-extensions#prerequisites)
Before you start, ensure you have the Gemini CLI installed and a basic understanding of Node.js.

## Extension features
[Section titled “Extension features”](https://geminicli.com/docs/extensions/writing-extensions#extension-features)
Extensions offer several ways to customize Gemini CLI. Use this table to decide which features your extension needs.
[MCP server](https://geminicli.com/docs/extensions/reference#mcp-servers)
[Custom commands](https://geminicli.com/docs/cli/custom-commands)

```
/my-cmd
```

[Context file (GEMINI.md)](https://geminicli.com/docs/extensions/reference#contextfilename)

```
GEMINI.md
```

[Agent skills](https://geminicli.com/docs/cli/skills)
[Hooks](https://geminicli.com/docs/hooks)
[Custom themes](https://geminicli.com/docs/extensions/reference#themes)

## Step 1: Create a new extension
[Section titled “Step 1: Create a new extension”](https://geminicli.com/docs/extensions/writing-extensions#step-1-create-a-new-extension)
The easiest way to start is by using a built-in template. We’ll use the mcp-server example as our foundation.

```
mcp-server
```

Run the following command to create a new directory called my-first-extension with the template files:

```
my-first-extension
```


```
gemini extensions new my-first-extension mcp-server
```


```
gemini extensions new my-first-extension mcp-server
```

This creates a directory with the following structure:

```
my-first-extension/├── example.js├── gemini-extension.json└── package.json
```


```
my-first-extension/├── example.js├── gemini-extension.json└── package.json
```

## Step 2: Understand the extension files
[Section titled “Step 2: Understand the extension files”](https://geminicli.com/docs/extensions/writing-extensions#step-2-understand-the-extension-files)
Your new extension contains several key files that define its behavior.

### gemini-extension.json
```
gemini-extension.json
```

[Section titled “gemini-extension.json”](https://geminicli.com/docs/extensions/writing-extensions#gemini-extensionjson)
The manifest file tells Gemini CLI how to load and use your extension.

```
{ "name": "mcp-server-example", "version": "1.0.0", "mcpServers": { "nodeServer": { "command": "node", "args": ["${extensionPath}${/}example.js"], "cwd": "${extensionPath}" } }}
```


```
{ "name": "mcp-server-example", "version": "1.0.0", "mcpServers": { "nodeServer": { "command": "node", "args": ["${extensionPath}${/}example.js"], "cwd": "${extensionPath}" } }}
```

- name: The unique name for your extension.
- version: The version of your extension.
- mcpServers: Defines Model Context Protocol (MCP) servers to add new tools.

command, args, cwd: Specify how to start your server. The
${extensionPath} variable is replaced with the absolute path to your
extension’s directory.


- command, args, cwd: Specify how to start your server. The
${extensionPath} variable is replaced with the absolute path to your
extension’s directory.

```
name
```


```
version
```


```
mcpServers
```

- command, args, cwd: Specify how to start your server. The
${extensionPath} variable is replaced with the absolute path to your
extension’s directory.

```
command
```


```
args
```


```
cwd
```


```
${extensionPath}
```

### example.js
```
example.js
```

[Section titled “example.js”](https://geminicli.com/docs/extensions/writing-extensions#examplejs)
This file contains the source code for your MCP server. It uses the @modelcontextprotocol/sdk to define tools.

```
@modelcontextprotocol/sdk
```


```
/** * @license * Copyright 2025 Google LLC * SPDX-License-Identifier: Apache-2.0 */ import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';import { z } from 'zod'; const server = new McpServer({ name: 'prompt-server', version: '1.0.0',}); // Registers a new tool named 'fetch_posts'server.registerTool( 'fetch_posts', { description: 'Fetches a list of posts from a public API.', inputSchema: z.object({}).shape, }, async () => { const apiResponse = await fetch( 'https://jsonplaceholder.typicode.com/posts', ); const posts = await apiResponse.json(); const response = { posts: posts.slice(0, 5) }; return { content: [ { type: 'text', text: JSON.stringify(response), }, ], }; },); const transport = new StdioServerTransport();await server.connect(transport);
```


```
/** * @license * Copyright 2025 Google LLC * SPDX-License-Identifier: Apache-2.0 */ import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';import { z } from 'zod'; const server = new McpServer({ name: 'prompt-server', version: '1.0.0',}); // Registers a new tool named 'fetch_posts'server.registerTool( 'fetch_posts', { description: 'Fetches a list of posts from a public API.', inputSchema: z.object({}).shape, }, async () => { const apiResponse = await fetch( 'https://jsonplaceholder.typicode.com/posts', ); const posts = await apiResponse.json(); const response = { posts: posts.slice(0, 5) }; return { content: [ { type: 'text', text: JSON.stringify(response), }, ], }; },); const transport = new StdioServerTransport();await server.connect(transport);
```

### package.json
```
package.json
```

[Section titled “package.json”](https://geminicli.com/docs/extensions/writing-extensions#packagejson)
The standard configuration file for a Node.js project. It defines dependencies and scripts for your extension.

## Step 3: Add extension settings
[Section titled “Step 3: Add extension settings”](https://geminicli.com/docs/extensions/writing-extensions#step-3-add-extension-settings)
Some extensions need configuration, such as API keys or user preferences. Let’s add a setting for an API key.
1. 
Open gemini-extension.json.

2. 
Add a settings array to the configuration:
{  "name": "mcp-server-example",  "version": "1.0.0",  "settings": [    {      "name": "API Key",      "description": "The API key for the service.",      "envVar": "MY_SERVICE_API_KEY",      "sensitive": true    }  ],  "mcpServers": {    // ...  }}

Open gemini-extension.json.

```
gemini-extension.json
```

Add a settings array to the configuration:

```
settings
```


```
{ "name": "mcp-server-example", "version": "1.0.0", "settings": [ { "name": "API Key", "description": "The API key for the service.", "envVar": "MY_SERVICE_API_KEY", "sensitive": true } ], "mcpServers": { // ... }}
```


```
{ "name": "mcp-server-example", "version": "1.0.0", "settings": [ { "name": "API Key", "description": "The API key for the service.", "envVar": "MY_SERVICE_API_KEY", "sensitive": true } ], "mcpServers": { // ... }}
```

When a user installs this extension, Gemini CLI will prompt them to enter the “API Key”. The value will be stored securely in the system keychain (because sensitive is true) and injected into the MCP server’s process as the MY_SERVICE_API_KEY environment variable.

```
sensitive
```


```
MY_SERVICE_API_KEY
```

## Step 4: Link your extension
[Section titled “Step 4: Link your extension”](https://geminicli.com/docs/extensions/writing-extensions#step-4-link-your-extension)
Link your extension to your Gemini CLI installation for local development.
1. 
Install dependencies:
Terminal windowcd my-first-extensionnpm install

2. 
Link the extension:
The link command creates a symbolic link from the Gemini CLI extensions
directory to your development directory. Changes you make are reflected
immediately.
Terminal windowgemini extensions link .

Install dependencies:

```
cd my-first-extensionnpm install
```


```
cd my-first-extensionnpm install
```

Link the extension:
The link command creates a symbolic link from the Gemini CLI extensions directory to your development directory. Changes you make are reflected immediately.

```
link
```


```
gemini extensions link .
```


```
gemini extensions link .
```

Restart your Gemini CLI session to use the new fetch_posts tool. Test it by asking: “fetch posts”.

```
fetch_posts
```

## Step 5: Add a custom command
[Section titled “Step 5: Add a custom command”](https://geminicli.com/docs/extensions/writing-extensions#step-5-add-a-custom-command)
Custom commands create shortcuts for complex prompts.
1. 
Create a commands directory and a subdirectory for your command group:
macOS/Linux
Terminal windowmkdir -p commands/fs
Windows (PowerShell)
Terminal windowNew-Item -ItemType Directory -Force -Path "commands\fs"

2. 
Create a file named commands/fs/grep-code.toml:
prompt = """Please summarize the findings for the pattern `{{args}}`.
Search Results:!{grep -r {{args}} .}"""
This command, /fs:grep-code, takes an argument, runs the grep shell
command, and pipes the results into a prompt for summarization.

Create a commands directory and a subdirectory for your command group:

```
commands
```

macOS/Linux

```
mkdir -p commands/fs
```


```
mkdir -p commands/fs
```

Windows (PowerShell)

```
New-Item -ItemType Directory -Force -Path "commands\fs"
```


```
New-Item -ItemType Directory -Force -Path "commands\fs"
```

Create a file named commands/fs/grep-code.toml:

```
commands/fs/grep-code.toml
```


```
prompt = """Please summarize the findings for the pattern `{{args}}`. Search Results:!{grep -r {{args}} .}"""
```


```
prompt = """Please summarize the findings for the pattern `{{args}}`. Search Results:!{grep -r {{args}} .}"""
```

This command, /fs:grep-code, takes an argument, runs the grep shell command, and pipes the results into a prompt for summarization.

```
/fs:grep-code
```


```
grep
```

After saving the file, restart Gemini CLI. Run /fs:grep-code "some pattern" to use your new command.

```
/fs:grep-code "some pattern"
```

```
GEMINI.md
```

[Section titled “Step 6: Add a custom GEMINI.md”](https://geminicli.com/docs/extensions/writing-extensions#step-6-add-a-custom-geminimd)
Provide persistent context to the model by adding a GEMINI.md file to your extension. This is useful for setting behavior or providing essential tool information.

```
GEMINI.md
```

1. 
Create a file named GEMINI.md in the root of your extension directory:

You are an expert developer assistant. When the user asks you to fetchposts, use the `fetch_posts` tool. Be concise in your responses.

2. 
Update your gemini-extension.json to load this file:
{  "name": "my-first-extension",  "version": "1.0.0",  "contextFileName": "GEMINI.md",  "mcpServers": {    "nodeServer": {      "command": "node",      "args": ["${extensionPath}${/}example.js"],      "cwd": "${extensionPath}"    }  }}

Create a file named GEMINI.md in the root of your extension directory:

```
GEMINI.md
```


```
# My First Extension Instructions You are an expert developer assistant. When the user asks you to fetchposts, use the `fetch_posts` tool. Be concise in your responses.
```


```
# My First Extension Instructions You are an expert developer assistant. When the user asks you to fetchposts, use the `fetch_posts` tool. Be concise in your responses.
```

Update your gemini-extension.json to load this file:

```
gemini-extension.json
```


```
{ "name": "my-first-extension", "version": "1.0.0", "contextFileName": "GEMINI.md", "mcpServers": { "nodeServer": { "command": "node", "args": ["${extensionPath}${/}example.js"], "cwd": "${extensionPath}" } }}
```


```
{ "name": "my-first-extension", "version": "1.0.0", "contextFileName": "GEMINI.md", "mcpServers": { "nodeServer": { "command": "node", "args": ["${extensionPath}${/}example.js"], "cwd": "${extensionPath}" } }}
```

Restart Gemini CLI. The model now has the context from your GEMINI.md file in every session where the extension is active.

```
GEMINI.md
```

[Section titled “(Optional) Step 7: Add an Agent Skill”](https://geminicli.com/docs/extensions/writing-extensions#optional-step-7-add-an-agent-skill)
[Agent Skills](https://geminicli.com/docs/cli/skills) bundle specialized expertise and workflows. Skills are activated only when needed, which saves context tokens.
1. 
Create a skills directory and a subdirectory for your skill:
macOS/Linux
Terminal windowmkdir -p skills/security-audit
Windows (PowerShell)
Terminal windowNew-Item -ItemType Directory -Force -Path "skills\security-audit"

2. 
Create a skills/security-audit/SKILL.md file:
---name: security-auditdescription:  Expertise in auditing code for security vulnerabilities. Use when the user  asks to "check for security issues" or "audit" their changes.---

You are an expert security researcher. When auditing code:
1. Look for common vulnerabilities (OWASP Top 10).2. Check for hardcoded secrets or API keys.3. Suggest remediation steps for any findings.

Create a skills directory and a subdirectory for your skill:

```
skills
```

macOS/Linux

```
mkdir -p skills/security-audit
```


```
mkdir -p skills/security-audit
```

Windows (PowerShell)

```
New-Item -ItemType Directory -Force -Path "skills\security-audit"
```


```
New-Item -ItemType Directory -Force -Path "skills\security-audit"
```

Create a skills/security-audit/SKILL.md file:

```
skills/security-audit/SKILL.md
```


```
---name: security-auditdescription: Expertise in auditing code for security vulnerabilities. Use when the user asks to "check for security issues" or "audit" their changes.--- # Security Auditor You are an expert security researcher. When auditing code: 1. Look for common vulnerabilities (OWASP Top 10).2. Check for hardcoded secrets or API keys.3. Suggest remediation steps for any findings.
```


```
---name: security-auditdescription: Expertise in auditing code for security vulnerabilities. Use when the user asks to "check for security issues" or "audit" their changes.--- # Security Auditor You are an expert security researcher. When auditing code: 1. Look for common vulnerabilities (OWASP Top 10).2. Check for hardcoded secrets or API keys.3. Suggest remediation steps for any findings.
```

Gemini CLI automatically discovers skills bundled with your extension. The model activates them when it identifies a relevant task.

## Step 8: Release your extension
[Section titled “Step 8: Release your extension”](https://geminicli.com/docs/extensions/writing-extensions#step-8-release-your-extension)
When your extension is ready, share it with others via a Git repository or GitHub Releases. Refer to the [Extension Releasing Guide](https://geminicli.com/docs/extensions/releasing) for detailed instructions and learn how to list your extension in the gallery.

## Next steps
[Section titled “Next steps”](https://geminicli.com/docs/extensions/writing-extensions#next-steps)
- [Extension reference](https://geminicli.com/docs/extensions/reference): Deeply understand the extension format,
commands, and configuration.
- [Best practices](https://geminicli.com/docs/extensions/best-practices): Learn strategies for building great
extensions.
[Extension reference](https://geminicli.com/docs/extensions/reference)
[Best practices](https://geminicli.com/docs/extensions/best-practices)
[cookies](https://policies.google.com/technologies/cookies)
[Terms](https://geminicli.com/terms)
[Privacy](https://policies.google.com/privacy)

