# Fujitsu MB85 FRAM

Simple wrapper around I²C (i2c-bus) implementation to provide read / write capability.

[![npm Version](https://img.shields.io/npm/v/@johntalton/mb85.svg)](https://www.npmjs.com/package/@johntalton/mb85)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/mb85)
![CI](https://github.com/johntalton/mb85/workflows/CI/badge.svg)
![CodeQL](https://github.com/johntalton/mb85/workflows/CodeQL/badge.svg)



## API

#### `size`
The density expressed as numeric bytes value.

#### `densityHuman`
The density expressed as product code string (example: '1M', '512K', ect)

#### `busHuman`
The bus as product code string ('RC' for I²C)

#### `async read(offset, length)`
Direct access to read at an offset for desired length.

#### `async write(offset, buffer)`
Direct write to an offset given a buffer of desired length to be written.

```javascript
import { I2CAddressedBus } = from '@johntalton/and-other-delights'
import { MB85RC, DEFAULT_MB85_ADDRESS } from '@johntalton/mb85'

const bus = /* I2CBus implementation */
const ab = new I2CAddressedBus(bus, DEFAULT_MB85_ADDRESS)
const fram = new MB85RC(ab, DENSITY_256K)

console.log('Fujitsu FRAM MB85', fram.busHuman, fram.densityHuman, fram.featuresHuman)
// Fujitsu FRAM MB85 RC 256K V

const byteLength = 64
const buffer = await fram.read(0, byteLength)

```

