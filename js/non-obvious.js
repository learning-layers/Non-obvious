/**
 * "Non-obvious" -- a personal reflection tool 
 * Copyright 2013 Jukka Purma
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ 

var IMAGES = ['images/qring.jpg', 'images/autumn1.jpg', 'images/autumn2.jpg','images/koivuja.jpg', 'images/ruohoja.jpg', 'images/suokoivuja.jpg','images/kaarna.jpg', 'images/grass.jpg', 'images/greyrock.jpg', 'images/juhannus.jpg', 'images/site.jpg', 'images/machinery2.jpg', 'images/boxes.jpg', 'images/drafting.jpg','images/paper.jpg', 'images/whiteboard.jpg']
var PAGE;
var INDENT = 12;
var DEFAULT_IMAGE = 'images/qring.jpg';
var FOCUS_KEY;
var DEFAULT_PALETTE = { bg: 'rgb(127, 109, 107)', text:'#e6e6e5', theme1:'rgb(73, 77, 91)', theme2:'rgb(146, 130, 144)', obvious1:'rgb(157, 156, 160)', obvious2:'rgb(231, 224, 225)', reflection1:'rgb(190, 190, 180)', reflection2:'rgb(85, 92, 94)', ui1:'rgb(60, 69, 72)', ui2:'rgb(199, 170, 161)', default:1};

navigator.getMedia = ( navigator.getUserMedia ||
                     navigator.webkitGetUserMedia ||
                     navigator.mozGetUserMedia ||
                     navigator.msGetUserMedia);
var CAMERA_SUPPORT = navigator.getMedia ? true : false; 
var show_help = true;

// I don't understand how this works.
var create_uid = ( function(){
    var id=1; 
    return function(){
      return id++ ;
    };
  } 
)();

function LocalStorageDataSource() {
    this.pages = [];
    this.current_index = 0;
}

LocalStorageDataSource.prototype = {
    init: function() {
        var p = new ReflectionPage();
        p.init();
        this.pages = [p];
        this.current_index = 0;
        return p;
    },
    load: function(loaded_data) {
        if (!loaded_data) {
            if (localStorage.nonobvious_catalog) {
                loaded_data = $.parseJSON(localStorage.nonobvious_catalog);       
            } else {
                return this.reset_db();
            }            
        } else if (typeof loaded_data == "string") {
            try {
                loaded_data = $.parseJSON(loaded_data);
            } catch(err) {
                console.log(error);
                console.log('Parsing JSON failed, using empty page set instead');
                return this.init();
            }            
        } 
        this.current_index = loaded_data.current_index;
        var ref_page;
        this.pages = [];
        if (!loaded_data.pages) return this.init();
        for (var i=0; i< loaded_data.pages.length; i++) {
            ref_page = new ReflectionPage();
            ref_page.load(loaded_data.pages[i]);
            this.pages.push(ref_page);
        }
        return this.pages[this.current_index];
    },
    save: function() {
        localStorage.nonobvious_catalog = JSON.stringify(this);
    },
    dump: function() {
        //var uri_content = "data:text/plain;charset=UTF-8," + encodeURIComponent(s);
        //new_window = window.open(uri_content, 'new_text');
        return JSON.stringify(this, null, ' ');
    },
    next: function() {
        if (this.current_index+1 < this.pages.length) {
            this.current_index++;
            return this.pages[this.current_index];
        }
    },
    prev: function() {
        if (this.current_index > 0) {
            this.current_index--;
            return this.pages[this.current_index];
        }
    },
    current_page: function() {
        return this.pages[this.current_index];
    },
    is_last_page: function() {
        return (this.current_index == this.pages.length-1)
    },
    is_first_page: function() {
        return (this.current_index == 0)
    },
    add_new: function() {
        var ref_page = new ReflectionPage();
        ref_page.init();
        this.pages.push(ref_page);
        this.current_index = this.pages.length-1;
        return ref_page;
    },
    remove_current_page: function() {
        this.pages.splice(this.current_index,1);
        this.current_index--;
        if (this.current_index < 0) {
            this.current_index = 0;
        }
        if (this.pages.length == 0) {
            this.init();
        }
        return this.current_page();
    },
    reset_db: function() {
        if (typeof DEFAULT_DATASET !== 'undefined') {
            this.load(DEFAULT_DATASET);            
        } else {
            this.init();
        }
        this.save();
        return this.dump();
    }

}

function ReflectionPage() {
    this.first = null;
    this.catalog = {};
    this.linear = [];
    this.image_path = DEFAULT_IMAGE;
    this.palette = DEFAULT_PALETTE; 
}

ReflectionPage.prototype = {
    init: function() {
        var note;
        note = new Note('theme', this.next_available_uid());
        note.content = 'reflection';
        this.add_note(note);
        this.first = note.uid;
        this.image_path = DEFAULT_IMAGE;
        this.palette = DEFAULT_PALETTE;
        this.linearize(); 
    },
    add_note: function(note) {
        this.catalog[note.uid] = note;
    },
    get_note: function(key) {
        if (!key in this.catalog) {
            alert('missing note with key '+key);
        }
        return this.catalog[key];
    },
    remove_note: function(key) {
        delete this.catalog[key];
    },
    next_available_uid: function() {
        var uid = 0; 
        while (uid in this.catalog) uid++; 
        console.log('giving uid '+uid);
        return uid.toString();
    },
    linearize: function() {
        function flatten(item_key, page) {
            var f = [item_key];
            var item = page.get_note(item_key);
            if (!item) {
                alert('flattening, but broken item:' + item_key + ' aborting, load default instead');
                return null;
            }
            for (var i=0; i < item.children_keys.length; i++) {
                child_key = item.children_keys[i];
                if ((f.indexOf(child_key)) == -1) { // check for duplicates, because they cause infinite loops
                    f = f.concat(flatten(child_key, page));
                }
            }
            return f;
        }
        this.linear = flatten(this.first, this);
    },
    load: function(data){
        // loads either a data object to ReflectionPage or JSON string to ReflectionPage 
        if (typeof data == "string") {
            try {
                data = $.parseJSON(data);
            } catch(err) {
                console.log(error);
                console.log('Parsing JSON failed, using empty page instead');
                this.init();
                return;
            }            
        } 
        this.first = data.first;
        this.image_path = (data.image_path) ? data.image_path : DEFAULT_IMAGE;
        this.palette = (data.palette) ? data.palette : DEFAULT_P;
        this.linear = [];
        this.catalog = {};
        var note;
        var ndata;
        if (!'catalog' in data) {
            console.log('Malformed data, creating empty page instead');
            this.init();
            return;
        }
        for (var key in data.catalog) {
            ndata = data.catalog[key];
            note = new Note(ndata.type, null); // uid will be set soon
            for (var dkey in ndata) {
                note[dkey] = ndata[dkey];
            }
            if (!note.parent_key) {
                note.type = 'theme';
            }
            if (key == note.uid) {
                this.add_note(note);                     
            } else {
                console.log('Mismatch between note uid ('+note.uid+') and note key ('+key+')');
            }
        }
        // verify that referred objects exist and delete if not
        for (var key in this.catalog) {
            note = this.get_note(key);        
            if (note.parent_key) {
                if (!this.get_note(note.parent_key)) {
                    note.parent_key = null;
                }
            }
            for (var j=0; j < note.children_keys.length; j++) {
                if (!this.get_note(note.children_keys[j])) {
                    note.children_keys.splice(j,1);
                }
            }
        }
        this.linearize();
        if (!this.linear) {
            this.init();
        }
        // verify that each catalog item is in linearized version too
        for (var key in this.catalog) {
            if (this.linear.indexOf(key) == -1 ) {
                this.remove_note(key);
            }
        }
        console.log('Loaded page w. background ' + this.image_path);
    }, 
    save: function(spaces) {
        // returns only this page as a JSON string. Usually you want to stringify all pages
        if (spaces) {
            return JSON.stringify(this, null, ' ');   
        } else {
            return JSON.stringify(this);               
        }
    },
    print: function() {
        // gives a pretty string format of discussion
        //save_data();
        var s = '';
        var item;
        for (var i = 0; i < this.linear.length; i++) {
            item = this.get_note(this.linear[i]);
            for (var j = 0; j < item.depth; j++) {
                s = s + ' ';
            }
            if (item.type == 'obvious') {
                s = s + 'o:';            
            } else if (item.type == 'adjusted theme') {
                s = s + 'adjusted theme:';
            }
            s = s + item.content + '\n';        
        }
        return s;
        //alert(s);
        //var blob = new Blob([s], {type: "text/plain;charset=utf-8"});
        //alert(blob);
        //saveAs(blob, "hello world.txt");

        //uriContent = "data:application/octet-stream," + encodeURIComponent(s);
        //var uri_content = "data:text/plain;charset=UTF-8," + encodeURIComponent(s);
        //new_window = window.open(uri_content, 'new_text');
    }
}

function Note(type, available_uid){
    this.uid = available_uid;
    this.type = type;
    this.content = '';
    this.depth = 0;
    this.parent_key = '';
    this.children_keys = [];
}    
Note.prototype = {
    next_key: function() {
        var my_index = PAGE.linear.indexOf(this.uid);
        if (my_index > -1 && my_index + 1 < PAGE.linear.length) {
            return PAGE.linear[my_index + 1]
        }
    },
    prev_key: function() {
        var my_index = PAGE.linear.indexOf(this.uid);
        if (my_index > 0) {
            return PAGE.linear[my_index - 1]
        }
    },
    get$: function() {
        return $('#'+this.uid);
    },
    get_parent: function() {
        if (!this.parent_key) return null;
        return PAGE.get_note(this.parent_key);
    },
    add_child: function(child) {
        child.parent_key = this.uid;
        this.children_keys.push(child.uid);    
        child.depth = this.depth + 1;
        PAGE.linearize();
    },
    insert_child: function(child) {
        child.parent_key = this.uid;
        this.children_keys.splice(0,0,child.uid);    
        child.depth = this.depth + 1;
        PAGE.linearize();
    },
    add_sibling: function(sibling) {
        parent = this.get_parent();
        parent.children_keys.push(sibling.uid);
        sibling.parent_key = parent.uid;      
        sibling.depth = this.depth;
        PAGE.linearize();
    },
    reduce_depth: function() {
        // recursively reduce depth for each child
        this.depth--;
        var child;
        for (var i=0; i < this.children_keys.length;i++) {
            child = PAGE.get_note(this.children_keys[i]);
            child.reduce_depth();
        }
    },
    pop: function() {
        // disconnects note from its parent and children.
        // parent becomes the parent of note's children
        parent = this.get_parent();
        if (parent) {
            child_i = parent.children_keys.indexOf(this.uid);
            if (child_i > -1) {
                parent.children_keys.splice(child_i, 1);            
            }
        }
        var child;
        for (var i=0; i < this.children_keys.length;i++) {
            child = PAGE.get_note(this.children_keys[i]);
            child.reduce_depth();
            if (parent) {
                parent.children_keys.splice(child_i+i, 0, child.uid);
                child.parent_key = parent.uid;
            } else {
                child.parent_key = '';
            }
        }
        this.children_keys = [];
    },
    insert_sibling: function(sibling, before) {
        parent = this.get_parent();
        i = parent.children_keys.indexOf(this.uid);
        if (before) {        
            parent.children_keys.splice(i,0,sibling.uid);
        } else {
            if (i+1 < parent.children_keys.length) {
                parent.children_keys.splice(i+1,0,sibling.uid);
            } else {
                parent.children_keys.push(sibling.uid);            
            }
        }
        sibling.parent_key = parent.uid;      
        sibling.depth = this.depth;
        PAGE.linearize();
    },
    delete: function() {
        var child;
        for (var i = 0; i < this.children_keys.length; i++) {
            child = PAGE.get_note(this.children_keys[i]);
            child.delete();
        }
        var parent = this.get_parent();
        var child_i;
        if (parent) {
            child_i = parent.children_keys.indexOf(this.uid);
            if (child_i > -1) {
                parent.children_keys.splice(child_i, 1);            
            }
        }
        PAGE.remove_note(this.uid);
        var $note = this.get$();
        $note.remove();
        PAGE.linearize();            
    },
    move_up: function() {
    },
    css_class: function() {
        switch (this.type) {
            case 'theme':
                return 'theme';
            case 'obvious':
                return 'obvious';
            case 'reflection':
                return 'reflection';
            case 'adjusted theme':
                return 'adjusted_theme';
        } 
    }
}

function Color(rgb, i) {
    this.rgb = rgb;
    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
    this.sum = (rgb[0] + rgb[1] + rgb[2]);
    this.goodness = [];
    this.original_index = i;
    this.preferred = [];
    this.comp_value = 0;
}
Color.prototype = {
    build_distances: function(colors) {
        //this.distances = [];
        //this.ratio_distances = [];
        this.goodness = [];
        var d;
        for (var i=0; i< colors.length; i++) {
            other= colors[i];
            //d = Math.abs(other.r - this.r) + Math.abs(other.g - this.g) + Math.abs(other.b - this.b);
            d = Math.sqrt(Math.abs(other.r - this.r)) + Math.sqrt(Math.abs(other.g - this.g)) + Math.sqrt(Math.abs(other.b - this.b));

            //d = ((other.r - this.r) * (other.r - this.r)) + ((other.g + this.g) * (other.g + this.g)) + ((other.b + this.b) * (other.b + this.b));
            this.goodness.push(d);
            //this.distances.push(d);
            //r = Math.abs((other.r/other.g) - (this.r/this.g)) + Math.abs((other.r/other.b) - (this.r/this.b)) + Math.abs((other.b/other.g) - (this.b/this.g));
            //this.ratio_distances.push(r);
        }        
    },
    build_preferred: function(colors) {
        this.preferred = colors.slice(0);
        for (var i=0; i < this.preferred.length; i++) {
            this.preferred[i].comp_value = this.preferred[i].goodness[this.original_index];
        }

        this.preferred.sort(function(a,b){return b.comp_value - a.comp_value});
        for (var i=0; i < this.preferred.length; i++) {
            this.preferred[i] = this.preferred[i].original_index;
        }
    },
    to_rgb: function() {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
}



// functions that handle jQuery objects and UI logic 


DATASOURCE = new LocalStorageDataSource();
PAGE = DATASOURCE.load();

$(document).ready( function() {
    $('#background_image img').load(grab_colors);
    change_page();
    $('#save_button').click(toggle_save_box).disableSelection();
    $('#save_box .ok').click(toggle_save_box).disableSelection();
    $('#save_box .plaintext').click(toggle_plaintext).disableSelection();
    $('#save_box .all_data').click(toggle_all_data).disableSelection();
    $('#save_box .json').click(toggle_json).disableSelection();
    $('#load_box .cancel').click(toggle_load_box).disableSelection();
    $('#load_box .load').click(load_from_textarea).disableSelection();
    $('#load_box .upload_confirm .ok').click(load_page_confirmed).disableSelection();
    $('#load_box .upload_all_confirm .ok').click(load_all_confirmed).disableSelection();
    $('#delete_box .cancel').click(toggle_delete_box).disableSelection();
    $('#delete_box .ok').click(delete_page_confirmed).disableSelection();
    $('#prev_button').click(prev_page).disableSelection();
    $('#next_button').click(next_page).disableSelection();
    $('#add_button').click(add_page).disableSelection();
    $('#upload_button').click(toggle_load_box).disableSelection();
    $('#info_button').click(toggle_info_box).disableSelection();
    $('#misty_layer').click(close_any_box);
    /* Image capturing */
    $('#video').load(adjust_video_size);
    $('#take_photo').click(take_picture);

});

