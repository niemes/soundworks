export function getOpt(opt, def, min = -Infinity, max = Infinity) {
  var val = opt;

  if (val === undefined)
    val = opt;

  return Math.max(min, Math.min(max, val));
};
