# ⚡ REDIS // NEON-CORE [DATA-VAULT TERMINAL]

> Interfaz web interactiva (HTML/CSS/JS puro) con simulador de motor Redis en tiempo real, visualizador holográfico reactivo **Data-Vault Memory**, sintetizador de efectos de audio procedurales (Web Audio API), barra inteligente de sugerencias de sintaxis y selector de temas de doble estética: **Cyberpunk HUD** vs **Neón Dark Minimalista**. 100% responsiva para celulares, tablets y desktop.

🌐 **Demo en vivo en GitHub Pages:** [https://xjhony911.github.io/redis-cyberpunk-console/](https://xjhony911.github.io/redis-cyberpunk-console/)

---

## 🎨 Selector de Temas Dual (Dual Aesthetic Engine)

La consola incorpora un motor de estilos intercambiable en 1 clic (con persistencia en `localStorage` y sonido cristalino armónico):

1. **⚡ Cyberpunk HUD (Por defecto):**
   - Estética retrofuturista con líneas de escaneo CRT y distorsión fósforo.
   - Cortes poligonales (`clip-path`) en paneles y tarjetas con muescas angulares.
   - Animaciones glitch activas en encabezados y tipografía monoespaciada de alta intensidad.
2. **✦ Neón Dark Minimalista:**
   - Fondo negro OLED ultra-profundo (`#030508`) con gradiente ambiental sutil.
   - Glassmorphism moderno (`backdrop-filter: blur(24px)`) y bordes suaves redondeados (`border-radius: 12px/14px`).
   - Sin scanlines ni efectos de glitch para máxima legibilidad y descanso visual.
   - Acentos de neón cian, verde esmeralda y violeta eléctrico refinado.

---

## 📸 Características Principales

- **Consola Cyber-Shell Interactiva:**
  - Prompt auténtico `127.0.0.1:6379>` con cursor pulsante.
  - **Barra de Sugerencias de Sintaxis en Vivo:** Mientras escribes cualquier comando (ej. `SET`, `HSET`, `ZADD`), una barra interactiva muestra en tiempo real la categoría, la sintaxis exacta con argumentos y la descripción.
  - Autocompletado inteligente con tecla <kbd>Tab</kbd> o botón de completar.
  - Atajo global <kbd>Ctrl+L</kbd> o <kbd>Cmd+L</kbd> para limpiar la pantalla de terminal al instante.
  - Historial de comandos navegable con las flechas <kbd>↑</kbd> y <kbd>↓</kbd>.
  - Snippets de acceso rápido superiores para pruebas en 1 clic.

- **Data-Vault Memory Visualizer (Panel Lateral Reactivo):**
  - Renderizado en vivo de llaves y estructuras de datos con tarjetas de neón:
    - 🟢 **STRINGS**: Contenido de texto, contadores atómicos y cálculo de longitud.
    - 🔵 **HASHES**: Tablas interactivas con pares campo-valor editables.
    - 🟡 **LISTS**: Pipelines enlazados de nodos indexados `[0] -> [1] -> [2]`.
    - 🟣 **SETS**: Nubes de etiquetas de miembros únicos sin duplicados.
    - 🔴 **SORTED SETS**: Tablas de clasificación (*leaderboards*) ordenadas en tiempo real por score numérico.
  - **Inspección en 1 Clic:** Haz clic en el nombre de cualquier clave o en su botón `[▶ GET]` para que la consola ejecute automáticamente la consulta correspondiente (`GET`, `HGETALL`, `LRANGE`, `SMEMBERS` o `ZRANGE`).
  - **Resaltado de Búsqueda:** Filtra claves y visualiza las coincidencias de texto iluminadas en neón (`<mark>`).
  - **Efecto Holográfico de Destello (Neon Flash):** Cuando un comando inserta o modifica un dato, la tarjeta correspondiente pulsa intensamente con animación neón.
  - **Autodestrucción Activa (TTL Countdown):** Al aplicar `EXPIRE clave segundos`, el Vault muestra la cuenta regresiva en vivo y destruye la clave con sonido digital al expirar.
  - **Exportación de Memoria (Botón 💾 EXPORTAR):** Descarga una copia de seguridad en formato JSON estructurado con un solo clic.

- **Sintetizador de Sonidos Procedurales (Web Audio API):**
  - **Cero archivos mp3 externos**: 100% autónomo y offline.
  - Campanada armónica cristalina al alternar entre temas Cyberpunk y Neón Minimalista.
  - Sonido seco y corto de desintegración digital al eliminar (`DEL`, `[×]`, `LPOP`, `FLUSHALL`).
  - Chirp ascendente de alta tecnología al escribir (`SET`, `HSET`, `LPUSH`, `SADD`, etc.).
  - Sonar escáner de doble frecuencia al consultar (`GET`, `LRANGE`, `HGETALL`, `KEYS`, etc.).
  - Zumbido de rechazo en caso de error de sintaxis.
  - Secuencia de apagado en `DISCONNECT` / `QUIT`.
  - Botón de silenciar/activar audio en el HUD (`🔊 AUDIO: ON / MUTED`).

- **Directorio Total de Comandos (Cyber-Command Matrix):**
  - Registro de más de 40 comandos organizados en categorías.
  - Búsqueda en vivo instantánea por nombre, sintaxis o función.
  - Explicaciones directas y concisas sin muros de texto.
  - Botones `[▶ Probar]` para inyectar y ejecutar el comando al instante en la terminal.
  - Botones `[📋 Copiar]` para llevar cualquier comando al portapapeles.

- **Diseño Ultra-Responsivo (Mobile Ready):**
  - Optimizado para pantallas táctiles de smartphones (360px+) y tablets.
  - Scroll táctil suave (`-webkit-overflow-scrolling: touch`), inputs anti-zoom y botones táctiles cómodos.

---

## 🛠️ Comandos Soportados en el Simulador

| Categoría | Comandos |
| :--- | :--- |
| **Strings** | `SET`, `GET`, `SETNX`, `INCR`, `DECR`, `INCRBY`, `APPEND`, `STRLEN`, `MSET`, `MGET` |
| **Hashes** | `HSET`, `HGET`, `HGETALL`, `HKEYS`, `HVALS`, `HDEL`, `HEXISTS`, `HLEN`, `HINCRBY` |
| **Listas** | `LPUSH`, `RPUSH`, `LPOP`, `RPOP`, `LRANGE`, `LLEN`, `LSET`, `LREM` |
| **Sets** | `SADD`, `SMEMBERS`, `SISMEMBER`, `SCARD`, `SREM`, `SINTER`, `SUNION`, `SDIFF` |
| **Sorted Sets** | `ZADD`, `ZRANGE`, `ZREVRANGE`, `ZSCORE`, `ZRANK`, `ZREVRANK`, `ZCARD`, `ZINCRBY`, `ZRANGEBYSCORE` |
| **Sistema & Claves** | `KEYS`, `EXISTS`, `TYPE`, `DEL`, `EXPIRE`, `TTL`, `FLUSHALL`, `CLEAR`, `HELP`, `INFO`, `PING`, `TIME`, `ECHO` |
| **Cierre & Sesión** | `QUIT`, `EXIT`, `DISCONNECT`, `CIERRE` |

---

## 🧪 Laboratorio Real en Windows (Docker)

Si deseas conectar o probar los mismos comandos en un servidor Redis real con Docker en tu PowerShell:

### 1. Despliegue del Servidor (Segundo plano)
```powershell
docker pull sickp/alpine-redis
docker network create redis_network
docker run --rm --network redis_network --name redis-server sickp/alpine-redis
```

### 2. Conexión del Cliente Interactivo
En otra pestaña de PowerShell:
```powershell
docker run --rm --network redis_network -it sickp/alpine-redis redis-cli -h redis-server
```

### 3. Cierre de Sesión & Limpieza de Huellas
```powershell
docker kill redis-server && docker network remove redis_network
```

---

## 🚀 Despliegue en la Web (Vercel o GitHub Pages)

Dado que este proyecto está construido enteramente con **HTML, CSS y JavaScript nativo puro**, no requiere ningún servidor backend, build step ni instalación de npm.

### Opción A: Desplegar en Vercel (10 segundos)
1. Ve a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** &rarr; **"Project"**.
3. Selecciona el repositorio `redis-cyberpunk-console`.
4. En **Framework Preset**, déjalo en **"Other"** (o automático).
5. Haz clic en **Deploy**.
6. ¡Listo! Vercel te dará una URL HTTPS pública (ej. `https://redis-cyberpunk-console.vercel.app`) accesible desde cualquier PC o celular.

### Opción B: Desplegar en GitHub Pages
1. Entra a tu repositorio en GitHub: `https://github.com/xJhony911/redis-cyberpunk-console`.
2. Ve a **Settings** &rarr; **Pages** (menú izquierdo).
3. En **Source**, selecciona `Deploy from a branch`.
4. Selecciona la rama `main` y la carpeta `/ (root)`.
5. Haz clic en **Save**. En 1 minuto tendrás tu enlace público oficial.

---

## 💻 Ejecución Local en Windows

Simplemente abre el archivo `Iniciar_Redis_Console.bat` o haz doble clic en `index.html`.

---

## 👤 Autor
Desarrollado con pasión Cyberpunk por [Jonathan Acosta (@xJhony911)](https://github.com/xJhony911).
Licencia: MIT.