function create_note_objects() {
    var next_key = PAGE.first;
    var container = $('#main');
    container.html('');
    while(next_key) {
        note = PAGE.get_note(next_key);
        note_html = create_note_html(note);
        container.append(note_html);
        $new_note = container.find('.note:last');
        activate_note($new_note);
        update_$note(note);
        next_key = note.next_key();
    }
}

function create_note_html(note) {
    html = '<div class = "note '+note.css_class()+'" id = "'+note.uid+'" style = "left : '+note.depth * INDENT+'px">';
    if (note.type != 'theme') {
        html += '<div class ="drop_area top"></div>';        
        html += '<span class = "hint">'+note.type+'</span><span class = "type_switch">'+note.type+' &#8635;</span><span class="drag_bar">&nbsp;</span>';
    } else {
        html += '<div class ="prev_theme">&#10094;</div><div class ="next_theme">&#10095;</div>';
        html += '<span class = "hint">'+note.type+'</span> <span class = "image_switch">'+PAGE.image_path+' &#8635;</span>';
        html += '<span class="camera_switch">cam</span>';
        html += '<span class="drag_bar">&nbsp;</span>';
    }
    html += '<textarea rows = "1" columns = "40">'+note.content+'</textarea>';
    html += '<div class = "note_buttons" style = "display:none">';
    if (note.type != 'theme') {    
        html += '<div class = "button add_sibling" title = "Add '+note.type+' ( &#8984;&darr; )" >&darr;+</div>';
    }
    html += '<div class = "button add_child" title = "Add reflection, ( &#8984;&rarr; / &#8629;)">&#8600;+</div>';
    //html += '<div class = "button reduce_depth" title = "Move left, ( &#8984;&larr; )">&larr;</div>';
    html += '<div class = "button delete" title = "Remove this note">x</div></div>'; // &#10005;

    if (note.type != 'theme') {
        html += '<div class ="drop_area bottom_left"></div>';
    }
    html += '<div class ="drop_area bottom_right"></div></div>';
    return html;
}

