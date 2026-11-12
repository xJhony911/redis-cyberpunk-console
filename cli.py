#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
REDIS // NEON-CORE [TERMINAL CONSOLE & EXCEL ENGINE]
Standalone Cyberpunk Redis Terminal Simulator for Windows / CLI
Author: Jonathan Acosta (@xJhony911)
"""

import os
import sys
import time
import json
import math
import shlex
import subprocess
from datetime import datetime

# Windows ANSI Enable
if os.name == 'nt':
    os.system('')

# ==============================================================================
# COLOR PALETTES (CYBERPUNK VS NEON MINIMAL)
# ==============================================================================
class Theme:
    CYBERPUNK = {
        'name': 'CYBERPUNK HUD',
        'cyan': '\033[96m',
        'green': '\033[92m',
        'yellow': '\033[93m',
        'pink': '\033[95m',
        'purple': '\033[35m',
        'red': '\033[91m',
        'dim': '\033[90m',
        'bold': '\033[1m',
        'underline': '\033[4m',
        'reset': '\033[0m',
        'box': 'cyan'
    }
    MINIMAL = {
        'name': 'NEON DARK MINIMAL',
        'cyan': '\033[36m',
        'green': '\033[32m',
        'yellow': '\033[33m',
        'pink': '\033[35m',
        'purple': '\033[34m',
        'red': '\033[31m',
        'dim': '\033[90m',
        'bold': '\033[1m',
        'underline': '\033[4m',
        'reset': '\033[0m',
        'box': 'dim'
    }

current_theme = Theme.CYBERPUNK

def c(color_key, text):
    return f"{current_theme.get(color_key, '')}{text}{current_theme['reset']}"

# Sound helper (terminal beep or windows winsound)
def beep(freq=880, duration=40):
    try:
        if os.name == 'nt':
            import winsound
            winsound.Beep(int(freq), int(duration))
        else:
            sys.stdout.write('\a')
            sys.stdout.flush()
    except Exception:
        pass

# ==============================================================================
# IN-MEMORY REDIS ENGINE (PURE PYTHON, 0 DEPENDENCIES)
# ==============================================================================
class RedisEntry:
    def __init__(self, key_type, value, ttl=None):
        self.type = key_type
        self.value = value
        self.ttl = ttl
        self.created_at = time.time()

    def is_expired(self):
        if self.ttl is None:
            return False
        return (time.time() - self.created_at) >= self.ttl

    def remaining_ttl(self):
        if self.ttl is None:
            return -1
        rem = int(self.ttl - (time.time() - self.created_at))
        return max(0, rem)

class RedisCore:
    def __init__(self):
        self.store = {}
        self.total_ops = 0

    def purge_expired(self):
        expired = [k for k, v in self.store.items() if v.is_expired()]
        for k in expired:
            del self.store[k]
        return len(expired)

    def execute(self, cmd_line):
        self.purge_expired()
        self.total_ops += 1

        try:
            tokens = shlex.split(cmd_line.strip())
        except Exception:
            tokens = cmd_line.strip().split()

        if not tokens:
            return None

        cmd = tokens[0].upper()
        args = tokens[1:]

        # ---------------- STRINGS ----------------
        if cmd == 'SET':
            if len(args) < 2:
                return ('ERR', "wrong number of arguments for 'set' command")
            key, val = args[0], args[1]
            ttl = None
            nx = False

            i = 2
            while i < len(args):
                opt = args[i].upper()
                if opt == 'EX' and i + 1 < len(args):
                    try:
                        ttl = int(args[i+1])
                    except ValueError:
                        return ('ERR', "value is not an integer or out of range")
                    i += 2
                elif opt == 'NX':
                    nx = True
                    i += 1
                else:
                    i += 1

            if nx and key in self.store:
                return ('NIL', None)

            self.store[key] = RedisEntry('string', val, ttl)
            return ('STATUS', "OK")

        elif cmd == 'GET':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'get' command")
            entry = self.store.get(args[0])
            if not entry or entry.type != 'string':
                return ('NIL', None)
            return ('STRING', str(entry.value))

        elif cmd == 'SETNX':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'setnx' command")
            key, val = args[0], args[1]
            if key in self.store:
                return ('INTEGER', 0)
            self.store[key] = RedisEntry('string', val)
            return ('INTEGER', 1)

        elif cmd == 'APPEND':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'append' command")
            key, val = args[0], args[1]
            if key not in self.store:
                self.store[key] = RedisEntry('string', val)
                return ('INTEGER', len(val))
            entry = self.store[key]
            if entry.type != 'string':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            entry.value = str(entry.value) + str(val)
            return ('INTEGER', len(entry.value))

        elif cmd == 'STRLEN':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'strlen' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('INTEGER', 0)
            if entry.type != 'string':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            return ('INTEGER', len(str(entry.value)))

        elif cmd in ('INCR', 'DECR'):
            if len(args) != 1:
                return ('ERR', f"wrong number of arguments for '{cmd.lower()}' command")
            key = args[0]
            step = 1 if cmd == 'INCR' else -1
            entry = self.store.get(key)
            if not entry:
                self.store[key] = RedisEntry('string', str(step))
                return ('INTEGER', step)
            if entry.type != 'string':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            try:
                curr = int(entry.value)
                curr += step
                entry.value = str(curr)
                return ('INTEGER', curr)
            except ValueError:
                return ('ERR', "value is not an integer or out of range")

        elif cmd == 'INCRBY':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'incrby' command")
            key = args[0]
            try:
                amt = int(args[1])
            except ValueError:
                return ('ERR', "value is not an integer or out of range")
            entry = self.store.get(key)
            if not entry:
                self.store[key] = RedisEntry('string', str(amt))
                return ('INTEGER', amt)
            if entry.type != 'string':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            try:
                curr = int(entry.value) + amt
                entry.value = str(curr)
                return ('INTEGER', curr)
            except ValueError:
                return ('ERR', "value is not an integer or out of range")

        # ---------------- HASHES ----------------
        elif cmd == 'HSET':
            if len(args) < 3 or (len(args) - 1) % 2 != 0:
                return ('ERR', "wrong number of arguments for 'hset' command")
            key = args[0]
            entry = self.store.get(key)
            if entry and entry.type != 'hash':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            if not entry:
                entry = RedisEntry('hash', {})
                self.store[key] = entry
            added = 0
            for i in range(1, len(args), 2):
                f, v = args[i], args[i+1]
                if f not in entry.value:
                    added += 1
                entry.value[f] = v
            return ('INTEGER', added)

        elif cmd == 'HGET':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'hget' command")
            key, f = args[0], args[1]
            entry = self.store.get(key)
            if not entry or entry.type != 'hash' or f not in entry.value:
                return ('NIL', None)
            return ('STRING', str(entry.value[f]))

        elif cmd == 'HGETALL':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'hgetall' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('ARRAY', [])
            if entry.type != 'hash':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            res = []
            for f, v in entry.value.items():
                res.extend([f, str(v)])
            return ('ARRAY', res)

        elif cmd == 'HDEL':
            if len(args) < 2:
                return ('ERR', "wrong number of arguments for 'hdel' command")
            key = args[0]
            entry = self.store.get(key)
            if not entry:
                return ('INTEGER', 0)
            if entry.type != 'hash':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            deleted = 0
            for f in args[1:]:
                if f in entry.value:
                    del entry.value[f]
                    deleted += 1
            return ('INTEGER', deleted)

        elif cmd == 'HEXISTS':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'hexists' command")
            entry = self.store.get(args[0])
            if not entry or entry.type != 'hash':
                return ('INTEGER', 0)
            return ('INTEGER', 1 if args[1] in entry.value else 0)

        elif cmd == 'HKEYS':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'hkeys' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('ARRAY', [])
            if entry.type != 'hash':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            return ('ARRAY', list(entry.value.keys()))

        elif cmd == 'HVALS':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'hvals' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('ARRAY', [])
            if entry.type != 'hash':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            return ('ARRAY', [str(v) for v in entry.value.values()])

        elif cmd == 'HLEN':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'hlen' command")
            entry = self.store.get(args[0])
            if not entry or entry.type != 'hash':
                return ('INTEGER', 0)
            return ('INTEGER', len(entry.value))

        # ---------------- LISTS ----------------
        elif cmd in ('LPUSH', 'RPUSH'):
            if len(args) < 2:
                return ('ERR', f"wrong number of arguments for '{cmd.lower()}' command")
            key = args[0]
            entry = self.store.get(key)
            if entry and entry.type != 'list':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            if not entry:
                entry = RedisEntry('list', [])
                self.store[key] = entry
            elems = args[1:]
            if cmd == 'LPUSH':
                for elem in elems:
                    entry.value.insert(0, elem)
            else:
                for elem in elems:
                    entry.value.append(elem)
            return ('INTEGER', len(entry.value))

        elif cmd in ('LPOP', 'RPOP'):
            if len(args) != 1:
                return ('ERR', f"wrong number of arguments for '{cmd.lower()}' command")
            key = args[0]
            entry = self.store.get(key)
            if not entry or entry.type != 'list' or not entry.value:
                return ('NIL', None)
            val = entry.value.pop(0) if cmd == 'LPOP' else entry.value.pop()
            return ('STRING', str(val))

        elif cmd == 'LRANGE':
            if len(args) != 3:
                return ('ERR', "wrong number of arguments for 'lrange' command")
            key = args[0]
            try:
                start, stop = int(args[1]), int(args[2])
            except ValueError:
                return ('ERR', "value is not an integer or out of range")
            entry = self.store.get(key)
            if not entry:
                return ('ARRAY', [])
            if entry.type != 'list':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            lst = entry.value
            length = len(lst)
            if start < 0:
                start = max(0, length + start)
            if stop < 0:
                stop = length + stop
            return ('ARRAY', [str(x) for x in lst[start:stop+1]])

        elif cmd == 'LLEN':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'llen' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('INTEGER', 0)
            if entry.type != 'list':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            return ('INTEGER', len(entry.value))

        # ---------------- SETS ----------------
        elif cmd == 'SADD':
            if len(args) < 2:
                return ('ERR', "wrong number of arguments for 'sadd' command")
            key = args[0]
            entry = self.store.get(key)
            if entry and entry.type != 'set':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            if not entry:
                entry = RedisEntry('set', set())
                self.store[key] = entry
            added = 0
            for mem in args[1:]:
                if mem not in entry.value:
                    entry.value.add(mem)
                    added += 1
            return ('INTEGER', added)

        elif cmd == 'SMEMBERS':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'smembers' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('ARRAY', [])
            if entry.type != 'set':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            return ('ARRAY', list(entry.value))

        elif cmd == 'SREM':
            if len(args) < 2:
                return ('ERR', "wrong number of arguments for 'srem' command")
            key = args[0]
            entry = self.store.get(key)
            if not entry or entry.type != 'set':
                return ('INTEGER', 0)
            removed = 0
            for m in args[1:]:
                if m in entry.value:
                    entry.value.remove(m)
                    removed += 1
            return ('INTEGER', removed)

        elif cmd == 'SCARD':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'scard' command")
            entry = self.store.get(args[0])
            if not entry or entry.type != 'set':
                return ('INTEGER', 0)
            return ('INTEGER', len(entry.value))

        elif cmd == 'SISMEMBER':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'sismember' command")
            entry = self.store.get(args[0])
            if not entry or entry.type != 'set':
                return ('INTEGER', 0)
            return ('INTEGER', 1 if args[1] in entry.value else 0)

        elif cmd in ('SUNION', 'SINTER', 'SDIFF'):
            if len(args) < 1:
                return ('ERR', f"wrong number of arguments for '{cmd.lower()}' command")
            sets = []
            for k in args:
                e = self.store.get(k)
                if e and e.type == 'set':
                    sets.append(set(e.value))
                else:
                    sets.append(set())
            if cmd == 'SUNION':
                result = set.union(*sets) if sets else set()
            elif cmd == 'SINTER':
                result = set.intersection(*sets) if sets else set()
            else:
                result = sets[0].difference(*sets[1:]) if sets else set()
            return ('ARRAY', list(result))

        # ---------------- SORTED SETS ----------------
        elif cmd == 'ZADD':
            if len(args) < 3 or (len(args) - 1) % 2 != 0:
                return ('ERR', "wrong number of arguments for 'zadd' command")
            key = args[0]
            entry = self.store.get(key)
            if entry and entry.type != 'zset':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")
            if not entry:
                entry = RedisEntry('zset', {})
                self.store[key] = entry
            added = 0
            for i in range(1, len(args), 2):
                try:
                    score = float(args[i])
                except ValueError:
                    return ('ERR', "value is not a valid float")
                mem = args[i+1]
                if mem not in entry.value:
                    added += 1
                entry.value[mem] = score
            return ('INTEGER', added)

        elif cmd in ('ZRANGE', 'ZREVRANGE'):
            if len(args) < 3:
                return ('ERR', f"wrong number of arguments for '{cmd.lower()}' command")
            key = args[0]
            try:
                start, stop = int(args[1]), int(args[2])
            except ValueError:
                return ('ERR', "value is not an integer or out of range")
            withscores = any(a.upper() == 'WITHSCORES' for a in args[3:])
            entry = self.store.get(key)
            if not entry:
                return ('ARRAY', [])
            if entry.type != 'zset':
                return ('ERR', "WRONGTYPE Operation against a key holding the wrong kind of value")

            # Sort items by score
            reverse = (cmd == 'ZREVRANGE')
            sorted_items = sorted(entry.value.items(), key=lambda x: (x[1], x[0]), reverse=reverse)
            length = len(sorted_items)
            if start < 0:
                start = max(0, length + start)
            if stop < 0:
                stop = length + stop
            sliced = sorted_items[start:stop+1]
            res = []
            for mem, score in sliced:
                res.append(mem)
                if withscores:
                    res.append(str(int(score) if score.is_integer() else score))
            return ('ARRAY', res)

        elif cmd == 'ZSCORE':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'zscore' command")
            entry = self.store.get(args[0])
            if not entry or entry.type != 'zset' or args[1] not in entry.value:
                return ('NIL', None)
            score = entry.value[args[1]]
            return ('STRING', str(int(score) if score.is_integer() else score))

        elif cmd == 'ZCARD':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'zcard' command")
            entry = self.store.get(args[0])
            if not entry or entry.type != 'zset':
                return ('INTEGER', 0)
            return ('INTEGER', len(entry.value))

        # ---------------- SYSTEM & KEYS ----------------
        elif cmd == 'KEYS':
            pattern = args[0] if args else '*'
            return ('ARRAY', list(self.store.keys()))

        elif cmd == 'EXISTS':
            if not args:
                return ('ERR', "wrong number of arguments for 'exists' command")
            count = sum(1 for k in args if k in self.store)
            return ('INTEGER', count)

        elif cmd == 'TYPE':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'type' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('STATUS', "none")
            return ('STATUS', entry.type)

        elif cmd == 'DEL':
            if not args:
                return ('ERR', "wrong number of arguments for 'del' command")
            deleted = 0
            for k in args:
                if k in self.store:
                    del self.store[k]
                    deleted += 1
            return ('INTEGER', deleted)

        elif cmd == 'EXPIRE':
            if len(args) != 2:
                return ('ERR', "wrong number of arguments for 'expire' command")
            try:
                ttl = int(args[1])
            except ValueError:
                return ('ERR', "value is not an integer or out of range")
            entry = self.store.get(args[0])
            if not entry:
                return ('INTEGER', 0)
            entry.ttl = ttl
            entry.created_at = time.time()
            return ('INTEGER', 1)

        elif cmd == 'TTL':
            if len(args) != 1:
                return ('ERR', "wrong number of arguments for 'ttl' command")
            entry = self.store.get(args[0])
            if not entry:
                return ('INTEGER', -2)
            return ('INTEGER', entry.remaining_ttl())

        elif cmd in ('FLUSHALL', 'FLUSHDB'):
            self.store.clear()
            return ('STATUS', "OK")

        elif cmd == 'PING':
            msg = args[0] if args else "PONG"
            return ('STRING', msg)

        elif cmd == 'INFO':
            mem_kb = sum(len(str(k)) + len(str(v.value)) for k, v in self.store.items()) / 1024.0
            info_str = f"# Cyber-Core Memory\r\ntotal_keys:{len(self.store)}\r\nused_memory_human:{mem_kb:.2f}K\r\ntotal_commands_processed:{self.total_ops}\r\nconnected_clients:1\r\nengine:Python Cyber-Shell 2.0"
            return ('STRING', info_str)

        return ('ERR', f"unknown command '{cmd.lower()}'")

# ==============================================================================
# EXCEL GENERATOR (SPREADSHEET XML 2003 & CSV COMPATIBLE)
# Zero external packages required! Opens natively in Microsoft Excel with formatting!
# ==============================================================================
def export_to_excel(core, base_filename="redis_datavault"):
    xls_path = os.path.abspath(f"{base_filename}.xls")
    csv_path = os.path.abspath(f"{base_filename}.csv")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Group keys by type
    data_by_type = {
        'string': [],
        'hash': [],
        'list': [],
        'set': [],
        'zset': []
    }
    for k, entry in core.store.items():
        data_by_type[entry.type].append((k, entry))

    # 1. XML Spreadsheet 2003 (True multi-sheet styled workbook for Microsoft Excel)
    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>REDIS DATA-VAULT DUMP</Title>
  <Author>Redis Cyberpunk Console</Author>
  <Created>{timestamp}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:FontName="Courier New" ss:Size="11"/>
   <Interior ss:Color="#03070d" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#00f3ff"/>
   </Borders>
  </Style>
  <Style ss:ID="Title">
   <Font ss:Bold="1" ss:Color="#00f3ff" ss:FontName="Courier New" ss:Size="14"/>
   <Interior ss:Color="#060b13" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Cell">
   <Font ss:FontName="Courier New" ss:Size="10" ss:Color="#111827"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellType">
   <Font ss:Bold="1" ss:FontName="Courier New" ss:Size="10" ss:Color="#0284c7"/>
   <Interior ss:Color="#F0F9FF" ss:Pattern="Solid"/>
  </Style>
 </Styles>
"""

    # Sheet 1: RESUMEN
    xml_content += f"""
 <Worksheet ss:Name="RESUMEN_METRICAS">
  <Table>
   <Column ss:Width="180"/>
   <Column ss:Width="250"/>
   <Row ss:StyleID="Title"><Cell><Data ss:Type="String">REDIS // NEON-CORE DATA-VAULT DUMP</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Fecha de Exportación</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="String">{timestamp}</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Total de Claves</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="Number">{len(core.store)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Total Strings</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="Number">{len(data_by_type['string'])}</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Total Hashes</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="Number">{len(data_by_type['hash'])}</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Total Listas</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="Number">{len(data_by_type['list'])}</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Total Sets</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="Number">{len(data_by_type['set'])}</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Total Sorted Sets</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="Number">{len(data_by_type['zset'])}</Data></Cell></Row>
   <Row><Cell ss:StyleID="Cell"><Data ss:Type="String">Total Operaciones Ejecutadas</Data></Cell><Cell ss:StyleID="Cell"><Data ss:Type="Number">{core.total_ops}</Data></Cell></Row>
  </Table>
 </Worksheet>
"""

    # Sheet 2: STRINGS
    xml_content += """
 <Worksheet ss:Name="STRINGS">
  <Table>
   <Column ss:Width="180"/><Column ss:Width="300"/><Column ss:Width="80"/><Column ss:Width="80"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">CLAVE (KEY)</Data></Cell>
    <Cell><Data ss:Type="String">VALOR (STRING)</Data></Cell>
    <Cell><Data ss:Type="String">LONGITUD</Data></Cell>
    <Cell><Data ss:Type="String">TTL (SEG)</Data></Cell>
   </Row>
"""
    for k, entry in data_by_type['string']:
        val_str = str(entry.value).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        k_str = str(k).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        ttl_val = entry.remaining_ttl()
        xml_content += f"""   <Row>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{k_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{val_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{len(str(entry.value))}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{ttl_val}</Data></Cell>
   </Row>\n"""
    xml_content += """  </Table>\n </Worksheet>\n"""

    # Sheet 3: HASHES
    xml_content += """
 <Worksheet ss:Name="HASHES">
  <Table>
   <Column ss:Width="160"/><Column ss:Width="160"/><Column ss:Width="280"/><Column ss:Width="80"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">CLAVE HASH</Data></Cell>
    <Cell><Data ss:Type="String">CAMPO (FIELD)</Data></Cell>
    <Cell><Data ss:Type="String">VALOR</Data></Cell>
    <Cell><Data ss:Type="String">TTL (SEG)</Data></Cell>
   </Row>
"""
    for k, entry in data_by_type['hash']:
        for f, val in entry.value.items():
            k_str = str(k).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            f_str = str(f).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            val_str = str(val).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            xml_content += f"""   <Row>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{k_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{f_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{val_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{entry.remaining_ttl()}</Data></Cell>
   </Row>\n"""
    xml_content += """  </Table>\n </Worksheet>\n"""

    # Sheet 4: LISTAS
    xml_content += """
 <Worksheet ss:Name="LISTAS">
  <Table>
   <Column ss:Width="160"/><Column ss:Width="60"/><Column ss:Width="300"/><Column ss:Width="80"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">CLAVE LISTA</Data></Cell>
    <Cell><Data ss:Type="String">ÍNDICE</Data></Cell>
    <Cell><Data ss:Type="String">ELEMENTO</Data></Cell>
    <Cell><Data ss:Type="String">TTL (SEG)</Data></Cell>
   </Row>
"""
    for k, entry in data_by_type['list']:
        for idx, elem in enumerate(entry.value):
            k_str = str(k).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            e_str = str(elem).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            xml_content += f"""   <Row>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{k_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{idx}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{e_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{entry.remaining_ttl()}</Data></Cell>
   </Row>\n"""
    xml_content += """  </Table>\n </Worksheet>\n"""

    # Sheet 5: SETS
    xml_content += """
 <Worksheet ss:Name="SETS">
  <Table>
   <Column ss:Width="180"/><Column ss:Width="280"/><Column ss:Width="80"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">CLAVE SET</Data></Cell>
    <Cell><Data ss:Type="String">MIEMBRO ÚNICO</Data></Cell>
    <Cell><Data ss:Type="String">TTL (SEG)</Data></Cell>
   </Row>
"""
    for k, entry in data_by_type['set']:
        for mem in entry.value:
            k_str = str(k).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            m_str = str(mem).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            xml_content += f"""   <Row>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{k_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{m_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{entry.remaining_ttl()}</Data></Cell>
   </Row>\n"""
    xml_content += """  </Table>\n </Worksheet>\n"""

    # Sheet 6: SORTED SETS
    xml_content += """
 <Worksheet ss:Name="SORTED_SETS">
  <Table>
   <Column ss:Width="160"/><Column ss:Width="100"/><Column ss:Width="240"/><Column ss:Width="60"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">CLAVE ZSET</Data></Cell>
    <Cell><Data ss:Type="String">PUNTUACIÓN (SCORE)</Data></Cell>
    <Cell><Data ss:Type="String">MIEMBRO</Data></Cell>
    <Cell><Data ss:Type="String">TTL</Data></Cell>
   </Row>
"""
    for k, entry in data_by_type['zset']:
        sorted_items = sorted(entry.value.items(), key=lambda x: x[1])
        for mem, score in sorted_items:
            k_str = str(k).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            m_str = str(mem).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            xml_content += f"""   <Row>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{k_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{score}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">{m_str}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">{entry.remaining_ttl()}</Data></Cell>
   </Row>\n"""
    xml_content += """  </Table>\n </Worksheet>\n</Workbook>"""

    with open(xls_path, 'w', encoding='utf-8') as f:
        f.write(xml_content)

    # 2. Also write standard CSV for universal compatibility
    with open(csv_path, 'w', encoding='utf-8-sig') as f:
        f.write("KEY,TYPE,FIELD_OR_INDEX,VALUE_OR_SCORE,TTL\n")
        for k, entry in core.store.items():
            ttl = entry.remaining_ttl()
            if entry.type == 'string':
                f.write(f'"{k}","string","","{entry.value}",{ttl}\n')
            elif entry.type == 'hash':
                for field, val in entry.value.items():
                    f.write(f'"{k}","hash","{field}","{val}",{ttl}\n')
            elif entry.type == 'list':
                for idx, elem in enumerate(entry.value):
                    f.write(f'"{k}","list","{idx}","{elem}",{ttl}\n')
            elif entry.type == 'set':
                for mem in entry.value:
                    f.write(f'"{k}","set","","{mem}",{ttl}\n')
            elif entry.type == 'zset':
                for mem, score in entry.value.items():
                    f.write(f'"{k}","zset","{score}","{mem}",{ttl}\n')

    return xls_path, csv_path

