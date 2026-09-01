# Agent instructions (this repo)

**Canonical rules:** Read and follow [`CLAUDE.md`](CLAUDE.md) — project overview, skill-loading rules, constraints, and the full skill directory.

**On each task:** When the user’s request matches a skill’s domain, read `.agent/skills/<skill-name>/SKILL.md` before doing that work. Load only relevant skills; do not preload every skill. If a task spans domains, apply skills in sequence.

**Skill index:** See the “Skill Directory” and “Skill Loading Logic” sections in `CLAUDE.md`.
