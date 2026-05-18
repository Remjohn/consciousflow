Title: Git Worktrees (experimental) | Gemini CLI

Source: https://geminicli.com/docs/cli/git-worktrees

---

[Skip to content](https://geminicli.com/docs/cli/git-worktrees#_top)
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
[Feedback](https://github.com/google-gemini/gemini-cli/issues/new?template=website_issue.yml&url=https%3A%2F%2Fgeminicli.com%2Fdocs%2Fcli%2Fgit-worktrees%2F)
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
-  [Introduction](https://geminicli.com/docs/cli/git-worktrees#_top)  
-  [How to enable Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-enable-git-worktrees)  
-  [How to use Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-use-git-worktrees)  
-  [How to exit a Git worktree session](https://geminicli.com/docs/cli/git-worktrees#how-to-exit-a-git-worktree-session)  
-  [Resuming work in a Git worktree](https://geminicli.com/docs/cli/git-worktrees#resuming-work-in-a-git-worktree)  
-  [Managing Git worktrees manually](https://geminicli.com/docs/cli/git-worktrees#managing-git-worktrees-manually)  
[Introduction](https://geminicli.com/docs/cli/git-worktrees#_top)
[How to enable Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-enable-git-worktrees)
[How to use Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-use-git-worktrees)
[How to exit a Git worktree session](https://geminicli.com/docs/cli/git-worktrees#how-to-exit-a-git-worktree-session)
[Resuming work in a Git worktree](https://geminicli.com/docs/cli/git-worktrees#resuming-work-in-a-git-worktree)
[Managing Git worktrees manually](https://geminicli.com/docs/cli/git-worktrees#managing-git-worktrees-manually)

-  [Introduction](https://geminicli.com/docs/cli/git-worktrees#_top)  
-  [How to enable Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-enable-git-worktrees)  
-  [How to use Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-use-git-worktrees)  
-  [How to exit a Git worktree session](https://geminicli.com/docs/cli/git-worktrees#how-to-exit-a-git-worktree-session)  
-  [Resuming work in a Git worktree](https://geminicli.com/docs/cli/git-worktrees#resuming-work-in-a-git-worktree)  
-  [Managing Git worktrees manually](https://geminicli.com/docs/cli/git-worktrees#managing-git-worktrees-manually)  
[Introduction](https://geminicli.com/docs/cli/git-worktrees#_top)
[How to enable Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-enable-git-worktrees)
[How to use Git worktrees](https://geminicli.com/docs/cli/git-worktrees#how-to-use-git-worktrees)
[How to exit a Git worktree session](https://geminicli.com/docs/cli/git-worktrees#how-to-exit-a-git-worktree-session)
[Resuming work in a Git worktree](https://geminicli.com/docs/cli/git-worktrees#resuming-work-in-a-git-worktree)
[Managing Git worktrees manually](https://geminicli.com/docs/cli/git-worktrees#managing-git-worktrees-manually)

When working on multiple tasks at once, you can use Git worktrees to give each Gemini session its own copy of the codebase. Git worktrees create separate working directories that each have their own files and branch while sharing the same repository history. This prevents changes in one session from colliding with another.
Learn more about [session management](https://geminicli.com/docs/cli/session-management).
Note
This is an experimental feature currently under active development. Your feedback is invaluable as we refine this feature. If you have ideas, suggestions, or encounter issues:
- [Open an issue](https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml) on GitHub.
- Use the /bug command within Gemini CLI to file an issue.
[Open an issue](https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml)
Learn more in the official Git worktree [documentation](https://git-scm.com/docs/git-worktree).

## How to enable Git worktrees
[Section titled “How to enable Git worktrees”](https://geminicli.com/docs/cli/git-worktrees#how-to-enable-git-worktrees)
Git worktrees are an experimental feature. You must enable them in your settings using the /settings command or by manually editing your settings.json file.

```
/settings
```


```
settings.json
```

1. Use the /settings command.
2. Search for and set Enable Git Worktrees to true.

```
/settings
```


```
true
```

Alternatively, add the following to your settings.json:

```
settings.json
```


```
{ "experimental": { "worktrees": true }}
```


```
{ "experimental": { "worktrees": true }}
```

## How to use Git worktrees
[Section titled “How to use Git worktrees”](https://geminicli.com/docs/cli/git-worktrees#how-to-use-git-worktrees)
Use the --worktree (-w) flag to create an isolated worktree and start Gemini CLI in it.

```
--worktree
```


```
-w
```

- 
Start with a specific name: The value you pass becomes both the directory
name (within .gemini/worktrees/) and the branch name.
Terminal windowgemini --worktree feature-search

- 
Start with a random name: If you omit the name, Gemini generates a random
one automatically (for example, worktree-a1b2c3d4).
Terminal windowgemini --worktree

Start with a specific name: The value you pass becomes both the directory name (within .gemini/worktrees/) and the branch name.

```
.gemini/worktrees/
```


```
gemini --worktree feature-search
```


```
gemini --worktree feature-search
```

Start with a random name: If you omit the name, Gemini generates a random one automatically (for example, worktree-a1b2c3d4).

```
worktree-a1b2c3d4
```


```
gemini --worktree
```


```
gemini --worktree
```

Note
Remember to initialize your development environment in each new worktree according to your project’s setup. Depending on your stack, this might include running dependency installation (npm install, yarn), setting up virtual environments, or following your project’s standard build process.

```
npm install
```


```
yarn
```

## How to exit a Git worktree session
[Section titled “How to exit a Git worktree session”](https://geminicli.com/docs/cli/git-worktrees#how-to-exit-a-git-worktree-session)
When you exit a worktree session (using /quit or Ctrl+C), Gemini leaves the worktree intact so your work is not lost. This includes your uncommitted changes (modified files, staged changes, or untracked files) and any new commits you have made.

```
/quit
```


```
Ctrl+C
```

Gemini prioritizes a fast and safe exit: it does not automatically delete your worktree or branch. You are responsible for cleaning up your worktrees manually once you are finished with them.
When you exit, Gemini displays instructions on how to resume your work or how to manually remove the worktree if you no longer need it.

## Resuming work in a Git worktree
[Section titled “Resuming work in a Git worktree”](https://geminicli.com/docs/cli/git-worktrees#resuming-work-in-a-git-worktree)
To resume a session in a worktree, navigate to the worktree directory and start Gemini CLI with the --resume flag and the session ID:

```
--resume
```


```
cd .gemini/worktrees/feature-searchgemini --resume <session_id>
```


```
cd .gemini/worktrees/feature-searchgemini --resume <session_id>
```

## Managing Git worktrees manually
[Section titled “Managing Git worktrees manually”](https://geminicli.com/docs/cli/git-worktrees#managing-git-worktrees-manually)
For more control over worktree location and branch configuration, or to clean up a preserved worktree, you can use Git directly:
- Clean up a preserved Git worktree:
Terminal windowgit worktree remove .gemini/worktrees/feature-search --forcegit branch -D worktree-feature-search

- Create a Git worktree manually:
Terminal windowgit worktree add ../project-feature-search -b feature-searchcd ../project-feature-search && gemini


```
git worktree remove .gemini/worktrees/feature-search --forcegit branch -D worktree-feature-search
```


```
git worktree remove .gemini/worktrees/feature-search --forcegit branch -D worktree-feature-search
```


```
git worktree add ../project-feature-search -b feature-searchcd ../project-feature-search && gemini
```


```
git worktree add ../project-feature-search -b feature-searchcd ../project-feature-search && gemini
```

[cookies](https://policies.google.com/technologies/cookies)
[Terms](https://geminicli.com/terms)
[Privacy](https://policies.google.com/privacy)