# ==============================================================================
# TERMINAL UI DISPLAY & HUD HELPERS
# ==============================================================================
BANNER = r"""
 ██████╗ ███████╗██████╗ ██╗███████╗   // CYBER-CORE v2.0 TERMINAL ENGINE
 ██╔══██╗██╔════╝██╔══██╗██║██╔════╝   // STANDALONE CLI & EXCEL INTEGRATED
 ██████╔╝█████╗  ██║  ██║██║███████╗   // PORT: 6379 [OPEN IN-MEMORY]
 ██╔══██╗██╔══╝  ██║  ██║██║╚════██║   // TYPE: 'HELP', 'VAULT', 'EXCEL'
 ██║  ██║███████╗██████╔╝██║███████║   ====================================
 ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝╚══════╝   MODO STANDALONE DIRECTO (WINDOWS EXE)
"""

def print_banner():
    print(c('cyan', BANNER))
    print(f" {c('green', '● Conexión neuronal establecida')} {c('dim', 'con el motor in-memory de Redis.')}")
    print(f" {c('dim', 'Comandos especiales:')} {c('yellow', 'VAULT')} (ver memoria), {c('green', 'EXCEL')} (generar y abrir Excel), {c('cyan', 'BENCHMARK')}, {c('pink', 'MISSIONS')}, {c('dim', 'THEME')}, {c('red', 'QUIT')}\n")

