document.addEventListener('DOMContentLoaded', () => {
    
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');

    const camView = document.getElementById('cam-view');
    const snapView = document.getElementById('snap-view');
    const resultView = document.getElementById('result-view');
    
    const snappedPhoto = document.getElementById('snapped-photo');
    const snappedContainer = document.getElementById('snapped-container');
    const processedImage = document.getElementById('processed-image');

    const step1Controls = document.getElementById('controls-step-1');
    const snapBtn = document.getElementById('snap-btn');
    
    const step2Controls = document.getElementById('controls-step-2');
    const customPrompt = document.getElementById('custom-prompt');
    const funPromptBtns = document.querySelectorAll('.fun-prompt-btn');
    const submitBtn = document.getElementById('submit-btn');
    const backStep1Btn = document.getElementById('back-step1-btn');

    const loadingState = document.getElementById('loading-state');
    const step3Controls = document.getElementById('controls-step-3');
    const resultDescription = document.getElementById('result-description');
    const errorMessage = document.getElementById('error-message');
    const resetBtn = document.getElementById('reset-btn');
    const printBtn = document.getElementById('print-btn');
    const qrcodeContainer = document.getElementById('qrcode');

    let capturedImageDataUrl = null;
    let qrCodeInstance = null; 

    let currentStream = null;
    const cameraSelect = document.getElementById('cameraSelect');

    // --- Webcam Initialization ---
    async function startWebcam() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        const deviceId = cameraSelect ? cameraSelect.value : null;
        const videoConstraints = deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'user' };

        try {
            currentStream = await navigator.mediaDevices.getUserMedia({ 
                video: videoConstraints,
                audio: false 
            });
            video.srcObject = currentStream;
            video.play();
        } catch (err) {
            console.error("Error accessing webcam: ", err);
            alert("Could not access your webcam. Please enable it in your browser settings.");
        }
    }

    async function getCameras() {
        if (!cameraSelect) return;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            cameraSelect.innerHTML = ''; 
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Error getting camera list: ", err);
        }
    }
    
    // --- UI Routing Logic ---
    function hideAllSteps() {
        step1Controls.style.display = 'none';
        step2Controls.style.display = 'none';
        step3Controls.style.display = 'none';
        loadingState.style.display = 'none';
        errorMessage.style.display = 'none';
    }

    function updateImageDisplayAtStep(step) {
        camView.style.display = 'none';
        snapView.style.display = 'none';
        resultView.style.display = 'none';
        snappedContainer.style.display = 'none';

        if (step === 1) {
            camView.style.display = 'flex';
        } else if (step === 2) {
            snapView.style.display = 'flex'; 
            if (capturedImageDataUrl) {
                snappedPhoto.src = capturedImageDataUrl;
                snappedContainer.style.display = 'flex'; 
                snappedContainer.style.flexDirection = 'column';
                snappedContainer.style.justifyContent = 'center';
            }
        } else if (step === 3) {
            resultView.style.display = 'flex';
        }
    }

    function goToStep1() {
        hideAllSteps();
        step1Controls.style.display = 'block';
        updateImageDisplayAtStep(1);
    }

    function goToStep2() {
        if (!capturedImageDataUrl) {
            alert("Please snap a photo first.");
            goToStep1();
            return;
        }
        hideAllSteps();
        step2Controls.style.display = 'block';
        updateImageDisplayAtStep(2);
    }

    function showLoadingState() {
        hideAllSteps();
        loadingState.style.display = 'block';
        updateImageDisplayAtStep(0); 
    }

    function showResult() {
        hideAllSteps();
        step3Controls.style.display = 'block';
        updateImageDisplayAtStep(3);
    }

    // --- Event Listeners ---
    snapBtn.addEventListener('click', () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            capturedImageDataUrl = canvas.toDataURL('image/jpeg');
            goToStep2(); // Jumps directly to prompt selection!
        } else {
            setTimeout(() => {
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                capturedImageDataUrl = canvas.toDataURL('image/jpeg');
                goToStep2();
            }, 100);
        }
    });

    backStep1Btn.addEventListener('click', () => {
        capturedImageDataUrl = null;
        goToStep1();
    });

    funPromptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            customPrompt.value = btn.getAttribute('data-prompt');
        });
    });

    submitBtn.addEventListener('click', async () => {
        const userPrompt = customPrompt.value;
        if (!userPrompt) { alert('Please provide a prompt!'); return; }
        if (!capturedImageDataUrl) { alert('Missing camera image!'); return; }

        showLoadingState();

        try {
            const response = await fetch('/api/process_image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    captured_image: capturedImageDataUrl,
                    uploaded_image: null, // Nullified to bypass the backend's double-image requirement
                    prompt: userPrompt,
                }),
            });

            if (!response.ok) {

                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errData = await response.json();
                    if (errData.error) errorMsg = errData.error;
                } catch (e) {
                    console.error("Could not parse error JSON");
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            processedImage.src = data.processed_image;
            resultDescription.textContent = data.description;

            const mobileViewUrl = new URL('/mobile', window.location.origin).href;
            qrcodeContainer.innerHTML = ''; 
            if (qrCodeInstance) { qrCodeInstance.clear(); qrCodeInstance = null; }
            
            qrCodeInstance = new QRCode(qrcodeContainer, {
                text: mobileViewUrl,
                width: 128,
                height: 128,
                correctLevel : QRCode.CorrectLevel.H
            });

            showResult(); // Properly route to the final screen!

        } catch (error) {
            console.error('Error:', error);
            goToStep2(); // Reset the UI FIRST
            errorMessage.textContent = `Error: ${error.message} (Check Cloud Run logs for details)`;
            errorMessage.style.display = 'block'; // Show the error SECOND!
        }
    });

    resetBtn.addEventListener('click', () => {
        customPrompt.value = '';
        snappedPhoto.src = '';
        processedImage.src = '';
        capturedImageDataUrl = null;
        if (qrCodeInstance) { qrCodeInstance.clear(); qrCodeInstance = null; }
        qrcodeContainer.innerHTML = '';
        goToStep1();
    });

    printBtn.addEventListener('click', () => {
        const imageToPrint = document.getElementById('processed-image');
        if (!imageToPrint || !imageToPrint.src) return;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Print</title><style>@media print{body{margin:0}img{width:100%;height:auto}}</style></head><body><img src="${imageToPrint.src}"></body></html>`);
        printWindow.document.close();
        printWindow.setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    });

    startWebcam().then(() => {
        getCameras();
        if (cameraSelect) {
            cameraSelect.addEventListener('change', startWebcam);
        }
    });
    goToStep1();
});
