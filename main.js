document.addEventListener('DOMContentLoaded', function(){
	enforceDesktopRequirement();
	ensureImagesLoaded();
	if (!deviceCompatible){
		return;
	}
	var form = document.getElementById('prolific-form');
	if (!form){
		return;
	}
	setEnglishValidationMessages(form);
	var splashError = document.getElementById('splash-error');
	form.onsubmit = async function(e) {
		e.preventDefault();
		enforceDesktopRequirement();
		if (!deviceCompatible){
			return;
		}
		if (splashError){
			splashError.textContent = '';
			splashError.style.display = 'none';
		}
		pid = document.getElementById('prolific-id-input').value.trim();
		if (!pid){
			if (splashError){
				splashError.textContent = 'Please enter your participant ID to continue.';
				splashError.style.display = 'block';
			}
			return;
		}
		document.getElementById('splash').style.display = 'none';

		// Go to demographics & pre-questions
		try {
			await showPreSurvey();
		} catch (err){
			console.error('Failed to start pre-survey:', err);
			if (splashError){
				splashError.textContent = 'Something went wrong while loading the next page. Please refresh and try again.';
				splashError.style.display = 'block';
			}
			document.getElementById('splash').style.display = '';
		}
	};
});
