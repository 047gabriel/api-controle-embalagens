export function validarId(id) {
  return typeof id === 'string'
    && /^[1-9]\d*$/.test(id)
    && Number.isSafeInteger(Number(id));
}
