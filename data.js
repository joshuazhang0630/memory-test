async function loadManifest() {
    try {
        const res = await fetch(imageManifestUrl);
        if (!res.ok){
            throw new Error("Manifest HTTP " + res.status);
        }
        const manifest = await res.json();
        const files = Array.isArray(manifest.files) ? manifest.files : [];
        const base = manifest.baseUrl || "";
        return { files: files, base: base };
    } catch (err) {
        if (!manifestFallbackUrl){
            throw err;
        }
        console.warn("Remote manifest failed, trying fallback:", manifestFallbackUrl, err);
        const res = await fetch(manifestFallbackUrl);
        if (!res.ok){
            throw new Error("Fallback manifest HTTP " + res.status);
        }
        const manifest = await res.json();
        const files = Array.isArray(manifest.files) ? manifest.files : [];
        const base = manifest.baseUrl || "";
        return { files: files, base: base };
    }
}

function resolveManifestUrl(base, name){
    if (!name){
        return "";
    }
    return name.startsWith("http") ? name : base + name;
}

function parseManifest(manifest){
    var data = {
        pretest: [],
        levels: {}
    };
    var files = manifest.files || [];
    var base = manifest.baseUrl || manifest.base || "";
    files.forEach(function(name){
        if (!name){
            return;
        }
        var url = resolveManifestUrl(base, name);
        var pretestMatch = name.match(/^P\d+/i);
        if (pretestMatch){
            data.pretest.push(url);
            return;
        }
        var levelMatch = name.match(/^L(\d+)_([TFV])\d+/i);
        if (!levelMatch){
            return;
        }
        var level = levelMatch[1];
        var kind = levelMatch[2].toUpperCase();
        if (!data.levels[level]){
            data.levels[level] = { targets: [], fillers: [], vigilance: [] };
        }
        if (kind === "T"){
            data.levels[level].targets.push(url);
        } else if (kind === "F"){
            data.levels[level].fillers.push(url);
        } else if (kind === "V"){
            data.levels[level].vigilance.push(url);
        }
    });
    return data;
}

function ensureImagesLoaded(){
    if (!imageLoadPromise){
        imageLoadPromise = loadManifest().then(function(manifest){
            manifestData = parseManifest(manifest);
            pretestImages = (manifestData.pretest || []).slice();
            availableLevels = Object.keys(manifestData.levels).sort();
            allImagesCatalog = [];
            availableLevels.forEach(function(levelKey){
                var level = manifestData.levels[levelKey];
                if (level){
                    allImagesCatalog = allImagesCatalog.concat(level.targets, level.fillers, level.vigilance);
                }
            });
            console.log("Loaded manifest with", pretestImages.length, "pretest images and", availableLevels.length, "levels.");
            return manifestData;
        }).catch(function(err){
            console.error("Failed to load image manifest", err);
            manifestData = null;
            pretestImages = [];
            availableLevels = [];
            allImagesCatalog = [];
            return null;
        });
    }
    return imageLoadPromise;
}

async function requireImagesReady(){
    await ensureImagesLoaded();
    if (!manifestData || !availableLevels.length){
        throw new Error("No manifest data loaded");
    }
    return manifestData;
}