def display_vault(core):
    core.purge_expired()
    print(f"\n{c('cyan', '╔══════════════════════════════════════════════════════════════════════════╗')}")
    print(f"{c('cyan', '║')} {c('bold', 'DATA-VAULT MEMORY // VISUALIZADOR HOLOGRÁFICO EN TIEMPO REAL')}          {c('cyan', '║')}")
    print(f"{c('cyan', '╚══════════════════════════════════════════════════════════════════════════╝')}")

    if not core.store:
        print(f" {c('dim', '[!] Data-Vault vacío. Usa')} {c('yellow', 'SEED')} {c('dim', 'para cargar datos cyberpunk o escribe')} {c('green', 'SET clave valor')}\n")
        return

    for key, entry in core.store.items():
        type_badge = c('cyan', f"[{entry.type.upper()}]")
        if entry.type == 'hash':
            type_badge = c('purple', "[HASH]")
        elif entry.type == 'list':
            type_badge = c('green', "[LIST]")
        elif entry.type == 'set':
            type_badge = c('pink', "[SET]")
        elif entry.type == 'zset':
            type_badge = c('yellow', "[ZSET]")

        ttl_str = f"TTL: {entry.remaining_ttl()}s" if entry.ttl is not None else "TTL: persistente"
        print(f" ┌─ {type_badge} {c('bold', key)} {c('dim', f'({ttl_str})')}")

        if entry.type == 'string':
            print(f" │  └─ Valor: \"{c('green', entry.value)}\"")
        elif entry.type == 'hash':
            for f, v in entry.value.items():
                print(f" │  ├─ {c('yellow', f)}: \"{v}\"")
        elif entry.type == 'list':
            nodes = " -> ".join([f"[{i}] {x}" for i, x in enumerate(entry.value)])
            print(f" │  └─ Pipeline: {c('green', nodes)}")
        elif entry.type == 'set':
            print(f" │  └─ Miembros: {c('pink', str(list(entry.value)))}")
        elif entry.type == 'zset':
            sorted_items = sorted(entry.value.items(), key=lambda x: x[1])
            formatted = ", ".join([f"{m} (score:{s})" for m, s in sorted_items])
            print(f" │  └─ Ranking: {c('yellow', formatted)}")
        print(f" └───\n")

