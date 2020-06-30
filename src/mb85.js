// default i2c address
const DEFAULT_MB85_ADDRESS = 0x50;

// datasheet max w/r times/byte
const endurance = Math.pow(10, 12);

// spec defined manufactur id
const FUJITSU_I2C_MANUFACTURER_ID = 0x0A;

// density
const D_4K  =  0x0;
// D_8K
// D_16K
const D_64K =  0x3;
// D_128
const D_256K = 0x5;
const D_512K = 0x6;
const D_1M =   0x7;
// D_4M

/**
 * Fujitsu MB85RC (i2c) managment layer
 */
class MB85RC {
  static from(bus, density) {
    return new Promise((resolve, reject) => {
      resolve(new MB85RC(bus, density, 0));
    });
  }

  static fromId(bus, id) {
    if(id.manufacturer !== FUJITSU_I2C_MANUFACTURER_ID) { throw new Error('Manufacturer missmatch'); }
    // prod is split into 4bit Density and Proprietary
    const density = id.product >> 8 & 0x0F;
    const proprietary = id.product & 0xFF;

    return Promise.resolve(new MB85RC(bus, density, proprietary));
  }

  constructor(bus, density, features) {
    this._bus = bus;
    this._density = density;
    this._features = features;
  }

  get busHuman() { return Util.stringForBus('i2c'); }
  get size() { return Util.sizeForDensity(this._density); }
  get densityHuman() { return Util.stringForDensity(this._density); }
  get featuresHuman() { return Util.stringForFeatures(this._features); }


  read(offset, length) {
    return this._bus.writeBuffer(Buffer.from(Util.splitAddress(offset)))
      .then(() => this._bus.readBuffer(length));
  }

  write(offset, buffer) {
    return this._bus.writeBuffer(Buffer.concat([Buffer.from(Util.splitAddress(offset)), buffer]));
  }
}

/**
 * Util class
 */
class Util {
  static splitAddress(address) { return [(address >> 8) & 0x7F, address & 0xFF]; }

  static sizeForDensity(density) {
    switch(density) {
      case D_4K:   return 4 * 1024 / 8; break;
      case D_64K:  return 64 * 1024 / 8; break;
      case D_256K: return 256 * 1024 / 8; break;
      case D_512K: return 512 * 1024 / 8; break;
      case D_1M:   return 1 * 1024 * 1024 / 8; break;
      default: throw Error('i am your density: ' + density); break;
    }
  }

  static stringForDensity(density) {
    switch(density) {
      case D_4K:   return '4K'; break;
      case D_64K:  return '64K'; break;
      case D_256K: return '256K'; break;
      case D_512K: return '512K'; break;
      case D_1M:   return '1M'; break;
      default: throw Error('i am your density: ' + density); break;
    }
  }

  static stringForFeatures(features) {
    switch(features) {
      case 16: return 'V'; break;
      case 88: return 'T'; break; // or TA, who knows
      default: throw Error('unknown feature set ' + features); break;
    }
  }

  static stringForBus(bus) {
    switch(bus.toLowerCase()) {
      case 'i2c': return 'RC'; break;
      case 'spi': return 'RS'; break; // or RQ
      case 'parallel': return 'R'; break;
      default: throw Error('unknown bus type'); break;
    }
  }
}

module.exports = {
  MB85RC,
  DEFAULT_MB85_ADDRESS
};
