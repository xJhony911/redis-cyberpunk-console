# Redis Lab

Laboratorio educativo en español que transforma la consola original en una plataforma de estudio. HTML, CSS y JavaScript modular con Vite; ejecución compatible con Redis en el navegador, sin cuentas ni credenciales del estudiante.

## Ejecutar

Requiere Node.js 22.12 o posterior y npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Abre la URL que muestra Vite. No abras index.html directamente: los módulos y el motor necesitan el servidor HTTP. `dist/` es el artefacto estático de producción. `.env.example` explica que no se requieren variables de entorno ni secretos.

## Qué incluye

- 23 lecciones progresivas: fundamentos, claves, expiración, Strings, Hashes, Lists, Sets, Sorted Sets, bitmaps/bitfields, HyperLogLog, geoespacial, Streams y grupos, Pub/Sub, transacciones/WATCH, pipelines, Lua/funciones, RDB/AOF, memoria/expulsión, replicación/Sentinel/Cluster, seguridad/ACL, diagnóstico y extensiones.
- 16 laboratorios: 15 verificables automáticamente mediante estado y uno de Pub/Sub con evidencia externa. La terminal sí permite experimentar con Pub/Sub entre A y B; el laboratorio externo enseña clientes independientes.
- 18 preguntas de repaso con explicación, favoritos, búsqueda, filtros, progreso y continuación.
- Tema claro, oscuro y sistema, diseño adaptable, foco visible y movimiento reducido.
- Terminal multilinea, comillas, historial, autocompletado de comandos y claves, ayuda de sintaxis, respuestas RESP legibles, dos conexiones y explorador reactivo con TTL.

## Cobertura exacta y límites

Referencia: **Redis 7.2.7**, tag oficial, commit `ba181057223b04aba580a01b1b36662430aea4a0`.

El inventario contiene **392 definiciones**, incluyendo contenedores de subcomandos, Sentinel y comandos internos. No representa 392 comandos pedagógicamente completos o ejecutables. Hay **40 fichas ampliadas**, **182 entradas con ejemplos** y **204 ejemplos ejecutados sin errores**. Los **22 comandos de Strings** tienen opciones, caducidad, errores y dos ejemplos cada uno.

El motor habilita **181 comandos raíz**. El número de entradas habilitadas puede ser mayor por los subcomandos. `SUPPORTED` en `src/engine.js` es la fuente de verdad; las opciones bloqueantes y las funciones administrativas se rechazan explícitamente. Ver [matriz documental](docs/COVERAGE.md) y [evidencia de ejecución](data/execution-coverage.json). Habilitación y ejecución sin errores no certifican todas las variantes ni equivalencia total con Redis real.

**Pendiente funcional:** ampliar las fichas de referencia restantes al mismo nivel pedagógico que Strings y añadir ejemplos a las 210 definiciones que aún no los tienen. Las opciones administrativas, de infraestructura y variantes avanzadas no están exhaustivamente comprobadas. No se declara completada esa parte del alcance original.

**Simulación explícita:** se incluye el núcleo de js-redis-server 0.5.0, perfil Redis 7.2, con licencia y procedencia en `vendor/js-redis-server/PROVENANCE.md`. No se ejecuta Redis oficial. Se corrigió el soporte del marcador `=` para recorte exacto de Streams, con prueba de regresión.

Lua, funciones, RDB/AOF, ACL, Cluster, replicación, métricas de servidor y comandos bloqueantes requieren infraestructura externa. JSON, búsqueda y Bloom no pertenecen a Redis base 7.2.7 y requieren módulos/distribución adecuada. El recorte aproximado de Streams es educativo y no reproduce bloques radix ni el límite de trabajo real. HLL no expone el mismo formato binario del servidor. Las entradas de terminal son UTF-8, no un transporte RESP binario arbitrario.

Límites: 64 KiB por comando, 1 MiB por String, 2.000 claves, 1.000 comandos por transacción y 2.048 bytes por cadena en LCS. LCS dentro de MULTI se rechaza para poder controlar su asignación de memoria. La simulación no sustituye pruebas de carga o garantías de durabilidad.

## Estado e aislamiento

Cada pestaña tiene su propia instancia, sin red ni credenciales. A y B comparten únicamente esa instancia para observar WATCH y Pub/Sub; el explorador usa una tercera conexión para no contaminar MULTI o suscripciones. Limpiar pantalla no borra datos. Reiniciar crea una instancia nueva y restaura el escenario cuando corresponde.

Los datos se conservan entre comandos y se pierden al recargar. Progreso, favoritos y tema se conservan en localStorage. No hay sincronización entre dispositivos ni persistencia de datos de práctica. El progreso de lectura y los laboratorios aprobados se registran por separado.

## Arquitectura