function activate_note($note) {
    // sets note to deliver events
    //$note.hover(hover_on_note, hover_leave_note);
    var $textarea = $note.find('textarea');
    $textarea.keydown(key_pressed);
    $textarea.keyup(editing_note);
    $textarea.focusin(focus_on_note);
    $textarea.blur(focus_leave_note);
    $textarea.change(save_data);
    $textarea.click(function (event) {$(event.target).focus()});
    $note.click(focus_on_note);
    $note.dblclick(function (event) {$(event.target).closest('.note').find('textarea').focus()});
    $note.find(".add_child").click(create_child_note);
    $note.find(".add_sibling").click(create_sibling_note);
    //$note.find(".reduce_depth").click(move_note_left);
    $note.find(".delete").click(delete_note);
    $note.find(".type_switch").click(change_note_type);
    if ($note.hasClass('theme')) {
        $('#main').draggable({ handle:$note.find('.drag_bar')}) // axis:'x',
        $note.find(".image_switch").click(change_image);
        $note.find(".camera_switch").click(switch_camera);

    } else {
        $note.draggable({zIndex:1000, cursor:'move',cursorAt: { left: 0}, revert: "invalid", start: function (event, ui) {$('.drop_area').show();}, 
            stop: function (event, ui) {$('.drop_area').hide();},
        }); // snap:".note", snapMode:'outer', //         
    }
    $note.find('.drop_area').droppable({hoverClass:'drop_hover', tolerance:'pointer', drop:note_dropped})
}
function note_dropped(event, ui) {
    var $drop_area = $(event.target);
    var $moved = ui.draggable;
    var $target = $drop_area.closest('.note');
    var moved_note = PAGE.get_note($moved.attr('id'));
    var target_note = PAGE.get_note($target.attr('id'));
    moved_note.pop();
    if ($drop_area.hasClass('top')) {
        target_note.insert_sibling(moved_note, true);
    } else if ($drop_area.hasClass('bottom_left')) {
        target_note.insert_sibling(moved_note, false);
    } else if ($drop_area.hasClass('bottom_right')) {
        target_note.insert_child(moved_note);
    }
    create_note_objects();
    save_data();
}
function create_$note(new_note) {
    var $after_me = PAGE.get_note(PAGE.linear[PAGE.linear.indexOf(new_note.uid)-1]).get$();
    $after_me.after(create_note_html(new_note));
    var $new_note = new_note.get$();
    activate_note($new_note);
    update_$note(new_note);
    $new_note.find('textarea').focus();
    if (DATASOURCE.is_last_page()) {
        $('#add_button').show();
    } else {
        $('#add_button').hide();
    };
}

