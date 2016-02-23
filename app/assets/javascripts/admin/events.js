//= require dropzone/dropzone.js
//= require cropper/cropper.min.js
//= require datapicker/bootstrap-datepicker.js
//= require chosen/chosen.jquery.js
//= require clockpicker/clockpicker.js
//= require daterangepicker/daterangepicker.js

$( document ).ready(function() {
 
	$( "form#new_event_form" ).validate({
	  rules: {
	    'event[event_date]': {
	      date: true
	    },
	    'end_date': {
	      date: true
	    }
	  }
	});
	
	// Add events - calendar
	$('#data_1 .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });
    $('.clockpicker').clockpicker();
    
	$('#data_5 .input-daterange').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });
});  

 
