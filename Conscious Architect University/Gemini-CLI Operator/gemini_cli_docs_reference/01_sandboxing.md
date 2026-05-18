Title: Sandboxing in the Gemini CLI | Gemini CLI

Source: https://geminicli.com/docs/cli/sandbox

---

[Skip to content](https://geminicli.com/docs/cli/sandbox#_top)
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
[Feedback](https://github.com/google-gemini/gemini-cli/issues/new?template=website_issue.yml&url=https%3A%2F%2Fgeminicli.com%2Fdocs%2Fcli%2Fsandbox%2F)
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
-  [Introduction](https://geminicli.com/docs/cli/sandbox#_top)  
-  [Prerequisites](https://geminicli.com/docs/cli/sandbox#prerequisites)  
-  [Overview of sandboxing](https://geminicli.com/docs/cli/sandbox#overview-of-sandboxing)  
-  [Sandboxing methods](https://geminicli.com/docs/cli/sandbox#sandboxing-methods)   [1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)   [2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)   [3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)   [4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)   [5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)     
-  [1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)  
-  [2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)  
-  [3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)  
-  [4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)  
-  [5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)  
-  [Quickstart](https://geminicli.com/docs/cli/sandbox#quickstart)  
-  [Configuration](https://geminicli.com/docs/cli/sandbox#configuration)   [Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)   [macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)   [Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)     
-  [Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)

-  [macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)  
-  [Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)  
-  [Linux UID/GID handling](https://geminicli.com/docs/cli/sandbox#linux-uidgid-handling)  
-  [Troubleshooting](https://geminicli.com/docs/cli/sandbox#troubleshooting)   [Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)   [Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)   [Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)     
-  [Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)  
-  [Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)  
-  [Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)  
-  [Security notes](https://geminicli.com/docs/cli/sandbox#security-notes)  
-  [Related documentation](https://geminicli.com/docs/cli/sandbox#related-documentation)  
[Introduction](https://geminicli.com/docs/cli/sandbox#_top)
[Prerequisites](https://geminicli.com/docs/cli/sandbox#prerequisites)
[Overview of sandboxing](https://geminicli.com/docs/cli/sandbox#overview-of-sandboxing)
[Sandboxing methods](https://geminicli.com/docs/cli/sandbox#sandboxing-methods)
-  [1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)  
-  [2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)  
-  [3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)  
-  [4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)  
-  [5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)  
[1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)
[2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)
[3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)
[4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)
[5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)
[Quickstart](https://geminicli.com/docs/cli/sandbox#quickstart)
[Configuration](https://geminicli.com/docs/cli/sandbox#configuration)
-  [Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)  
-  [macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)  
-  [Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)  
[Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)
[macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)
[Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)
[Linux UID/GID handling](https://geminicli.com/docs/cli/sandbox#linux-uidgid-handling)
[Troubleshooting](https://geminicli.com/docs/cli/sandbox#troubleshooting)
-  [Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)  
-  [Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)  
-  [Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)  
[Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)
[Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)
[Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)
[Security notes](https://geminicli.com/docs/cli/sandbox#security-notes)
[Related documentation](https://geminicli.com/docs/cli/sandbox#related-documentation)

-  [Introduction](https://geminicli.com/docs/cli/sandbox#_top)  
-  [Prerequisites](https://geminicli.com/docs/cli/sandbox#prerequisites)  
-  [Overview of sandboxing](https://geminicli.com/docs/cli/sandbox#overview-of-sandboxing)  
-  [Sandboxing methods](https://geminicli.com/docs/cli/sandbox#sandboxing-methods)   [1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)   [2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)   [3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)   [4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)   [5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)     
-  [1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)  
-  [2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)  
-  [3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)  
-  [4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)  
-  [5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)  
-  [Quickstart](https://geminicli.com/docs/cli/sandbox#quickstart)  
-  [Configuration](https://geminicli.com/docs/cli/sandbox#configuration)   [Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)   [macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)   [Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)     
-  [Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)  
-  [macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)  
-  [Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)  
-  [Linux UID/GID handling](https://geminicli.com/docs/cli/sandbox#linux-uidgid-handling)  
-  [Troubleshooting](https://geminicli.com/docs/cli/sandbox#troubleshooting)   [Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)   [Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)   [Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)     
-  [Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)  
-  [Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)  
-  [Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)  
-  [Security notes](https://geminicli.com/docs/cli/sandbox#security-notes)  
-  [Related documentation](https://geminicli.com/docs/cli/sandbox#related-documentation)  
[Introduction](https://geminicli.com/docs/cli/sandbox#_top)
[Prerequisites](https://geminicli.com/docs/cli/sandbox#prerequisites)
[Overview of sandboxing](https://geminicli.com/docs/cli/sandbox#overview-of-sandboxing)
[Sandboxing methods](https://geminicli.com/docs/cli/sandbox#sandboxing-methods)
-  [1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)  
-  [2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)  
-  [3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)  
-  [4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)  
-  [5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)  
[1. macOS Seatbelt (macOS only)](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)
[2. Container-based (Docker/Podman)](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)
[3. Windows Native Sandbox (Windows only)](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)
[4. gVisor / runsc (Linux only)](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)
[5. LXC/LXD (Linux only, experimental)](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)
[Quickstart](https://geminicli.com/docs/cli/sandbox#quickstart)

[Configuration](https://geminicli.com/docs/cli/sandbox#configuration)
-  [Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)  
-  [macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)  
-  [Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)  
[Enable sandboxing (in order of precedence)](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)
[macOS Seatbelt profiles](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)
[Custom sandbox flags](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)
[Linux UID/GID handling](https://geminicli.com/docs/cli/sandbox#linux-uidgid-handling)
[Troubleshooting](https://geminicli.com/docs/cli/sandbox#troubleshooting)
-  [Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)  
-  [Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)  
-  [Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)  
[Common issues](https://geminicli.com/docs/cli/sandbox#common-issues)
[Debug mode](https://geminicli.com/docs/cli/sandbox#debug-mode)
[Inspect sandbox](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)
[Security notes](https://geminicli.com/docs/cli/sandbox#security-notes)
[Related documentation](https://geminicli.com/docs/cli/sandbox#related-documentation)

This document provides a guide to sandboxing in the Gemini CLI, including prerequisites, quickstart, and configuration.

## Prerequisites
[Section titled “Prerequisites”](https://geminicli.com/docs/cli/sandbox#prerequisites)
Before using sandboxing, you need to install and set up the Gemini CLI:

```
npm install -g @google/gemini-cli
```


```
npm install -g @google/gemini-cli
```

To verify the installation:

```
gemini --version
```


```
gemini --version
```

## Overview of sandboxing
[Section titled “Overview of sandboxing”](https://geminicli.com/docs/cli/sandbox#overview-of-sandboxing)
Sandboxing isolates potentially dangerous operations (such as shell commands or file modifications) from your host system, providing a security barrier between AI operations and your environment.
The benefits of sandboxing include:
- Security: Prevent accidental system damage or data loss.
- Isolation: Limit file system access to project directory.
- Consistency: Ensure reproducible environments across different systems.
- Safety: Reduce risk when working with untrusted code or experimental
commands.

## Sandboxing methods
[Section titled “Sandboxing methods”](https://geminicli.com/docs/cli/sandbox#sandboxing-methods)
Your ideal method of sandboxing may differ depending on your platform and your preferred container solution.

### 1. macOS Seatbelt (macOS only)
[Section titled “1. macOS Seatbelt (macOS only)”](https://geminicli.com/docs/cli/sandbox#1-macos-seatbelt-macos-only)
Lightweight, built-in sandboxing using sandbox-exec.

```
sandbox-exec
```

Default profile: permissive-open - restricts writes outside project directory but allows most other operations.

```
permissive-open
```

### 2. Container-based (Docker/Podman)
[Section titled “2. Container-based (Docker/Podman)”](https://geminicli.com/docs/cli/sandbox#2-container-based-dockerpodman)
Cross-platform sandboxing with complete process isolation.
Note: Requires building the sandbox image locally or using a published image from your organization’s registry.

### 3. Windows Native Sandbox (Windows only)
[Section titled “3. Windows Native Sandbox (Windows only)”](https://geminicli.com/docs/cli/sandbox#3-windows-native-sandbox-windows-only)
… Troubleshooting and Side Effects:
The Windows Native sandbox uses the icacls command to set a “Low Mandatory Level” on files and directories it needs to write to.

```
icacls
```

- Persistence: These integrity level changes are persistent on the
filesystem. Even after the sandbox session ends, files created or modified by
the sandbox will retain their “Low” integrity level.
- Manual Reset: If you need to reset the integrity level of a file or
directory, you can use:
Terminal windowicacls "C:\path\to\dir" /setintegritylevel Medium

- System Folders: The sandbox manager automatically skips setting integrity
levels on system folders (like C:\Windows) for safety.

```
icacls "C:\path\to\dir" /setintegritylevel Medium
```


```
icacls "C:\path\to\dir" /setintegritylevel Medium
```


```
C:\Windows
```

### 4. gVisor / runsc (Linux only)
[Section titled “4. gVisor / runsc (Linux only)”](https://geminicli.com/docs/cli/sandbox#4-gvisor--runsc-linux-only)
Strongest isolation available: runs containers inside a user-space kernel via [gVisor](https://github.com/google/gvisor). gVisor intercepts all container system calls and handles them in a sandboxed kernel written in Go, providing a strong security barrier between AI operations and the host OS.
Prerequisites:
- Linux (gVisor supports Linux only)
- Docker installed and running
- gVisor/runsc runtime configured
When you set sandbox: "runsc", Gemini CLI runs docker run --runtime=runsc ... to execute containers with gVisor isolation. runsc is not auto-detected; you must specify it explicitly (e.g. GEMINI_SANDBOX=runsc or sandbox: "runsc").

```
sandbox: "runsc"
```


```
docker run --runtime=runsc ...
```


```
GEMINI_SANDBOX=runsc
```


```
sandbox: "runsc"
```

To set up runsc:
1. Install the runsc binary.
2. Configure the Docker daemon to use the runsc runtime.
3. Verify the installation.

[Section titled “5. LXC/LXD (Linux only, experimental)”](https://geminicli.com/docs/cli/sandbox#5-lxclxd-linux-only-experimental)
Full-system container sandboxing using LXC/LXD. Unlike Docker/Podman, LXC containers run a complete Linux system with systemd, snapd, and other system services. This is ideal for tools that don’t work in standard Docker containers, such as Snapcraft and Rockcraft.

```
systemd
```


```
snapd
```

Prerequisites:
- Linux only.
- LXC/LXD must be installed (snap install lxd or apt install lxd).
- A container must be created and running before starting Gemini CLI. Gemini
does not create the container automatically.

```
snap install lxd
```


```
apt install lxd
```

Quick setup:

```
# Initialize LXD (first time only)lxd init --auto # Create and start an Ubuntu containerlxc launch ubuntu:24.04 gemini-sandbox # Enable LXC sandboxingexport GEMINI_SANDBOX=lxcgemini -p "build the project"
```


```
# Initialize LXD (first time only)lxd init --auto # Create and start an Ubuntu containerlxc launch ubuntu:24.04 gemini-sandbox # Enable LXC sandboxingexport GEMINI_SANDBOX=lxcgemini -p "build the project"
```

Custom container name:

```
export GEMINI_SANDBOX=lxcexport GEMINI_SANDBOX_IMAGE=my-snapcraft-containergemini -p "build the snap"
```


```
export GEMINI_SANDBOX=lxcexport GEMINI_SANDBOX_IMAGE=my-snapcraft-containergemini -p "build the snap"
```

Limitations:
- Linux only (LXC is not available on macOS or Windows).
- The container must already exist and be running.
- The workspace directory is bind-mounted into the container at the same
absolute path — the path must be writable inside the container.
- Used with tools like Snapcraft or Rockcraft that require a full system.

## Quickstart
[Section titled “Quickstart”](https://geminicli.com/docs/cli/sandbox#quickstart)

```
# Enable sandboxing with command flaggemini -s -p "analyze the code structure"
```


```
# Enable sandboxing with command flaggemini -s -p "analyze the code structure"
```

Use environment variable
macOS/Linux

```
export GEMINI_SANDBOX=truegemini -p "run the test suite"
```


```
export GEMINI_SANDBOX=truegemini -p "run the test suite"
```

Windows (PowerShell)

```
$env:GEMINI_SANDBOX="true"gemini -p "run the test suite"
```


```
$env:GEMINI_SANDBOX="true"gemini -p "run the test suite"
```

Configure in settings.json

```
{ "tools": { "sandbox": "docker" }}
```


```
{ "tools": { "sandbox": "docker" }}
```

## Configuration
[Section titled “Configuration”](https://geminicli.com/docs/cli/sandbox#configuration)

### Enable sandboxing (in order of precedence)
[Section titled “Enable sandboxing (in order of precedence)”](https://geminicli.com/docs/cli/sandbox#enable-sandboxing-in-order-of-precedence)
1. Command flag: -s or --sandbox
2. Environment variable:
GEMINI_SANDBOX=true|docker|podman|sandbox-exec|runsc|lxc
3. Settings file: "sandbox": true in the tools object of your
settings.json file (e.g., {"tools": {"sandbox": true}}).

```
-s
```


```
--sandbox
```


```
GEMINI_SANDBOX=true|docker|podman|sandbox-exec|runsc|lxc
```


```
"sandbox": true
```


```
tools
```


```
settings.json
```


```
{"tools": {"sandbox": true}}
```

### macOS Seatbelt profiles
[Section titled “macOS Seatbelt profiles”](https://geminicli.com/docs/cli/sandbox#macos-seatbelt-profiles)
Built-in profiles (set via SEATBELT_PROFILE env var):

```
SEATBELT_PROFILE
```

- permissive-open (default): Write restrictions, network allowed
- permissive-proxied: Write restrictions, network via proxy
- restrictive-open: Strict restrictions, network allowed
- restrictive-proxied: Strict restrictions, network via proxy
- strict-open: Read and write restrictions, network allowed
- strict-proxied: Read and write restrictions, network via proxy

```
permissive-open
```


```
permissive-proxied
```


```
restrictive-open
```


```
restrictive-proxied
```


```
strict-open
```


```
strict-proxied
```

### Custom sandbox flags
[Section titled “Custom sandbox flags”](https://geminicli.com/docs/cli/sandbox#custom-sandbox-flags)
For container-based sandboxing, you can inject custom flags into the docker or podman command using the SANDBOX_FLAGS environment variable. This is useful for advanced configurations, such as disabling security features for specific use cases.

```
docker
```


```
podman
```


```
SANDBOX_FLAGS
```

Example (Podman):
To disable SELinux labeling for volume mounts, you can set the following:
macOS/Linux

```
export SANDBOX_FLAGS="--security-opt label=disable"
```


```
export SANDBOX_FLAGS="--security-opt label=disable"
```

Windows (PowerShell)

```
$env:SANDBOX_FLAGS="--security-opt label=disable"
```


```
$env:SANDBOX_FLAGS="--security-opt label=disable"
```

Multiple flags can be provided as a space-separated string:
macOS/Linux

```
export SANDBOX_FLAGS="--flag1 --flag2=value"
```


```
export SANDBOX_FLAGS="--flag1 --flag2=value"
```

Windows (PowerShell)

```
$env:SANDBOX_FLAGS="--flag1 --flag2=value"
```


```
$env:SANDBOX_FLAGS="--flag1 --flag2=value"
```

## Linux UID/GID handling
[Section titled “Linux UID/GID handling”](https://geminicli.com/docs/cli/sandbox#linux-uidgid-handling)
The sandbox automatically handles user permissions on Linux. Override these permissions with:
macOS/Linux

```
export SANDBOX_SET_UID_GID=true # Force host UID/GIDexport SANDBOX_SET_UID_GID=false # Disable UID/GID mapping
```


```
export SANDBOX_SET_UID_GID=true # Force host UID/GIDexport SANDBOX_SET_UID_GID=false # Disable UID/GID mapping
```

Windows (PowerShell)

```
$env:SANDBOX_SET_UID_GID="true" # Force host UID/GID$env:SANDBOX_SET_UID_GID="false" # Disable UID/GID mapping
```


```
$env:SANDBOX_SET_UID_GID="true" # Force host UID/GID$env:SANDBOX_SET_UID_GID="false" # Disable UID/GID mapping
```

## Troubleshooting
[Section titled “Troubleshooting”](https://geminicli.com/docs/cli/sandbox#troubleshooting)

### Common issues
[Section titled “Common issues”](https://geminicli.com/docs/cli/sandbox#common-issues)
“Operation not permitted”
- Operation requires access outside sandbox.
- Try more permissive profile or add mount points.
Missing commands
- Add to custom Dockerfile.
- Install via sandbox.bashrc.

```
sandbox.bashrc
```

Network issues
- Check sandbox profile allows network.
- Verify proxy configuration.

### Debug mode
[Section titled “Debug mode”](https://geminicli.com/docs/cli/sandbox#debug-mode)

```
DEBUG=1 gemini -s -p "debug command"
```


```
DEBUG=1 gemini -s -p "debug command"
```

Note
If you have DEBUG=true in a project’s .env file, it won’t affect gemini-cli due to automatic exclusion. Use .gemini/.env files for gemini-cli specific debug settings.

```
DEBUG=true
```


```
.env
```


```
.gemini/.env
```

### Inspect sandbox
[Section titled “Inspect sandbox”](https://geminicli.com/docs/cli/sandbox#inspect-sandbox)

```
# Check environmentgemini -s -p "run shell command: env | grep SANDBOX" # List mountsgemini -s -p "run shell command: mount | grep workspace"
```


```
# Check environmentgemini -s -p "run shell command: env | grep SANDBOX" # List mountsgemini -s -p "run shell command: mount | grep workspace"
```

## Security notes
[Section titled “Security notes”](https://geminicli.com/docs/cli/sandbox#security-notes)
- Sandboxing reduces but doesn’t eliminate all risks.
- Use the most restrictive profile that allows your work.
- Container overhead is minimal after first build.
- GUI applications may not work in sandboxes.

## Related documentation
[Section titled “Related documentation”](https://geminicli.com/docs/cli/sandbox#related-documentation)
- [Configuration](https://geminicli.com/docs/reference/configuration): Full configuration options.
- [Commands](https://geminicli.com/docs/reference/commands): Available commands.
- [Troubleshooting](https://geminicli.com/docs/resources/troubleshooting): General troubleshooting.
[Configuration](https://geminicli.com/docs/reference/configuration)
[Commands](https://geminicli.com/docs/reference/commands)
[Troubleshooting](https://geminicli.com/docs/resources/troubleshooting)
[cookies](https://policies.google.com/technologies/cookies)
[Terms](https://geminicli.com/terms)
[Privacy](https://policies.google.com/privacy)