function update_$note(note) {
    var $note = note.get$(); 
    //if (note && note.depth > 1) {
    //    $note.find('.reduce_depth').show()
    //}
    $note.css('left', note.depth * INDENT);
    $note.attr('class', 'note '+note.css_class());
    $note.find('.hint').text(note.type);
    $note.find('.type_switch').html(note.type+' &#8635;');    
    $textarea = $note.find('textarea');
    $textarea.height($textarea.prop('scrollHeight')-4); // 4 is padding that gets added automatically 

}

function triggering_note(event) {
    var $trigger = $(event.target);
    return PAGE.get_note($trigger.closest('.note').attr('id'));
}

function change_note_type(event) {
    var note = triggering_note(event);
    switch (note.type) {
        case 'theme':
            note.type = 'obvious';
            break;
        case 'obvious':
            note.type = 'reflection';
            break;
        case 'reflection':
            note.type = 'adjusted theme';
            break;
        case 'adjusted theme':
            note.type = 'obvious';
            break;
    }
    update_$note(note);
    save_data();            
}

function change_image(event) {
    var current_index = IMAGES.indexOf(PAGE.image_path);
    current_index++;
    if (current_index >= IMAGES.length) current_index = 0;
    PAGE.image_path = IMAGES[current_index];
    PAGE.palette.default = true; // force palette recalculation
    $('#background_image img').attr('src', PAGE.image_path);
    $('body').css('background-image', 'url('+ PAGE.image_path + ')');

    $(event.target).html(PAGE.image_path + ' &#8635;');
    save_data();
}

