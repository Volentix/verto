import { asset } from 'eos-common'

export function computeForward (x, y, z, fee) {
  // const tmp = x.multiply(-1).multiply(z).divide(y.plus(x))
  // return tmp.plus(tmp.multiply(-1).multiply(fee).plus(9999).divide(10000)).abs()

  const prod = x.multiply(y)
  let tmp, tmp_fee

  if (x > 0) {
    tmp = prod.minus(1).divide(z).plus(1)
    tmp_fee = tmp.multiply(fee).plus(9999).divide(10000)
  } else {
    tmp = prod.divide(z)
    tmp_fee = tmp.multiply(-1).multiply(fee).plus(9999).divide(10000)
  }

  return tmp.plus(tmp_fee)
}

export function computeBackward (x, y, z, fee) {
  const fee_amount = x.multiply(fee).plus(9999).divide(10000)
  x = x.minus(fee_amount)
  x = x.multiply(y).divide(z)

  return x
}

export function calcPrice (a, b) {
  const diff_precision = a.symbol.precision() - b.symbol.precision()

  return (a.amount / b.amount) / (10 ** diff_precision)
}

export function preparePool (pool) {
  pool.pool1.quantity = asset(pool.pool1.quantity)
  pool.pool2.quantity = asset(pool.pool2.quantity)
  pool.supply = asset(pool.supply)

  return pool
}
