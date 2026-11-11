// Lua must run in an isolated worker with an interrupt budget before enabling it.
export class WasmFault extends Error {}
export async function load() { throw new Error('Lua requiere un servidor Redis externo en este laboratorio.'); }
