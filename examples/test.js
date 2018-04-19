"use strict";

const rasbus = require('rasbus');
const { MB85, MB85RC } = require('../');

/*
const peter = {
  signature: 'foo',
  map: [
    { start: 42, length: 20, tags: ['foo', 'test'] }
    { start: 0, length: 20, tags: ['bar', 'test'] }
  ]
};

class Framton {
  static framton(...bus) {
    return Promise.reject();
  }
}
*/

rasbus.byname('i2c-bus').init(42, 0x50).then(bus => {
  return MB85RC.detect(bus).then(fram => {
    console.log('Fujitsu FRAM MB85', fram.busHuman, fram.densityHuman, fram.featuresHuman);
  });
})

/*
  const addr = 42;
  const msb = (addr >> 8) & 0x7F;
  const lsb = (addr) & 0xFF;

  const value0 = 37;

  //const value1 = Buffer.from(JSON.stringify({ hello: 'goodbye' }));

  return Promise.resolve()

    //.then(() => bus.writeBuffer(Buffer.from([msb, lsb, value0])))

    //.then(() => bus.writeBuffer(Buffer.concat([ Buffer.from([msb, lsb]), value1, Buffer.from([0, 0, 0]) ])))


    .then(() => bus.writeBuffer(Buffer.from([msb, lsb])))

    //.then(() => bus.readBuffer(Math.pow(2, 15)))

    .then(() => bus.readBuffer(64))

    .then(foo => {
      const index = foo.indexOf(0x00);
      const data = Buffer.from(foo.buffer, 0, index).toString('utf8');
      //console.log(index, data);
      console.log(JSON.parse(data));
    })

})*/
.catch(e => { console.log('top-level error', e); });