function delete_note(event) {
    var note = triggering_note(event);
    if (PAGE.first == note.uid || note.type == 'theme') {
        toggle_delete_box(event);
    } else {
        note.pop();
        note.delete();
        FOCUS_KEY = null;   
        create_note_objects();
        save_data();        
    }
}

function delete_page_confirmed(event) {
    DATASOURCE.remove_current_page();
    toggle_delete_box();
    change_page();
}

function create_child_note(event) {
    var parent = triggering_note(event);
    var $parent = parent.get$();
    var new_type = 'theme';
    if (parent.type == 'theme') new_type = 'obvious';
    else if (parent.type == 'obvious') new_type = 'reflection';
    else new_type = 'reflection';
    var new_note = new Note(new_type, PAGE.next_available_uid());
    PAGE.add_note(new_note);
    parent.add_child(new_note);
    create_$note(new_note);
    save_data();
}

function create_sibling_note(event) {
    var note = triggering_note(event);
    new_type = note.type;
    var new_note = new Note(new_type, PAGE.next_available_uid());
    PAGE.add_note(new_note);
    note.add_sibling(new_note);
    create_$note(new_note);
    save_data();
}

function move_focus_to_previous_note(event) {
    var note_id = $(event.target).parent().attr('id');
    var prev_key = PAGE.get_note(note_id).prev_key(); 
    if (prev_key) {
        PAGE.get_note(prev_key).get$().find('textarea').focus();
    }
}

function move_focus_to_next_note(event) {
    var note_id = $(event.target).parent().attr('id');
    var next_key = PAGE.get_note(note_id).next_key(); 
    if (next_key) {
        PAGE.get_note(next_key).get$().find('textarea').focus();
    }
}

function editing_note(event) {
   var area = $(event.target);
   var note_data = PAGE.get_note(area.parent().attr('id'));
    note_data.content = area.val();
    area.height(area.prop('scrollHeight')-4); // 4 is padding that gets added automatically 
}
function key_pressed(event) {
   if (event.which == 13 && !event.shiftKey) {
      create_child_note(event);
      event.preventDefault();     
   } else if (event.which == 39 && event.metaKey) {
      create_child_note(event);
      event.preventDefault();     
   } else if (event.which == 40 && event.metaKey) {
      create_sibling_note(event);
      event.preventDefault();     
   //} else if (event.which == 37 && event.metaKey) {
   //   move_note_left(event);   
   //   event.preventDefault();     
   } else if (event.which == 38 && get_cursor_position(event.target) == 0) {
      move_focus_to_previous_note(event);   
      event.preventDefault();     
   } else if (event.which == 40 && get_cursor_position(event.target) == event.target.value.length) {
      move_focus_to_next_note(event);   
      event.preventDefault();     
   }
}

function show_buttons($note) {
    var note = PAGE.get_note($note.attr('id'));
    if (note.type == 'theme') {
        $note.find('.image_switch').show();
        if (CAMERA_SUPPORT) {
            $note.find('.camera_switch').show();
        }
        //$note.find('.next_theme').show();
        //$note.find('.prev_theme').show();
    } else {
        $note.find('.hint').hide();
        $note.find('.type_switch').show();        
    }
    $note.find('.note_buttons').show();
    if (show_help) {
        host_pos = $note.offset();
        left = host_pos.left + $note.width() + 20;
        postop = host_pos.top;

        if (note.type == 'theme') {
            help_id = '#theme_help';
        } else if (note.type == 'obvious') {
            help_id = '#obvious_help';            
        } else if (note.type == 'reflection') {
            help_id = '#reflection_help';            
        } 
        var $help = $(help_id);
        $help.css('left', left).css('top', host_pos.top);
        if (!$help.is(':animated')) {
            $help.fadeIn('fast');     
        } else { 
            $help.finish().show();
        }
    }    


}

