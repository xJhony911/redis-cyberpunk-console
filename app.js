/**
 * REDIS // NEON-CORE [DATA-VAULT TERMINAL]
 * Interactive Cyberpunk Redis Simulator Engine & Reactive Visualizer
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CYBER AUDIO SYNTHESIZER (WEB AUDIO API)
  // Zero external assets required, 100% offline & low-latency
  // ==========================================================================
  class CyberAudioEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.init();
        this.playSuccess();
      }
      return this.enabled;
    }

    playKeypress() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100 + Math.random() * 150, now);
        gain.gain.setValueAtTime(0.012, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.022);
      } catch (e) { /* ignore */ }
    }

    playExecute() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) { /* ignore */ }
    }

    // Write / Mutation: Punchy rising futuristic chirp (SET, HSET, LPUSH, SADD, etc.)
    playWrite() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } catch (e) { /* ignore */ }
    }

    // Read / Query: Dual high-pitch crystal scanner pings (GET, LRANGE, HGETALL, etc.)
    playRead() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        [1350, 1800].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          gain.gain.setValueAtTime(0.03, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.045);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + 0.045);
        });
      } catch (e) { /* ignore */ }
    }

    // Delete: Short, crisp, crunchy electronic disintegration zap (DEL, card X)
    playDelete() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        // Punchy downward sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.055);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
      } catch (e) { /* ignore */ }
    }

    // Pop: Short reverse bubble pop (LPOP, RPOP, HDEL, SREM)
    playPop() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.045);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } catch (e) { /* ignore */ }
    }

    // Flush / Purge: Deep EMP electromagnetic purge (FLUSHALL)
    playFlush() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) { /* ignore */ }
    }

    // Error: Double low rejection click buzz
    playError() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        [0, 0.05].forEach(tOffset => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now + tOffset);
          gain.gain.setValueAtTime(0.06, now + tOffset);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + tOffset + 0.035);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + tOffset);
          osc.stop(now + tOffset + 0.035);
        });
      } catch (e) { /* ignore */ }
    }

    playMutation() {
      this.playWrite();
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        [580, 880].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.035);
          gain.gain.setValueAtTime(0.03, now + i * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.07);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.035);
          osc.stop(now + i * 0.035 + 0.07);
        });
      } catch (e) { /* ignore */ }
    }

    playShutdown() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.45);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } catch (e) { /* ignore */ }
    }

    // Theme Switch: Harmonic dual crystalline chime
    playThemeSwitch() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        [520, 780, 1040, 1560].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.035);
          gain.gain.setValueAtTime(0.035, now + idx * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.035);
          osc.stop(now + idx * 0.035 + 0.12);
        });
      } catch (e) { /* ignore */ }
    }

    // Benchmark Burst: Rapid futuristic data stream burst
    playBenchmarkBurst() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        for (let i = 0; i < 8; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = i % 2 === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(400 + i * 180, now + i * 0.025);
          gain.gain.setValueAtTime(0.03, now + i * 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.025 + 0.035);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.025);
          osc.stop(now + i * 0.025 + 0.035);
        }
      } catch (e) { /* ignore */ }
    }

    // Mission Complete Fanfare: Ascending Triumph Chord
    playMissionComplete() {
      if (!this.enabled) return;
      this.init();
      try {
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.045, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.22);
        });
      } catch (e) { /* ignore */ }
    }
  }

  const audio = new CyberAudioEngine();

  // ==========================================================================
  // 2. IN-MEMORY REDIS SIMULATION ENGINE
  // ==========================================================================
  class RedisMemoryEngine {
    constructor() {
      this.store = new Map(); // key -> { type: 'string'|'hash'|'list'|'set'|'zset', value: any, ttl: null, updatedAt: number }
      this.opsCount = 0;
      this.listeners = [];

      // Active TTL countdown timer (autodestruction loop)
      setInterval(() => {
        let changed = false;
        for (let [k, item] of this.store.entries()) {
          if (typeof item.ttl === 'number') {
            item.ttl--;
            if (item.ttl <= 0) {
              this.store.delete(k);
              changed = true;
              this.notify(k, 'expired');
            } else {
              changed = true;
            }
          }
        }
        if (changed) {
          this.notify(null, 'ttl_tick');
        }
      }, 1000);
    }

    subscribe(listener) {
      this.listeners.push(listener);
    }

    notify(changedKey = null, action = 'update') {
      this.listeners.forEach(fn => fn({ changedKey, action, store: this.store }));
    }

    getStats() {
      let totalBytes = 0;
      let count = {
        total: this.store.size,
        string: 0,
        hash: 0,
        list: 0,
        set: 0,
        zset: 0
      };

      for (let [k, item] of this.store.entries()) {
        totalBytes += k.length * 2 + 32; // basic overhead
        count[item.type] = (count[item.type] || 0) + 1;

        if (item.type === 'string') {
          totalBytes += String(item.value).length * 2;
        } else if (item.type === 'hash') {
          for (let f in item.value) {
            totalBytes += (f.length + String(item.value[f]).length) * 2 + 16;
          }
        } else if (item.type === 'list') {
          item.value.forEach(v => totalBytes += String(v).length * 2 + 16);
        } else if (item.type === 'set') {
          item.value.forEach(v => totalBytes += String(v).length * 2 + 16);
        } else if (item.type === 'zset') {
          item.value.forEach(v => totalBytes += String(v.member).length * 2 + 24);
        }
      }

      return {
        totalKeys: count.total,
        counts: count,
        totalBytes: totalBytes,
        formattedBytes: (totalBytes / 1024).toFixed(2) + ' KB',
        ops: this.opsCount
      };
    }

    // Command Tokenizer: handles quoted strings (e.g. SET foo "Hello World")
    tokenize(cmdStr) {
      const tokens = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';

      for (let i = 0; i < cmdStr.length; i++) {
        const c = cmdStr[i];
        if ((c === '"' || c === "'") && !inQuotes) {
          inQuotes = true;
          quoteChar = c;
        } else if (c === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
        } else if (c === ' ' && !inQuotes) {
          if (current.length > 0) {
            tokens.push(current);
            current = '';
          }
        } else {
          current += c;
        }
      }
      if (current.length > 0) {
        tokens.push(current);
      }
      return tokens;
    }

    // Execute Redis command
    execute(rawCmd) {
      const trimmed = rawCmd.trim();
      if (!trimmed) return null;

      this.opsCount++;
      const tokens = this.tokenize(trimmed);
      if (tokens.length === 0) return null;

      const cmd = tokens[0].toUpperCase();
      const args = tokens.slice(1);

      try {
        switch (cmd) {
          // ----------------------------------------------------
          // GENERAL & SYSTEM COMMANDS
          // ----------------------------------------------------
          case 'QUIT':
          case 'EXIT':
          case 'DISCONNECT':
          case 'CIERRE':
            audio.playShutdown();
            return {
              type: 'system',
              raw: [
                '// CIERRE DE SESIÓN.',
                '// LIMPIEZA DE HUELLAS (docker kill redis-server && docker network remove redis_network)',
                '// DESCONEXIÓN EXITOSA.'
              ].join('\n')
            };

          case 'PING':
            return { type: 'string', raw: args.length > 0 ? args.join(' ') : 'PONG' };

          case 'ECHO':
            return { type: 'string', raw: args.join(' ') };

          case 'TIME':
            const nowMs = Date.now();
            return { type: 'array', raw: [Math.floor(nowMs / 1000).toString(), (nowMs % 1000 * 1000).toString()] };

          case 'CLEAR':
            return { type: 'system', action: 'clear' };

          case 'HELP':
            return this.cmdHelp(args);

          case 'INFO':
            return this.cmdInfo();

          case 'FLUSHALL':
          case 'FLUSHDB':
            const deletedCount = this.store.size;
            this.store.clear();
            this.notify(null, 'flush');
            return { type: 'ok', raw: `OK (Purged ${deletedCount} keys from Data-Vault RAM)` };

          case 'KEYS':
            return this.cmdKeys(args);

          case 'EXISTS':
            if (args.length === 0) throw new Error("ERR wrong number of arguments for 'exists' command");
            let existsCount = 0;
            args.forEach(k => { if (this.store.has(k)) existsCount++; });
            return { type: 'integer', raw: existsCount };

          case 'DEL':
            if (args.length === 0) throw new Error("ERR wrong number of arguments for 'del' command");
            let delCount = 0;
            args.forEach(k => {
              if (this.store.delete(k)) delCount++;
            });
            if (delCount > 0) this.notify(args[0], 'delete');
            return { type: 'integer', raw: delCount };

          case 'TYPE':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'type' command");
            const entry = this.store.get(args[0]);
            return { type: 'string', raw: entry ? entry.type : 'none' };

          case 'EXPIRE':
            if (args.length < 2) throw new Error("ERR wrong number of arguments for 'expire' command");
            const expKey = args[0];
            const seconds = parseInt(args[1], 10);
            if (!this.store.has(expKey) || isNaN(seconds)) {
              return { type: 'integer', raw: 0 };
            }
            this.store.get(expKey).ttl = seconds;
            this.notify(expKey, 'expire');
            return { type: 'integer', raw: 1 };

          case 'TTL':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'ttl' command");
            const ttlEntry = this.store.get(args[0]);
            if (!ttlEntry) return { type: 'integer', raw: -2 };
            return { type: 'integer', raw: ttlEntry.ttl !== null ? ttlEntry.ttl : -1 };

          // ----------------------------------------------------
          // STRINGS
          // ----------------------------------------------------
          case 'SET':
            if (args.length < 2) throw new Error("ERR wrong number of arguments for 'set' command");
            const setKey = args[0];
            const setVal = args[1];
            this.store.set(setKey, {
              type: 'string',
              value: setVal,
              ttl: null,
              updatedAt: Date.now()
            });
            this.notify(setKey, 'set');
            return { type: 'ok', raw: 'OK' };

          case 'SETNX':
            if (args.length < 2) throw new Error("ERR wrong number of arguments for 'setnx' command");
            const snxKey = args[0];
            const snxVal = args[1];
            if (this.store.has(snxKey)) {
              return { type: 'integer', raw: 0 };
            }
            this.store.set(snxKey, {
              type: 'string',
              value: snxVal,
              ttl: null,
              updatedAt: Date.now()
            });
            this.notify(snxKey, 'setnx');
            return { type: 'integer', raw: 1 };

          case 'GET':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'get' command");
            const getKey = args[0];
            const getEntry = this.store.get(getKey);
            if (!getEntry) return { type: 'nil', raw: '(nil)' };
            if (getEntry.type !== 'string') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'string', raw: `"${getEntry.value}"` };

          case 'INCR':
          case 'DECR':
          case 'INCRBY':
          case 'DECRBY':
            return this.cmdNumericString(cmd, args);

          case 'APPEND':
            if (args.length < 2) throw new Error("ERR wrong number of arguments for 'append' command");
            const appKey = args[0];
            const appVal = args[1];
            let existingStr = '';
            if (this.store.has(appKey)) {
              const cur = this.store.get(appKey);
              if (cur.type !== 'string') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
              existingStr = cur.value;
            }
            const newStr = existingStr + appVal;
            this.store.set(appKey, { type: 'string', value: newStr, ttl: null, updatedAt: Date.now() });
            this.notify(appKey, 'append');
            return { type: 'integer', raw: newStr.length };

          case 'STRLEN':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'strlen' command");
            const lenEntry = this.store.get(args[0]);
            if (!lenEntry) return { type: 'integer', raw: 0 };
            if (lenEntry.type !== 'string') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'integer', raw: String(lenEntry.value).length };

          case 'MSET':
            if (args.length < 2 || args.length % 2 !== 0) throw new Error("ERR wrong number of arguments for 'mset' command");
            for (let i = 0; i < args.length; i += 2) {
              this.store.set(args[i], { type: 'string', value: args[i + 1], ttl: null, updatedAt: Date.now() });
            }
            this.notify(args[0], 'mset');
            return { type: 'ok', raw: 'OK' };

          case 'MGET':
            if (args.length < 1) throw new Error("ERR wrong number of arguments for 'mget' command");
            const mgetResults = args.map(k => {
              const item = this.store.get(k);
              return (item && item.type === 'string') ? `"${item.value}"` : '(nil)';
            });
            return { type: 'array', raw: mgetResults };

          // ----------------------------------------------------
          // HASHES
          // ----------------------------------------------------
          case 'HSET':
            if (args.length < 3) throw new Error("ERR wrong number of arguments for 'hset' command");
            const hKey = args[0];
            let hashEntry = this.store.get(hKey);
            if (hashEntry && hashEntry.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (!hashEntry) {
              hashEntry = { type: 'hash', value: {}, ttl: null, updatedAt: Date.now() };
              this.store.set(hKey, hashEntry);
            }
            let fieldsAdded = 0;
            for (let i = 1; i < args.length; i += 2) {
              const f = args[i];
              const v = args[i + 1];
              if (v !== undefined) {
                if (!(f in hashEntry.value)) fieldsAdded++;
                hashEntry.value[f] = v;
              }
            }
            hashEntry.updatedAt = Date.now();
            this.notify(hKey, 'hset');
            return { type: 'integer', raw: fieldsAdded };

          case 'HGET':
            if (args.length !== 2) throw new Error("ERR wrong number of arguments for 'hget' command");
            const hgKey = args[0];
            const hgField = args[1];
            const hgItem = this.store.get(hgKey);
            if (!hgItem) return { type: 'nil', raw: '(nil)' };
            if (hgItem.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (hgField in hgItem.value) {
              return { type: 'string', raw: `"${hgItem.value[hgField]}"` };
            }
            return { type: 'nil', raw: '(nil)' };

          case 'HGETALL':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'hgetall' command");
            const hgaKey = args[0];
            const hgaItem = this.store.get(hgaKey);
            if (!hgaItem) return { type: 'array', raw: [] };
            if (hgaItem.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            const hgaArr = [];
            for (let f in hgaItem.value) {
              hgaArr.push(`"${f}"`);
              hgaArr.push(`"${hgaItem.value[f]}"`);
            }
            return { type: 'array', raw: hgaArr };

          case 'HDEL':
            if (args.length < 2) throw new Error("ERR wrong number of arguments for 'hdel' command");
            const hdKey = args[0];
            const hdItem = this.store.get(hdKey);
            if (!hdItem) return { type: 'integer', raw: 0 };
            if (hdItem.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            let hdelCount = 0;
            for (let i = 1; i < args.length; i++) {
              if (args[i] in hdItem.value) {
                delete hdItem.value[args[i]];
                hdelCount++;
              }
            }
            hdItem.updatedAt = Date.now();
            this.notify(hdKey, 'hdel');
            return { type: 'integer', raw: hdelCount };

          case 'HEXISTS':
            if (args.length !== 2) throw new Error("ERR wrong number of arguments for 'hexists' command");
            const heItem = this.store.get(args[0]);
            if (!heItem || heItem.type !== 'hash') return { type: 'integer', raw: 0 };
            return { type: 'integer', raw: (args[1] in heItem.value) ? 1 : 0 };

          case 'HLEN':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'hlen' command");
            const hlItem = this.store.get(args[0]);
            if (!hlItem) return { type: 'integer', raw: 0 };
            if (hlItem.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'integer', raw: Object.keys(hlItem.value).length };

          case 'HKEYS':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'hkeys' command");
            const hkItem = this.store.get(args[0]);
            if (!hkItem) return { type: 'array', raw: [] };
            if (hkItem.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'array', raw: Object.keys(hkItem.value).map(k => `"${k}"`) };

          case 'HVALS':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'hvals' command");
            const hvItem = this.store.get(args[0]);
            if (!hvItem) return { type: 'array', raw: [] };
            if (hvItem.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'array', raw: Object.values(hvItem.value).map(v => `"${v}"`) };

          case 'HINCRBY':
            if (args.length !== 3) throw new Error("ERR wrong number of arguments for 'hincrby' command");
            const hicKey = args[0];
            const hicField = args[1];
            const hicIncr = parseInt(args[2], 10);
            if (isNaN(hicIncr)) throw new Error("ERR value is not an integer or out of range");
            let hicItem = this.store.get(hicKey);
            if (hicItem && hicItem.type !== 'hash') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (!hicItem) {
              hicItem = { type: 'hash', value: {}, ttl: null, updatedAt: Date.now() };
              this.store.set(hicKey, hicItem);
            }
            const oldVal = parseInt(hicItem.value[hicField] || '0', 10);
            if (isNaN(oldVal)) throw new Error("ERR hash value is not an integer");
            const nextVal = oldVal + hicIncr;
            hicItem.value[hicField] = String(nextVal);
            hicItem.updatedAt = Date.now();
            this.notify(hicKey, 'hincrby');
            return { type: 'integer', raw: nextVal };

          // ----------------------------------------------------
          // LISTS
          // ----------------------------------------------------
          case 'LPUSH':
          case 'RPUSH':
            if (args.length < 2) throw new Error(`ERR wrong number of arguments for '${cmd.toLowerCase()}' command`);
            const lKey = args[0];
            let listItem = this.store.get(lKey);
            if (listItem && listItem.type !== 'list') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (!listItem) {
              listItem = { type: 'list', value: [], ttl: null, updatedAt: Date.now() };
              this.store.set(lKey, listItem);
            }
            for (let i = 1; i < args.length; i++) {
              if (cmd === 'LPUSH') {
                listItem.value.unshift(args[i]);
              } else {
                listItem.value.push(args[i]);
              }
            }
            listItem.updatedAt = Date.now();
            this.notify(lKey, cmd.toLowerCase());
            return { type: 'integer', raw: listItem.value.length };

          case 'LPOP':
          case 'RPOP':
            if (args.length < 1) throw new Error(`ERR wrong number of arguments for '${cmd.toLowerCase()}' command`);
            const popKey = args[0];
            const popItem = this.store.get(popKey);
            if (!popItem) return { type: 'nil', raw: '(nil)' };
            if (popItem.type !== 'list') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (popItem.value.length === 0) return { type: 'nil', raw: '(nil)' };
            const popped = (cmd === 'LPOP') ? popItem.value.shift() : popItem.value.pop();
            popItem.updatedAt = Date.now();
            this.notify(popKey, cmd.toLowerCase());
            return { type: 'string', raw: `"${popped}"` };

          case 'LRANGE':
            if (args.length !== 3) throw new Error("ERR wrong number of arguments for 'lrange' command");
            const lrKey = args[0];
            let start = parseInt(args[1], 10);
            let stop = parseInt(args[2], 10);
            const lrItem = this.store.get(lrKey);
            if (!lrItem) return { type: 'array', raw: [] };
            if (lrItem.type !== 'list') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            const arr = lrItem.value;
            const len = arr.length;
            if (start < 0) start = Math.max(0, len + start);
            if (stop < 0) stop = len + stop;
            if (start > stop || start >= len) return { type: 'array', raw: [] };
            const slice = arr.slice(start, stop + 1).map(v => `"${v}"`);
            return { type: 'array', raw: slice };

          case 'LLEN':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'llen' command");
            const llenItem = this.store.get(args[0]);
            if (!llenItem) return { type: 'integer', raw: 0 };
            if (llenItem.type !== 'list') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'integer', raw: llenItem.value.length };

          case 'LSET':
            if (args.length !== 3) throw new Error("ERR wrong number of arguments for 'lset' command");
            const lsKey = args[0];
            const lsIdx = parseInt(args[1], 10);
            const lsVal = args[2];
            const lsItem = this.store.get(lsKey);
            if (!lsItem) throw new Error("ERR no such key");
            if (lsItem.type !== 'list') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            const targetIdx = lsIdx < 0 ? lsItem.value.length + lsIdx : lsIdx;
            if (targetIdx < 0 || targetIdx >= lsItem.value.length) throw new Error("ERR index out of range");
            lsItem.value[targetIdx] = lsVal;
            lsItem.updatedAt = Date.now();
            this.notify(lsKey, 'lset');
            return { type: 'ok', raw: 'OK' };

          case 'LREM':
            if (args.length !== 3) throw new Error("ERR wrong number of arguments for 'lrem' command");
            const lremKey = args[0];
            const lremCount = parseInt(args[1], 10);
            const lremVal = args[2];
            const lremItem = this.store.get(lremKey);
            if (!lremItem) return { type: 'integer', raw: 0 };
            if (lremItem.type !== 'list') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            let removedCount = 0;
            if (lremCount === 0) {
              const prevLen = lremItem.value.length;
              lremItem.value = lremItem.value.filter(v => v !== lremVal);
              removedCount = prevLen - lremItem.value.length;
            } else if (lremCount > 0) {
              for (let i = 0; i < lremItem.value.length && removedCount < lremCount; i++) {
                if (lremItem.value[i] === lremVal) {
                  lremItem.value.splice(i, 1);
                  removedCount++;
                  i--;
                }
              }
            } else {
              for (let i = lremItem.value.length - 1; i >= 0 && removedCount < Math.abs(lremCount); i--) {
                if (lremItem.value[i] === lremVal) {
                  lremItem.value.splice(i, 1);
                  removedCount++;
                }
              }
            }
            lremItem.updatedAt = Date.now();
            this.notify(lremKey, 'lrem');
            return { type: 'integer', raw: removedCount };

          // ----------------------------------------------------
          // SETS
          // ----------------------------------------------------
          case 'SADD':
            if (args.length < 2) throw new Error("ERR wrong number of arguments for 'sadd' command");
            const sKey = args[0];
            let setItem = this.store.get(sKey);
            if (setItem && setItem.type !== 'set') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (!setItem) {
              setItem = { type: 'set', value: new Set(), ttl: null, updatedAt: Date.now() };
              this.store.set(sKey, setItem);
            }
            let sAdded = 0;
            for (let i = 1; i < args.length; i++) {
              if (!setItem.value.has(args[i])) {
                setItem.value.add(args[i]);
                sAdded++;
              }
            }
            setItem.updatedAt = Date.now();
            this.notify(sKey, 'sadd');
            return { type: 'integer', raw: sAdded };

          case 'SMEMBERS':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'smembers' command");
            const smItem = this.store.get(args[0]);
            if (!smItem) return { type: 'array', raw: [] };
            if (smItem.type !== 'set') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'array', raw: Array.from(smItem.value).map(v => `"${v}"`) };

          case 'SISMEMBER':
            if (args.length !== 2) throw new Error("ERR wrong number of arguments for 'sismember' command");
            const sisItem = this.store.get(args[0]);
            if (!sisItem || sisItem.type !== 'set') return { type: 'integer', raw: 0 };
            return { type: 'integer', raw: sisItem.value.has(args[1]) ? 1 : 0 };

          case 'SCARD':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'scard' command");
            const scItem = this.store.get(args[0]);
            if (!scItem) return { type: 'integer', raw: 0 };
            if (scItem.type !== 'set') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'integer', raw: scItem.value.size };

          case 'SREM':
            if (args.length < 2) throw new Error("ERR wrong number of arguments for 'srem' command");
            const srItem = this.store.get(args[0]);
            if (!srItem) return { type: 'integer', raw: 0 };
            if (srItem.type !== 'set') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            let sRemCount = 0;
            for (let i = 1; i < args.length; i++) {
              if (srItem.value.delete(args[i])) sRemCount++;
            }
            srItem.updatedAt = Date.now();
            this.notify(args[0], 'srem');
            return { type: 'integer', raw: sRemCount };

          case 'SUNION':
          case 'SINTER':
          case 'SDIFF':
            return this.cmdSetAlgebra(cmd, args);

          // ----------------------------------------------------
          // SORTED SETS (ZSETS)
          // ----------------------------------------------------
          case 'ZADD':
            if (args.length < 3 || (args.length - 1) % 2 !== 0) {
              throw new Error("ERR syntax error or wrong number of arguments for 'zadd' command");
            }
            const zKey = args[0];
            let zItem = this.store.get(zKey);
            if (zItem && zItem.type !== 'zset') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (!zItem) {
              zItem = { type: 'zset', value: [], ttl: null, updatedAt: Date.now() };
              this.store.set(zKey, zItem);
            }
            let zAdded = 0;
            for (let i = 1; i < args.length; i += 2) {
              const score = parseFloat(args[i]);
              const member = args[i + 1];
              if (isNaN(score)) throw new Error("ERR value is not a valid float");

              const existingIdx = zItem.value.findIndex(item => item.member === member);
              if (existingIdx >= 0) {
                zItem.value[existingIdx].score = score;
              } else {
                zItem.value.push({ score, member });
                zAdded++;
              }
            }
            // keep sorted ascending by score
            zItem.value.sort((a, b) => a.score - b.score);
            zItem.updatedAt = Date.now();
            this.notify(zKey, 'zadd');
            return { type: 'integer', raw: zAdded };

          case 'ZRANGE':
          case 'ZREVRANGE':
            return this.cmdZRange(cmd, args);

          case 'ZSCORE':
            if (args.length !== 2) throw new Error("ERR wrong number of arguments for 'zscore' command");
            const zscItem = this.store.get(args[0]);
            if (!zscItem || zscItem.type !== 'zset') return { type: 'nil', raw: '(nil)' };
            const mMatch = zscItem.value.find(item => item.member === args[1]);
            return mMatch ? { type: 'string', raw: `"${mMatch.score}"` } : { type: 'nil', raw: '(nil)' };

          case 'ZRANK':
          case 'ZREVRANK':
            if (args.length !== 2) throw new Error(`ERR wrong number of arguments for '${cmd.toLowerCase()}' command`);
            const zrkItem = this.store.get(args[0]);
            if (!zrkItem || zrkItem.type !== 'zset') return { type: 'nil', raw: '(nil)' };
            let rankArr = [...zrkItem.value];
            if (cmd === 'ZREVRANK') rankArr.reverse();
            const rankIdx = rankArr.findIndex(item => item.member === args[1]);
            return rankIdx >= 0 ? { type: 'integer', raw: rankIdx } : { type: 'nil', raw: '(nil)' };

          case 'ZCARD':
            if (args.length !== 1) throw new Error("ERR wrong number of arguments for 'zcard' command");
            const zcItem = this.store.get(args[0]);
            if (!zcItem) return { type: 'integer', raw: 0 };
            if (zcItem.type !== 'zset') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            return { type: 'integer', raw: zcItem.value.length };

          case 'ZINCRBY':
            if (args.length !== 3) throw new Error("ERR wrong number of arguments for 'zincrby' command");
            const zincKey = args[0];
            const incVal = parseFloat(args[1]);
            const zincMember = args[2];
            if (isNaN(incVal)) throw new Error("ERR value is not a valid float");
            let zincItem = this.store.get(zincKey);
            if (zincItem && zincItem.type !== 'zset') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            if (!zincItem) {
              zincItem = { type: 'zset', value: [], ttl: null, updatedAt: Date.now() };
              this.store.set(zincKey, zincItem);
            }
            let mem = zincItem.value.find(i => i.member === zincMember);
            if (!mem) {
              mem = { score: incVal, member: zincMember };
              zincItem.value.push(mem);
            } else {
              mem.score += incVal;
            }
            zincItem.value.sort((a, b) => a.score - b.score);
            zincItem.updatedAt = Date.now();
            this.notify(zincKey, 'zincrby');
            return { type: 'string', raw: `"${mem.score}"` };

          case 'ZRANGEBYSCORE':
            if (args.length < 3) throw new Error("ERR wrong number of arguments for 'zrangebyscore' command");
            return this.cmdZRangeByScore(args);

          default:
            throw new Error(`ERR unknown command '${tokens[0]}', with args beginning with: ${tokens.slice(1, 4).map(s => `'${s}'`).join(' ')}`);
        }
      } catch (err) {
        return { type: 'error', raw: `(error) ${err.message}` };
      }
    }

    // String increment/decrement helper
    cmdNumericString(cmd, args) {
      if (args.length < 1) throw new Error(`ERR wrong number of arguments for '${cmd.toLowerCase()}' command`);
      const key = args[0];
      let step = 1;
      if (cmd === 'DECR') step = -1;
      if (cmd === 'INCRBY') {
        if (args.length < 2) throw new Error("ERR wrong number of arguments for 'incrby' command");
        step = parseInt(args[1], 10);
      }
      if (cmd === 'DECRBY') {
        if (args.length < 2) throw new Error("ERR wrong number of arguments for 'decrby' command");
        step = -parseInt(args[1], 10);
      }
      if (isNaN(step)) throw new Error("ERR value is not an integer or out of range");

      let entry = this.store.get(key);
      if (entry && entry.type !== 'string') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
      let currentVal = entry ? parseInt(entry.value, 10) : 0;
      if (isNaN(currentVal)) throw new Error("ERR value is not an integer or out of range");

      const newVal = currentVal + step;
      this.store.set(key, { type: 'string', value: String(newVal), ttl: null, updatedAt: Date.now() });
      this.notify(key, cmd.toLowerCase());
      return { type: 'integer', raw: newVal };
    }

    // Set union & intersection helper
    cmdSetAlgebra(cmd, args) {
      if (args.length < 1) throw new Error(`ERR wrong number of arguments for '${cmd.toLowerCase()}' command`);
      const sets = [];
      for (let k of args) {
        const item = this.store.get(k);
        if (item) {
          if (item.type !== 'set') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
          sets.push(item.value);
        } else {
          sets.push(new Set());
        }
      }
      if (sets.length === 0) return { type: 'array', raw: [] };

      let resultSet;
      if (cmd === 'SUNION') {
        resultSet = new Set();
        sets.forEach(s => s.forEach(v => resultSet.add(v)));
      } else if (cmd === 'SINTER') {
        resultSet = new Set(sets[0]);
        for (let i = 1; i < sets.length; i++) {
          const nextSet = sets[i];
          resultSet = new Set([...resultSet].filter(x => nextSet.has(x)));
        }
      } else if (cmd === 'SDIFF') {
        resultSet = new Set(sets[0]);
        for (let i = 1; i < sets.length; i++) {
          const nextSet = sets[i];
          nextSet.forEach(x => resultSet.delete(x));
        }
      }
      return { type: 'array', raw: Array.from(resultSet).map(v => `"${v}"`) };
    }

    // ZSet Range By Score helper
    cmdZRangeByScore(args) {
      const key = args[0];
      const min = parseFloat(args[1]);
      const max = parseFloat(args[2]);
      if (isNaN(min) || isNaN(max)) throw new Error("ERR min or max is not a float");

      const item = this.store.get(key);
      if (!item) return { type: 'array', raw: [] };
      if (item.type !== 'zset') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");

      let withScores = false;
      let offset = 0;
      let count = Infinity;

      for (let i = 3; i < args.length; i++) {
        const flag = args[i].toUpperCase();
        if (flag === 'WITHSCORES') {
          withScores = true;
        } else if (flag === 'LIMIT' && i + 2 < args.length) {
          offset = parseInt(args[i + 1], 10);
          count = parseInt(args[i + 2], 10);
          i += 2;
        }
      }

      const filtered = item.value
        .filter(m => m.score >= min && m.score <= max)
        .slice(offset, count === Infinity ? undefined : offset + count);

      const out = [];
      filtered.forEach(m => {
        out.push(`"${m.member}"`);
        if (withScores) out.push(`"${m.score}"`);
      });
      return { type: 'array', raw: out };
    }

    // ZSet Range helper
    cmdZRange(cmd, args) {
      if (args.length < 3) throw new Error(`ERR wrong number of arguments for '${cmd.toLowerCase()}' command`);
      const key = args[0];
      let start = parseInt(args[1], 10);
      let stop = parseInt(args[2], 10);
      const withScores = (args[3] && args[3].toUpperCase() === 'WITHSCORES');

      const item = this.store.get(key);
      if (!item) return { type: 'array', raw: [] };
      if (item.type !== 'zset') throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");

      let list = [...item.value];
      if (cmd === 'ZREVRANGE') list.reverse();

      const len = list.length;
      if (start < 0) start = Math.max(0, len + start);
      if (stop < 0) stop = len + stop;
      if (start > stop || start >= len) return { type: 'array', raw: [] };

      const slice = list.slice(start, stop + 1);
      const out = [];
      slice.forEach(i => {
        out.push(`"${i.member}"`);
        if (withScores) out.push(`"${i.score}"`);
      });
      return { type: 'array', raw: out };
    }

    // KEYS pattern search
    cmdKeys(args) {
      const pattern = args[0] || '*';
      const results = [];
      let regex;
      try {
        const regexStr = '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
        regex = new RegExp(regexStr);
      } catch (e) {
        regex = /.*/;
      }
      for (let k of this.store.keys()) {
        if (regex.test(k)) results.push(`"${k}"`);
      }
      return { type: 'array', raw: results };
    }

    cmdHelp(args) {
      return {
        type: 'system',
        raw: [
          '=== CYBERPUNK REDIS KERNEL MANUAL ===',
          'STRINGS:     SET k v | GET k | INCR k | DECR k | APPEND k v | STRLEN k | MSET | MGET',
          'HASHES:      HSET k f v | HGET k f | HGETALL k | HDEL k f | HEXISTS k f | HINCRBY',
          'LISTS:       LPUSH k v | RPUSH k v | LPOP k | RPOP k | LRANGE k 0 -1 | LLEN k',
          'SETS:        SADD k m | SMEMBERS k | SREM k m | SISMEMBER k m | SUNION | SINTER',
          'SORTED SETS: ZADD k score m | ZRANGE k 0 -1 [WITHSCORES] | ZREVRANGE | ZSCORE | ZRANK',
          'GENERIC:     KEYS * | DEL k | EXISTS k | TYPE k | EXPIRE k s | TTL k | FLUSHALL | CLEAR'
        ].join('\n')
      };
    }

    cmdInfo() {
      const s = this.getStats();
      return {
        type: 'system',
        raw: [
          '# Server',
          'redis_version:2.0.77-cyberpunk',
          'os:Alpine Linux 3.19 (Cyber-Kernel)',
          'process_id:6379',
          'tcp_port:6379',
          '# Memory',
          `used_memory_human:${s.formattedBytes}`,
          `total_keys:${s.totalKeys}`,
          'mem_allocator:jemalloc-5.3.0-cyber',
          '# Stats',
          `total_commands_processed:${s.ops}`,
          'instantaneous_ops_per_sec:1250'
        ].join('\n')
      };
    }
  }

  // ==========================================================================
  // 3. UI CONTROLLER & EVENT INTEGRATION
  // ==========================================================================
  const engine = new RedisMemoryEngine();

  // DOM Elements
  const termLogs = document.getElementById('term-logs');
  const termScreen = document.getElementById('terminal-screen');
  const termInput = document.getElementById('terminal-input');
  const btnSubmit = document.getElementById('btn-submit-cmd');
  const btnClearTerm = document.getElementById('btn-clear-term');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundLabel = document.getElementById('sound-label');
  const btnSeedData = document.getElementById('btn-seed-data');
  const btnFlushAll = document.getElementById('btn-flush-all');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  const btnExportVault = document.getElementById('btn-export-vault');
  const btnImportVault = document.getElementById('btn-import-vault');
  const fileImportVault = document.getElementById('file-import-vault');
  const btnBenchmark = document.getElementById('btn-benchmark');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  const btnMissionsToggle = document.getElementById('btn-missions-toggle');
  const missionProgressLabel = document.getElementById('mission-progress-label');
  const modalMissions = document.getElementById('modal-missions');
  const modalMissionsBackdrop = document.getElementById('modal-missions-backdrop');
  const btnCloseMissions = document.getElementById('btn-close-missions');
  const btnDoneMissions = document.getElementById('btn-done-missions');
  const btnResetMissions = document.getElementById('btn-reset-missions');
  const missionsGrid = document.getElementById('missions-grid');
  const netrunnerRank = document.getElementById('netrunner-rank');
  const netrunnerXp = document.getElementById('netrunner-xp');
  const missionProgressBar = document.getElementById('mission-progress-bar');

  const suggestionBar = document.getElementById('terminal-suggestion-bar');
  const suggestionBadge = document.getElementById('suggestion-badge');
  const suggestionCmd = document.getElementById('suggestion-cmd');
  const suggestionSyntax = document.getElementById('suggestion-syntax');
  const suggestionDesc = document.getElementById('suggestion-desc');
  const btnApplySuggestion = document.getElementById('btn-apply-suggestion');

  const vaultCardsContainer = document.getElementById('vault-cards-container');
  const vaultSearchInput = document.getElementById('vault-search-input');
  const vaultFilterChips = document.querySelectorAll('.type-chip');
  const vaultLastAction = document.getElementById('vault-last-action');
  const vaultItemsFiltered = document.getElementById('vault-items-filtered');

  const statTotalKeys = document.getElementById('stat-total-keys');
  const statCmdCount = document.getElementById('stat-cmd-count');
  const statMemUsage = document.getElementById('stat-mem-usage');
  const meterFill = document.getElementById('meter-fill');

  const countAll = document.getElementById('count-all');
  const countString = document.getElementById('count-string');
  const countHash = document.getElementById('count-hash');
  const countList = document.getElementById('count-list');
  const countSet = document.getElementById('count-set');
  const countZset = document.getElementById('count-zset');

  // Command History Navigation
  const cmdHistory = [];
  let historyIdx = -1;
  let activeFilter = 'all';

  // --------------------------------------------------------------------------
  // Terminal Output Formatter
  // --------------------------------------------------------------------------
  function appendTerminalEntry(commandStr, result) {
    if (result && result.action === 'clear') {
      termLogs.innerHTML = '';
      return;
    }

    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'log-cmd';
    cmdLine.innerHTML = `<span class="log-prompt">127.0.0.1:6379&gt;</span> <span>${escapeHtml(commandStr)}</span>`;
    logEntry.appendChild(cmdLine);

    if (result) {
      const respLine = document.createElement('div');
      respLine.className = `log-response resp-${result.type}`;

      if (result.type === 'array') {
        if (result.raw.length === 0) {
          respLine.textContent = '(empty list or set)';
        } else {
          respLine.textContent = result.raw.map((item, idx) => `${idx + 1}) ${item}`).join('\n');
        }
      } else if (result.type === 'integer') {
        respLine.textContent = `(integer) ${result.raw}`;
      } else {
        respLine.textContent = result.raw;
      }
      logEntry.appendChild(respLine);
    }

    termLogs.appendChild(logEntry);
    termScreen.scrollTop = termScreen.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function highlightMatch(text, query) {
    const raw = String(text ?? '');
    if (!query) return escapeHtml(raw);
    const escapedText = escapeHtml(raw);
    const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return escapedText.replace(regex, '<mark class="neon-match">$1</mark>');
    } catch (e) {
      return escapedText;
    }
  }

  // --------------------------------------------------------------------------
  // Execute Command from Input
  // --------------------------------------------------------------------------
  function runTerminalCommand(rawCmd, fromInteractive = true) {
    if (!rawCmd || !rawCmd.trim()) return;
    const cmdStr = rawCmd.trim();

    if (fromInteractive) {
      cmdHistory.push(cmdStr);
      historyIdx = cmdHistory.length;
    }

    const result = engine.execute(cmdStr);
    appendTerminalEntry(cmdStr, result);

    const firstWord = (cmdStr.split(/\s+/)[0] || '').toUpperCase();

    if (result) {
      if (result.type === 'error') {
        audio.playError();
      } else if (firstWord === 'FLUSHALL' || firstWord === 'FLUSHDB') {
        audio.playFlush();
      } else if (firstWord === 'DEL') {
        audio.playDelete();
      } else if (['LPOP', 'RPOP', 'HDEL', 'SREM', 'ZREM'].includes(firstWord)) {
        audio.playPop();
      } else if (['SET', 'SETNX', 'HSET', 'LPUSH', 'RPUSH', 'SADD', 'ZADD', 'INCR', 'DECR', 'INCRBY', 'DECRBY', 'APPEND', 'LSET', 'ZINCRBY'].includes(firstWord)) {
        audio.playWrite();
      } else if (['GET', 'HGET', 'HGETALL', 'HKEYS', 'HVALS', 'LRANGE', 'LLEN', 'SMEMBERS', 'SISMEMBER', 'SCARD', 'ZRANGE', 'ZREVRANGE', 'ZSCORE', 'ZRANK', 'ZREVRANK', 'ZCARD', 'ZRANGEBYSCORE', 'KEYS', 'EXISTS', 'TYPE', 'TTL', 'PING', 'TIME', 'ECHO', 'INFO', 'HELP', 'SUNION', 'SINTER', 'SDIFF'].includes(firstWord)) {
        audio.playRead();
      } else if (['QUIT', 'EXIT', 'DISCONNECT', 'CIERRE'].includes(firstWord)) {
        audio.playShutdown();
      } else {
        audio.playSuccess();
      }
    }

    updateHUDStats();
    if (fromInteractive) {
      termInput.value = '';
      updateSyntaxSuggestion();
    }
  }

  // --------------------------------------------------------------------------
  // HUD & Stats Refresh
  // --------------------------------------------------------------------------
  function updateHUDStats() {
    const stats = engine.getStats();
    statTotalKeys.textContent = stats.totalKeys;
    statCmdCount.textContent = stats.ops;
    statMemUsage.textContent = stats.formattedBytes;

    countAll.textContent = stats.counts.total;
    countString.textContent = stats.counts.string;
    countHash.textContent = stats.counts.hash;
    countList.textContent = stats.counts.list;
    countSet.textContent = stats.counts.set;
    countZset.textContent = stats.counts.zset;

    // Simulated memory fill bar (relative to 100 KB demo limit)
    const pct = Math.min(100, Math.max(5, (stats.totalBytes / 102400) * 100));
    meterFill.style.width = `${pct}%`;
  }

  // --------------------------------------------------------------------------
  // Data-Vault Memory Card Visualizer
  // --------------------------------------------------------------------------
  function renderVaultMemory(changedKey = null, action = 'update') {
    const query = (vaultSearchInput.value || '').trim().toLowerCase();
    const store = engine.store;

    if (store.size === 0) {
      vaultCardsContainer.innerHTML = `
        <div class="vault-empty-state">
          <div class="empty-icon-radar">
            <div class="radar-circle circle-1"></div>
            <div class="radar-circle circle-2"></div>
            <div class="radar-line"></div>
          </div>
          <p class="empty-title">DATA-VAULT VACÍO</p>
          <p class="empty-desc">No hay llaves alojadas en el espacio de memoria RAM virtual.</p>
          <div class="empty-actions">
            <button class="cyber-btn-mini btn-highlight" id="btn-empty-seed">
              CARGAR DEMO SET
            </button>
            <button class="cyber-btn-mini" id="btn-empty-sample">
              CREAR PRIMERA CLAVE
            </button>
          </div>
        </div>
      `;
      const btnEmptySeed = document.getElementById('btn-empty-seed');
      if (btnEmptySeed) btnEmptySeed.onclick = seedDemoData;
      const btnEmptySample = document.getElementById('btn-empty-sample');
      if (btnEmptySample) btnEmptySample.onclick = () => injectExample('SET node:alpha "ONLINE"');

      vaultLastAction.textContent = action === 'flush' ? 'MEMORIA PURGADA (FLUSHALL)' : 'DATA-VAULT EN ESPERA';
      vaultItemsFiltered.textContent = '0 elementos';
      return;
    }

    // Filter items
    const entries = [];
    for (let [k, item] of store.entries()) {
      if (activeFilter !== 'all' && item.type !== activeFilter) continue;
      if (query && !k.toLowerCase().includes(query) && !JSON.stringify(item.value).toLowerCase().includes(query)) {
        continue;
      }
      entries.push({ key: k, item });
    }

    vaultItemsFiltered.textContent = `${entries.length} de ${store.size} claves`;
    if (changedKey) {
      vaultLastAction.textContent = `MUTACIÓN [${action.toUpperCase()}]: ${changedKey}`;
    }

    vaultCardsContainer.innerHTML = '';

    entries.forEach(({ key, item }) => {
      const card = document.createElement('div');
      card.className = `vault-card type-${item.type}`;
      card.dataset.key = key;

      // Header
      const header = document.createElement('div');
      header.className = 'card-header-line';

      let inspectCmd = `GET ${key}`;
      if (item.type === 'hash') inspectCmd = `HGETALL ${key}`;
      else if (item.type === 'list') inspectCmd = `LRANGE ${key} 0 -1`;
      else if (item.type === 'set') inspectCmd = `SMEMBERS ${key}`;
      else if (item.type === 'zset') inspectCmd = `ZRANGE ${key} 0 -1 WITHSCORES`;

      header.innerHTML = `
        <div class="card-title-group">
          <span class="card-type-tag">${item.type}</span>
          <span class="card-key-name clickable" title="Clic para consultar: ${escapeHtml(inspectCmd)}">${highlightMatch(key, query)}</span>
        </div>
        <div class="card-actions-group">
          <button class="card-btn-query" title="Inspeccionar clave en la terminal">&#9654; GET</button>
          ${item.ttl !== null ? `<span class="card-size-tag text-neon-yellow">TTL: ${item.ttl}s</span>` : ''}
          <button class="card-btn-del" title="Eliminar clave (DEL ${escapeHtml(key)})">&times;</button>
        </div>
      `;

      // Card Content Body
      const body = document.createElement('div');
      body.className = 'card-content-body';

      if (item.type === 'string') {
        body.innerHTML = `<div class="val-string">"${highlightMatch(String(item.value), query)}"</div>`;
      } else if (item.type === 'hash') {
        let tableRows = '';
        for (let f in item.value) {
          tableRows += `
            <tr class="hash-row">
              <td class="hash-key">${highlightMatch(f, query)}</td>
              <td class="hash-val">${highlightMatch(String(item.value[f]), query)}</td>
            </tr>
          `;
        }
        body.innerHTML = `<table class="hash-fields-table"><tbody>${tableRows || '<tr><td colspan="2" class="text-dim">(vacío)</td></tr>'}</tbody></table>`;
      } else if (item.type === 'list') {
        let nodes = item.value.map((v, i) => `
          <span class="list-node"><span class="node-idx">[${i}]</span> ${highlightMatch(v, query)}</span>
          ${i < item.value.length - 1 ? '<span class="list-arrow">&rarr;</span>' : ''}
        `).join('');
        body.innerHTML = `<div class="list-pipeline">${nodes || '<span class="text-dim">(lista vacía)</span>'}</div>`;
      } else if (item.type === 'set') {
        let pills = Array.from(item.value).map(v => `
          <span class="set-pill">${highlightMatch(v, query)}</span>
        `).join('');
        body.innerHTML = `<div class="set-cluster">${pills || '<span class="text-dim">(set vacío)</span>'}</div>`;
      } else if (item.type === 'zset') {
        let rows = item.value.map(v => `
          <div class="zset-item">
            <span class="zset-member">${highlightMatch(v.member, query)}</span>
            <span class="zset-score">${v.score}</span>
          </div>
        `).join('');
        body.innerHTML = `<div class="zset-board">${rows || '<span class="text-dim">(zset vacío)</span>'}</div>`;
      }

      card.appendChild(header);
      card.appendChild(body);

      // Attach header click actions
      const keyNameEl = header.querySelector('.card-key-name');
      if (keyNameEl) {
        keyNameEl.addEventListener('click', () => {
          injectExample(inspectCmd);
        });
      }

      const queryBtn = header.querySelector('.card-btn-query');
      if (queryBtn) {
        queryBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          injectExample(inspectCmd);
        });
      }

      // Attach delete click
      const delBtn = card.querySelector('.card-btn-del');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        runTerminalCommand(`DEL ${key}`);
        audio.playDelete();
      });

      // Highlight Flash Animation on the modified key
      if (changedKey && key === changedKey) {
        card.classList.add('flash-neon');
        setTimeout(() => card.classList.remove('flash-neon'), 950);
        audio.playMutation();
      }

      vaultCardsContainer.appendChild(card);
    });
  }

  // Engine mutation subscription
  engine.subscribe(({ changedKey, action }) => {
    updateHUDStats();
    renderVaultMemory(changedKey, action);
    checkMissions();
  });

  // --------------------------------------------------------------------------
  // Seed Demo Data (Cyberpunk Universe Dataset)
  // --------------------------------------------------------------------------
  function seedDemoData() {
    audio.playMutation();
    const demoCommands = [
      'SET puerta_01 "desbloqueada"',
      'SETNX tarjeta_acceso "valida"',
      'HSET operativo:v nombre "Vincent" clase "Solo" nivel 45',
      'LPUSH log_hackeos "Servidor_Arasaka" "Cámara_callejón"',
      'SADD red_fantasma "nodo_A" "nodo_B"',
      'SADD red_corporativa "nodo_B" "nodo_C"',
      'ZADD recompensas 50000 "Maelstrom_Lider" 12000 "Scavenger_Scout" 85000 "Cyberpsycho_01"'
    ];

    demoCommands.forEach(cmd => {
      engine.execute(cmd);
      appendTerminalEntry(cmd, { type: 'ok', raw: 'OK' });
    });

    updateHUDStats();
    renderVaultMemory(null, 'seed');
    appendTerminalEntry('SYS:INFO', {
      type: 'system',
      raw: '>>> DATA-VAULT INICIALIZADO: CLAVES CYBERPUNK CARGADAS (puerta_01, tarjeta_acceso, operativo:v, log_hackeos, red_fantasma, red_corporativa, recompensas)'
    });
  }
  window.seedDemoData = seedDemoData;

  // --------------------------------------------------------------------------
  // Helper for 1-Click Code Run / Injection
  // --------------------------------------------------------------------------
  function injectExample(commandStr) {
    termInput.value = commandStr;
    termInput.focus();
    runTerminalCommand(commandStr, true);
    // Smooth scroll terminal into view if user is in lower module
    termScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  window.injectExample = injectExample;

  // --------------------------------------------------------------------------
  // Event Listeners: Terminal Input & Navigation
  // --------------------------------------------------------------------------
  termInput.addEventListener('keydown', (e) => {
    audio.playKeypress();

    if (e.key === 'Enter') {
      e.preventDefault();
      runTerminalCommand(termInput.value, true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIdx > 0) {
        historyIdx--;
        termInput.value = cmdHistory[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        termInput.value = cmdHistory[historyIdx];
      } else {
        historyIdx = cmdHistory.length;
        termInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (currentSuggestion && !termInput.value.trim().includes(' ')) {
        applyActiveSuggestion();
      } else {
        autoCompleteCommand();
      }
    }
  });

  // --------------------------------------------------------------------------
  // Command Dictionary & Live Syntax Suggestions
  // --------------------------------------------------------------------------
  const COMMAND_DICTIONARY = [
    // Strings
    { name: 'SET', cat: 'string', syntax: 'SET key value [EX seg] [NX]', desc: 'Guarda una clave con su valor de texto.' },
    { name: 'GET', cat: 'string', syntax: 'GET key', desc: 'Devuelve el valor en texto de la clave solicitada.' },
    { name: 'SETNX', cat: 'string', syntax: 'SETNX key value', desc: 'Guarda SOLO si la clave no existe aún en memoria.' },
    { name: 'INCR', cat: 'string', syntax: 'INCR key', desc: 'Incrementa atómicamente un número entero en +1.' },
    { name: 'DECR', cat: 'string', syntax: 'DECR key', desc: 'Decrementa atómicamente un número entero en -1.' },
    { name: 'INCRBY', cat: 'string', syntax: 'INCRBY key increment', desc: 'Incrementa un número entero por una cantidad dada.' },
    { name: 'APPEND', cat: 'string', syntax: 'APPEND key value', desc: 'Concatena texto al final del valor existente.' },
    { name: 'STRLEN', cat: 'string', syntax: 'STRLEN key', desc: 'Devuelve la longitud en caracteres de la cadena.' },
    { name: 'MSET', cat: 'string', syntax: 'MSET k1 v1 [k2 v2 ...]', desc: 'Guarda múltiples pares clave-valor a la vez.' },
    { name: 'MGET', cat: 'string', syntax: 'MGET k1 [k2 ...]', desc: 'Obtiene el valor de múltiples claves simultáneamente.' },

    // Hashes
    { name: 'HSET', cat: 'hash', syntax: 'HSET key field value [f2 v2 ...]', desc: 'Asigna uno o más campos y valores en un Hash.' },
    { name: 'HGET', cat: 'hash', syntax: 'HGET key field', desc: 'Obtiene el valor del campo especificado dentro del Hash.' },
    { name: 'HGETALL', cat: 'hash', syntax: 'HGETALL key', desc: 'Devuelve todos los campos y valores contenidos en el Hash.' },
    { name: 'HDEL', cat: 'hash', syntax: 'HDEL key field [f2 ...]', desc: 'Elimina uno o más campos específicos de un Hash.' },
    { name: 'HEXISTS', cat: 'hash', syntax: 'HEXISTS key field', desc: 'Verifica si un campo específico existe en el Hash.' },
    { name: 'HKEYS', cat: 'hash', syntax: 'HKEYS key', desc: 'Devuelve todos los nombres de campos del Hash.' },
    { name: 'HVALS', cat: 'hash', syntax: 'HVALS key', desc: 'Devuelve todos los valores de campos del Hash.' },
    { name: 'HLEN', cat: 'hash', syntax: 'HLEN key', desc: 'Devuelve la cantidad de campos dentro del Hash.' },
    { name: 'HINCRBY', cat: 'hash', syntax: 'HINCRBY key field increment', desc: 'Incrementa el número de un campo de Hash.' },

    // Lists
    { name: 'LPUSH', cat: 'list', syntax: 'LPUSH key element [elem2 ...]', desc: 'Inserta elementos al INICIO (cabeza) de la lista.' },
    { name: 'RPUSH', cat: 'list', syntax: 'RPUSH key element [elem2 ...]', desc: 'Inserta elementos al FINAL (cola) de la lista.' },
    { name: 'LPOP', cat: 'list', syntax: 'LPOP key [count]', desc: 'Extrae y elimina el primer elemento de la lista.' },
    { name: 'RPOP', cat: 'list', syntax: 'RPOP key [count]', desc: 'Extrae y elimina el último elemento de la cola de la lista.' },
    { name: 'LRANGE', cat: 'list', syntax: 'LRANGE key start stop', desc: 'Obtiene rango de elementos (ej. 0 -1 para todos).' },
    { name: 'LLEN', cat: 'list', syntax: 'LLEN key', desc: 'Devuelve la cantidad total de elementos en la lista.' },
    { name: 'LSET', cat: 'list', syntax: 'LSET key index value', desc: 'Modifica el valor en un índice específico de la lista.' },
    { name: 'LREM', cat: 'list', syntax: 'LREM key count element', desc: 'Elimina ocurrencias del elemento en la lista.' },

    // Sets
    { name: 'SADD', cat: 'set', syntax: 'SADD key member [mem2 ...]', desc: 'Agrega uno o varios miembros únicos al conjunto.' },
    { name: 'SMEMBERS', cat: 'set', syntax: 'SMEMBERS key', desc: 'Devuelve todos los miembros únicos del conjunto.' },
    { name: 'SREM', cat: 'set', syntax: 'SREM key member [mem2 ...]', desc: 'Elimina uno o más miembros específicos del Set.' },
    { name: 'SISMEMBER', cat: 'set', syntax: 'SISMEMBER key member', desc: 'Comprueba con O(1) si un valor pertenece al Set.' },
    { name: 'SCARD', cat: 'set', syntax: 'SCARD key', desc: 'Devuelve el número total de miembros del Set.' },
    { name: 'SUNION', cat: 'set', syntax: 'SUNION key1 [key2 ...]', desc: 'Calcula y devuelve la unión de múltiples Sets.' },
    { name: 'SINTER', cat: 'set', syntax: 'SINTER key1 [key2 ...]', desc: 'Devuelve la intersección común entre Sets.' },
    { name: 'SDIFF', cat: 'set', syntax: 'SDIFF key1 [key2 ...]', desc: 'Devuelve la diferencia entre conjuntos.' },

    // Sorted Sets
    { name: 'ZADD', cat: 'zset', syntax: 'ZADD key score member [s2 m2 ...]', desc: 'Inserta miembros ordenados automáticamente por score.' },
    { name: 'ZRANGE', cat: 'zset', syntax: 'ZRANGE key start stop [WITHSCORES]', desc: 'Devuelve elementos ordenados de menor a mayor score.' },
    { name: 'ZREVRANGE', cat: 'zset', syntax: 'ZREVRANGE key start stop [WITHSCORES]', desc: 'Devuelve elementos ordenados de mayor a menor score.' },
    { name: 'ZREM', cat: 'zset', syntax: 'ZREM key member [mem2 ...]', desc: 'Elimina miembros del Sorted Set.' },
    { name: 'ZSCORE', cat: 'zset', syntax: 'ZSCORE key member', desc: 'Devuelve el puntaje asignado a un miembro.' },
    { name: 'ZRANK', cat: 'zset', syntax: 'ZRANK key member', desc: 'Devuelve la posición ordinal del miembro en el ranking.' },
    { name: 'ZCARD', cat: 'zset', syntax: 'ZCARD key', desc: 'Devuelve el número total de miembros en el Sorted Set.' },
    { name: 'ZINCRBY', cat: 'zset', syntax: 'ZINCRBY key increment member', desc: 'Incrementa el puntaje de un miembro en el Sorted Set.' },
    { name: 'ZRANGEBYSCORE', cat: 'zset', syntax: 'ZRANGEBYSCORE key min max [LIMIT off cnt]', desc: 'Filtra miembros en un rango numérico de puntajes.' },

    // General & Diagnostics
    { name: 'DEL', cat: 'general', syntax: 'DEL key [key2 ...]', desc: 'Elimina una o más claves de la memoria física RAM.' },
    { name: 'EXISTS', cat: 'general', syntax: 'EXISTS key [key2 ...]', desc: 'Comprueba si una o más claves existen en el Vault.' },
    { name: 'KEYS', cat: 'general', syntax: 'KEYS pattern', desc: 'Busca todas las claves que coincidan (ej. KEYS *).' },
    { name: 'TYPE', cat: 'general', syntax: 'TYPE key', desc: 'Devuelve el tipo de dato asignado a la clave.' },
    { name: 'EXPIRE', cat: 'general', syntax: 'EXPIRE key seconds', desc: 'Configura tiempo de vida (TTL) en segundos.' },
    { name: 'TTL', cat: 'general', syntax: 'TTL key', desc: 'Devuelve los segundos restantes antes de que la clave expire.' },
    { name: 'FLUSHALL', cat: 'general', syntax: 'FLUSHALL', desc: 'Purga y borra absolutamente TODA la memoria RAM.' },
    { name: 'CLEAR', cat: 'general', syntax: 'CLEAR (Ctrl+L)', desc: 'Limpia el visor de registros de la terminal.' },
    { name: 'HELP', cat: 'general', syntax: 'HELP [comando]', desc: 'Muestra el manual de ayuda interactivo.' },
    { name: 'INFO', cat: 'general', syntax: 'INFO', desc: 'Muestra estadísticas de memoria y comandos.' },
    { name: 'PING', cat: 'general', syntax: 'PING [mensaje]', desc: 'Prueba la conexión (responde PONG).' }
  ];

  let currentSuggestion = null;

  function updateSyntaxSuggestion() {
    if (!suggestionBar) return;
    const raw = termInput.value.trim();
    if (!raw) {
      suggestionBar.style.display = 'none';
      currentSuggestion = null;
      return;
    }

    const firstWord = raw.split(/\s+/)[0].toUpperCase();
    const match = COMMAND_DICTIONARY.find(c => c.name === firstWord)
               || COMMAND_DICTIONARY.find(c => c.name.startsWith(firstWord));

    if (match) {
      currentSuggestion = match;
      if (suggestionBadge) {
        suggestionBadge.textContent = match.cat.toUpperCase();
        suggestionBadge.className = `suggestion-badge badge-${match.cat}`;
      }
      if (suggestionCmd) suggestionCmd.textContent = match.name;
      if (suggestionSyntax) suggestionSyntax.textContent = match.syntax;
      if (suggestionDesc) suggestionDesc.textContent = match.desc;
      suggestionBar.style.display = 'flex';
    } else {
      suggestionBar.style.display = 'none';
      currentSuggestion = null;
    }
  }

  function applyActiveSuggestion() {
    if (currentSuggestion) {
      termInput.value = currentSuggestion.name + ' ';
      updateSyntaxSuggestion();
      termInput.focus();
      audio.playKeypress();
    }
  }

  if (btnApplySuggestion) {
    btnApplySuggestion.addEventListener('click', applyActiveSuggestion);
  }

  termInput.addEventListener('input', updateSyntaxSuggestion);

  function autoCompleteCommand() {
    const val = termInput.value.trim().toUpperCase();
    const match = COMMAND_DICTIONARY.find(c => c.name.startsWith(val));
    if (match) {
      termInput.value = match.name + ' ';
      updateSyntaxSuggestion();
    }
  }

  btnSubmit.addEventListener('click', () => {
    runTerminalCommand(termInput.value, true);
    termInput.focus();
  });

  btnClearTerm.addEventListener('click', () => {
    audio.playExecute();
    termLogs.innerHTML = '';
  });

  // Hotkey Ctrl+L / Cmd+L to clear terminal
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      audio.playExecute();
      termLogs.innerHTML = '';
    }
  });

  // --------------------------------------------------------------------------
  // Theme Management (Cyberpunk HUD vs Neon Dark Minimalista)
  // --------------------------------------------------------------------------
  let currentTheme = localStorage.getItem('neon_core_theme') || 'cyberpunk';

  function applyTheme(theme, playSound = false) {
    currentTheme = theme;
    localStorage.setItem('neon_core_theme', theme);

    if (theme === 'minimal') {
      document.body.classList.remove('theme-cyberpunk');
      document.body.classList.add('theme-minimal');
      if (themeLabel) themeLabel.textContent = '✦ TEMA: NEON MINIMAL';
      if (btnThemeToggle) {
        btnThemeToggle.querySelector('.btn-icon').textContent = '✦';
        btnThemeToggle.classList.add('btn-theme-active');
      }
    } else {
      document.body.classList.remove('theme-minimal');
      document.body.classList.add('theme-cyberpunk');
      if (themeLabel) themeLabel.textContent = '⚡ TEMA: CYBERPUNK';
      if (btnThemeToggle) {
        btnThemeToggle.querySelector('.btn-icon').textContent = '⚡';
        btnThemeToggle.classList.remove('btn-theme-active');
      }
    }

    if (playSound) {
      audio.playThemeSwitch();
    }
  }

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const nextTheme = currentTheme === 'cyberpunk' ? 'minimal' : 'cyberpunk';
      applyTheme(nextTheme, true);
    });
  }

  // Initial Theme Load
  applyTheme(currentTheme, false);

  // --------------------------------------------------------------------------
  // Data-Vault Export (JSON & Redis Backup)
  // --------------------------------------------------------------------------
  function exportVaultData() {
    const store = engine.store;
    if (store.size === 0) {
      audio.playError();
      alert('El Data-Vault está vacío. No hay claves que exportar.');
      return;
    }

    const exportObj = {
      system: 'REDIS_NEON_CORE',
      version: '2.0',
      exported_at: new Date().toISOString(),
      keys_count: store.size,
      keys: {}
    };

    for (let [k, item] of store.entries()) {
      exportObj.keys[k] = {
        type: item.type,
        ttl: item.ttl,
        value: item.value instanceof Set ? Array.from(item.value) : item.value
      };
    }

    const jsonStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redis-vault-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    audio.playSuccess();
    appendTerminalEntry('DUMP VAULT', {
      type: 'string',
      raw: `[OK] ${store.size} claves exportadas exitosamente a '${a.download}'.`
    });
  }

  if (btnExportVault) {
    btnExportVault.addEventListener('click', exportVaultData);
  }

  // Sound Toggle
  btnSoundToggle.addEventListener('click', () => {
    const isAudioOn = audio.toggle();
    soundLabel.textContent = isAudioOn ? 'AUDIO: ON' : 'AUDIO: MUTED';
    btnSoundToggle.querySelector('.btn-icon').textContent = isAudioOn ? '🔊' : '🔇';
  });

  // Seed Data Button
  btnSeedData.addEventListener('click', seedDemoData);

  // FlushAll Button
  btnFlushAll.addEventListener('click', () => {
    if (confirm('¿CONFIRMAS PURGA TOTAL DE LA MEMORIA (FLUSHALL)? Se destruirán todos los datos del Vault.')) {
      audio.playDelete();
      runTerminalCommand('FLUSHALL', true);
    }
  });

  // Quick Command Snippets Bar
  document.querySelectorAll('.quick-cmd').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) injectExample(cmd);
    });
  });

  // Vault Type Filters
  vaultFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      vaultFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter');
      audio.playKeypress();
      renderVaultMemory();
    });
  });

  // Vault Search Input
  vaultSearchInput.addEventListener('input', () => {
    renderVaultMemory();
  });

  // --------------------------------------------------------------------------
  // Cyber Command Directory: Filters & Live Search
  // --------------------------------------------------------------------------
  const dirSearchInput = document.getElementById('cmd-dir-search');
  const dirFilterChips = document.querySelectorAll('.dir-filter-chip');
  const cmdCards = document.querySelectorAll('.cmd-dir-card');
  const dirCounter = document.getElementById('cmd-dir-count');

  let activeDirCategory = 'all';

  function filterCommandDirectory() {
    const query = (dirSearchInput ? dirSearchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    cmdCards.forEach(card => {
      const cat = card.getAttribute('data-cat') || '';
      const text = (card.textContent || '').toLowerCase();
      const matchCat = (activeDirCategory === 'all' || cat === activeDirCategory);
      const matchQuery = (!query || text.includes(query));

      if (matchCat && matchQuery) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (dirCounter) {
      dirCounter.textContent = `${visibleCount} comandos`;
    }
  }

  if (dirSearchInput) {
    dirSearchInput.addEventListener('input', () => {
      filterCommandDirectory();
    });
  }

  dirFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dirFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeDirCategory = chip.getAttribute('data-cat') || 'all';
      audio.playKeypress();
      filterCommandDirectory();
    });
  });

  // Inject Command from Directory Buttons
  document.querySelectorAll('.btn-dir-inject').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        injectExample(cmd);
      }
    });
  });

  // Copy Code in Directory & Docker steps
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rawData = btn.getAttribute('data-copy') || '';
      const codeToCopy = rawData.includes('|||') ? rawData.split('|||').join('\r\n') : rawData;
      navigator.clipboard.writeText(codeToCopy).then(() => {
        audio.playSuccess();
        const origText = btn.innerHTML;
        btn.innerHTML = '&#10004; COPIADO!';
        btn.style.borderColor = 'var(--neon-green)';
        btn.style.color = 'var(--neon-green)';
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 1800);
      }).catch(() => {
        alert('Comando copiado manualmente:\n\n' + codeToCopy);
      });
    });
  });

  // --------------------------------------------------------------------------
  // Benchmark / Stress Test Engine
  // --------------------------------------------------------------------------
  function runBenchmark() {
    audio.playBenchmarkBurst();
    appendTerminalEntry('BENCHMARK --START', {
      type: 'system',
      raw: '>>> INICIANDO BENCHMARK CUÁNTICO // 100 OPERACIONES EN PIPELINE...'
    });

    const t0 = performance.now();
    const totalOps = 100;

    for (let i = 0; i < 20; i++) {
      engine.execute(`SET bench:key:${i} "PACKET_DATA_${i * 999}"`);
      engine.execute(`INCR bench:counter`);
      engine.execute(`LPUSH bench:stream "node_${i}"`);
      engine.execute(`SADD bench:cluster "addr_${i}"`);
      engine.execute(`ZADD bench:ranking ${i * 1250} "target_${i}"`);
    }

    const t1 = performance.now();
    const elapsedMs = Math.max(0.01, t1 - t0);
    const throughput = Math.round(totalOps / (elapsedMs / 1000));
    const avgLatency = (elapsedMs / totalOps).toFixed(3);

    updateHUDStats();
    renderVaultMemory(null, 'benchmark');

    const report = [
      `╔════════════════════════════════════════════════════════════╗`,
      `║            REDIS QUANTUM BENCHMARK REPORT                  ║`,
      `╠════════════════════════════════════════════════════════════╣`,
      `║  Total Operaciones:       ${totalOps} OPS en memoria              ║`,
      `║  Tiempo Transcurrido:     ${elapsedMs.toFixed(2)} ms                        ║`,
      `║  Rendimiento Estimado:    ${throughput.toLocaleString()} ops/sec               ║`,
      `║  Latencia Promedio:       ${avgLatency} ms/op                   ║`,
      `║  Operaciones Ejecutadas:  20x SET, 20x INCR, 20x LPUSH     ║`,
      `║                           20x SADD, 20x ZADD               ║`,
      `║  Estado del Motor:        ÓPTIMO // 0% PÉRDIDA DE PAQUETES ║`,
      `╚════════════════════════════════════════════════════════════╝`
    ].join('\n');

    appendTerminalEntry('BENCHMARK --REPORT', {
      type: 'string',
      raw: report
    });
  }

  if (btnBenchmark) {
    btnBenchmark.addEventListener('click', runBenchmark);
  }

  // --------------------------------------------------------------------------
  // Import Vault Data (File Picker & Drag & Drop)
  // --------------------------------------------------------------------------
  function processImportedJson(jsonText, filename = 'backup.json') {
    try {
      const data = JSON.parse(jsonText);
      if (!data.keys || typeof data.keys !== 'object') {
        throw new Error('Estructura inválida. Debe ser un JSON con la propiedad "keys".');
      }

      let count = 0;
      for (let k in data.keys) {
        const item = data.keys[k];
        let val = item.value;
        if (item.type === 'set' && Array.isArray(val)) {
          val = new Set(val);
        }
        engine.store.set(k, {
          type: item.type,
          value: val,
          ttl: item.ttl ?? null,
          createdAt: Date.now()
        });
        count++;
      }

      updateHUDStats();
      renderVaultMemory(null, 'import');
      audio.playSuccess();
      appendTerminalEntry('IMPORT VAULT', {
        type: 'string',
        raw: `[RESTORE OK] ${count} claves restauradas con éxito desde '${filename}'.`
      });
    } catch (err) {
      audio.playError();
      alert('Error al importar archivo JSON: ' + err.message);
    }
  }

  if (btnImportVault && fileImportVault) {
    btnImportVault.addEventListener('click', () => {
      fileImportVault.click();
    });

    fileImportVault.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        processImportedJson(event.target.result, file.name);
        fileImportVault.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Drag & drop support on vault container
  if (vaultCardsContainer) {
    ['dragenter', 'dragover'].forEach(eventName => {
      vaultCardsContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        vaultCardsContainer.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      vaultCardsContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        vaultCardsContainer.classList.remove('drag-over');
      });
    });

    vaultCardsContainer.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt && dt.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.json')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            processImportedJson(event.target.result, file.name);
          };
          reader.readAsText(file);
        } else {
          audio.playError();
          alert('Por favor, arrastra un archivo de volcado con extensión .json.');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // Fullscreen Mode Controller
  // --------------------------------------------------------------------------
  function toggleFullscreen() {
    audio.playKeypress();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      if (btnFullscreen) btnFullscreen.innerHTML = '<span class="btn-icon">🗗</span> SALIR FS';
    } else {
      document.exitFullscreen().catch(() => {});
      if (btnFullscreen) btnFullscreen.innerHTML = '<span class="btn-icon">⛶</span> FULLSCREEN';
    }
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && btnFullscreen) {
      btnFullscreen.innerHTML = '<span class="btn-icon">⛶</span> FULLSCREEN';
    }
  });

  // --------------------------------------------------------------------------
  // Cyber-Ops Missions Training System
  // --------------------------------------------------------------------------
  const MISSIONS = [
    {
      id: 1,
      cat: 'STRINGS',
      title: 'Misión 01: Infiltración Básica',
      desc: 'Desbloquea el acceso corporativo guardando la clave "puerta_01" con valor "desbloqueada".',
      cmd: 'SET puerta_01 "desbloqueada"',
      check: (store) => store.has('puerta_01') && String(store.get('puerta_01').value).includes('desbloqueada')
    },
    {
      id: 2,
      cat: 'STRINGS',
      title: 'Misión 02: Tarjeta Sin Colisión',
      desc: 'Registra la tarjeta de acceso con SETNX para evitar sobrescribir huellas de otros netrunners.',
      cmd: 'SETNX tarjeta_acceso "valida"',
      check: (store) => store.has('tarjeta_acceso') && store.get('tarjeta_acceso').value === 'valida'
    },
    {
      id: 3,
      cat: 'HASHES',
      title: 'Misión 03: Perfil Clandestino',
      desc: 'Crea el perfil de mercenario "operativo:v" con los campos "nombre" y "clase".',
      cmd: 'HSET operativo:v nombre "Vincent" clase "Solo" nivel 45',
      check: (store) => {
        const item = store.get('operativo:v');
        return item && item.type === 'hash' && 'nombre' in item.value && 'clase' in item.value;
      }
    },
    {
      id: 4,
      cat: 'LISTS',
      title: 'Misión 04: Registro Forense de Intrusión',
      desc: 'Apila al menos 2 eventos en la cola indexada "log_hackeos" usando LPUSH o RPUSH.',
      cmd: 'LPUSH log_hackeos "Servidor_Arasaka" "Camara_Callejon"',
      check: (store) => {
        const item = store.get('log_hackeos');
        return item && item.type === 'list' && item.value.length >= 2;
      }
    },
    {
      id: 5,
      cat: 'SETS',
      title: 'Misión 05: Red de Nodos Seguros',
      desc: 'Agrega al menos 2 nodos únicos sin duplicados al conjunto "red_fantasma" con SADD.',
      cmd: 'SADD red_fantasma "nodo_A" "nodo_B"',
      check: (store) => {
        const item = store.get('red_fantasma');
        return item && item.type === 'set' && item.value.size >= 2;
      }
    },
    {
      id: 6,
      cat: 'SORTED SETS',
      title: 'Misión 06: Leaderboard de Amenazas',
      desc: 'Registra un objetivo en el ranking "recompensas" con una puntuación igual o mayor a 50000 usando ZADD.',
      cmd: 'ZADD recompensas 50000 "Maelstrom_Lider"',
      check: (store) => {
        const item = store.get('recompensas');
        return item && item.type === 'zset' && item.value.some(x => x.score >= 50000);
      }
    }
  ];

  let completedMissionsHistory = new Set();
  try {
    const saved = localStorage.getItem('cyber_redis_missions');
    if (saved) {
      completedMissionsHistory = new Set(JSON.parse(saved));
    }
  } catch (e) {}

  function renderMissionsList() {
    if (!missionsGrid) return;
    missionsGrid.innerHTML = '';

    MISSIONS.forEach((m) => {
      const card = document.createElement('div');
      card.className = `mission-card ${m.isCompleted ? 'completed' : ''}`;

      card.innerHTML = `
        <div class="mission-card-top">
          <span class="mission-num">${m.cat} &bull; M0${m.id}</span>
          <span class="mission-status-badge ${m.isCompleted ? 'done' : 'pending'}">
            ${m.isCompleted ? '&#10004; COMPLETADA (+100 XP)' : '&#128274; PENDIENTE'}
          </span>
        </div>
        <h4 class="mission-title">${escapeHtml(m.title)}</h4>
        <p class="mission-desc">${escapeHtml(m.desc)}</p>
        <div class="mission-cmd-preview">
          <code>${escapeHtml(m.cmd)}</code>
          <button class="cyber-btn-mini btn-mission-inject" data-cmd="${escapeHtml(m.cmd)}">&#9654; Inyectar</button>
        </div>
      `;

      const injectBtn = card.querySelector('.btn-mission-inject');
      if (injectBtn) {
        injectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          injectExample(m.cmd);
          if (modalMissions) modalMissions.style.display = 'none';
        });
      }

      missionsGrid.appendChild(card);
    });
  }

  function checkMissions() {
    let completedCount = 0;
    const store = engine.store;

    MISSIONS.forEach((m) => {
      const isDone = m.check(store);
      if (isDone) {
        completedCount++;
        if (!completedMissionsHistory.has(m.id)) {
          completedMissionsHistory.add(m.id);
          try {
            localStorage.setItem('cyber_redis_missions', JSON.stringify(Array.from(completedMissionsHistory)));
          } catch (e) {}
          audio.playMissionComplete();
        }
      }
      m.isCompleted = isDone;
    });

    const xp = completedCount * 100;
    if (netrunnerXp) netrunnerXp.textContent = `${xp} / 600 XP (${completedCount}/6 Misiones)`;
    if (missionProgressLabel) missionProgressLabel.textContent = `${completedCount}/6`;
    if (missionProgressBar) missionProgressBar.style.width = `${(completedCount / 6) * 100}%`;

    if (netrunnerRank) {
      if (completedCount === 6) {
        netrunnerRank.textContent = '🏆 MAESTRO CUÁNTICO // 100% DESBLOQUEADO';
        netrunnerRank.className = 'text-neon-green';
      } else if (completedCount >= 4) {
        netrunnerRank.textContent = 'CYBER-DECKER // TIER 3';
        netrunnerRank.className = 'text-neon-cyan';
      } else if (completedCount >= 2) {
        netrunnerRank.textContent = 'OPERATIVO // TIER 2';
        netrunnerRank.className = 'text-neon-yellow';
      } else {
        netrunnerRank.textContent = 'NOVATO // TIER 1';
        netrunnerRank.className = 'text-neon-cyan';
      }
    }

    renderMissionsList();
  }

  function openMissionsModal() {
    if (modalMissions) {
      modalMissions.style.display = 'flex';
      checkMissions();
      audio.playKeypress();
    }
  }

  function closeMissionsModal() {
    if (modalMissions) {
      modalMissions.style.display = 'none';
      audio.playKeypress();
    }
  }

  if (btnMissionsToggle) btnMissionsToggle.addEventListener('click', openMissionsModal);
  if (btnCloseMissions) btnCloseMissions.addEventListener('click', closeMissionsModal);
  if (btnDoneMissions) btnDoneMissions.addEventListener('click', closeMissionsModal);
  if (modalMissionsBackdrop) modalMissionsBackdrop.addEventListener('click', closeMissionsModal);

  if (btnResetMissions) {
    btnResetMissions.addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar el progreso de todas las misiones tácticas?')) {
        completedMissionsHistory.clear();
        try {
          localStorage.removeItem('cyber_redis_missions');
        } catch (e) {}
        runTerminalCommand('FLUSHALL', true);
        checkMissions();
      }
    });
  }

  // --------------------------------------------------------------------------
  // SDK Multi-Language Switcher (Redis CLI / Python / Node.js)
  // --------------------------------------------------------------------------
  const SDK_TRANSLATIONS = {
    'SET': {
      redis: 'SET key value [EX seg]',
      python: 'r.set("puerta_01", "desbloqueada", ex=30)',
      node: 'await redis.set("puerta_01", "desbloqueada", "EX", 30);'
    },
    'GET': {
      redis: 'GET key',
      python: 'val = r.get("puerta_01")',
      node: 'const val = await redis.get("puerta_01");'
    },
    'SETNX': {
      redis: 'SETNX key value',
      python: 'r.setnx("tarjeta_acceso", "valida")',
      node: 'await redis.setnx("tarjeta_acceso", "valida");'
    },
    'INCR': {
      redis: 'INCR key',
      python: 'r.incr("cyber:credits")',
      node: 'await redis.incr("cyber:credits");'
    },
    'DECR': {
      redis: 'DECR key',
      python: 'r.decr("cyber:shield")',
      node: 'await redis.decr("cyber:shield");'
    },
    'APPEND': {
      redis: 'APPEND key value',
      python: 'r.append("puerta_01", "_override")',
      node: 'await redis.append("puerta_01", "_override");'
    },
    'STRLEN': {
      redis: 'STRLEN key',
      python: 'length = r.strlen("puerta_01")',
      node: 'const length = await redis.strlen("puerta_01");'
    },
    'HSET': {
      redis: 'HSET key field value [f2 v2 ...]',
      python: 'r.hset("operativo:v", mapping={"nombre": "Vincent", "clase": "Solo"})',
      node: 'await redis.hset("operativo:v", "nombre", "Vincent", "clase", "Solo");'
    },
    'HGET': {
      redis: 'HGET key field',
      python: 'clase = r.hget("operativo:v", "clase")',
      node: 'const clase = await redis.hget("operativo:v", "clase");'
    },
    'HGETALL': {
      redis: 'HGETALL key',
      python: 'profile = r.hgetall("operativo:v")',
      node: 'const profile = await redis.hgetall("operativo:v");'
    },
    'HDEL': {
      redis: 'HDEL key field [field2 ...]',
      python: 'r.hdel("operativo:v", "implante_ilegal")',
      node: 'await redis.hdel("operativo:v", "implante_ilegal");'
    },
    'HEXISTS': {
      redis: 'HEXISTS key field',
      python: 'has_field = r.hexists("operativo:v", "implante_ilegal")',
      node: 'const hasField = await redis.hexists("operativo:v", "implante_ilegal");'
    },
    'HKEYS': {
      redis: 'HKEYS key',
      python: 'fields = r.hkeys("operativo:v")',
      node: 'const fields = await redis.hkeys("operativo:v");'
    },
    'HVALS': {
      redis: 'HVALS key',
      python: 'values = r.hvals("operativo:v")',
      node: 'const values = await redis.hvals("operativo:v");'
    },
    'LPUSH': {
      redis: 'LPUSH key element [elem2 ...]',
      python: 'r.lpush("log_hackeos", "Servidor_Arasaka", "Camara_Callejon")',
      node: 'await redis.lpush("log_hackeos", "Servidor_Arasaka", "Camara_Callejon");'
    },
    'RPUSH': {
      redis: 'RPUSH key element [elem2 ...]',
      python: 'r.rpush("log_hackeos", "Camara_Callejon")',
      node: 'await redis.rpush("log_hackeos", "Camara_Callejon");'
    },
    'LPOP': {
      redis: 'LPOP key',
      python: 'item = r.lpop("log_hackeos")',
      node: 'const item = await redis.lpop("log_hackeos");'
    },
    'RPOP': {
      redis: 'RPOP key',
      python: 'item = r.rpop("log_hackeos")',
      node: 'const item = await redis.rpop("log_hackeos");'
    },
    'LRANGE': {
      redis: 'LRANGE key start stop',
      python: 'logs = r.lrange("log_hackeos", 0, -1)',
      node: 'const logs = await redis.lrange("log_hackeos", 0, -1);'
    },
    'LLEN': {
      redis: 'LLEN key',
      python: 'total = r.llen("log_hackeos")',
      node: 'const total = await redis.llen("log_hackeos");'
    },
    'SADD': {
      redis: 'SADD key member [mem2 ...]',
      python: 'r.sadd("red_fantasma", "nodo_A", "nodo_B")',
      node: 'await redis.sadd("red_fantasma", "nodo_A", "nodo_B");'
    },
    'SMEMBERS': {
      redis: 'SMEMBERS key',
      python: 'nodes = r.smembers("red_fantasma")',
      node: 'const nodes = await redis.smembers("red_fantasma");'
    },
    'SREM': {
      redis: 'SREM key member [mem2 ...]',
      python: 'r.srem("red_fantasma", "nodo_A")',
      node: 'await redis.srem("red_fantasma", "nodo_A");'
    },
    'SINTER': {
      redis: 'SINTER key1 [key2 ...]',
      python: 'crosspoints = r.sinter("red_fantasma", "red_corporativa")',
      node: 'const cross = await redis.sinter("red_fantasma", "red_corporativa");'
    },
    'SUNION': {
      redis: 'SUNION key1 [key2 ...]',
      python: 'all_nodes = r.sunion("red_fantasma", "red_corporativa")',
      node: 'const allNodes = await redis.sunion("red_fantasma", "red_corporativa");'
    },
    'SDIFF': {
      redis: 'SDIFF key1 [key2 ...]',
      python: 'safe_nodes = r.sdiff("red_fantasma", "red_corporativa")',
      node: 'const safeNodes = await redis.sdiff("red_fantasma", "red_corporativa");'
    },
    'ZADD': {
      redis: 'ZADD key score member',
      python: 'r.zadd("recompensas", {"Maelstrom_Lider": 50000})',
      node: 'await redis.zadd("recompensas", 50000, "Maelstrom_Lider");'
    },
    'ZRANGE': {
      redis: 'ZRANGE key start stop [WITHSCORES]',
      python: 'ranks = r.zrange("recompensas", 0, -1, withscores=True)',
      node: 'const ranks = await redis.zrange("recompensas", 0, -1, "WITHSCORES");'
    },
    'ZREVRANGE': {
      redis: 'ZREVRANGE key start stop [WITHSCORES]',
      python: 'top = r.zrevrange("recompensas", 0, 2, withscores=True)',
      node: 'const top = await redis.zrevrange("recompensas", 0, 2, "WITHSCORES");'
    },
    'ZSCORE': {
      redis: 'ZSCORE key member',
      python: 'score = r.zscore("recompensas", "Maelstrom_Lider")',
      node: 'const score = await redis.zscore("recompensas", "Maelstrom_Lider");'
    },
    'ZRANK': {
      redis: 'ZRANK key member',
      python: 'pos = r.zrank("recompensas", "Maelstrom_Lider")',
      node: 'const pos = await redis.zrank("recompensas", "Maelstrom_Lider");'
    },
    'DEL': {
      redis: 'DEL key [key2 ...]',
      python: 'r.delete("puerta_01")',
      node: 'await redis.del("puerta_01");'
    },
    'EXISTS': {
      redis: 'EXISTS key',
      python: 'exists = r.exists("puerta_01")',
      node: 'const exists = await redis.exists("puerta_01");'
    },
    'EXPIRE': {
      redis: 'EXPIRE key seconds',
      python: 'r.expire("sesion_hack", 30)',
      node: 'await redis.expire("sesion_hack", 30);'
    },
    'TTL': {
      redis: 'TTL key',
      python: 'seconds = r.ttl("sesion_hack")',
      node: 'const seconds = await redis.ttl("sesion_hack");'
    },
    'KEYS': {
      redis: 'KEYS *',
      python: 'keys = r.keys("*")',
      node: 'const keys = await redis.keys("*");'
    },
    'FLUSHALL': {
      redis: 'FLUSHALL',
      python: 'r.flushall()',
      node: 'await redis.flushall();'
    }
  };

  const sdkTabs = document.querySelectorAll('.sdk-tab');

  function applySdkLanguage(lang) {
    sdkTabs.forEach(t => {
      if (t.dataset.lang === lang) t.classList.add('active');
      else t.classList.remove('active');
    });

    cmdCards.forEach(card => {
      const cmdNameEl = card.querySelector('.cmd-card-name');
      const syntaxEl = card.querySelector('.cmd-card-syntax');
      const copyBtn = card.querySelector('.btn-copy-code');
      if (!cmdNameEl || !syntaxEl) return;

      const cmdName = cmdNameEl.textContent.trim().toUpperCase();
      const translation = SDK_TRANSLATIONS[cmdName];
      if (translation && translation[lang]) {
        syntaxEl.textContent = translation[lang];
        if (copyBtn) {
          copyBtn.setAttribute('data-copy', translation[lang]);
        }
      }
    });
  }

  sdkTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const lang = tab.dataset.lang || 'redis';
      audio.playKeypress();
      applySdkLanguage(lang);
    });
  });

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------
  updateHUDStats();
  // Auto-seed initially for stunning first-load visual presentation
  seedDemoData();
  checkMissions();

})();
