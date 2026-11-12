// Generado por scripts/generate-catalog.mjs a partir del tag oficial 7.2.7.
import data from '../data/catalog.json' with { type: 'json' };
export const catalog = data;
export const groups = {"string":"Strings","hash":"Hashes","list":"Lists","set":"Sets","sorted_set":"Sorted Sets","generic":"Claves y caducidad","bitmap":"Bitmaps y Bitfields","hyperloglog":"HyperLogLog","geo":"Geoespacial","stream":"Streams","pubsub":"Pub/Sub","transactions":"Transacciones","scripting":"Scripting y funciones","server":"Servidor y diagnóstico","connection":"Conexiones","cluster":"Redis Cluster","sentinel":"Sentinel"};
export function findCommand(name) { return catalog.find(c => c.name === name.trim().toUpperCase()); }
export default catalog;
