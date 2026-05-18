# Course 10: The Gemini-CLI Operator Certification
## Module 14: Hooking the Pipeline: Events & Filters

### Phase I: The Context Anchor

We govern a 76-agent cognitive-behavioral matrix called the **Conscious Coaching Platform (CCP)**, and its autonomous video arm, the **Conscious Media Factory (CMF)**. In this module, we address the critical science of **Synchronous Interception** because, without it, the generative pipeline is a runaway freight train with no brakes.

When the CMF triggers a multi-stage render—synthesizing T2I prompts, I2V animation pulses, and audio layers—it isn't just one API call. It is a cascading sequence of agentic decisions. Each decision carries a literal financial cost and a systemic risk. If an agent decides to "optimize" a video by deleting the master source files, or runs a 100-step loop that drains your Anthropic credits in four minutes, the system has failed. 

This module grounds itself in the technical blueprints of the `CMF_Pipeline_Documentation.md` and the `prd-update-CA11-quad-platform.md`. We are not building "features"; we are building the **Inhibitory Layer**—the hooks and events that allow the operator to catch a model's intent *before* it becomes a reality. This is where we transition from passive observers of the AI to active governors of the pipeline.

---

### Phase II: The Negative Space

Before we construct, we must first demolish a dangerous assumption: **The belief that an AI’s execution path is, or should be, a "black box" that operates uninterruptibly from prompt to output.**

This "Set and Forget" myth is the hallmark of the amateur operator. The amateur believes that if the prompt is "good enough," the agent will behave. But in a 76-agent matrix like the CCP, entropy is a law. A model can hallucinate a tool argument, fail a safety check, or simply enter a "helpful" infinite loop that costs more than your monthly rent. 

If you view the AI's execution as a straight line from Input to Output, you have already lost control. In the terminal-native world of Pi and Gemini CLI, execution is not a line; it is a **Chain of Interception Points**. We do not let the model "just run." We build checkpoints. We build filters. We build the ability to say "Stop" at every millisecond of the process. With this cleared, we can now construct the correct architecture of Pipeline Hooks.

---

### Phase III: First Principles, Lexicon & Systems Engineering

At its most primitive, a **Hook** is a mathematical "Pattern Interrupt" in the flow of data. In systems engineering, we call this the **Middleware Pattern** or the **Interception Pattern**. 

Imagine a river (the data flow from the model). A hook is a gate you build across that river. When the water hits the gate, the flow *stops*. You can check the water for toxins (security), measure its volume (cost calculation), or even divert it into a different channel (routing). Only once your "Hook Script" returns a "Success" signal does the gate open and the water continue its journey.

In **Gemini CLI (v0.26.0+)**, this is implemented via a strict, synchronous hook lifecycle:
1.  **BeforeAgent**: Intercept before the prompt is even sent. (Inject context, check auth).
2.  **AfterModel**: Intercept after the model responds but *before* the output is shown/executed. (Validate JSON, check for PII).
3.  **BeforeTool**: Intercept before a dangerous command (like `bash`) is fired. (The ultimate security gate).
4.  **AfterAgent**: Intercept after the entire loop finishes. (Log the cost, update the session tree).

**Pi**, being the physical execution harness, treats these as **Extension Events**. While Gemini defines the *where*, Pi handles the *how*. Pi allows you to register "Listeners" that can block the execution thread until a specific condition is met—such as a manual "Enter" from the operator or a successful validation from a secondary safety subagent.

#### THE TECHNICAL LEXICON (MANDATORY)

*   **Interception:** The act of pausing a process to inspect or modify its state before it completes.
*   **Middleware:** A software layer that sits between two components (e.g., the User and the LLM) to process data as it passes through.
*   **Blocking Filter:** A hook that prevents the next step of execution unless a specific "Pass" criteria is met. Unlike a passive logger, a blocking filter can kill the process entirely if it detects a violation.

> [!TIP]
> **Observational Humor:** You know that feeling when you've just sent a text you immediately regret, and you have that three-second "Undo" window? Hooks are that window, but for an AI that is currently trying to delete your entire database because it thought it was a "good way to save disk space." It’s basically digital anxiety turned into a productive engineering feature.

---

### Phase IV: The Pedagogical Association

To truly understand Hooks, we must look at the most sophisticated orchestration engine in the known universe: the human brain.

#### Primary Metaphor: Neuroscience — Inhibitory Interneurons
In your brain, every "Go" signal (Excitatory) is balanced by a "Wait" signal (Inhibitory). When you decide to reach for a cup of coffee, your motor cortex fires. But if your brain detects that the cup is red-hot, a specialized circuit of **Inhibitory Interneurons** in the Pre-Supplementary Motor Area (Pre-SMA) fires *before* your arm moves. 

These neurons are the brain's "BeforeTool" hooks. They don't just "report" that the cup is hot; they physically block the motor signal from reaching your muscles. A lack of these "hooks" in the human brain leads to impulsivity and chaotic behavior. In the CCP, an agent without hooks is an impulsive agent—one that acts without a pre-frontal check. We are essentially building the CCP's social-behavioral cortex, ensuring every agentic impulse is filtered through our "Executive Function" layer.

#### Reinforcement Metaphor: Behavioral Change — Pattern Interrupts
In Cognitive Behavioral Therapy (CBT), we teach a technique called the **Pattern Interrupt**. When a patient spiraling into anxiety (an infinite loop of "hallucination") triggers a negative thought, we train them to physically shout "STOP!" or snap a rubber band on their wrist. 

