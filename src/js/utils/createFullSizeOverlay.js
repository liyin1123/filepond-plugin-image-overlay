import { getImageSize } from './getImageSize';

/**
 * Register the full size overlay so that it will be instantiated upon clicking the image preview wrapper
 */
export const registerFullSizeOverlay = (item, el) => {
    const info = el.querySelector('.filepond--file-info-main'),
          magnifyIcon = getMagnifyIcon();

    info.prepend(magnifyIcon);
    magnifyIcon.addEventListener("click", () => createFullSizeOverlay(item));

    // in case the image preview plugin is loaded, make the preview clickable as well.
    // we don't have a hook to determine whether that plugin is loaded, as listening to FilePond:pluginloaded doesn't work
    window.setTimeout(() => {
        const imagePreview = el.querySelector('.filepond--image-preview');
        if (imagePreview) {
            imagePreview.classList.add('clickable');
            imagePreview.addEventListener("click", () => createFullSizeOverlay(item));
        }
    },1000);
}

export const getMagnifyIcon = () => {
    let icon = document.createElement('span');
    icon.className = 'filepond--magnify-icon';
    return icon;
}

/**
 * Generate the full size overlay and present the image in it.
 */
export const createFullSizeOverlay = (item) => {
    const overlay = document.createElement('div');
    overlay.className = 'filepond--fullsize-overlay';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    imgContainer.style.backgroundImage = 'url(' + URL.createObjectURL(item.file) + ')';

    determineImageOverlaySize(item, imgContainer);

    let body = document.getElementsByTagName("body")[0];

    overlay.appendChild(imgContainer);
    body.appendChild(overlay);

    overlay.addEventListener("click",() => overlay.remove());
}

/**
 * Determines whether the image is larger than the viewport.
 * If so, set the backgroundSize to 'contain' to scale down the image so it fits the overlay.
 */
export const determineImageOverlaySize = (item, imgContainer) => {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
          h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
          fileURL = URL.createObjectURL(item.file);

    getImageSize(fileURL, (width, height) => {
        if (width > w || height > h) {
            imgContainer.style.backgroundSize = 'contain';
        }
    });
}