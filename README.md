# Fujitsu MB85 FRAM 

Simple wrapper around I²C (i2c-bus) implementation to provide read / write capability.

[![npm Version](https://img.shields.io/npm/v/@johntalton/mb85.svg)](https://www.npmjs.com/package/@johntalton/mb85)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/mb85)
![CI](https://github.com/johntalton/mb85/workflows/CI/badge.svg?branch=master&event=push)
![GitHub](https://img.shields.io/github/license/johntalton/mb85)
[![Downloads Per Month](https://img.shields.io/npm/dm/@johntalton/mb85.svg)](https://www.npmjs.com/package/@johntalton/mb85)
![GitHub last commit](https://img.shields.io/github/last-commit/johntalton/mb85)
[![Package Quality](https://npm.packagequality.com/shield/%40johntalton%2Fmb85.svg)](https://packagequality.com/#?package=@johntalton/mb85)

## API
Construction is achived via the statis `from` and `fromId` methods of `MB85RC`. 
```javascript
const id = ... // detected via I²C, or user specified 
const fram = MB85RC.fromId(bus, id)
```

#### Feature string
The feature set exposed as the Fujitsu product codes.

#### `size` 
The density expressed as numeric value.

#### `densityHuman`
The density expressed as prodcut code string (example: '1M', '512K', ect)

#### `busHuman`
The bus as product code string ('RC' for I²C)

#### `read(offset, length)`
Direct access to read at an offset for desired length.
Retruning a `Promise` that resolves to a Buffer.

#### `write(offset, buffer)`
Direct write to an offset given a buffer of desired length to be writen.
Returning a `Promise` that resolves when completed.

## Devcie ID
The provided library is also provides a way of identifying a chip based on its assigned Id value.

This can be passed in, however, it becomes more usefull with the bus level `deviceId` call.  This uses a bus level discovery not supported by most chips.  By using this method, the chips feature inforamtion can detected.

```javascript
const i2c = require('i2c-bus')
const { I2CAddressedBus } = require('@johntalton/and-other-delights')
const { MB85RC, DEFAULT_MB85_ADDRESS } = require('@johntalton/mb85')

const busNumber = 1
const busAddress = DEFAULT_MB85_ADDRESS // 0x50

const bus1 = await i2c.openPromisified(busNumber)
const id = await bus1.deviceId()
const ab = new I2CAddressedBus(bus1, busAddress)
const fram = MB85RC.fromId(ab, id)

console.log('Fujitsu FRAM MB85', fram.busHuman, fram.densityHuman, fram.featuresHuman)
// Fujitsu FRAM MB85 RC 256K V

```

