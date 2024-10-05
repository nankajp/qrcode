/**
 * Onload.
 */
window.onload = function() {

    // ImageFile-Change Event
    document.getElementById('file').addEventListener("change", function(e){
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function(){
            convertQRtoText(reader.result);
        }
    }, false);

    // Image-Paste Event
    document.addEventListener('paste', (event) => {
        var items = event.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            var item = items[i];

            if (item.type.startsWith('image/')) {
                var reader = new FileReader();
                reader.readAsDataURL(item.getAsFile());
                reader.onload = function(){
                    convertQRtoText(reader.result);
                };
            }
        }
    });

    // URL-Copy Event
    document.getElementById('copyButton').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById("outputText").innerText);
    });
};

/**
 * convert QRImage(DataURL) to Text.
 * 
 * @param  imageDataURL
 */
function convertQRtoText(imageDataURL){
    var img = new Image();
    img.src = imageDataURL;
    img.onload = function() {
        var canvas = document.getElementById('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var canvasContext = canvas.getContext('2d', { willReadFrequently: true });
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(img, 0, 0);  // for call getImageData()...

        var imageData = canvasContext.getImageData(0, 0, img.width, img.height);

        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert", // see jsQR documentaion...
        });

        document.getElementById("outputText").innerText = code.data;
    }
}