# Motor compatible incluido

Fuente: https://github.com/fatal10110/js-redis-server

Versión: 0.5.0. Commit: `a5699f5cb7289e5f63fb676c092c10b66a1835a0`.
Licencia MIT conservada en `LICENSE`. Se incluye `src/` para poder importar el
núcleo sin los puntos de entrada TCP del paquete publicado. Es una implementación
compatible en JavaScript, no el servidor Redis oficial.

Adaptación local: se elimina MIGRATE del registro de comandos para no incluir
conexiones TCP en el navegador. El adaptador del laboratorio limita el registro
efectivo, el tamaño de las operaciones y las funciones que requieren un servidor.
El shim SHA-1 `src/crypto-shim.ts` procede del mismo commit y tiene la misma licencia.

No confundir los valores de telemetría simulados del upstream con métricas reales.
El adaptador excluye INFO, CONFIG, SLOWLOG y operaciones administrativas.

Corrección local: `streams/trim.ts` acepta el marcador explícito `=` en XADD/XTRIM,
igual que Redis 7.2; se cubre con un test de regresión.
