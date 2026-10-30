<template>
  <section id="sec-ui" class="space-y-6">
    <div class="border-b border-slate-800 pb-4">
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
        <span>SECTION 04</span>
        <span>｜</span>
        <span>UI MICRO-INTERACTIONS</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
        04. UI 卡片與 3D 微互動展演區
      </h2>
      <p class="text-sm text-slate-400 mt-1">
        測試各類按鈕光效、毛玻璃質感與卡片在深色星雲背景下的易讀性與反饋手感。
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 卡片 1: 磁吸科技按鈕光影 -->
      <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 group hover:border-cyan-500/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl">
          ⚡
        </div>
        <h4 class="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
          流光霓虹漸層按鈕
        </h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          自帶呼吸漸層與微發光邊框，點擊時伴隨輕微微震回饋。
        </p>
        <div class="pt-2">
          <button
            type="button"
            class="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            互動體驗按鈕 →
          </button>
        </div>
      </div>

      <!-- 卡片 2: 毛玻璃全息卡片 -->
      <div class="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4 group hover:border-blue-500/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xl">
          💎
        </div>
        <h4 class="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
          深度毛玻璃 (Frosted Glass)
        </h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          高斯模糊消隱底層雜訊，確保在動態星雲背景上文字依然具備 100% 高對比度。
        </p>
        <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs font-mono text-slate-300">
          backdrop-blur-2xl ｜ bg-slate-900/80
        </div>
      </div>

      <!-- 卡片 3: AI 脈衝呼吸燈 -->
      <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 group hover:border-emerald-500/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl">
          🤖
        </div>
        <h4 class="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
          AI 脈衝呼吸燈
        </h4>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
          <div class="flex items-center space-x-2 text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SYSTEM ONLINE</span>
          </div>
          <div class="text-xs text-slate-500">AI AGENT: READY</div>
        </div>
      </div>
    </div>
  </section>
</template>