function hide_buttons($note) {
    var note = PAGE.get_note($note.attr('id'));
    if (!note) return;
    if (note.type == 'theme') {
        $note.find('.image_switch').hide();
        if (CAMERA_SUPPORT) {
            $note.find('.camera_switch').hide();
        }
        //$note.find('.next_theme').hide();
        //$note.find('.prev_theme').hide();
    } else {
        $note.find('.hint').show();
        $note.find('.type_switch').hide();        
    }
    $note.find('.note_buttons').hide();
    if (show_help) {
        if (note.type == 'theme') {
            help_id = '#theme_help';
        } else if (note.type == 'obvious') {
            help_id = '#obvious_help';            
        } else if (note.type == 'reflection') {
            help_id = '#reflection_help';            
        }
        var $help = $(help_id);
        if (!$help.is(':animated')) {
            $help.fadeOut('fast');     
        } else { 
            $help.finish().hide();
        }
    }    


}

function focus_on_note(event) {
    var $focused = $(event.target).closest('.note');
    var new_focus = $focused.attr('id'); 
    if (FOCUS_KEY && new_focus != FOCUS_KEY) {
        hide_buttons($('#'+FOCUS_KEY)); 
    }   
    FOCUS_KEY = new_focus;
    show_buttons($focused);
}

function focus_leave_note(event) {
    //FOCUS_KEY = null;
    //var $note = $(event.target).parent();
}

function save_data() {
    DATASOURCE.save();
}

function get_cursor_position(input) {
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var sel_length = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - sel_length;
    }
}

function close_any_box(event) {
    if ($('#info_box').is(':visible')) {
        toggle_info_box(event);
    } else if ($('#save_box').is(':visible')) {
        toggle_save_box(event);
    } else if ($('#load_box').is(':visible')) {
        toggle_load_box(event);
    } else if ($('#delete_box').is(':visible')) {
        toggle_delete_box(event);
    }        

}

function toggle_info_box(event) {
    var $box = $('#info_box');
    if ($box.is(':visible')) {
        $box.fadeOut('fast');
        $('#misty_layer').fadeOut('fast');
    } else {
        var x = ($(window).width() - $box.width())/2;
        var y = ($(window).height() - $box.height())/2;
        $box.css({left:x, top:y});
        $box.load('_readme.html', function() {$(this).fadeIn('fast')});        
        $('#misty_layer').height($(document).height()).width($(document).width()).fadeIn('fast');
        $box.focus();
    }
}

function toggle_delete_box(event) {
    var $box = $('#delete_box');
    if ($box.is(':visible')) {
        $box.fadeOut('fast');
        $('#misty_layer').fadeOut('fast');
    } else {
        var x = ($(window).width() - $box.width())/2;
        var y = ($(window).height() - $box.height())/2;
        $box.fadeIn('fast');
        $box.css({left:x, top:y});
        $('#misty_layer').height($(document).height()).width($(document).width()).fadeIn('fast');
    }
}

function toggle_save_box(event) {
    var $box = $('#save_box');

    if ($box.is(':visible')) {
        $box.fadeOut('fast');
        $('#misty_layer').fadeOut('fast');
    } else {
        toggle_json(event);
        var x = ($(window).width() - $box.width())/2;
        var y = ($(window).height() - $box.height())/2;
        $box.css({left:x, top:y});
        $box.fadeIn('fast');
        $('#misty_layer').height($(document).height()).width($(document).width()).fadeIn('fast');
        $box.find('textarea').focus();
    }
}
function toggle_plaintext(event) {
    $('#save_box textarea').val(PAGE.print());
    $('#save_box .json span').hide();
    $('#save_box .all_data span').hide();
    $('#save_box .plaintext span').show();
}

function toggle_json(event) {
    $('#save_box textarea').val(PAGE.save(false));
    $('#save_box .json span').show();
    $('#save_box .all_data span').hide();
    $('#save_box .plaintext span').hide();
}

function toggle_all_data(event) {
    $('#save_box textarea').val(JSON.stringify(DATASOURCE));
    $('#save_box .json span').hide();
    $('#save_box .all_data span').show();
    $('#save_box .plaintext span').hide();
}


function toggle_load_box(event) {
    var $box = $('#load_box')
    if ($box.is(':visible')) {
        $box.fadeOut('fast');
        $('#misty_layer').fadeOut('fast');
    } else {
        $('#load_box .upload_dialog').show();
        $('#load_box .upload_all_confirm').hide();
        $('#load_box .upload_confirm').hide();
        var x = ($(window).width() - $box.width())/2;
        var y = ($(window).height() - $box.height())/2;
        $box.css({left:x, top:y});
        $box.fadeIn('fast');
        $('#misty_layer').height($(document).height()).width($(document).width()).fadeIn('fast');
        $box.find('textarea').focus();
    }
}