def run_benchmark(core):
    print(f"\n{c('yellow', '>>> INICIANDO BENCHMARK CUÁNTICO // 100 OPERACIONES EN PIPELINE...')}")
    beep(600, 30)
    beep(900, 30)
    t0 = time.time()
    total = 100
    for i in range(20):
        core.execute(f'SET bench:key:{i} "PACKET_{i * 999}"')
        core.execute(f'INCR bench:counter')
        core.execute(f'LPUSH bench:stream "packet_{i}"')
        core.execute(f'SADD bench:cluster "node_{i}"')
        core.execute(f'ZADD bench:ranking {i * 1200} "target_{i}"')

    elapsed = max(0.0001, time.time() - t0)
    throughput = int(total / elapsed)
    avg_lat = (elapsed / total) * 1000

    print(c('cyan', '╔════════════════════════════════════════════════════════════╗'))
    print(c('cyan', '║') + c('bold', '            REDIS QUANTUM BENCHMARK REPORT                  ') + c('cyan', '║'))
    print(c('cyan', '╠════════════════════════════════════════════════════════════╣'))
    print(f"{c('cyan', '║')}  Total Operaciones:       {c('green', f'{total} OPS')} en memoria virtual        {c('cyan', '║')}")
    print(f"{c('cyan', '║')}  Tiempo Transcurrido:     {c('yellow', f'{elapsed*1000:.2f} ms')}                          {c('cyan', '║')}")
    print(f"{c('cyan', '║')}  Rendimiento Estimado:    {c('green', f'{throughput:,} ops/sec')}                 {c('cyan', '║')}")
    print(f"{c('cyan', '║')}  Latencia Promedio:       {c('cyan', f'{avg_lat:.3f} ms / op')}                     {c('cyan', '║')}")
    print(f"{c('cyan', '║')}  Operaciones:             20x SET, 20x INCR, 20x LPUSH      {c('cyan', '║')}")
    print(f"{c('cyan', '║')}                           20x SADD, 20x ZADD                {c('cyan', '║')}")
    print(f"{c('cyan', '║')}  Estado del Motor:        {c('green', 'ÓPTIMO // 0% PÉRDIDA')}              {c('cyan', '║')}")
    print(c('cyan', '╚════════════════════════════════════════════════════════════╝\n'))
    beep(1200, 80)

