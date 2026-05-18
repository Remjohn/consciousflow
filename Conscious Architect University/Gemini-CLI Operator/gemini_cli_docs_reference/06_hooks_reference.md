Title: Hooks reference | Gemini CLI

Source: https://geminicli.com/docs/hooks/reference

---

[Skip to content](https://geminicli.com/docs/hooks/reference#_top)
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
[Feedback](https://github.com/google-gemini/gemini-cli/issues/new?template=website_issue.yml&url=https%3A%2F%2Fgeminicli.com%2Fdocs%2Fhooks%2Freference%2F)
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
-  [Introduction](https://geminicli.com/docs/hooks/reference#_top)  
-  [Global hook mechanics](https://geminicli.com/docs/hooks/reference#global-hook-mechanics)  
-  [Configuration schema](https://geminicli.com/docs/hooks/reference#configuration-schema)   [Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)   [Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)     
-  [Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)  
-  [Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)  
-  [Base input schema](https://geminicli.com/docs/hooks/reference#base-input-schema)  
-  [Common output fields](https://geminicli.com/docs/hooks/reference#common-output-fields)  
-  [Tool hooks](https://geminicli.com/docs/hooks/reference#tool-hooks)   [Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)   [BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)   [AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)     
-  [Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)  
-  [BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)  
-  [AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)  
-  [Agent hooks](https://geminicli.com/docs/hooks/reference#agent-hooks)   [BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)   [AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)     
-  [BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)  
-  [AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)  
-  [Model hooks](https://geminicli.com/docs/hooks/reference#model-hooks)   [BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)   [BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)   [AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)     
-  [BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)

-  [BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)  
-  [AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)  
-  [Lifecycle & system hooks](https://geminicli.com/docs/hooks/reference#lifecycle--system-hooks)   [SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)   [SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)   [Notification](https://geminicli.com/docs/hooks/reference#notification)   [PreCompress](https://geminicli.com/docs/hooks/reference#precompress)     
-  [SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)  
-  [SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)  
-  [Notification](https://geminicli.com/docs/hooks/reference#notification)  
-  [PreCompress](https://geminicli.com/docs/hooks/reference#precompress)  
-  [Stable Model API](https://geminicli.com/docs/hooks/reference#stable-model-api)  
[Introduction](https://geminicli.com/docs/hooks/reference#_top)
[Global hook mechanics](https://geminicli.com/docs/hooks/reference#global-hook-mechanics)
[Configuration schema](https://geminicli.com/docs/hooks/reference#configuration-schema)
-  [Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)  
-  [Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)  
[Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)
[Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)
[Base input schema](https://geminicli.com/docs/hooks/reference#base-input-schema)
[Common output fields](https://geminicli.com/docs/hooks/reference#common-output-fields)
[Tool hooks](https://geminicli.com/docs/hooks/reference#tool-hooks)
-  [Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)  
-  [BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)  
-  [AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)  
[Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)
[BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)
[AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)
[Agent hooks](https://geminicli.com/docs/hooks/reference#agent-hooks)
-  [BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)  
-  [AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)  
[BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)
[AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)
[Model hooks](https://geminicli.com/docs/hooks/reference#model-hooks)
-  [BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)  
-  [BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)  
-  [AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)  
[BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)
[BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)
[AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)
[Lifecycle & system hooks](https://geminicli.com/docs/hooks/reference#lifecycle--system-hooks)
-  [SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)  
-  [SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)  
-  [Notification](https://geminicli.com/docs/hooks/reference#notification)  
-  [PreCompress](https://geminicli.com/docs/hooks/reference#precompress)  
[SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)
[SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)
[Notification](https://geminicli.com/docs/hooks/reference#notification)
[PreCompress](https://geminicli.com/docs/hooks/reference#precompress)
[Stable Model API](https://geminicli.com/docs/hooks/reference#stable-model-api)

-  [Introduction](https://geminicli.com/docs/hooks/reference#_top)  
-  [Global hook mechanics](https://geminicli.com/docs/hooks/reference#global-hook-mechanics)  
-  [Configuration schema](https://geminicli.com/docs/hooks/reference#configuration-schema)   [Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)   [Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)     
-  [Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)  
-  [Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)  
-  [Base input schema](https://geminicli.com/docs/hooks/reference#base-input-schema)  
-  [Common output fields](https://geminicli.com/docs/hooks/reference#common-output-fields)  
-  [Tool hooks](https://geminicli.com/docs/hooks/reference#tool-hooks)   [Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)   [BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)   [AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)     
-  [Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)  
-  [BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)  
-  [AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)  
-  [Agent hooks](https://geminicli.com/docs/hooks/reference#agent-hooks)   [BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)   [AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)     
-  [BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)  
-  [AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)  
-  [Model hooks](https://geminicli.com/docs/hooks/reference#model-hooks)   [BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)   [BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)   [AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)     
-  [BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)  
-  [BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)  
-  [AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)  
-  [Lifecycle & system hooks](https://geminicli.com/docs/hooks/reference#lifecycle--system-hooks)   [SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)   [SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)   [Notification](https://geminicli.com/docs/hooks/reference#notification)   [PreCompress](https://geminicli.com/docs/hooks/reference#precompress)     
-  [SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)  
-  [SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)  
-  [Notification](https://geminicli.com/docs/hooks/reference#notification)  
-  [PreCompress](https://geminicli.com/docs/hooks/reference#precompress)  
-  [Stable Model API](https://geminicli.com/docs/hooks/reference#stable-model-api)  
[Introduction](https://geminicli.com/docs/hooks/reference#_top)
[Global hook mechanics](https://geminicli.com/docs/hooks/reference#global-hook-mechanics)
[Configuration schema](https://geminicli.com/docs/hooks/reference#configuration-schema)
-  [Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)  
-  [Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)  
[Hook definition](https://geminicli.com/docs/hooks/reference#hook-definition)
[Hook configuration](https://geminicli.com/docs/hooks/reference#hook-configuration)
[Base input schema](https://geminicli.com/docs/hooks/reference#base-input-schema)
[Common output fields](https://geminicli.com/docs/hooks/reference#common-output-fields)
[Tool hooks](https://geminicli.com/docs/hooks/reference#tool-hooks)
-  [Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)  
-  [BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)  
-  [AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)  
[Matchers and tool names](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)
[BeforeTool](https://geminicli.com/docs/hooks/reference#beforetool)
[AfterTool](https://geminicli.com/docs/hooks/reference#aftertool)
[Agent hooks](https://geminicli.com/docs/hooks/reference#agent-hooks)
-  [BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)

-  [AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)  
[BeforeAgent](https://geminicli.com/docs/hooks/reference#beforeagent)
[AfterAgent](https://geminicli.com/docs/hooks/reference#afteragent)
[Model hooks](https://geminicli.com/docs/hooks/reference#model-hooks)
-  [BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)  
-  [BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)  
-  [AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)  
[BeforeModel](https://geminicli.com/docs/hooks/reference#beforemodel)
[BeforeToolSelection](https://geminicli.com/docs/hooks/reference#beforetoolselection)
[AfterModel](https://geminicli.com/docs/hooks/reference#aftermodel)
[Lifecycle & system hooks](https://geminicli.com/docs/hooks/reference#lifecycle--system-hooks)
-  [SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)  
-  [SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)  
-  [Notification](https://geminicli.com/docs/hooks/reference#notification)  
-  [PreCompress](https://geminicli.com/docs/hooks/reference#precompress)  
[SessionStart](https://geminicli.com/docs/hooks/reference#sessionstart)
[SessionEnd](https://geminicli.com/docs/hooks/reference#sessionend)
[Notification](https://geminicli.com/docs/hooks/reference#notification)
[PreCompress](https://geminicli.com/docs/hooks/reference#precompress)
[Stable Model API](https://geminicli.com/docs/hooks/reference#stable-model-api)

This document provides the technical specification for Gemini CLI hooks, including JSON schemas and API details.

## Global hook mechanics
[Section titled “Global hook mechanics”](https://geminicli.com/docs/hooks/reference#global-hook-mechanics)
- Communication: stdin for Input (JSON), stdout for Output (JSON), and
stderr for logs and feedback.
- Exit codes:

0: Success. stdout is parsed as JSON. Preferred for all logic.
2: System Block. The action is blocked; stderr is used as the rejection
reason.
Other: Warning. A non-fatal failure occurred; the CLI continues with a
warning.


- 0: Success. stdout is parsed as JSON. Preferred for all logic.
- 2: System Block. The action is blocked; stderr is used as the rejection
reason.
- Other: Warning. A non-fatal failure occurred; the CLI continues with a
warning.
- Silence is Mandatory: Your script must not print any plain text to
stdout other than the final JSON.

```
stdin
```


```
stdout
```


```
stderr
```

- 0: Success. stdout is parsed as JSON. Preferred for all logic.
- 2: System Block. The action is blocked; stderr is used as the rejection
reason.
- Other: Warning. A non-fatal failure occurred; the CLI continues with a
warning.

```
0
```


```
stdout
```


```
2
```


```
stderr
```


```
Other
```


```
stdout
```

## Configuration schema
[Section titled “Configuration schema”](https://geminicli.com/docs/hooks/reference#configuration-schema)
Hooks are defined in settings.json within the hooks object. Each event (e.g., BeforeTool) contains an array of hook definitions.

```
settings.json
```


```
hooks
```


```
BeforeTool
```

### Hook definition
[Section titled “Hook definition”](https://geminicli.com/docs/hooks/reference#hook-definition)

```
matcher
```


```
string
```


```
sequential
```


```
boolean
```


```
true
```


```
false
```


```
hooks
```


```
array
```

### Hook configuration
[Section titled “Hook configuration”](https://geminicli.com/docs/hooks/reference#hook-configuration)

```
type
```


```
string
```


```
"command"
```


```
command
```


```
string
```


```
type
```


```
"command"
```


```
name
```


```
string
```


```
timeout
```


```
number
```


```
description
```


```
string
```

## Base input schema
[Section titled “Base input schema”](https://geminicli.com/docs/hooks/reference#base-input-schema)
All hooks receive these common fields via stdin:

```
stdin
```


```
{ "session_id": string, // Unique ID for the current session "transcript_path": string, // Absolute path to session transcript JSON "cwd": string, // Current working directory "hook_event_name": string, // The firing event (e.g. "BeforeTool") "timestamp": string // ISO 8601 execution time}
```


```
{ "session_id": string, // Unique ID for the current session "transcript_path": string, // Absolute path to session transcript JSON "cwd": string, // Current working directory "hook_event_name": string, // The firing event (e.g. "BeforeTool") "timestamp": string // ISO 8601 execution time}
```

## Common output fields
[Section titled “Common output fields”](https://geminicli.com/docs/hooks/reference#common-output-fields)
Most hooks support these fields in their stdout JSON:

```
stdout
```


```
systemMessage
```


```
string
```


```
suppressOutput
```


```
boolean
```


```
true
```


```
continue
```


```
boolean
```


```
false
```


```
stopReason
```


```
string
```


```
continue
```


```
false
```


```
decision
```


```
string
```


```
"allow"
```


```
"deny"
```


```
"block"
```


```
reason
```


```
string
```


```
decision
```


```
"deny"
```

## Tool hooks
[Section titled “Tool hooks”](https://geminicli.com/docs/hooks/reference#tool-hooks)

### Matchers and tool names
[Section titled “Matchers and tool names”](https://geminicli.com/docs/hooks/reference#matchers-and-tool-names)
For BeforeTool and AfterTool events, the matcher field in your settings is compared against the name of the tool being executed.

```
BeforeTool
```


```
AfterTool
```


```
matcher
```

- Built-in Tools: You can match any built-in tool (e.g., read_file,
run_shell_command). See the [Tools Reference](https://geminicli.com/docs/reference/tools) for a full
list of available tool names.
- MCP Tools: Tools from MCP servers follow the naming pattern
mcp_<server_name>_<tool_name>.
- Regex Support: Matchers support regular expressions (e.g.,
matcher: "read_.*" matches all file reading tools).

```
read_file
```


```
run_shell_command
```

[Tools Reference](https://geminicli.com/docs/reference/tools)

```
mcp_<server_name>_<tool_name>
```


```
matcher: "read_.*"
```

### BeforeTool
```
BeforeTool
```

[Section titled “BeforeTool”](https://geminicli.com/docs/hooks/reference#beforetool)
Fires before a tool is invoked. Used for argument validation, security checks, and parameter rewriting.
- Input Fields:

tool_name: (string) The name of the tool being called.
tool_input: (object) The raw arguments generated by the model.
mcp_context: (object) Optional metadata for MCP-based tools.
original_request_name: (string) The original name of the tool being
called, if this is a tail tool call.


- tool_name: (string) The name of the tool being called.
- tool_input: (object) The raw arguments generated by the model.
- mcp_context: (object) Optional metadata for MCP-based tools.
- original_request_name: (string) The original name of the tool being
called, if this is a tail tool call.
- Relevant Output Fields:

decision: Set to "deny" (or "block") to prevent the tool from
executing.
reason: Required if denied. This text is sent to the agent as a tool
error, allowing it to respond or retry.
hookSpecificOutput.tool_input: An object that merges with and
overrides the model’s arguments before execution.
continue: Set to false to kill the entire agent loop immediately.


- decision: Set to "deny" (or "block") to prevent the tool from
executing.
- reason: Required if denied. This text is sent to the agent as a tool
error, allowing it to respond or retry.
- hookSpecificOutput.tool_input: An object that merges with and
overrides the model’s arguments before execution.
- continue: Set to false to kill the entire agent loop immediately.
- Exit Code 2 (Block Tool): Prevents execution. Uses stderr as the
reason sent to the agent. The turn continues.
- tool_name: (string) The name of the tool being called.
- tool_input: (object) The raw arguments generated by the model.
- mcp_context: (object) Optional metadata for MCP-based tools.
- original_request_name: (string) The original name of the tool being
called, if this is a tail tool call.

```
tool_name
```


```
string
```


```
tool_input
```


```
object
```


```
mcp_context
```


```
object
```


```
original_request_name
```


```
string
```

- decision: Set to "deny" (or "block") to prevent the tool from
executing.
- reason: Required if denied. This text is sent to the agent as a tool
error, allowing it to respond or retry.
- hookSpecificOutput.tool_input: An object that merges with and
overrides the model’s arguments before execution.
- continue: Set to false to kill the entire agent loop immediately.

```
decision
```


```
"deny"
```


```
"block"
```


```
reason
```


```
hookSpecificOutput.tool_input
```


```
continue
```


```
false
```


```
stderr
```


```
reason
```

```
AfterTool
```

[Section titled “AfterTool”](https://geminicli.com/docs/hooks/reference#aftertool)
Fires after a tool executes. Used for result auditing, context injection, or hiding sensitive output from the agent.
- Input Fields:

tool_name: (string)
tool_input: (object) The original arguments.
tool_response: (object) The result containing llmContent,
returnDisplay, and optional error.
mcp_context: (object)
original_request_name: (string) The original name of the tool being
called, if this is a tail tool call.


- tool_name: (string)
- tool_input: (object) The original arguments.
- tool_response: (object) The result containing llmContent,
returnDisplay, and optional error.
- mcp_context: (object)
- original_request_name: (string) The original name of the tool being
called, if this is a tail tool call.
- Relevant Output Fields:

decision: Set to "deny" to hide the real tool output from the agent.
reason: Required if denied. This text replaces the tool result sent
back to the model.
hookSpecificOutput.additionalContext: Text that is appended to the
tool result for the agent.
hookSpecificOutput.tailToolCallRequest: ({ name: string, args: object })
A request to execute another tool immediately after this one. The result of
this “tail call” will replace the original tool’s response. Ideal for
programmatic tool routing.
continue: Set to false to kill the entire agent loop immediately.


- decision: Set to "deny" to hide the real tool output from the agent.
- reason: Required if denied. This text replaces the tool result sent
back to the model.
- hookSpecificOutput.additionalContext: Text that is appended to the
tool result for the agent.
- hookSpecificOutput.tailToolCallRequest: ({ name: string, args: object })
A request to execute another tool immediately after this one. The result of
this “tail call” will replace the original tool’s response. Ideal for
programmatic tool routing.
- continue: Set to false to kill the entire agent loop immediately.
- Exit Code 2 (Block Result): Hides the tool result. Uses stderr as the
replacement content sent to the agent. The turn continues.
- tool_name: (string)
- tool_input: (object) The original arguments.
- tool_response: (object) The result containing llmContent,
returnDisplay, and optional error.
- mcp_context: (object)
- original_request_name: (string) The original name of the tool being
called, if this is a tail tool call.

```
tool_name
```


```
string
```


```
tool_input
```


```
object
```


```
tool_response
```


```
object
```


```
llmContent
```


```
returnDisplay
```


```
error
```


```
mcp_context
```


```
object
```


```
original_request_name
```


```
string
```

- decision: Set to "deny" to hide the real tool output from the agent.
- reason: Required if denied. This text replaces the tool result sent
back to the model.
- hookSpecificOutput.additionalContext: Text that is appended to the
tool result for the agent.
- hookSpecificOutput.tailToolCallRequest: ({ name: string, args: object })
A request to execute another tool immediately after this one. The result of
this “tail call” will replace the original tool’s response. Ideal for
programmatic tool routing.
- continue: Set to false to kill the entire agent loop immediately.

```
decision
```


```
"deny"
```


```
reason
```


```
hookSpecificOutput.additionalContext
```


```
hookSpecificOutput.tailToolCallRequest
```


```
{ name: string, args: object }
```


```
continue
```


```
false
```


```
stderr
```

[Section titled “Agent hooks”](https://geminicli.com/docs/hooks/reference#agent-hooks)

### BeforeAgent
```
BeforeAgent
```

[Section titled “BeforeAgent”](https://geminicli.com/docs/hooks/reference#beforeagent)
Fires after a user submits a prompt, but before the agent begins planning. Used for prompt validation or injecting dynamic context.
- Input Fields:

prompt: (string) The original text submitted by the user.


- prompt: (string) The original text submitted by the user.
- Relevant Output Fields:

hookSpecificOutput.additionalContext: Text that is appended to the
prompt for this turn only.
decision: Set to "deny" to block the turn and discard the user’s
message (it will not appear in history).
continue: Set to false to block the turn but save the message to
history.
reason: Required if denied or stopped.


- hookSpecificOutput.additionalContext: Text that is appended to the
prompt for this turn only.
- decision: Set to "deny" to block the turn and discard the user’s
message (it will not appear in history).
- continue: Set to false to block the turn but save the message to
history.
- reason: Required if denied or stopped.
- Exit Code 2 (Block Turn): Aborts the turn and erases the prompt from
context. Same as decision: "deny".
- prompt: (string) The original text submitted by the user.

```
prompt
```


```
string
```

- hookSpecificOutput.additionalContext: Text that is appended to the
prompt for this turn only.
- decision: Set to "deny" to block the turn and discard the user’s
message (it will not appear in history).
- continue: Set to false to block the turn but save the message to
history.
- reason: Required if denied or stopped.

```
hookSpecificOutput.additionalContext
```


```
decision
```


```
"deny"
```


```
continue
```


```
false
```


```
reason
```


```
decision: "deny"
```

### AfterAgent
```
AfterAgent
```

[Section titled “AfterAgent”](https://geminicli.com/docs/hooks/reference#afteragent)
Fires once per turn after the model generates its final response. Primary use case is response validation and automatic retries.
- Input Fields:

prompt: (string) The user’s original request.
prompt_response: (string) The final text generated by the agent.
stop_hook_active: (boolean) Indicates if this hook is already running as
part of a retry sequence.


- prompt: (string) The user’s original request.
- prompt_response: (string) The final text generated by the agent.
- stop_hook_active: (boolean) Indicates if this hook is already running as
part of a retry sequence.
- Relevant Output Fields:

decision: Set to "deny" to reject the response and force a retry.
reason: Required if denied. This text is sent to the agent as a new
prompt to request a correction.
continue: Set to false to stop the session without retrying.
hookSpecificOutput.clearContext: If true, clears conversation history
(LLM memory) while preserving UI display.


- decision: Set to "deny" to reject the response and force a retry.
- reason: Required if denied. This text is sent to the agent as a new
prompt to request a correction.
- continue: Set to false to stop the session without retrying.
- hookSpecificOutput.clearContext: If true, clears conversation history
(LLM memory) while preserving UI display.
- Exit Code 2 (Retry): Rejects the response and triggers an automatic retry
turn using stderr as the feedback prompt.
- prompt: (string) The user’s original request.
- prompt_response: (string) The final text generated by the agent.
- stop_hook_active: (boolean) Indicates if this hook is already running as
part of a retry sequence.

```
prompt
```


```
string
```


```
prompt_response
```


```
string
```


```
stop_hook_active
```


```
boolean
```

- decision: Set to "deny" to reject the response and force a retry.
- reason: Required if denied. This text is sent to the agent as a new
prompt to request a correction.
- continue: Set to false to stop the session without retrying.
- hookSpecificOutput.clearContext: If true, clears conversation history
(LLM memory) while preserving UI display.

```
decision
```


```
"deny"
```


```
reason
```


```
continue
```


```
false
```


```
hookSpecificOutput.clearContext
```


```
true
```


```
stderr
```

[Section titled “Model hooks”](https://geminicli.com/docs/hooks/reference#model-hooks)

### BeforeModel
```
BeforeModel
```

[Section titled “BeforeModel”](https://geminicli.com/docs/hooks/reference#beforemodel)
Fires before sending a request to the LLM. Operates on a stable, SDK-agnostic request format.
- Input Fields:

llm_request: (object) Contains model, messages, and config
(generation params).


- llm_request: (object) Contains model, messages, and config
(generation params).
- Relevant Output Fields:

hookSpecificOutput.llm_request: An object that overrides parts of the
outgoing request (e.g., changing models or temperature).
hookSpecificOutput.llm_response: A Synthetic Response object. If
provided, the CLI skips the LLM call entirely and uses this as the response.
decision: Set to "deny" to block the request and abort the turn.


- hookSpecificOutput.llm_request: An object that overrides parts of the
outgoing request (e.g., changing models or temperature).
- hookSpecificOutput.llm_response: A Synthetic Response object. If
provided, the CLI skips the LLM call entirely and uses this as the response.
- decision: Set to "deny" to block the request and abort the turn.
- Exit Code 2 (Block Turn): Aborts the turn and skips the LLM call. Uses
stderr as the error message.
- llm_request: (object) Contains model, messages, and config
(generation params).

```
llm_request
```


```
object
```


```
model
```


```
messages
```


```
config
```

- hookSpecificOutput.llm_request: An object that overrides parts of the
outgoing request (e.g., changing models or temperature).
- hookSpecificOutput.llm_response: A Synthetic Response object. If
provided, the CLI skips the LLM call entirely and uses this as the response.
- decision: Set to "deny" to block the request and abort the turn.

```
hookSpecificOutput.llm_request
```


```
hookSpecificOutput.llm_response
```


```
decision
```


```
"deny"
```


```
stderr
```

### BeforeToolSelection
```
BeforeToolSelection
```

[Section titled “BeforeToolSelection”](https://geminicli.com/docs/hooks/reference#beforetoolselection)
Fires before the LLM decides which tools to call. Used to filter the available toolset or force specific tool modes.
- Input Fields:

llm_request: (object) Same format as BeforeModel.


- llm_request: (object) Same format as BeforeModel.
- Relevant Output Fields:

hookSpecificOutput.toolConfig.mode: ("AUTO" | "ANY" | "NONE")

"NONE": Disables all tools (Wins over other hooks).
"ANY": Forces at least one tool call.


hookSpecificOutput.toolConfig.allowedFunctionNames: (string[]) Whitelist
of tool names.


- hookSpecificOutput.toolConfig.mode: ("AUTO" | "ANY" | "NONE")

"NONE": Disables all tools (Wins over other hooks).
"ANY": Forces at least one tool call.


- "NONE": Disables all tools (Wins over other hooks).
- "ANY": Forces at least one tool call.
- hookSpecificOutput.toolConfig.allowedFunctionNames: (string[]) Whitelist
of tool names.
- Union Strategy: Multiple hooks’ whitelists are combined.
- Limitations: Does not support decision, continue, or
systemMessage.
- llm_request: (object) Same format as BeforeModel.

```
llm_request
```


```
object
```


```
BeforeModel
```

- hookSpecificOutput.toolConfig.mode: ("AUTO" | "ANY" | "NONE")

"NONE": Disables all tools (Wins over other hooks).
"ANY": Forces at least one tool call.


- "NONE": Disables all tools (Wins over other hooks).
- "ANY": Forces at least one tool call.
- hookSpecificOutput.toolConfig.allowedFunctionNames: (string[]) Whitelist
of tool names.

```
hookSpecificOutput.toolConfig.mode
```


```
"AUTO" | "ANY" | "NONE"
```

- "NONE": Disables all tools (Wins over other hooks).
- "ANY": Forces at least one tool call.

```
"NONE"
```


```
"ANY"
```


```
hookSpecificOutput.toolConfig.allowedFunctionNames
```


```
string[]
```


```
decision
```


```
continue
```


```
systemMessage
```

```
AfterModel
```

[Section titled “AfterModel”](https://geminicli.com/docs/hooks/reference#aftermodel)
Fires immediately after an LLM response chunk is received. Used for real-time redaction or PII filtering.
- Input Fields:

llm_request: (object) The original request.
llm_response: (object) The model’s response (or a single chunk during
streaming).


- llm_request: (object) The original request.
- llm_response: (object) The model’s response (or a single chunk during
streaming).
- Relevant Output Fields:

hookSpecificOutput.llm_response: An object that replaces the model’s
response chunk.
decision: Set to "deny" to discard the response chunk and block the
turn.
continue: Set to false to kill the entire agent loop immediately.


- hookSpecificOutput.llm_response: An object that replaces the model’s
response chunk.
- decision: Set to "deny" to discard the response chunk and block the
turn.
- continue: Set to false to kill the entire agent loop immediately.
- Note on Streaming: Fired for every chunk generated by the model.
Modifying the response only affects the current chunk.
- Exit Code 2 (Block Response): Aborts the turn and discards the model’s
output. Uses stderr as the error message.
- llm_request: (object) The original request.
- llm_response: (object) The model’s response (or a single chunk during
streaming).

```
llm_request
```


```
object
```


```
llm_response
```


```
object
```

- hookSpecificOutput.llm_response: An object that replaces the model’s
response chunk.
- decision: Set to "deny" to discard the response chunk and block the
turn.
- continue: Set to false to kill the entire agent loop immediately.

```
hookSpecificOutput.llm_response
```


```
decision
```


```
"deny"
```


```
continue
```


```
false
```


```
stderr
```

[Section titled “Lifecycle & system hooks”](https://geminicli.com/docs/hooks/reference#lifecycle--system-hooks)

### SessionStart
```
SessionStart
```

[Section titled “SessionStart”](https://geminicli.com/docs/hooks/reference#sessionstart)
Fires on application startup, resuming a session, or after a /clear command. Used for loading initial context.

```
/clear
```

- Input fields:

source: ("startup" | "resume" | "clear")


- source: ("startup" | "resume" | "clear")
- Relevant output fields:

hookSpecificOutput.additionalContext: (string)

Interactive: Injected as the first turn in history.
Non-interactive: Prepended to the user’s prompt.


systemMessage: Shown at the start of the session.


- hookSpecificOutput.additionalContext: (string)

Interactive: Injected as the first turn in history.
Non-interactive: Prepended to the user’s prompt.


- Interactive: Injected as the first turn in history.
- Non-interactive: Prepended to the user’s prompt.
- systemMessage: Shown at the start of the session.
- Advisory only: continue and decision fields are ignored. Startup
is never blocked.
- source: ("startup" | "resume" | "clear")

```
source
```


```
"startup" | "resume" | "clear"
```

- hookSpecificOutput.additionalContext: (string)

Interactive: Injected as the first turn in history.
Non-interactive: Prepended to the user’s prompt.


- Interactive: Injected as the first turn in history.
- Non-interactive: Prepended to the user’s prompt.
- systemMessage: Shown at the start of the session.

```
hookSpecificOutput.additionalContext
```


```
string
```

- Interactive: Injected as the first turn in history.
- Non-interactive: Prepended to the user’s prompt.

```
systemMessage
```


```
continue
```


```
decision
```

### SessionEnd
```
SessionEnd
```

[Section titled “SessionEnd”](https://geminicli.com/docs/hooks/reference#sessionend)
Fires when the CLI exits or a session is cleared. Used for cleanup or final telemetry.
- Input Fields:

reason: ("exit" | "clear" | "logout" | "prompt_input_exit" | "other")


- reason: ("exit" | "clear" | "logout" | "prompt_input_exit" | "other")
- Relevant Output Fields:

systemMessage: Displayed to the user during shutdown.


- systemMessage: Displayed to the user during shutdown.
- Best Effort: The CLI will not wait for this hook to complete and
ignores all flow-control fields (continue, decision).
- reason: ("exit" | "clear" | "logout" | "prompt_input_exit" | "other")

```
reason
```


```
"exit" | "clear" | "logout" | "prompt_input_exit" | "other"
```

- systemMessage: Displayed to the user during shutdown.

```
systemMessage
```


```
continue
```


```
decision
```

### Notification
```
Notification
```

[Section titled “Notification”](https://geminicli.com/docs/hooks/reference#notification)
Fires when the CLI emits a system alert (e.g., Tool Permissions). Used for external logging or cross-platform alerts.
- Input Fields:

notification_type: ("ToolPermission")
message: Summary of the alert.
details: JSON object with alert-specific metadata (e.g., tool name, file
path).


- notification_type: ("ToolPermission")
- message: Summary of the alert.
- details: JSON object with alert-specific metadata (e.g., tool name, file
path).
- Relevant Output Fields:

systemMessage: Displayed alongside the system alert.


- systemMessage: Displayed alongside the system alert.
- Observability Only: This hook cannot block alerts or grant permissions
automatically. Flow-control fields are ignored.
- notification_type: ("ToolPermission")
- message: Summary of the alert.
- details: JSON object with alert-specific metadata (e.g., tool name, file
path).

```
notification_type
```


```
"ToolPermission"
```


```
message
```


```
details
```

- systemMessage: Displayed alongside the system alert.

```
systemMessage
```

### PreCompress
```
PreCompress
```

[Section titled “PreCompress”](https://geminicli.com/docs/hooks/reference#precompress)
Fires before the CLI summarizes history to save tokens. Used for logging or state saving.
- Input Fields:

trigger: ("auto" | "manual")


- trigger: ("auto" | "manual")
- Relevant Output Fields:

systemMessage: Displayed to the user before compression.


- systemMessage: Displayed to the user before compression.
- Advisory Only: Fired asynchronously. It cannot block or modify the
compression process. Flow-control fields are ignored.
- trigger: ("auto" | "manual")

```
trigger
```


```
"auto" | "manual"
```

- systemMessage: Displayed to the user before compression.

```
systemMessage
```

[Section titled “Stable Model API”](https://geminicli.com/docs/hooks/reference#stable-model-api)
Gemini CLI uses these structures to ensure hooks don’t break across SDK updates.
LLMRequest:

```
{ "model": string, "messages": Array<{ "role": "user" | "model" | "system", "content": string // Non-text parts are filtered out for hooks }>, "config": { "temperature": number, ... }, "toolConfig": { "mode": string, "allowedFunctionNames": string[] }}
```


```
{ "model": string, "messages": Array<{ "role": "user" | "model" | "system", "content": string // Non-text parts are filtered out for hooks }>, "config": { "temperature": number, ... }, "toolConfig": { "mode": string, "allowedFunctionNames": string[] }}
```

LLMResponse:

```
{ "candidates": Array<{ "content": { "role": "model", "parts": string[] }, "finishReason": string }>, "usageMetadata": { "totalTokenCount": number }}
```


```
{ "candidates": Array<{ "content": { "role": "model", "parts": string[] }, "finishReason": string }>, "usageMetadata": { "totalTokenCount": number }}
```

[cookies](https://policies.google.com/technologies/cookies)
[Terms](https://geminicli.com/terms)
[Privacy](https://policies.google.com/privacy)

