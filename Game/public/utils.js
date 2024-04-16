function centerX(size) {
    return (surface.cv.width - size) / 2;
}

function centerY(size) {
    return (surface.cv.height - size) / 2;
}

function center(width, height) {
    return {
        x: centerX(width),
        y: centerY(height),
    }
}