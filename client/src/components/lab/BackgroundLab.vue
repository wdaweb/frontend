<template>
  <div class="space-y-20">
    <!-- ======================================================================= -->
    <!-- 區域 03：全域背景氛圍測試與展示 (Ambient Background Studio) -->
    <!-- ======================================================================= -->
    <section id="sec-bg" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
            <span>SECTION 03</span>
            <span>｜</span>
            <span>AMBIENT BACKGROUND</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            03. 全域背景氛圍測試與展示
          </h2>
          <p class="text-sm text-slate-400 mt-1">
            當前運作：<span class="text-cyan-300 font-bold">3D 宇宙深空流動星雲 (Three.js WebGL)</span> ｜ 全站 100% 常駐高幀率渲染
          </p>
        </div>

        <div class="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30 self-start sm:self-auto">
          🌌 旗艦定案基準
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- 旗艦定案卡片：3D 宇宙深空流動星雲 -->
        <div class="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-slate-950 border border-cyan-500/70 shadow-2xl shadow-cyan-950/60 text-white relative overflow-hidden flex flex-col justify-between group">
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-3xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                🌌
              </span>
              <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ACTIVE ✓ ｜ 全站旗艦定案
              </span>
            </div>

            <div>
              <h3 class="font-extrabold text-lg text-white mb-2">
                1. 3D 宇宙深空流動星雲與銀河星空 (3D Nebula & Milky Way Stars)
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                5 大 3D 柔焦星雲漫游交疊，搭配 1,880 顆三階星等銀河繁星（100% 聚焦視界內！深空微星、中景二等星、璀璨一等亮星）在深空中自然眨眼微閃爍，營造如高山觀星般的浪漫深邃銀河！
              </p>
            </div>

            <!-- 規格參數徽章 -->
            <div class="grid grid-cols-2 gap-2.5 pt-2">
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                <span>☁️</span>
                <span>5 大星雲自轉舒展</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                <span>✨</span>
                <span>1,880 顆視界聚焦繁星</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                <span>💎</span>
                <span>三階星等微十字星芒</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                <span>⚡</span>
                <span>120fps+ WebGL</span>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-800/80 text-xs font-mono flex items-center justify-between text-cyan-400 font-bold">
            <span>● 全站常駐運作中</span>
            <span>100% LOADED ✓</span>
          </div>
        </div>

        <!-- 5 大星雲深空物理特性即時調控台 -->
        <div class="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-2xl shadow-slate-950/60 text-white flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                🎛️ 4 大星雲物理特性即時調控台
              </span>
              <span class="text-xs font-mono text-slate-400">
                REAL-TIME PHYSICS
              </span>
            </div>

            <div class="space-y-2.5 pt-1">
              <!-- 1. 游標引力透鏡視差 -->
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
                <div class="flex items-center space-x-2.5 text-xs sm:text-sm">
                  <span>🪐</span>
                  <span class="font-bold text-slate-200">游標引力透鏡視差 (Parallax)</span>
                </div>
                <input
                  type="checkbox"
                  v-model="store.nebulaFeatures.mouseParallax"
                  class="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                />
              </label>

              <!-- 2. 絲狀雲氣纖維紋理 -->
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
                <div class="flex items-center space-x-2.5 text-xs sm:text-sm">
                  <span>🌪️</span>
                  <span class="font-bold text-slate-200">絲狀雲氣纖維紋理 (Filaments)</span>
                </div>
                <input
                  type="checkbox"
                  v-model="store.nebulaFeatures.filamentNoise"
                  class="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                />
              </label>

              <!-- 3. 引力波能量交織呼吸 -->
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
                <div class="flex items-center space-x-2.5 text-xs sm:text-sm">
                  <span>💓</span>
                  <span class="font-bold text-slate-200">引力波能量交織呼吸 (Breathing)</span>
                </div>
                <input
                  type="checkbox"
                  v-model="store.nebulaFeatures.entangledPulse"
                  class="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                />
              </label>

              <!-- 4. 滾動星空視差 -->
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
                <div class="flex items-center space-x-2.5 text-xs sm:text-sm">
                  <span>🌌</span>
                  <span class="font-bold text-slate-200">滾動星空視差 (GSAP Scroll Scrub)</span>
                </div>
                <input
                  type="checkbox"
                  v-model="store.nebulaFeatures.scrollParallax"
                  class="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div class="pt-3 mt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>4 大物理特性即時連動中</span>
            <span class="text-cyan-400 font-bold">ALL SYSTEMS LIVE</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================================= -->
    <!-- 區域 03.5：Awwwards 級 360° 天球仰望偶發流星控制台 (Celestial Meteor Lab) -->
    <!-- ======================================================================= -->
    <section id="sec-meteors" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
            <span>SECTION 03.5</span>
            <span>｜</span>
            <span>CELESTIAL SPORADIC METEORS</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            03.5 360° 天球仰望偶發流星物理實驗室
          </h2>
          <p class="text-sm text-slate-400 mt-1">
            打破傳統單向傾斜流星！重現仰望真實天穹時，流星從四面八方隨機偶發穿梭、白熱等離子高熱核與微爆火流星光學！
          </p>
        </div>

        <div class="flex flex-wrap gap-2.5 flex-shrink-0">
          <button
            type="button"
            @click="store.triggerMeteor()"
            class="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-yellow-400 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>⚡</span>
            <span>發射流星</span>
          </button>
          <button
            type="button"
            @click="store.triggerCodeMeteor()"
            class="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>👾</span>
            <span>發射代碼流星</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 卡片 1: 頻率節奏模式 -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              ⏱️ 頻率節奏模式
            </span>
            <span class="text-xs font-mono text-slate-400">FREQUENCY</span>
          </div>

          <div class="space-y-2">
            <button
              type="button"
              @click="store.setMeteorMode('sporadic')"
              class="w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between"
              :class="store.meteorConfig.mode === 'sporadic' ? 'bg-cyan-500/20 border-cyan-400/60 text-white shadow-lg shadow-cyan-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'"
            >
              <div>
                <div class="font-bold text-sm">🌌 靜謐偶發（8~22s 久久一次）</div>
                <div class="text-xs text-slate-400 mt-0.5">預設推薦！符合真實夜空仰望，靜謐不干擾閱讀</div>
              </div>
              <span v-if="store.meteorConfig.mode === 'sporadic'" class="text-cyan-400 font-mono text-xs font-bold">ACTIVE ✓</span>
            </button>

            <button
              type="button"
              @click="store.setMeteorMode('shower')"
              class="w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between"
              :class="store.meteorConfig.mode === 'shower' ? 'bg-cyan-500/20 border-cyan-400/60 text-white shadow-lg shadow-cyan-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'"
            >
              <div>
                <div class="font-bold text-sm">🎆 璀璨流星雨（2~5s 頻繁穿梭）</div>
                <div class="text-xs text-slate-400 mt-0.5">適合動效展演與即時視覺鑑賞</div>
              </div>
              <span v-if="store.meteorConfig.mode === 'shower'" class="text-cyan-400 font-mono text-xs font-bold">ACTIVE ✓</span>
            </button>

            <button
              type="button"
              @click="store.setMeteorMode('fireball')"
              class="w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between"
              :class="store.meteorConfig.mode === 'fireball' ? 'bg-amber-500/20 border-amber-400/60 text-white shadow-lg shadow-amber-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'"
            >
              <div>
                <div class="font-bold text-sm">💥 純微爆火流星（Fireballs Only）</div>
                <div class="text-xs text-slate-400 mt-0.5">每顆流星均伴隨 110px 耀斑微爆與散落碎屑火花</div>
              </div>
              <span v-if="store.meteorConfig.mode === 'fireball'" class="text-amber-400 font-mono text-xs font-bold">ACTIVE ✓</span>
            </button>
          </div>
        </div>

        <!-- 卡片 2: 360° 天球放射幾何 -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              🧭 發射幾何方向
            </span>
            <span class="text-xs font-mono text-slate-400">GEOMETRY</span>
          </div>

          <div class="space-y-2">
            <button
              type="button"
              @click="store.setMeteorDirection('omnidirectional')"
              class="w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between"
              :class="store.meteorConfig.direction === 'omnidirectional' ? 'bg-purple-500/20 border-purple-400/60 text-white shadow-lg shadow-purple-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'"
            >
              <div>
                <div class="font-bold text-sm">🌐 360° 仰望天穹四面八方</div>
                <div class="text-xs text-slate-400 mt-0.5">自上、下、左、右各維度隨機劃過夜空</div>
              </div>
              <span v-if="store.meteorConfig.direction === 'omnidirectional'" class="text-purple-400 font-mono text-xs font-bold">ACTIVE ✓</span>
            </button>

            <button
              type="button"
              @click="store.setMeteorDirection('radiant')"
              class="w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between"
              :class="store.meteorConfig.direction === 'radiant' ? 'bg-purple-500/20 border-purple-400/60 text-white shadow-lg shadow-purple-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'"
            >
              <div>
                <div class="font-bold text-sm">🎯 天頂深空向外輻射 (Radiant)</div>
                <div class="text-xs text-slate-400 mt-0.5">從天頂輻射點朝 360° 圓形散射而出</div>
              </div>
              <span v-if="store.meteorConfig.direction === 'radiant'" class="text-purple-400 font-mono text-xs font-bold">ACTIVE ✓</span>
            </button>

            <button
              type="button"
              @click="store.setMeteorDirection('diagonal')"
              class="w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between"
              :class="store.meteorConfig.direction === 'diagonal' ? 'bg-purple-500/20 border-purple-400/60 text-white shadow-lg shadow-purple-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'"
            >
              <div>
                <div class="font-bold text-sm">📐 經典斜向掠過 (Diagonal)</div>
                <div class="text-xs text-slate-400 mt-0.5">維持傳統右上向左下之流線軌跡</div>
              </div>
              <span v-if="store.meteorConfig.direction === 'diagonal'" class="text-purple-400 font-mono text-xs font-bold">ACTIVE ✓</span>
            </button>
          </div>
        </div>

        <!-- 卡片 3: 光學物理特性規格 -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                🔬 光學物理規格
              </span>
              <span class="text-xs font-mono text-slate-400">PHYSICS SPEC</span>
            </div>

            <div class="space-y-2.5 text-xs font-mono">
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400">等離子白熱針尖核心</span>
                <span class="text-white font-bold">#FFFFFF (1.4~2.2px)</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400">非線性電離彗尾長度</span>
                <span class="text-cyan-300 font-bold">140px ~ 440px</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400">火流星耀斑微爆脈衝</span>
                <span class="text-amber-300 font-bold">110px Radial Flare</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400">殘留發光煙霧痕跡</span>
                <span class="text-purple-300 font-bold">1.2s Slow Diffusion</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800/80 text-xs font-mono flex items-center justify-between text-slate-400">
            <span>全天球流星已全域啟用</span>
            <span class="text-cyan-400 font-bold">60FPS CANVAS 2D</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================================= -->
    <!-- 區域 03.6：AI 深空量子思維漣漪與幽靈代碼彩蛋控制台 -->
    <!-- ======================================================================= -->
    <section id="sec-easter-eggs" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
            <span>SECTION 03.6</span>
            <span>｜</span>
            <span>QUANTUM MIND WAVES & CYBER MATRIX EASTER EGGS</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            03.6 AI 深空量子思維漣漪與幽靈代碼彩蛋
          </h2>
          <p class="text-sm text-slate-400 mt-1">
            為仰望星空注入極致純淨的 AI 科技彩蛋！無連線噪訊干擾、自發性量子思維漣漪光環、以及進站首發與自然掠過的幽靈代碼流星！
          </p>
        </div>

        <div class="flex flex-wrap gap-2.5 flex-shrink-0">
          <button
            type="button"
            @click="store.triggerSynapticPulse()"
            class="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>🧠</span>
            <span>激發量子思維漣漪</span>
          </button>
          <button
            type="button"
            @click="store.triggerCodeMeteor()"
            class="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>⚡</span>
            <span>發射幽靈代碼流星</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 卡片 1: 👾 幽靈代碼流星彩蛋 -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                👾 幽靈代碼流星彩蛋
              </span>
              <span class="text-xs font-mono text-slate-400">CYBER MATRIX</span>
            </div>

            <div>
              <h3 class="font-bold text-base text-white mb-1">黑客科技矩陣流星</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                🌟 進站 2.2 秒首發 100% 必定掠過！後續全天球流星 55% 偶發轉化，沿途動態拋灑發光微塵符號粒子！
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-mono text-slate-300 font-bold block">
                偶發生成機率 (Chance)
              </label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="c in [
                    { label: '15%', val: 0.15 },
                    { label: '35%', val: 0.35 },
                    { label: '55%', val: 0.55 },
                    { label: '100%', val: 1.00 }
                  ]"
                  :key="c.val"
                  type="button"
                  @click="store.meteorConfig.codeMeteorChance = c.val"
                  class="py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center"
                  :class="[
                    Math.abs(store.meteorConfig.codeMeteorChance - c.val) < 0.05
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/30 scale-105'
                      : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                  ]"
                >
                  {{ c.label }}
                </button>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono text-emerald-400 font-bold">
                  🔤 職訓核心技能微塵庫 (Skills Pool)
                </span>
                <span class="text-xs font-mono text-slate-400">20 顆技能粒子</span>
              </div>
              
              <div class="space-y-2 text-xs font-mono">
                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span class="text-slate-400 font-bold min-w-[32px]">前端:</span>
                  <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">&lt;Vue/&gt;</span>
                  <span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">JavaScript</span>
                  <span class="px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/30">HTML5</span>
                  <span class="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">CSS3</span>
                  <span class="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">Pinia</span>
                  <span class="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">Bootstrap</span>
                </div>

                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span class="text-slate-400 font-bold min-w-[32px]">後端:</span>
                  <span class="px-1.5 py-0.5 rounded bg-green-500/15 text-green-300 border border-green-500/30">Node.js</span>
                  <span class="px-1.5 py-0.5 rounded bg-slate-500/15 text-slate-300 border border-slate-500/30">Express</span>
                  <span class="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">REST API</span>
                  <span class="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">Axios</span>
                  <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">NPM</span>
                </div>

                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span class="text-slate-400 font-bold min-w-[32px]">庫:</span>
                  <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">MongoDB</span>
                  <span class="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">NoSQL</span>
                  <span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">JSON</span>
                  <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">CRUD</span>
                </div>

                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span class="text-slate-400 font-bold min-w-[32px]">AI:</span>
                  <span class="px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30">AI</span>
                  <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">GenAI</span>
                  <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Prompt</span>
                  <span class="px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">Agent</span>
                  <span class="text-slate-400 font-bold ml-1">時數:</span>
                  <span class="px-1.5 py-0.5 rounded bg-white/20 text-white font-bold border border-white/40">920h</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800/80 text-xs font-mono flex items-center justify-between text-slate-400">
            <span>JetBrains Mono 原生渲染</span>
            <span class="text-emerald-400 font-bold">READY</span>
          </div>
        </div>

        <!-- 卡片 2: 🧠 AI 量子思維漣漪 -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                🧠 AI 量子思維光環
              </span>
              <span class="text-xs font-mono text-slate-400">QUANTUM WAVES</span>
            </div>

            <div>
              <h3 class="font-bold text-base text-white mb-1">深空純淨無連線・動態思維漣漪</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                深空繁星純淨無直線連線；漣漪大小具備多階動態範圍（靈動小波 300px ～ 廣域中波 650px ～ 浩瀚超巨引力波 1150px），自然擴散不單調！
              </p>
            </div>

            <div class="space-y-2.5">
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
                <div class="flex items-center space-x-2.5 text-xs sm:text-sm">
                  <span>🌐</span>
                  <span class="font-bold text-slate-200">啟用量子思維光環</span>
                </div>
                <input
                  type="checkbox"
                  v-model="store.synapticConfig.enabled"
                  class="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 cursor-pointer"
                />
              </label>

              <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
                <div class="flex items-center space-x-2.5 text-xs sm:text-sm">
                  <span>🌊</span>
                  <span class="font-bold text-slate-200">自發性宇宙思維量子漣漪 (9~14s)</span>
                </div>
                <input
                  type="checkbox"
                  v-model="store.synapticConfig.autonomousPulse"
                  class="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800/80 text-xs font-mono flex items-center justify-between text-slate-400">
            <span>無連線純淨星空</span>
            <span class="text-cyan-400 font-bold">ACTIVE</span>
          </div>
        </div>

        <!-- 卡片 3: 💫 彩蛋體驗引導與效能指標 -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
          <div class="space-y-3.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                💫 彩蛋體驗引導
              </span>
              <span class="text-xs font-mono text-slate-400">HOW IT FEELS</span>
            </div>

            <div>
              <h3 class="font-bold text-base text-white mb-1">純粹深空・絕無干擾</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                繁星維持最純天然閃爍與星雲漫游，無任何連線噪訊；偶爾掠過的代碼流星與量子光環讓民眾會心一笑！
              </p>
            </div>

            <div class="space-y-2 text-xs font-mono">
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400">量子思維漣漪擴散半徑</span>
                <span class="text-cyan-300 font-bold">220px ~ 360px</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400">進站首發代碼流星</span>
                <span class="text-emerald-300 font-bold">2.2 秒 100% 必出</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400">GPU / CPU 額外開銷</span>
                <span class="text-emerald-400 font-bold">&lt; 0.2ms (極致絲滑)</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800/80 text-xs font-mono flex items-center justify-between text-slate-400">
            <span>全域同步生效於所有分頁</span>
            <span class="text-purple-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/useThemeStore'

const store = useThemeStore()
</script>
