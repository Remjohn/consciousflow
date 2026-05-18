Title: Ignoring files | Gemini CLI

Source: https://geminicli.com/docs/cli/gemini-ignore

---

[Skip to content](https://geminicli.com/docs/cli/gemini-ignore#_top)
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
[Feedback](https://github.com/google-gemini/gemini-cli/issues/new?template=website_issue.yml&url=https%3A%2F%2Fgeminicli.com%2Fdocs%2Fcli%2Fgemini-ignore%2F)
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
-  [Introduction](https://geminicli.com/docs/cli/gemini-ignore#_top)  
-  [How it works](https://geminicli.com/docs/cli/gemini-ignore#how-it-works)  
-  [How to use .geminiignore](https://geminicli.com/docs/cli/gemini-ignore#how-to-use-geminiignore)   [.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)     
-  [.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)  
[Introduction](https://geminicli.com/docs/cli/gemini-ignore#_top)
[How it works](https://geminicli.com/docs/cli/gemini-ignore#how-it-works)
[How to use .geminiignore](https://geminicli.com/docs/cli/gemini-ignore#how-to-use-geminiignore)
-  [.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)  
[.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)

-  [Introduction](https://geminicli.com/docs/cli/gemini-ignore#_top)  
-  [How it works](https://geminicli.com/docs/cli/gemini-ignore#how-it-works)  
-  [How to use .geminiignore](https://geminicli.com/docs/cli/gemini-ignore#how-to-use-geminiignore)   [.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)     
-  [.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)  
[Introduction](https://geminicli.com/docs/cli/gemini-ignore#_top)
[How it works](https://geminicli.com/docs/cli/gemini-ignore#how-it-works)
[How to use .geminiignore](https://geminicli.com/docs/cli/gemini-ignore#how-to-use-geminiignore)
-  [.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)  
[.geminiignore examples](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)

This document provides an overview of the Gemini Ignore (.geminiignore) feature of the Gemini CLI.

```
.geminiignore
```

The Gemini CLI includes the ability to automatically ignore files, similar to .gitignore (used by Git) and .aiexclude (used by Gemini Code Assist). Adding paths to your .geminiignore file will exclude them from tools that support this feature, although they will still be visible to other services (such as Git).

```
.gitignore
```


```
.aiexclude
```


```
.geminiignore
```

## How it works
[Section titled “How it works”](https://geminicli.com/docs/cli/gemini-ignore#how-it-works)
When you add a path to your .geminiignore file, tools that respect this file will exclude matching files and directories from their operations. For example, when you use the @ command to share files, any paths in your .geminiignore file will be automatically excluded.

```
.geminiignore
```


```
@
```


```
.geminiignore
```

For the most part, .geminiignore follows the conventions of .gitignore files:

```
.geminiignore
```


```
.gitignore
```

- Blank lines and lines starting with # are ignored.
- Standard glob patterns are supported (such as *, ?, and []).
- Putting a / at the end will only match directories.
- Putting a / at the beginning anchors the path relative to the
.geminiignore file.
- ! negates a pattern.

```
#
```


```
*
```


```
?
```


```
[]
```


```
/
```


```
/
```


```
.geminiignore
```


```
!
```

You can update your .geminiignore file at any time. To apply the changes, you must restart your Gemini CLI session.

```
.geminiignore
```

## How to use .geminiignore
```
.geminiignore
```

[Section titled “How to use .geminiignore”](https://geminicli.com/docs/cli/gemini-ignore#how-to-use-geminiignore)
To enable .geminiignore:

```
.geminiignore
```

1. Create a file named .geminiignore in the root of your project directory.

```
.geminiignore
```

To add a file or directory to .geminiignore:

```
.geminiignore
```

1. Open your .geminiignore file.
2. Add the path or file you want to ignore, for example: /archive/ or
apikeys.txt.

```
.geminiignore
```


```
/archive/
```


```
apikeys.txt
```

```
.geminiignore
```

[Section titled “.geminiignore examples”](https://geminicli.com/docs/cli/gemini-ignore#geminiignore-examples)
You can use .geminiignore to ignore directories and files:

```
.geminiignore
```


```
# Exclude your /packages/ directory and all subdirectories/packages/ # Exclude your apikeys.txt fileapikeys.txt
```


```
# Exclude your /packages/ directory and all subdirectories/packages/ # Exclude your apikeys.txt fileapikeys.txt
```

You can use wildcards in your .geminiignore file with *:

```
.geminiignore
```


```
*
```


```
# Exclude all .md files*.md
```


```
# Exclude all .md files*.md
```

Finally, you can exclude files and directories from exclusion with !:

```
!
```


```
# Exclude all .md files except README.md*.md!README.md
```


```
# Exclude all .md files except README.md*.md!README.md
```

To remove paths from your .geminiignore file, delete the relevant lines.

```
.geminiignore
```

[cookies](https://policies.google.com/technologies/cookies)
[Terms](https://geminicli.com/terms)
[Privacy](https://policies.google.com/privacy)

