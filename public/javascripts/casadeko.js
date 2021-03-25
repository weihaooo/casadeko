$(function() {
    /*---------------------------------
     * Fixed Menu
     *---------------------------------*/
    function menuScroll() {
        if ($(window).scrollTop() > 50) {
            $('.nav-menu').addClass('is-scrolling');
            $('#backToTopBtn').css('display','block');
        } else {
            $('.nav-menu').removeClass("is-scrolling");
            $("#backToTopBtn").css('display','none');
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    
    $("#backToTopBtn").on('click', function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

    menuScroll();
    $(window).on('scroll', function() {
        menuScroll();
    });
    
    /*---------------------------------
     * Nav Mobile Collapsible
     *---------------------------------*/

    $('.navbar-nav > li:not(.dropdown) > a').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });

    /* 
     * Navbar Toggle Mobile
     *-----------------*/
    var siteNav = $('#navbar');
    siteNav.on('show.bs.collapse', function(e) {
        $(this).parents('.nav-menu').addClass('menu-is-open');
    })
    siteNav.on('hide.bs.collapse', function(e) {
        $(this).parents('.nav-menu').removeClass('menu-is-open');
    })

    /*---------------------------------
     * ONE PAGE SCROLLING
     *---------------------------------*/
    // Select all links with hashes
    $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').not('[data-toggle="tab"]').on('click', function(event) {
        // On-page links
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });
    var slot1 = $("#1");
    var slot2 = $("#2");
    var slot3 = $("#3");
    var slot4 = $("#4");
    var slot5 = $("#5");
    var slot6 = $("#6");
    var slot7 = $("#7");
    
    $("#date").change(function() {
        var date = $("#date").val();
        $.ajax({ 
        url: '/changedate',
        data: { date : date },
        type: 'post',
        success: function(data)
        {
            var available = data.slot;
            
                 if(available[0] == 0){
                     slot1.parent('label').addClass('disabled');
                 } else{
                     slot1.parent('label').removeClass('disabled');
                 }
                 
                 if(available[1] == 0){
                     slot2.parent('label').addClass('disabled');
                 }else{
                     slot2.parent('label').removeClass('disabled');
                 }
                 
                 if(available[2] == 0){
                     slot3.parent('label').addClass('disabled');
                 }else{
                     slot3.parent('label').removeClass('disabled');
                 }
                 
                 if(available[3] == 0){
                     slot4.parent('label').addClass('disabled');
                 }else{
                     slot4.parent('label').removeClass('disabled');
                 }
                 
                 if(available[4] == 0){
                     slot5.parent('label').addClass('disabled');
                 }else{
                     slot5.parent('label').removeClass('disabled');
                 }
                 
                 if(available[5] == 0){
                     slot6.parent('label').addClass('disabled');
                 }else{
                     slot6.parent('label').removeClass('disabled');
                 }
                 if(available[6] == 0){
                     slot7.parent('label').addClass('disabled');
                 }else{
                     slot7.parent('label').removeClass('disabled');
                 }
            
            
        }, error: function(err){
            alert(JSON.stringify(err));
        }
    });
   });
   
    if(slot1.attr('disabled')){
        slot1.parent('label').addClass('disabled');
    }
    if(slot2.attr('disabled')){
        slot2.parent('label').addClass('disabled');
    }
    if(slot3.attr('disabled')){
        slot3.parent('label').addClass('disabled');
    }
    if(slot4.attr('disabled')){
        slot4.parent('label').addClass('disabled');
    }
    if(slot5.attr('disabled')){
        slot5.parent('label').addClass('disabled');
    }
    if(slot6.attr('disabled')){
        slot6.parent('label').addClass('disabled');
    }
    if(slot7.attr('disabled')){
        slot7.parent('label').addClass('disabled');
    }

}); /* End */