def display_missions(core):
    missions = [
        ('M01', 'STRINGS', 'Infiltración', 'SET puerta_01 "desbloqueada"', lambda s: 'puerta_01' in s and 'desbloqueada' in str(s['puerta_01'].value)),
        ('M02', 'STRINGS', 'Tarjeta Única', 'SETNX tarjeta_acceso "valida"', lambda s: 'tarjeta_acceso' in s and s['tarjeta_acceso'].value == 'valida'),
        ('M03', 'HASHES', 'Perfil Operativo', 'HSET operativo:v nombre "Vincent" clase "Solo"', lambda s: 'operativo:v' in s and s['operativo:v'].type == 'hash' and 'nombre' in s['operativo:v'].value),
        ('M04', 'LISTS', 'Registro Forense', 'LPUSH log_hackeos "Servidor_Arasaka" "Camara"', lambda s: 'log_hackeos' in s and s['log_hackeos'].type == 'list' and len(s['log_hackeos'].value) >= 2),
        ('M05', 'SETS', 'Nodos Seguros', 'SADD red_fantasma "nodo_A" "nodo_B"', lambda s: 'red_fantasma' in s and s['red_fantasma'].type == 'set' and len(s['red_fantasma'].value) >= 2),
        ('M06', 'ZSETS', 'Recompensas', 'ZADD recompensas 50000 "Maelstrom_Lider"', lambda s: 'recompensas' in s and s['recompensas'].type == 'zset' and any(v >= 50000 for v in s['recompensas'].value.values()))
    ]

    print(f"\n{c('yellow', '╔══════════════════════════════════════════════════════════════════════════╗')}")
    print(f"{c('yellow', '║')} {c('bold', 'CYBER-OPS // PROTOCOLOS DE ENTRENAMIENTO NETRUNNER (MISIONES)')}        {c('yellow', '║')}")
    print(f"{c('yellow', '╚══════════════════════════════════════════════════════════════════════════╝')}")

    completed = 0
    for code, cat, name, cmd_hint, checker in missions:
        done = checker(core.store)
        status = c('green', '[✔ COMPLETADA +100XP]') if done else c('yellow', '[🔒 PENDIENTE]')
        if done:
            completed += 1
        print(f" {c('cyan', f'{code}')} {c('dim', f'[{cat}]')} {c('bold', name)}: {status}")
        print(f"    └─ Comando objetivo: {c('green', cmd_hint)}")

    xp = completed * 100
    rank = "NOVATO // TIER 1"
    if completed == 6:
        rank = "🏆 MAESTRO CUÁNTICO // 100% COMPLETADO"
    elif completed >= 4:
        rank = "CYBER-DECKER // TIER 3"
    elif completed >= 2:
        rank = "OPERATIVO // TIER 2"

    print(f"\n Rango Actual: {c('cyan', rank)} | Progreso: {c('green', f'{xp}/600 XP')} ({completed}/6)\n")

