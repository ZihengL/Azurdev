const RES = "./public/res/";
const SPRITESHEETS = RES + "LPC/spritesheets/";

// let canvas = document.getElementById("game_canvas");
// let ctx = canvas.getContext("2d");

export async function getSpriteData(file) {
  return await fetch(`./public/res/${file}.json`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Promise rejected:", error);
    });
}

export async function loadCharacter(layers) {
  const width = 800;
  const height = 600;

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const sortedLayers = layers.sort((a, b) => a.zPos - b.zPos);
    console.log(sortedLayers);

    await Promise.all(
      sortedLayers.map(async (layer) => {
        const image = await loadImage(layer.fileName);

        const aspectRatio = image.naturalWidth / image.naturalHeight;
        const targetHeight = height / aspectRatio;

        ctx.drawImage(image, 0, 0, width, targetHeight);
      })
    );

    return canvas.toDataURL();
  } catch (error) {
    console.error("Error preloading and combining images:", error);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = SPRITESHEETS + src;
  });
}
