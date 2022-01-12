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
    let mimeType = imageMimeType;
    // Is this a data URL "data:[<mediatype>][;base64],<data>"?
    const matches = /^data:(image\/[-a-z0-9+.]+)?(;base64)?,/i.exec(imageUrl);
    if (matches) {
      mimeType = matches[1];
      card.photo = {
        data: imageUrl.substring(imageUrl.indexOf(',') + 1)
      };
    } else {
      card.photo = {
        ref: imageUrl
      };
    }
    card.photo.type = (mimeType || 'image/jpeg').substring('image/'.length);
  }

  return card;
}