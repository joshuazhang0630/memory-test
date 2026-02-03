function renderShell(content) {
    return `
        <main class="main-shell">
            ${content}
        </main>
    `;
}

function imageLabelFromUrl(url){
    if (!url){
        return "Image";
    }
    var filename = url.substring(url.lastIndexOf("/") + 1);
    return filename.split(".")[0];
}

function pickRandomImagePair(){
    var pool = (allImagesCatalog && allImagesCatalog.length ? allImagesCatalog : sessionImagesCatalog).slice();
    shuffleArray(pool);
    return pool.slice(0, 2);
}

function sampleImagesForPost(count){
    var pool = (sessionImagesCatalog && sessionImagesCatalog.length ? sessionImagesCatalog : (images && images.length ? images : allImagesCatalog)).slice();
    shuffleArray(pool);
    return pool.slice(0, Math.min(count, pool.length));
}

function renderImageChoice(url, groupName, value){
    var label = imageLabelFromUrl(url);
    return `
        <label class="image-choice">
            <input type="radio" name="${groupName}" value="${value}" required>
            <div><strong>${label}</strong></div>
            <img src="${url}" alt="${label}">
        </label>
    `;
}

function setEnglishValidationMessages(form){
    if (!form){
        return;
    }
    var message = "Please complete this required field.";
    var requiredFields = Array.from(form.querySelectorAll("[required]"));

    function syncMessage(target){
        if (!target || !target.validity){
            return;
        }
        if (target.type === "radio" && target.name){
            var safeName = target.name.replace(/"/g, '\\"');
            var group = Array.from(form.querySelectorAll('input[type="radio"][name="' + safeName + '"]'));
            var anyChecked = group.some(function(radio){ return radio.checked; });
            group.forEach(function(radio, index){
                radio.setCustomValidity(anyChecked ? "" : (index === 0 ? message : ""));
            });
            return;
        }
        if (target.validity.valueMissing){
            target.setCustomValidity(message);
        } else {
            target.setCustomValidity("");
        }
    }

    form.addEventListener("invalid", function(event){
        syncMessage(event.target);
    }, true);

    requiredFields.forEach(function(field){
        field.addEventListener("input", function(){
            syncMessage(field);
        });
        field.addEventListener("change", function(){
            syncMessage(field);
        });
        syncMessage(field);
    });
}

function isUnsupportedDevice() {
    var ua = navigator.userAgent || "";
    var mobileRegex = /Mobi|Android|iPhone|iPad|iPod/i;
    return window.innerWidth < 900 || mobileRegex.test(ua);
}

function showDeviceWarning() {
    var warning = `
        <section class="card device-warning">
            <h1 class="section-title">Desktop Device Required</h1>
            <p class="lead-text">
                This study uses keyboard-based responses and must be completed on a laptop or desktop display.
            </p>
            <p class="lead-text">
                Please access the experiment on a larger screen to proceed. Mobile phones and small tablets are not supported.
            </p>
        </section>
    `;
    document.body.innerHTML = renderShell(warning);
}

function enforceDesktopRequirement() {
    if (isUnsupportedDevice()) {
        deviceCompatible = false;
        showDeviceWarning();
    } else {
        deviceCompatible = true;
    }
}

// Load and parse the manifest so we can use fixed datasets per level.
