/**
 * @import { I2CAddressedBus, I2CBufferSource } from '@johntalton/and-other-delights'
 */

// default i2c address
export const DEFAULT_MB85_ADDRESS = 0x50

// datasheet max w/r times/byte
export const ENDURANCE = Math.pow(10, 12)

// spec defined manufacture id
export const FUJITSU_I2C_MANUFACTURER_ID = 0x0A

// density
export const DENSITY_4K = 0x0
// D_8K
// D_16K
export const DENSITY_64K = 0x3
// D_128
export const DENSITY_256K = 0x5
export const DENSITY_512K = 0x6
export const DENSITY_1M = 0x7
// D_4M

/**
 * @typedef {Object} MB85RCOptions
 * @property {number} manufacturer
 * @property {number} product
 */

/**
 * Fujitsu MB85RC (i2c) management layer
 */
export class MB85RC {
	/** @type {I2CAddressedBus} */
	#bus
	#density
	#features

	/**
	 * @param {I2CAddressedBus} bus
	 */
	static from(bus, density) { return new MB85RC(bus, density, 0) }

	/**
	 * @param {I2CAddressedBus} bus
	 * @param {MB85RCOptions} id
	 */
	static fromId(bus, id) {
		if (id.manufacturer !== FUJITSU_I2C_MANUFACTURER_ID) { throw new Error('Manufacturer mismatch') }
		const density = (id.product >> 8) & 0x0F
		const proprietary = id.product & 0xFF

		return new MB85RC(bus, density, proprietary)
	}

	/**
	 * @param {I2CAddressedBus} bus
	 */
	constructor(bus, density, features) {
		this.#bus = bus
		this.#density = density
		this.#features = features
	}

	get busHuman() { return Util.stringForBus('i2c') }
	get size() { return Util.sizeForDensity(this.#density) }
	get densityHuman() { return Util.stringForDensity(this.#density) }
	get featuresHuman() { return Util.stringForFeatures(this.#features) }


	/**
	 * @param {number} offset
	 * @param {number} length
	 * @param {I2CBufferSource} [target=undefined]
	 * @returns {Promise<I2CBufferSource>}
	 */
	async read(offset, length, target = undefined) {
		return this.#bus.readI2cBlock(Util.splitAddress(offset), length, target)
	}

	/**
	 * @param {number} offset
	 * @param {I2CBufferSource} buffer
	 */
	async write(offset, buffer) {
		return this.#bus.writeI2cBlock(Util.splitAddress(offset), buffer)
	}
}

/**
 * Util class
 */
export class Util {
	/**
	 * @returns {[ number, number ]}
	 */
	static splitAddress(address) { return [(address >> 8) & 0x7F, address & 0xFF] }

	static sizeForDensity(density) {
		switch (density) {
			case DENSITY_4K: return 4 * 1024 / 8; break
			case DENSITY_64K: return 64 * 1024 / 8; break
			case DENSITY_256K: return 256 * 1024 / 8; break
			case DENSITY_512K: return 512 * 1024 / 8; break
			case DENSITY_1M: return 1 * 1024 * 1024 / 8; break
			default: throw Error('i am your density: ' + density); break
		}
	}

	static stringForDensity(density) {
		switch (density) {
			case DENSITY_4K: return '4K'; break
			case DENSITY_64K: return '64K'; break
			case DENSITY_256K: return '256K'; break
			case DENSITY_512K: return '512K'; break
			case DENSITY_1M: return '1M'; break
			default: throw Error('i am your density: ' + density); break
		}
	}

	static stringForFeatures(features) {
		switch (features) {
			case 16: return 'V'; break
			case 88: return 'T'; break // or TA, who knows
			default: throw Error('unknown feature set ' + features); break
		}
	}

	static stringForBus(bus) {
		switch (bus.toLowerCase()) {
			case 'i2c': return 'RC'; break
			case 'spi': return 'RS'; break // or RQ
			case 'parallel': return 'R'; break
			default: throw Error('unknown bus type'); break
		}
	}
}
