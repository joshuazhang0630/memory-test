document.addEventListener('DOMContentLoaded', function(){
	enforceDesktopRequirement();
	ensureImagesLoaded();
	if (!deviceCompatible){
		return;
	}
	showPreSurvey().catch(function(err){
		console.error('Failed to start pre-survey:', err);
	});
});
