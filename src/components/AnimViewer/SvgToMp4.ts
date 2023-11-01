
// export function svgToVideo(options: SvgToVideoOptions) {
//     // Define your parameters here.
//     // For example: options could contain drawScene function, height, width, fps, bitrate, etc.

//     // Create a canvas element and get its context.
//     let canvas = document.createElement('canvas');
//     canvas.width = options.width;
//     canvas.height = options.height;
//     let context = canvas.getContext('2d');

//     // Get the SVG content and draw it onto the canvas.
//     let img = new Image();
//     img.src = 'data:image/svg+xml,' + encodeURIComponent(options.drawScene());
//     img.onload = function () {
//         context?.drawImage(img, 0, 0);
//     }

//     // Capture the canvas stream and create a MediaRecorder instance.
//     let stream = (canvas as any).captureStream(options.fps);
//     let recorder = new MediaRecorder(stream);

//     // Start recording.
//     recorder.start();

//     recorder.ondataavailable = function (event: any) {
//         let url = URL.createObjectURL(new Blob([event.data], { type: 'video/mp4' }));

//         // Create a download link and click it.
//         let link = document.createElement('a');
//         link.href = url;
//         link.download = 'animation.mp4';
//         link.click();
//     }

//     // Stop recording after a delay.
//     setTimeout(function () { recorder.stop(); }, options.duration);
// }


// export function cleanSvg(svgString: string): string {
//     // Create a new DOMParser
//     let parser = new DOMParser();

//     // Use the DOMParser to turn the SVG string into a document
//     let doc = parser.parseFromString(svgString, 'image/svg+xml');

//     // Get all elements in the document
//     let elements = doc.querySelectorAll('*');

//     // Loop over each element
//     for (let i = 0; i < elements.length; i++) {
//         let el = elements[i];

//         // Get all attributes of the element
//         let attrs = el.getAttributeNames();

//         // Loop over each attribute
//         for (let j = 0; j < attrs.length; j++) {
//             let attr = attrs[j];

//             // If the attribute starts with "inkscape", "sodipodi", or is "aria-label", remove it
//             if (attr.startsWith('inkscape') || attr.startsWith('sodipodi') || attr === 'aria-label') {
//                 el.removeAttribute(attr);
//             }
//         }

//         // If the element is from the "inkscape" or "sodipodi" namespace, remove it
//         if (el.namespaceURI === 'http://www.inkscape.org/namespaces/inkscape' || el.namespaceURI === 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd') {
//             el.parentNode?.removeChild(el);
//         }
//     }

//     // Remove the unwanted namespaces from the root SVG element
//     let svg = doc.querySelector('svg');
//     svg?.removeAttribute('xmlns:inkscape');
//     svg?.removeAttribute('xmlns:sodipodi');

//     // Return the cleaned SVG as a string
//     return new XMLSerializer().serializeToString(doc);
// }

export type SvgToVideoOptions = {
    width: number;
    height: number;
    fps: number;
    bitrate?: number;
    videoFormat?: string;
    outputContainer?: HTMLElement;
    autoplay?: boolean;
    // drawScene: () => string;
    duration: number;
};