'use strict';
// Caching shows a 6% perf bump
const mp51 = Math.pow(2,51);
const mp48 = Math.pow(2,48);
const mp34 = Math.pow(2,34);
const mp20 = Math.pow(2,20);
const mp14 = Math.pow(2,14);

module.exports.encode = encode;
module.exports.decode = decode;

/**
 * @param {object} grid - grid objec tto encode
 * @return {number} encoded grid
 */
function encode(grid) {
    if (grid.id >= mp20) throw new Error('id must be < 2^20');
    if (grid.x >= mp14) throw new Error('x must be < 2^14');
    if (grid.y >= mp14) throw new Error('x must be < 2^14');
    if (grid.x < 0) throw new Error('x must be > 0');
    if (grid.y < 0) throw new Error('y must be > 0');
    if (grid.relev > 1 || grid.relev < 0.4) throw new Error('relev must be between 0.4 and 1');

    const relev = Math.max(0, Math.min(3, Math.round((grid.relev - 0.4) / 0.2)));
    const score = Math.max(0, Math.min(7, grid.score));
    return (relev * mp51) + (score * mp48) + (grid.y * mp34) + (grid.x * mp20) + grid.id;
}

/**
 * @param {number} num - integer that represents a grid object
 * @return {object} decoded grid object
 */
function decode(num) {
    return {
        relev: parseFloat((0.4 + (Math.floor(num / mp51) * 0.2)).toFixed(1)),
        score: Math.floor(num % mp51 / mp48),
        x: Math.floor(num % mp34 / mp20),
        y: Math.floor(num % mp48 / mp34),
        id: Math.floor(num % mp20)
    };
}

