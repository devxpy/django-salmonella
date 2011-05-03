function popup_wrapper(triggerLink, app_name, model_name){
    var name = triggerLink.id.replace(/^lookup_/, ''),
        windowName = id_to_windowname(name);

    // Actual Django javascript function
    showRelatedObjectLookupPopup(triggerLink);

    // Sets focus on input field so event is 
    // fired correctly.
    try {
        document.getElementById(windowName).focus();
    } catch (e) {
        document.getElementById(name).focus();
    }
    
    return false;
}

(function($) {
    $(document).ready(function($) {
        function update_salmonella_label(element, url){
            var name = element.next("a").attr("data-name");
            var value = element.val();
            var admin_url_parts = window.location.pathname.split("/").slice(1, 4)
            var url = "/" + admin_url_parts[0] + "/" + admin_url_parts[1] + "/" + admin_url_parts[2] + url;
            
            // Handles elements added via the TabularInline add row functionality
            if (name.search(/__prefix__/) != -1){
                name = element.attr("id").replace("id_", "");
                console.log(name);
            }
            
            $.ajax({
                url: url,
                data: {"id": value},
                success: function(data){
                    $("#" + name + "_salmonella_label").html(" " + data);
                }
            });
        }

        // A big of a workaround.  The goal here was to use
        // 'change' but 'showRelatedObjectLookupPopup' above
        // doesn't set the value in a way that 'change'
        // is triggered so using blur instead.
        $(".vForeignKeyRawIdAdminField").blur(function(e){
            $this = $(this);
            var app = $this.next("a").attr("data-app");
            var model = $this.next("a").attr("data-model");
            var url = "/salmonella/" + app + "/" + model + "/";
            
            update_salmonella_label($this, url);
        });

        // Handle ManyToManyRawIdAdminFields.
        $(".vManyToManyRawIdAdminField").blur(function(e){
            $this = $(this);
            var app = $this.next("a").attr("data-app");
            var model = $this.next("a").attr("data-model");
            var url = "/salmonella/" + app + "/" + model + "/multiple/";
            
            update_salmonella_label($this, url);
        });
    });
})(django.jQuery);