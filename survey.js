async function showPreSurvey(){
    try {
        await requireImagesReady();
    } catch (e){
        console.error(e);
        var errorView = `
            <section class="card">
                <h1 class="section-title">Unable to load images</h1>
                <p class="lead-text">The image manifest could not be loaded. Please check your network connection and refresh the page.</p>
            </section>
        `;
        document.body.innerHTML = renderShell(errorView);
        return;
    }
    var content = `
        <section class="card compact-card">
            <div id="demographics" class="slide" style="display: block;">
                <form id="pre-survey-form" name="demographics" autocomplete="off">
                    <div id="header-container">
                        <span id="form-header" class="spaced-right">Please tell us a bit about yourself.</span>
                        <span id="why-form">Why?</span>
                        <div id="required-message" style="color: #0099CC">Fields marked with a * are required.</div>
                    </div>
                    <div class="form-element" id="pcid-container">
                        <span class="prompt-text spaced-right "><span style="color: #0099CC">*</span> Please provide your participant ID:</span>
                        <input type="text" id="pcid" name="participant_id" required>
                    </div>
                    <div class="form-element" id="retake-container">
                        <span class="prompt-text" style="color: #0099CC">* </span>
                        <span class="prompt-text spaced-right ">Have you taken this test before?</span>
                        <select id="retake" name="retake" required>
                            <option value=""></option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                    <div class="form-element" id="gender-container">
                        <span class="prompt-text" style="color: #0099CC">* </span>
                        <span class="prompt-text spaced-right ">What is your gender?</span>
                        <input type="checkbox" name="gender" id="gender0" value="man">
                        <label class="multiselect-label" for="gender0">Man</label>
                        <input type="checkbox" name="gender" id="gender1" value="woman">
                        <label class="multiselect-label" for="gender1">Woman</label>
                        <input type="checkbox" name="gender" id="gender2" value="nonbinary">
                        <label class="multiselect-label" for="gender2">Non-binary</label>
                        <input type="checkbox" name="gender" id="gender3" value="--">
                        <label class="multiselect-label" for="gender3">Prefer not to disclose</label>
                        <input type="checkbox" name="gender" id="gender4" value="other">
                        <label class="multiselect-label" for="gender4">Prefer to self-describe</label>
                        <input type="text" id="gendertext" name="gendertext" disabled="disabled">
                        <div id="gender-error" class="small-note" style="color: var(--error); display: none;">
                            Please select at least one option.
                        </div>
                    </div>
                    <div class="form-element" id="age_category-container">
                        <span class="prompt-text" style="color: #0099CC">* </span>
                        <span class="prompt-text spaced-right ">How old are you?</span>
                        <select id="age_category" name="age_category" required>
                            <option value=""></option>
                            <option value="18-25">18-25</option>
                            <option value="26-35">26-35</option>
                            <option value="36-45">36-45</option>
                            <option value="46-55">46-55</option>
                            <option value="Over 55">Over 55</option>
                        </select>
                    </div>
                    <div class="form-element" id="education-container">
                        <span class="prompt-text" style="color: #0099CC">* </span>
                        <span class="prompt-text spaced-right ">What is the highest level of education you have received?</span>
                        <select id="education" name="education" required>
                            <option value=""></option>
                            <option value="Some high-school">Some high-school</option>
                            <option value="College">College</option>
                            <option value="Graduate school">Graduate school</option>
                            <option value="Professional school">Professional school</option>
                            <option value="PhD">PhD</option>
                        </select>
                    </div>
                    <div class="form-element" id="textExperience-container">
                        <span class="prompt-text spaced-right "><span style="color: #0099CC">*</span> Describe the most complex visualization you have ever seen. What it looks like? Having a link to the image will be helpful but this is not absolutely necessary.</span>
                        <textarea id="textExperience" name="textExperience" required></textarea>
                    </div>
                    <div class="action-row">
                        <button type="submit" class="primary-button">Continue to Instructions</button>
                    </div>
                </form>
            </div>
        </section>
    `;
    document.body.innerHTML = renderShell(content);

    var genderSelfToggle = document.getElementById("gender4");
    var genderSelfInput = document.getElementById("gendertext");
    var genderError = document.getElementById("gender-error");
    if (genderSelfToggle && genderSelfInput){
        genderSelfToggle.addEventListener("change", function(){
            genderSelfInput.disabled = !genderSelfToggle.checked;
            if (!genderSelfToggle.checked){
                genderSelfInput.value = "";
            } else {
                genderSelfInput.focus();
            }
        });
    }

    var genderInputs = Array.from(document.querySelectorAll("input[name='gender']"));
    var genderFirstInput = document.getElementById("gender0");
    function updateGenderValidity(){
        var anyChecked = genderInputs.some(function(el){ return el.checked; });
        if (genderFirstInput){
            genderFirstInput.setCustomValidity(anyChecked ? "" : "Please complete this required field.");
        }
        if (genderError){
            genderError.style.display = anyChecked ? "none" : "block";
        }
    }
    genderInputs.forEach(function(input){
        input.addEventListener("change", updateGenderValidity);
    });
    updateGenderValidity();

    var preForm = document.getElementById("pre-survey-form");
    if (preForm){
        setEnglishValidationMessages(preForm);
        preForm.onsubmit = function(e){
            e.preventDefault();
            var genderSelections = Array.from(document.querySelectorAll("input[name='gender']:checked")).map(function(el){
                return el.value;
            });
            if (genderSelections.length === 0){
                updateGenderValidity();
                if (genderFirstInput){
                    genderFirstInput.focus();
                    genderFirstInput.reportValidity();
                }
                var genderContainer = document.getElementById("gender-container");
                if (genderContainer){
                    genderContainer.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }
            updateGenderValidity();
            if (!preForm.reportValidity()){
                return;
            }
            pid = (document.getElementById("pcid").value || "").trim();
            preSurveyResponses.workerId = pid;
            preSurveyResponses.takenBefore = document.getElementById("retake").value;
            preSurveyResponses.gender = genderSelections.join("|");
            preSurveyResponses.genderSelf = (document.getElementById("gendertext").value || "").trim();
            preSurveyResponses.age = document.getElementById("age_category").value;
            preSurveyResponses.education = document.getElementById("education").value;
            preSurveyResponses.complexVizDesc = (document.getElementById("textExperience").value || "").trim();
            preSurveyResponses.complexVizLink = "";
            preSurveyResponses.complexityChoice = "";
            preSurveyResponses.complexityImageA = "";
            preSurveyResponses.complexityImageB = "";

            buildPretrainSequence();
            showInstructions();
        };
    }
}

// Show instruction page

function sendToSheets() {
	const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = {
		prolific_id: pid,
		imseq: imgstring,
        imtypeseq: imtypestring,
        perfseq: perfstring,
        ending: document.getElementById("endingout").value,
        vigilancefails: vigilancefails,
        falsealarmcounts: falsealarmcounts,
        pre_worker_id: preSurveyResponses.workerId,
        pre_taken_before: preSurveyResponses.takenBefore,
        pre_gender: preSurveyResponses.gender,
        pre_gender_self: preSurveyResponses.genderSelf,
        pre_age: preSurveyResponses.age,
        pre_education: preSurveyResponses.education,
        pre_complex_viz_desc: preSurveyResponses.complexVizDesc,
        pre_complex_viz_link: preSurveyResponses.complexVizLink,
        pre_complexity_choice: preSurveyResponses.complexityChoice,
        pre_complexity_image_a: preSurveyResponses.complexityImageA,
        pre_complexity_image_b: preSurveyResponses.complexityImageB,
        post_remembered_image: postSurveyResponses.rememberedImage,
        post_remember_features_a: postSurveyResponses.rememberFeaturesA,
        post_remember_features_b: postSurveyResponses.rememberFeaturesB,
        post_study_comments: postSurveyResponses.studyComments
	};
	const appsURL = "https://script.google.com/macros/s/AKfycbwoVnAqV03kDx44YfwHrLuLtKyzOiyi4W51VmL-rfzitaE8nvCxek0D1CGKb96F60iz2g/exec";
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    data.vigilancefails = vigilancefails;
    data.falsealarmcounts = falsealarmcounts;

    console.log("data", data);

    fetch(appsURL, {
        method: "POST",
		mode: "no-cors",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(() => {
        console.log("Data sent to Google Sheets!");
    }).catch(err => console.error("Error:", err));
}