- `src/app.js`: interfaz, navegación por hash, preferencias y acciones.
- `styles.css`: temas, paneles y puntos de adaptación.
- `src/engine.js`: tokenización, límites, conexiones, formateo e inspección.
- `src/learning.js`: lecciones, laboratorios, pistas, soluciones, validadores y repaso.
- `data/redis-7.2.7.commands.json`: metadatos oficiales fijados a la versión.
- `data/command-guides.json` y `command-summaries.es.txt`: contenido educativo en español.
- `src/catalog.js` y `data/catalog.json`: catálogo generado, compartido por búsqueda, referencia y ayuda.
- `scripts/generate-catalog.mjs`: generación reproducible de catálogo y matriz.
- `tests/`: semántica, límites, aislamiento, escenarios y ejemplos.

Se mantuvo JavaScript sin introducir un framework de interfaz. Vite se añadió para empaquetar el núcleo TypeScript del motor y sus adaptadores de navegador. No hace falta backend ni mantener Redis remoto para ofrecer práctica inmediata en un alojamiento estático.

## Pruebas

`npm test` compila los tests y el núcleo vendorizado con esbuild y ejecuta el runner nativo de Node. No depende del loader tsx ni de información del usuario del sistema. La compilación temporal se elimina al terminar.

34 pruebas: parsing, enteros de 64 bits, bytes UTF-8, SET y sus opciones, TTL absoluto/relativo, GETEX, MSETNX atómico, LCS, tipos y estructuras, HLL, geoespacial, Streams, MULTI/WATCH, Pub/Sub, límites, aislamiento, 15 laboratorios (rechazo inicial + aceptación final), soluciones equivalentes, 204 ejemplos y recorte exacto de Streams.

Se verificó manualmente en navegador: recorrido lección → laboratorio, ejecución y explorador, validación incorrecta/correcta, búsqueda GETEX, persistencia de progreso/tema y diseño a 1440 y 390 píxeles. No se realizó comparación diferencial contra Redis real: Docker estaba instalado pero su daemon no estaba disponible.

CI en `.github/workflows/verify.yml` instala, prueba, comprueba la regeneración del catálogo y compila. No se deben marcar pruebas externas como aprobadas sin ejecutarlas.

## Mantener y ampliar

1. Añadir o corregir una guía en `data/command-guides.json`; conservar sintaxis y requisitos de la versión fijada.
2. Incorporar escenarios autocontenidos (setup, commands, expected, explanation). No marcar como ejecutable una variante externa.
3. Para habilitar un comando, revisar el motor y sus límites en `src/engine.js`, y añadir pruebas de resultados, errores y caducidad.
4. Ejecutar `npm run catalog:generate`, `npm test`, y de nuevo `npm run catalog:generate` para incorporar la evidencia actualizada.
5. Añadir laboratorios a `src/learning.js`, con validación por estado que acepte soluciones equivalentes. Enlazar `labId` desde la lección.
6. Compilar y revisar el flujo en navegador antes de publicar.

## Integración desde una aplicación Node.js

Este ejemplo se ejecuta fuera del navegador, en un proyecto de servidor con `npm install redis`, contra un Redis real. `REDIS_URL` es exclusivamente de servidor.

```js
import { createClient } from 'redis';
const client = createClient({ url: process.env.REDIS_URL });
client.on('error', error => console.error('Redis:', error.message));
await client.connect();
await client.set('cache:clima', 'soleado', { EX: 60 });
console.log(await client.get('cache:clima'));
await client.quit();
```

No colocar `REDIS_URL` ni contraseñas en variables `VITE_*`: se publican dentro del JavaScript cliente.

## GitHub y Vercel

Repositorio existente: https://github.com/xJhony911/redis-cyberpunk-console

La integración Vercel ya existía y apuntaba al proyecto `kex7/redis-cyberpunk-console`; se comprobó el estado de su despliegue anterior desde GitHub. Se reutiliza esa integración: cada push a la rama de trabajo debe producir una vista previa. `vercel.json` fija framework Vite, `npm run build` y salida `dist`. No requiere variables de entorno.

La publicación de producción depende del flujo de ramas de Vercel. Una vista previa verificada no significa que el dominio de producción haya sido actualizado. Consultar la entrega y los checks del commit para la URL exacta.

El repositorio también tenía GitHub Pages configurado con `main` y `/`. Esa configuración heredada servía archivos sin build; no debe usarse para la nueva aplicación sin publicar `dist/` mediante un workflow o una rama de artefactos. Vercel es el destino preparado para esta versión.

## Licencias

Se conserva la atribución del proyecto a Jonathan Acosta. El motor vendorizado conserva su licencia MIT. Los metadatos de Redis 7.2.7 conservan su procedencia y licencia BSD en los archivos de atribución de `data/`.