def seed_data(core):
    cmds = [
        'SET puerta_01 "desbloqueada"',
        'SETNX tarjeta_acceso "valida"',
        'HSET operativo:v nombre "Vincent" clase "Solo" nivel 45',
        'LPUSH log_hackeos "Servidor_Arasaka" "Camara_Callejon"',
        'SADD red_fantasma "nodo_A" "nodo_B"',
        'SADD red_corporativa "nodo_B" "nodo_C"',
        'ZADD recompensas 50000 "Maelstrom_Lider" 12000 "Scavenger_Scout" 85000 "Cyberpsycho_01"'
    ]
    for cmd in cmds:
        core.execute(cmd)
    beep(500, 40)
    beep(800, 40)
    print(f" {c('green', '[✔] Datos Cyberpunk cargados en el Data-Vault:')} puerta_01, tarjeta_acceso, operativo:v, log_hackeos, red_fantasma, recompensas.")

# ==============================================================================
# MAIN INTERACTIVE REPL LOOP
# ==============================================================================
def main():
    global current_theme
    core = RedisCore()
    seed_data(core)
    print_banner()

    prompt_symbol = f"{c('cyan', '127.0.0.1:6379')}{c('green', '>')}"

    while True:
        try:
            user_input = input(f"{prompt_symbol} ").strip()
        except (KeyboardInterrupt, EOFError):
            print(f"\n{c('red', 'Desconexión de sesión.')}")
            break

        if not user_input:
            continue

        raw_upper = user_input.upper()

        # Custom CLI helper commands
        if raw_upper in ('EXIT', 'QUIT', 'CIERRE', 'DISCONNECT'):
            beep(400, 80)
            beep(250, 120)
            print(c('red', "\n[SESIÓN FINALIZADA] Desconexión exitosa del núcleo."))
            break

        elif raw_upper == 'CLEAR':
            os.system('cls' if os.name == 'nt' else 'clear')
            print_banner()
            continue

        elif raw_upper in ('VAULT', 'DATA-VAULT'):
            display_vault(core)
            continue

        elif raw_upper == 'BENCHMARK':
            run_benchmark(core)
            continue

        elif raw_upper in ('MISSIONS', 'MISIONES'):
            display_missions(core)
            continue

        elif raw_upper == 'SEED':
            seed_data(core)
            continue

        elif raw_upper == 'THEME':
            if current_theme['name'] == 'CYBERPUNK HUD':
                current_theme = Theme.MINIMAL
            else:
                current_theme = Theme.CYBERPUNK
            beep(880, 50)
            beep(1200, 50)
            print(f" {c('cyan', '✦ Tema cambiado a:')} {c('bold', current_theme['name'])}\n")
            continue

        elif raw_upper in ('EXCEL', 'EXPORT EXCEL', 'EXPORTAR EXCEL'):
            print(f" {c('yellow', '>>> Generando libro de trabajo Excel enriquecido con pestañas...')}")
            xls_path, csv_path = export_to_excel(core)
            beep(1000, 60)
            beep(1400, 80)
            print(f" {c('green', '[✔ EXCEL GENERADO]')} Archivo XML Excel: {c('cyan', xls_path)}")
            print(f" {c('green', '[✔ CSV COMPATIBLE]')} Archivo CSV: {c('cyan', csv_path)}")
            print(f" {c('yellow', '>>> Abriendo Excel automáticamente en Windows...')}")
            try:
                if os.name == 'nt':
                    os.startfile(xls_path)
                elif sys.platform == 'darwin':
                    subprocess.call(['open', xls_path])
                else:
                    subprocess.call(['xdg-open', xls_path])
            except Exception as e:
                print(f" {c('dim', f'Abre manualmente el archivo en: {xls_path}')}")
            print()
            continue

        elif raw_upper.startswith('EXPORT'):
            xls_path, csv_path = export_to_excel(core)
            # Also export JSON
            json_path = os.path.abspath("redis_datavault.json")
            dump_obj = {
                "system": "REDIS_NEON_CORE",
                "timestamp": datetime.now().isoformat(),
                "total_keys": len(core.store),
                "keys": {k: {"type": v.type, "ttl": v.ttl, "value": list(v.value) if isinstance(v.value, set) else v.value} for k, v in core.store.items()}
            }
            with open(json_path, 'w', encoding='utf-8') as jf:
                json.dump(dump_obj, jf, indent=2)
            print(f" {c('green', '[✔] Datos exportados en:')}")
            print(f"   • Excel: {c('cyan', xls_path)}")
            print(f"   • CSV:   {c('cyan', csv_path)}")
            print(f"   • JSON:  {c('cyan', json_path)}\n")
            continue

        elif raw_upper.startswith('IMPORT'):
            parts = user_input.split(maxsplit=1)
            filename = parts[1] if len(parts) > 1 else "redis_datavault.json"
            if not os.path.exists(filename):
                print(f" {c('red', f'[!] Archivo no encontrado: {filename}')}\n")
                continue
            try:
                with open(filename, 'r', encoding='utf-8') as jf:
                    data = json.load(jf)
                cnt = 0
                for k, item in data.get('keys', {}).items():
                    val = set(item['value']) if item['type'] == 'set' and isinstance(item['value'], list) else item['value']
                    core.store[k] = RedisEntry(item['type'], val, item.get('ttl'))
                    cnt += 1
                beep(880, 50)
                print(f" {c('green', f'[✔] {cnt} claves restauradas con éxito desde {filename}')}\n")
            except Exception as e:
                print(f" {c('red', f'[!] Error al importar: {e}')}\n")
            continue

        elif raw_upper == 'HELP':
            print(f"\n{c('cyan', '╔══════════════════════════════════════════════════════════════════════════╗')}")
            print(f"{c('cyan', '║')} {c('bold', 'MANUAL CYBER-CORE // COMANDOS TÁCTICOS DISPONIBLES')}                    {c('cyan', '║')}")
            print(f"{c('cyan', '╚══════════════════════════════════════════════════════════════════════════╝')}")
            print(f" {c('bold', 'Strings:')}     SET, GET, SETNX, INCR, DECR, INCRBY, APPEND, STRLEN")
            print(f" {c('bold', 'Hashes:')}      HSET, HGET, HGETALL, HDEL, HEXISTS, HKEYS, HVALS, HLEN")
            print(f" {c('bold', 'Listas:')}      LPUSH, RPUSH, LPOP, RPOP, LRANGE, LLEN")
            print(f" {c('bold', 'Sets:')}        SADD, SMEMBERS, SREM, SCARD, SISMEMBER, SUNION, SINTER, SDIFF")
            print(f" {c('bold', 'Sorted Sets:')} ZADD, ZRANGE, ZREVRANGE, ZSCORE, ZCARD")
            print(f" {c('bold', 'Sistema:')}     KEYS, DEL, EXISTS, TYPE, EXPIRE, TTL, FLUSHALL, PING, INFO")
            print(f" {c('bold', 'Especiales:')}  {c('green', 'EXCEL')} (Exporta y abre en Excel), {c('yellow', 'VAULT')} (Ver memoria visual)")
            print(f"              {c('cyan', 'BENCHMARK')} (Test de estrés), {c('pink', 'MISSIONS')} (Retos Netrunner)")
            print(f"              {c('cyan', 'THEME')} (Alternar colores), {c('red', 'CLEAR')}, {c('red', 'QUIT')}\n")
            continue

        # Execute standard Redis command
        res = core.execute(user_input)

        if res is None:
            continue

        rtype, rval = res
        if rtype == 'ERR':
            beep(200, 60)
            print(f"{c('red', '(error) ERR')} {rval}")
        elif rtype == 'NIL':
            beep(900, 20)
            print(c('dim', '(nil)'))
        elif rtype == 'STATUS':
            beep(950, 30)
            print(c('green', rval))
        elif rtype == 'INTEGER':
            beep(900, 30)
            print(f"{c('dim', '(integer)')} {c('yellow', rval)}")
        elif rtype == 'STRING':
            beep(1100, 30)
            print(f'"{c("cyan", rval)}"')
        elif rtype == 'ARRAY':
            beep(1200, 30)
            if not rval:
                print(c('dim', '(empty list or set)'))
            else:
                for idx, item in enumerate(rval):
                    print(f"{c('dim', f'{idx+1})')} \"{c('cyan', item)}\"")

if __name__ == '__main__':
    main()
