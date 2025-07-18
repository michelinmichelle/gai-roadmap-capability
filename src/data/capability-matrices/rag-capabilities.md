# RAG细分能力矩阵
# RAG Capability Matrix

| RAG能力项<br>RAG Capability | 内部简单知识检索<br>Internal Simple Knowledge Retrieval | 内部专业知识深度检索<br>Internal Deep Expert Knowledge Retrieval | 外部知识整合<br>External Knowledge Integration |
|----------------------|------------------------------------------------|---------------------------------------------------|---------------------------------------------|
| 基础语义检索（稠密）<br>Dense Semantic Retrieval | ✅ | ✅ | ⚠️ |
| 全文检索（稀疏）<br>Sparse Keyword Retrieval | ✅ | ⚠️ | ⚠️ |
| 混合检索<br>Hybrid Retrieval | ✅ | ✅ | ✅ |
| 多重过滤检索<br>Multi-filter Retrieval | ⚠️ | ✅ | ⚠️ |
| 重排（Reranking） | ⚠️ | ✅ | ✅ |
| 简单意图路由<br>Simple Intent Routing | ✅ | ⚠️ | ❌ |
| 复杂意图分解<br>Complex Intent Decomposition | ⚠️ | ✅ | ✅ |