function load_from_textarea(event) {
    var data = $('#load_box textarea').val();
    try {
        data = $.parseJSON(data);
    } catch(err) {
        console.log(error);
        console.log('Parsing JSON failed, canceling');
        toggle_load_box();
        return;
    }            
    if (data.pages) {
        $('#load_box .upload_dialog').hide();
        $('#load_box .upload_all_confirm').show();
        $('#load_box textarea').prop('disabled', true);
    } else if (data.catalog) {
        $('#load_box .upload_dialog').hide();
        $('#load_box .upload_confirm').show();
        $('#load_box textarea').prop('disabled', true);        
    }
    //PAGE.load(data);
    //toggle_load_box();
    //change_page();
}
function load_page_confirmed(event) {
    var data = $('#load_box textarea').val();
    PAGE.load(data);
    toggle_load_box();
    change_page();
}

function load_all_confirmed(event) {
    var data = $('#load_box textarea').val();
    PAGE = DATASOURCE.load(data);
    toggle_load_box();
    change_page();
}

function next_page() {
    save_data();
    var p = DATASOURCE.next();
    if (!p) return;
    PAGE = p;
    change_page();
}

function prev_page() {
    save_data();
    var p = DATASOURCE.prev();
    if (!p) return;
    PAGE = p;
    change_page();
}

function add_page() {
    save_data();
    var p = DATASOURCE.add_new();
    if (!p) return;
    PAGE = p;
    change_page();
}


function change_page() {
    FOCUS_KEY = null;
    PAGE = DATASOURCE.current_page();
    if (DATASOURCE.is_last_page()) {
        $('#add_button').show();
        $('#next_button').hide();
    } else {
        $('#add_button').hide();
        $('#next_button').show();        
    };
    if (DATASOURCE.is_last_page() && PAGE.linear.length>1) {
        $('#add_button').show();
    } else {
        $('#add_button').hide();
    };

    if (DATASOURCE.is_first_page()) {
        $('#prev_button').hide();
    } else {
        $('#prev_button').show();        
    }
    $('#background_image img').attr('src', PAGE.image_path);
    $('body').css('background-image', 'url('+ PAGE.image_path + ')');
    $('body').css('background-size', '100%');
    $('body').css('background-repeat', 'none');
    create_note_objects();   
}


function grab_colors() {
    if (!PAGE.palette.default) { // color information is already loaded
        update_colors();
        return;
    }
    var image = $('#background_image img')[0];
    var colorThief = new ColorThief();
    var pal =  colorThief.getPalette(image, 15, 15);
    //var pal = [[125,120,125],[223,217,219],[179,173,176],[52,48,58],[71,59,70],[194,197,200],[188,185,197],[162,164,168],[157,153,164],[79,76,84],[72,72,60]];    
    //console.log(JSON.stringify(pal))
    // Need to build pairs of nice, matching colors from these.


    var colors = [];
    var col;
    for (var i=0; i<pal.length; i++) {
        col = new Color(pal[i], i);
        colors.push(col);
    }
    for (var i=0; i<colors.length; i++) {
        colors[i].build_distances(colors);
        //console.log('goodness['+ i + '] ' + colors[i].goodness);
    }
    for (var i=0; i<colors.length; i++) {
        colors[i].build_preferred(colors);
    }

    var sorted = colors.slice(0);
    var used_indices = [];
    sorted.sort(function(a,b){return a.sum-b.sum})
    var dark_colors = sorted.slice(0,5);
    var dark, light;
    var dark_keys = ['theme1', 'reflection2', 'obvious1', 'ui1', 'bg'];
    var light_keys = ['theme2', 'reflection1', 'obvious2', 'ui2', 'text'];

    var k = 0;
    for (var i=0;i < dark_keys.length; i++) {
        while (used_indices.indexOf(k)> -1) {
            k++;
        }
        dark = colors[k];
        used_indices.push(dark.original_index);
        for (var j=0; j< dark.preferred.length; j++) {
            preferred_pair_index = dark.preferred[j];
            if (used_indices.indexOf(preferred_pair_index)== -1) {
                light = colors[preferred_pair_index];
                used_indices.push(preferred_pair_index);
                break;                
            } 
        }
        PAGE.palette[dark_keys[i]] = dark.to_rgb();
        PAGE.palette[light_keys[i]] = light.to_rgb();
        PAGE.palette.default = 0;
        k++;
    }
    update_colors();    
}

