// Create theCard which represents user's or topic's "public" info.
export function theCard(fn, imageUrl, imageMimeType) {
  let card = null;
  fn = fn && fn.trim();

  if (fn) {
    card = {
      fn: fn
    };
  }

  if (imageUrl) {
    card = card || {};
    card.photo = {data: imageUrl, type: imageMimeType};
  }

  return card;
}