This is a **Manual Hook**. It breaks the automated cycle. In the Gemini-CLI environment, when we see a model start to output low-quality code, we don't wait for it to finish. We use an interceptor—a Hook—to snap the "digital rubber band," force the model to look at its own errors, and restart the logic from a clean state. We are teaching the system "sobriety" through deterministic interruption.

---

### Phase V: Python Native Construction

To implement this logic in our local CCP scripts, we use a powerful Python feature called **Decorators**. 

#### THE PYTHON DEFINITION RUBRIC (MANDATORY)

**What is a Decorator?**
Think of a decorator like a "Security Guard" standing at the door of a function. Normally, to call a function, you just enter. With a decorator, you *must* talk to the guard first. The guard can check your ID (Pre-execution hook), let you in, and then check your pockets on the way out (Post-execution hook). In Python, a decorator is a function that "wraps" another function, allowing you to run code before and after the original function executes without actually changing the original function's code.

**Python Difficulty Tier 4: Decorators and Closures**

In the example below, we will create a `secure_render` system for the CMF. We want to ensure that every time we try to "generate" a video render, we check the **Token Cost** and **Bash Safety** first.

```python
import functools

# Mocking the CCP Global Config
CCP_RESOURCES = {
    "token_budget": 5000,
    "security_level": "Strict"
}

def security_gate(func):
    """
    This is our 'BeforeAgent' Hook Decorator.
    It intercepts the function call to check if parameters are safe.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Phase 1: The Interception
        prompt = args[0] if args else kwargs.get("prompt", "")
        
        # Security Filter Logic
        if "rm -rf" in prompt or "sudo" in prompt:
            print(f"[!] SECURITY HOOK TRIGGERED: Dangerous command detected in prompt: '{prompt}'")
            return "EXECUTION BLOCKED: Policy Engine Violation."
        
        print(f"[+] Security Hook Passed for prompt: '{prompt[:30]}...'")
        
        # Phase 2: Call the actual function
        result = func(*args, **kwargs)
        
        # Phase 3: Post-Execution Hook (Validation)
        if result is None:
            return "ERROR: Empty output from agent."
            
        return result
        
    return wrapper

def cost_validator(func):
    """
    A secondary hook to check financial bounds.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if CCP_RESOURCES["token_budget"] <= 0:
            print("[!] COST HOOK TRIGGERED: No budget remains. Blocking render.")
            return "EXECUTION BLOCKED: Insufficient Funds."
        
        print(f"[+] Cost Hook Passed. Current Budget: {CCP_RESOURCES['token_budget']}")
        
        # Execute the function
        result = func(*args, **kwargs)
        
        # Simulate cost deduction
        CCP_RESOURCES["token_budget"] -= 500
        print(f"[-] Cost Hook: Deducted 500 tokens. New Budget: {CCP_RESOURCES['token_budget']}")
        
        return result
    return wrapper

# Now we 'hook' our CMF functionality
@cost_validator
@security_gate
def generate_cmf_render(prompt: str):
    """
    The actual task of generating a video render sequence.
    """
    print(f"[*] Core Function: Executing CMF Pipeline for: {prompt}")
    return f"Video_Render_Output_for_{prompt}.mp4"

# --- TEST THE HOOKS ---

# 1. Successful Run
print("\n--- TEST 1: Standard Render ---")
print(generate_cmf_render("Create a 5-second zoom of an autumn leaf."))

# 2. Security Failure
print("\n--- TEST 2: Malicious Prompt ---")
print(generate_cmf_render("rm -rf / --no-preserve-root"))

# 3. Cost Failure (Loop until empty)
print("\n--- TEST 3: Budget Depletion ---")
for i in range(12):
    print(f"Iter {i}: {generate_cmf_render('Another render')}")
```

#### Code Walkthrough:
1.  **`@security_gate`**: This decorator acts as our **BeforeTool** hook. It inspects the `prompt` variable *before* `func()` is ever called. If it finds "rm -rf", it returns early, effectively "killing" the core function.
2.  **`@cost_validator`**: This is a **Middleware** layer. Notice how we "stack" decorators. Python executes them from the top down. First, it checks the cost, then it checks security, and only then does it run the render.
3.  **`functools.wraps`**: This is a best practice. It ensures your function keeps its original "identity" (name and docstring) even after being wrapped in hooks.

> [!NOTE]
> **Observational Humor:** Is it just me, or does "Decorator" sound like something an interior designer does to your code's ego? "Oh, this function is lovely, but let's add a post-modernistic authentication wrapper and some throw-pillows of error handling. It really opens up the namespace."

---

### Phase VI: The Implementation Contract & Bridge

**Falsifiable Learning Gate:**
By the end of this module, the student can demonstrably write a Python Decorator that intercepts a mock "generate_code" function, validates its inputs against a list of forbidden commands, and logs the execution cost to a central CCP state dictionary without modifying the core logic of the generator.

**Reference Files:**
*   `docs/prd/prd-update-CA11-quad-platform.md` (Security Constraints)
*   `gemini_cli_docs_reference/06_hooks_reference.md` (CLI Technical Spec)
*   `docs/architecture/FR-CA11-12_Course_Video_CMF_Pipeline_Tech_Spec.md` (Render Pipeline Life-cycle)

**Bridge to Module 15:**
Now that we know how to automatically **intercept** a failing pipeline via Hooks, we must learn the manual art of **Steering**. In Module 15, we move from the "Automatic Brakes" of Decorators to the "Manual Steering Wheel" of the Pi terminal, learning how to grab a derailed agent by the throat and force it back onto the tracks in real-time.