function update_colors() {
    var P = PAGE.palette;
    var cs ='body { background-color: ' + P.bg +
            '; color: ' + P.text +
        '} textarea { color: ' + P.text + 
        '} .prev_theme, .next_theme { color:' + P.theme1 +
        '} .prev_theme:hover, .next_theme:hover { color:' + P.theme2 +
        '} .theme, .adjusted_theme { background-color: '+ P.theme1 + 
        '; color: '+ P.theme2 + 
        '} .theme textarea, .adjusted_theme textarea { color: '+ P.theme2 +
        '} .theme .button:hover, .theme .type_switch:hover, .adjusted_theme .button:hover, .adjusted_theme .type_switch:hover, .image_switch:hover, #theme_help { color: '+ P.theme1 + 
        '; background-color: '+ P.theme2 + 
        '} .obvious { background-color: ' + P.obvious1 + 
        '; color: ' + P.obvious2 + 
        '} .obvious textarea { color: ' + P.obvious2 +
        '} .obvious .button:hover, .obvious .type_switch:hover, #obvious_help { color: ' + P.obvious1 + 
        '; background-color: ' + P.obvious2 +
        '} .reflection { background-color: ' + P.reflection1 +
        '; color: ' + P.reflection2 + 
        '} .reflection textarea { color: ' + P.reflection2 + 
        '} .reflection .button:hover, .reflection .type_switch:hover, #reflection_help, #reflection_help2 { color: '+ P.reflection1 +
        '; background-color: ' + P.reflection2 + 
        '} .bottom_button_bar, .dialog_button { background-color: '+ P.ui1 + 
        '; color: ' + P.ui2 + 
        '} .bottom_button_bar .button:hover, .dialog_button:hover { background-color: ' + P.ui2 + 
        '; color: ' + P.ui1 + 
        '} #info_box, #save_box, #load_box, #delete_box { background-color: ' + P.ui1 + 
        '; color: '+ P.ui2 + 
        '} #save_box textarea, #load_box textarea { border-color: ' + P.ui2 + '}';
    $('#dynamic_style').html(cs);
}
/*
function update_colors() {
    var P = PAGE.palette;
    var cs ='body { background-color: ' + P.bg +
            '; color: ' + P.text +
        '} textarea { color: ' + P.text + 
        '} .prev_theme, .next_theme { color:' + P.theme1 +
        '} .prev_theme:hover, .next_theme:hover { color:' + P.theme2 +
        '} .theme, .adjusted_theme { background-color: '+ P.theme1 + 
        '; color: '+ P.theme2 + 
        '} .theme textarea, .adjusted_theme textarea { color: '+ P.theme2 +
        '} .theme .button:hover, .theme .type_switch:hover, .adjusted_theme .button:hover, .adjusted_theme .type_switch:hover, .image_switch:hover { color: '+ P.theme1 + 
        '; background-color: '+ P.theme2 + 
        '} .obvious { background-color: ' + P.obvious1 + 
        '; color: ' + P.obvious2 + 
        '} .obvious textarea { color: ' + P.obvious2 +
        '} .obvious .button:hover, .obvious .type_switch:hover { color: ' + P.obvious1 + 
        '; background-color: ' + P.obvious2 +
        '} .reflection { background-color: ' + P.reflection1 +
        '; color: ' + P.reflection2 + 
        '} .reflection textarea { color: ' + P.reflection2 + 
        '} .reflection .button:hover, .reflection .type_switch:hover { color: '+ P.reflection1 +
        '; background-color: ' + P.reflection2 + 
        '} .bottom_button_bar, .dialog_button { background-color: '+ P.ui1 + 
        '; color: ' + P.ui2 + 
        '} .bottom_button_bar .button:hover, .dialog_button:hover { background-color: ' + P.ui2 + 
        '; color: ' + P.ui1 + 
        '} #info_box, #save_box, #load_box, #delete_box { background-color: ' + P.ui1 + 
        '; color: '+ P.ui2 + 
        '} #save_box textarea, #load_box textarea { border-color: ' + P.ui2 + '}';
    $('#dynamic_style').html(cs);
}
*/

var STREAM;
/* Image capturing */
function switch_camera() {
    var $box = $('#video_box')
    if ($box.is(':visible')) {
        $box.fadeOut('fast');
        $('#misty_layer').fadeOut('fast');
    } else {
        $box.fadeIn('fast');
        navigator.getMedia({video: {optional:[ {minHeight:720}, {minWidth:960} ]}, audio: false},
        function(stream) {
            var video = $('#video')[0]
            if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
            } else {
                var vendorURL = window.URL || window.webkitURL;
                video.src = vendorURL.createObjectURL(stream);
            }
            video.play();
            adjust_video_size();
            STREAM = stream;
        },
        function(err) {
          console.log("An error occured! " + err);
          STREAM = null;
        }
      );
    }
}

function adjust_video_size() {
    $('#video_box').width(this.videoWidth).height(this.videoHeight+20);
    var canvas = $('#canvas')[0];
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;
    console.log('canvas width: ' +$('#canvas').width());
}



  // video.addEventListener('canplay', function(ev){
  //   if (!streaming) {
  //     height = video.videoHeight / (video.videoWidth/width);
  //     video.setAttribute('width', width);
  //     video.setAttribute('height', height);
  //     canvas.setAttribute('width', width);
  //     canvas.setAttribute('height', height);
  //     streaming = true;
  //   }
  // }, false);

  function take_picture() {
    var canvas = $('#canvas')[0];
    var video = $('#video')[0]
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, video.videoWidth, video.videoHeight);
    var data = canvas.toDataURL('image/png');
    $('#background_image img').attr('src', data);
    $('body').css({'background-image':'url('+ data + ')', 'background-repeat': 'none', 'background-position':'center'});
    PAGE.palette.default = true; // force palette recalculation
    if (STREAM) {
        STREAM.stop();
    }
    video.src="";
    switch_camera();
  }




