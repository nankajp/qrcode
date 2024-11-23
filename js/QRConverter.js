/**
 * Onload.
 */
window.onload = function() {

    // QRCode Generator ---------------------------------------------------------------
    // QR-GenerateButton Event
    document.getElementById('generateQRButton').addEventListener('click', () => {
        document.getElementById("qrcode").innerHTML = "";

        var qrcode = new QRCode("qrcode");       
        qrcode.makeCode(document.getElementById("inputText").value);
    });

    // clearInputTextButton Event
    document.getElementById('clearInputTextButton').addEventListener('click', () => {
        document.getElementById("inputText").value = "";
    });

    // QRCode Reader ------------------------------------------------------------------
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

    // URL-CopyButton Event
    document.getElementById('copyButton').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById("outputText").value);
    });

    // --------------------------------------------------------------------------------
    // set default CANVAS.
    var canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '70px bold Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Here !!', 30, 100);
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

        document.getElementById("outputText").value = code.data;
    }
}
