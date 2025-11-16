
document.addEventListener('DOMContentLoaded', () => {
    
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const fileInput = document.getElementById('file-input');

    const camView = document.getElementById('cam-view');
    const snapView = document.getElementById('snap-view');
    const resultView = document.getElementById('result-view');
    
    const snappedPhoto = document.getElementById('snapped-photo');
    const snappedContainer = document.getElementById('snapped-container');
    const uploadedPhoto = document.getElementById('uploaded-photo');
    const uploadedContainer = document.getElementById('uploaded-container');
    const processedImage = document.getElementById('processed-image');

    const step1Controls = document.getElementById('controls-step-1');
    const snapBtn = document.getElementById('snap-btn');
    
    const step2Controls = document.getElementById('controls-step-2');
    const uploadBtn = document.getElementById('upload-btn');
    const nextStep3Btn = document.getElementById('next-step3-btn');
    const backStep1Btn = document.getElementById('back-step1-btn');
    
    const step3Controls = document.getElementById('controls-step-3');
    const customPrompt = document.getElementById('custom-prompt');
    const funPromptBtns = document.querySelectorAll('.fun-prompt-btn');
    const submitBtn = document.getElementById('submit-btn');
    const backStep2Btn = document.getElementById('back-step2-btn');

    const loadingState = document.getElementById('loading-state');
    const step4Controls = document.getElementById('controls-step-4');
    const resultDescription = document.getElementById('result-description');
    const errorMessage = document.getElementById('error-message');
    const resetBtn = document.getElementById('reset-btn');
    const printBtn = document.getElementById('print-btn');
    const qrcodeContainer = document.getElementById('qrcode');

    let capturedImageDataUrl = null;
    let uploadedImageDataUrl = null;
    let qrCodeInstance = null; 

    // --- Initialization ---
    async function startWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' },
                audio: false 
            });
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error("Error accessing webcam: ", err);
            alert("Could not access your webcam. Please enable it in your browser settings.");
        }
    }

    
    function hideAllSteps() {
        step1Controls.style.display = 'none';
        step2Controls.style.display = 'none';
        step3Controls.style.display = 'none';
        step4Controls.style.display = 'none';
        loadingState.style.display = 'none';
        errorMessage.style.display = 'none';
    }

    function updateImageDisplayAtStep(step) {
        // Hide all main views initially
        camView.style.display = 'none';
        snapView.style.display = 'none';
        resultView.style.display = 'none';

        snappedContainer.style.display = 'none';
        uploadedContainer.style.display = 'none';

        if (step === 1) {
            camView.style.display = 'flex';
            
        } else if (step === 2 || step === 3) {
            snapView.style.display = 'flex'; 

            if (capturedImageDataUrl) {
                snappedPhoto.src = capturedImageDataUrl;
                snappedContainer.style.display = 'flex'; 
                snappedContainer.style.flexDirection = 'column';
                snappedContainer.style.justifyContent = 'center';
            }

            if (uploadedImageDataUrl) {
                uploadedPhoto.src = uploadedImageDataUrl;
                uploadedPhoto.style.display = 'block';
                uploadedContainer.style.display = 'flex';
                uploadedContainer.style.flexDirection = 'column';
                uploadedContainer.style.justifyContent = 'center';
            } else if (step === 2) {
                uploadedContainer.style.display = 'flex';
                uploadedContainer.style.flexDirection = 'column';
                uploadedContainer.style.justifyContent = 'center';
                uploadedPhoto.style.display = 'none'; 
            }

        } else if (step === 4) {
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

    function goToStep3() {
        if (!uploadedImageDataUrl) {
            alert("Please upload an image first.");
            return;
        }
        hideAllSteps();
        step3Controls.style.display = 'block';
        updateImageDisplayAtStep(3);
    }

    function showLoadingState() {
        hideAllSteps();
        loadingState.style.display = 'block';
        updateImageDisplayAtStep(0); 
    }

    function showResult() {
        hideAllSteps();
        step4Controls.style.display = 'block';
        updateImageDisplayAtStep(4);
    }



    snapBtn.addEventListener('click', () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            capturedImageDataUrl = canvas.toDataURL('image/jpeg');
            goToStep2();
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

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImageDataUrl = event.target.result;
                updateImageDisplayAtStep(2);
            };
            reader.readAsDataURL(file);
        }
        fileInput.value = '';
    });

    nextStep3Btn.addEventListener('click', goToStep3);
    backStep1Btn.addEventListener('click', () => {
        capturedImageDataUrl = null;
        goToStep1();
    });

    funPromptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            customPrompt.value = btn.getAttribute('data-prompt');
        });
    });

    backStep2Btn.addEventListener('click', goToStep2);

    submitBtn.addEventListener('click', async () => {
        const userPrompt = customPrompt.value;
        if (!userPrompt) { alert('Please provide a prompt!'); return; }
        if (!capturedImageDataUrl || !uploadedImageDataUrl) { alert('Missing images!'); return; }

        showLoadingState();

        try {
            const response = await fetch('/api/process_image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    captured_image: capturedImageDataUrl,
                    uploaded_image: uploadedImageDataUrl,
                    prompt: userPrompt,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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

            showResult();

        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.display = 'block';
            goToStep3(); 
        }
    });

    resetBtn.addEventListener('click', () => {
        customPrompt.value = '';
        snappedPhoto.src = '';
        uploadedPhoto.src = '';
        processedImage.src = '';
        capturedImageDataUrl = null;
        uploadedImageDataUrl = null;
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

    startWebcam();
    goToStep1();
});