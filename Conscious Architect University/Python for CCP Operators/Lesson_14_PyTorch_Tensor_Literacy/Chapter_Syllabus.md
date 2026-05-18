# Chapter Syllabus: Lesson 14 — PyTorch Tensor Literacy

## 🧠 Lesson 14: PyTorch Tensor Literacy

### 🎯 Goal

Understand tensors as multi-dimensional arrays that all neural networks operate on — and see enough PyTorch to read model loading, LoRA adapter injection, and activation steering operations.

---

### Layer 1 — What is a tensor?

A tensor is just a multi-dimensional array of numbers:

```python
import torch

# 1D tensor (vector)
v = torch.tensor([1.0, 2.0, 3.0])

# 2D tensor (matrix)
m = torch.tensor([[1.0, 2.0], [3.0, 4.0]])

# Shape tells you the dimensions
v.shape  # → torch.Size([3])
m.shape  # → torch.Size([2, 2])
```

If you completed the Linear Algebra course, you already know what these are — vectors and matrices. PyTorch tensors are Python's way of representing them, with GPU acceleration built in.

---

### Layer 2 — Why `.shape` matters

Every operation in a neural network depends on tensors having compatible shapes. If shapes don't match, the operation fails:

```python
a = torch.tensor([[1, 2, 3]])     # shape: (1, 3)
b = torch.tensor([[4], [5], [6]])  # shape: (3, 1)
result = a @ b                      # matrix multiply → shape: (1, 1)
```

When reading CCP model code, you'll constantly check shapes to verify that layers connect correctly. A LoRA adapter with the wrong dimensions won't merge — `.shape` is your first diagnostic tool.

---

### Layer 3 — Model loading and LoRA

The most common PyTorch operations you'll see in the CCP:

**Loading a model** (Launch Manual Ch 03):
```python
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3.5-72B")
```

**Loading a LoRA adapter**:
```python
from peft import PeftModel
model = PeftModel.from_pretrained(model, "path/to/voice_dna_adapter")
```

**Checking parameters**:
```python
for name, param in model.named_parameters():
    print(name, param.shape, param.requires_grad)
```

`requires_grad` tells you whether this parameter is being trained. In LoRA, most parameters have `requires_grad=False` (frozen) and only the adapter parameters are `True` (trainable).

---

### Layer 4 — `.eval()` vs `.train()`

Models have two modes:

```python
model.eval()   # inference mode — no gradient tracking, deterministic
model.train()  # training mode — tracks gradients, may use dropout
```

In production (CCP coaching sessions), the model MUST be in `.eval()` mode. If it's accidentally in `.train()` mode, behavior becomes non-deterministic — dropout layers randomly zero out neurons, producing inconsistent coaching responses.

---

### 🧩 Key questions

1. What does `torch.Size([4, 768])` tell you about a tensor?
2. Why would `requires_grad=False` on 99% of a model's parameters be a good thing?
3. What happens if you forget `model.eval()` during a live coaching session?

### 🎯 Takeaway

Tensors are the data format of neural networks. `.shape` tells you dimensions. `.requires_grad` tells you what's trainable. `.eval()` puts the model in production mode. You don't need to build models, but you need to read model-loading code and understand whether the LoRA adapter shapes match, the right parameters are frozen, and the model is in the right mode.
