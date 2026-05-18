# Lesson 12: FastAPI — The HTTP Backbone

## Goal
Understand FastAPI as the web framework that connects the CCP to the outside world — receiving requests, routing them to the right pipeline, and returning validated responses.

## Content Directives

### 1. What is FastAPI?
- FastAPI is the Python web framework for building the CCP's APIs.
- The concept of endpoints and `@app.get` / `@app.post` route decorators.
- Without FastAPI, the agentic engine is blind and deaf to the client application.

### 2. Request and Response Models
- The integration with Pydantic (Lesson 11).
- Incoming and outgoing validation before reaching internal functions.
- 422 Unprocessable Entity errors when clients send malformed JSON.

### 3. Dependency Injection
- Using `Depends()` to inject shared logic.
- Handling database sessions (`connect_to_neo4j()`), authentication tokens, and shared context without cluttering the route.

### 4. WebSocket Endpoints
- Moving from standard HTTP to persistent real-time connections (`@app.websocket`).
- The mechanism used by Pipecat to stream audio and text in real-time during coaching sessions.

## Strategic Paper Citations Required
- Building Effective Terminal Agents (190/200)
- Strategic Decision Document: Orchestration Dichotomy

## Factory Floor Role
**The Foreman.** FastAPI runs the factory floor. It takes the order (client request), checks the raw materials through QA (Pydantic), fires up the Machinists (DSPy/LLM), and schedules the Robot Arms (Pi Harness) before shipping the product back to the client.
