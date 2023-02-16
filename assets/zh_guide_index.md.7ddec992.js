import{_ as s,c as a,o as n,a as o}from"./app.1560828f.js";const d=JSON.parse('{"title":"快速开始","description":"","frontmatter":{},"headers":[{"level":2,"title":"概述","slug":"概述","link":"#概述","children":[]},{"level":2,"title":"安装","slug":"安装","link":"#安装","children":[]},{"level":2,"title":"用法","slug":"用法","link":"#用法","children":[]}],"relativePath":"zh/guide/index.md","lastUpdated":1676562677000}'),e={name:"zh/guide/index.md"},t=o(`<h1 id="快速开始" tabindex="-1">快速开始 <a class="header-anchor" href="#快速开始" aria-hidden="true">#</a></h1><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-hidden="true">#</a></h2><p>本插件兼容 <code>pinia^2.0.0</code>，在使用之前请确保你已经 <a href="https://pinia.vuejs.org/zh/getting-started.html" target="_blank" rel="noreferrer">安装 Pinia</a>。 <code>pinia-plugin-persistedstate</code> 丰富的功能可以使 Pinia Store 的持久化更易配置：</p><ul><li>与 <a href="https://github.com/robinvdvleuten/vuex-persistedstate" target="_blank" rel="noreferrer"><code>vuex-persistedstate</code></a> 相似的 API</li><li>所有 Store 均可单独配置</li><li>自定义 storage 和数据序列化</li><li>持久化数据前后的 hook</li><li>每个 Store 具有丰富的配置</li><li>兼容 Vue 2 和 3</li><li>无任何外部依赖</li></ul><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-hidden="true">#</a></h2><ol><li><p>用你喜欢的包管理器安装依赖：</p><ul><li>pnpm:</li></ul><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki css-variables"><code><span class="line"><span style="color:var(--shiki-color-text);">pnpm </span><span style="color:var(--shiki-token-string);">i</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string);">pinia-plugin-persistedstate</span></span>
<span class="line"></span></code></pre></div><ul><li>npm:</li></ul><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki css-variables"><code><span class="line"><span style="color:var(--shiki-color-text);">npm </span><span style="color:var(--shiki-token-string);">i</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string);">pinia-plugin-persistedstate</span></span>
<span class="line"></span></code></pre></div><ul><li>yarn:</li></ul><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki css-variables"><code><span class="line"><span style="color:var(--shiki-color-text);">yarn </span><span style="color:var(--shiki-token-string);">add</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string);">pinia-plugin-persistedstate</span></span>
<span class="line"></span></code></pre></div></li><li><p>将插件添加到 pinia 实例上</p></li></ol><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki css-variables"><code><span class="line"><span style="color:var(--shiki-token-keyword);">import</span><span style="color:var(--shiki-color-text);"> { createPinia } </span><span style="color:var(--shiki-token-keyword);">from</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string-expression);">&#39;pinia&#39;</span></span>
<span class="line"><span style="color:var(--shiki-token-keyword);">import</span><span style="color:var(--shiki-color-text);"> piniaPluginPersistedstate </span><span style="color:var(--shiki-token-keyword);">from</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string-expression);">&#39;pinia-plugin-persistedstate&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--shiki-token-keyword);">const</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-constant);">pinia</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-keyword);">=</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-function);">createPinia</span><span style="color:var(--shiki-color-text);">()</span></span>
<span class="line"><span style="color:var(--shiki-token-constant);">pinia</span><span style="color:var(--shiki-token-function);">.use</span><span style="color:var(--shiki-color-text);">(piniaPluginPersistedstate)</span></span>
<span class="line"></span></code></pre></div><h2 id="用法" tabindex="-1">用法 <a class="header-anchor" href="#用法" aria-hidden="true">#</a></h2><p>创建 Store 时，将 <code>persistent</code> 选项设置为 <code>true</code>。</p><p><em>使用选项式 Store 语法：</em></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki css-variables"><code><span class="line"><span style="color:var(--shiki-token-keyword);">import</span><span style="color:var(--shiki-color-text);"> { defineStore } </span><span style="color:var(--shiki-token-keyword);">from</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string-expression);">&#39;pinia&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--shiki-token-keyword);">export</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-keyword);">const</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-constant);">useStore</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-keyword);">=</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-function);">defineStore</span><span style="color:var(--shiki-color-text);">(</span><span style="color:var(--shiki-token-string-expression);">&#39;main&#39;</span><span style="color:var(--shiki-token-punctuation);">,</span><span style="color:var(--shiki-color-text);"> {</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  </span><span style="color:var(--shiki-token-function);">state</span><span style="color:var(--shiki-token-keyword);">:</span><span style="color:var(--shiki-color-text);"> () </span><span style="color:var(--shiki-token-keyword);">=&gt;</span><span style="color:var(--shiki-color-text);"> {</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">    </span><span style="color:var(--shiki-token-keyword);">return</span><span style="color:var(--shiki-color-text);"> {</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">      someState</span><span style="color:var(--shiki-token-keyword);">:</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string-expression);">&#39;你好 pinia&#39;</span><span style="color:var(--shiki-token-punctuation);">,</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">    }</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  }</span><span style="color:var(--shiki-token-punctuation);">,</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  persist</span><span style="color:var(--shiki-token-keyword);">:</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-constant);">true</span><span style="color:var(--shiki-token-punctuation);">,</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">})</span></span>
<span class="line"></span></code></pre></div><p><em>或者使用组合式 Store 语法：</em></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki css-variables"><code><span class="line"><span style="color:var(--shiki-token-keyword);">import</span><span style="color:var(--shiki-color-text);"> { defineStore } </span><span style="color:var(--shiki-token-keyword);">from</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-string-expression);">&#39;pinia&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--shiki-token-keyword);">export</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-keyword);">const</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-constant);">useStore</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-keyword);">=</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-function);">defineStore</span><span style="color:var(--shiki-color-text);">(</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  </span><span style="color:var(--shiki-token-string-expression);">&#39;main&#39;</span><span style="color:var(--shiki-token-punctuation);">,</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  () </span><span style="color:var(--shiki-token-keyword);">=&gt;</span><span style="color:var(--shiki-color-text);"> {</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">    </span><span style="color:var(--shiki-token-keyword);">const</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-constant);">someState</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-keyword);">=</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-function);">ref</span><span style="color:var(--shiki-color-text);">(</span><span style="color:var(--shiki-token-string-expression);">&#39;你好 pinia&#39;</span><span style="color:var(--shiki-color-text);">)</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">    </span><span style="color:var(--shiki-token-keyword);">return</span><span style="color:var(--shiki-color-text);"> { someState }</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  }</span><span style="color:var(--shiki-token-punctuation);">,</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  {</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">    persist</span><span style="color:var(--shiki-token-keyword);">:</span><span style="color:var(--shiki-color-text);"> </span><span style="color:var(--shiki-token-constant);">true</span><span style="color:var(--shiki-token-punctuation);">,</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">  }</span></span>
<span class="line"><span style="color:var(--shiki-color-text);">)</span></span>
<span class="line"></span></code></pre></div><p>现在，你的整个 Store 将使用<a href="/pinia-plugin-persistedstate/zh/guide/config.html">默认持久化配置</a>保存。</p>`,14),l=[t];function i(r,p,c,k,h,y){return n(),a("div",null,l)}const u=s(e,[["render",i]]);export{d as __pageData,u as default};
