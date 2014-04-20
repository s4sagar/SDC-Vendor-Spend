/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var pushNotification;
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        navigator.splashscreen.show();
        //Handle back android
        document.addEventListener("backbutton", function(e)
        {
            $("#app-status-ul").append('<li>backbutton event received</li>');

            if( $("#home").length > 0 )
            {
                e.preventDefault();
                pushNotification.unregister(successHandler, errorHandler);
                navigator.app.exitApp();
            }
            else
            {
                navigator.app.backHistory();
            }
        }, false);
        // ALERT any errors
        window.onerror = function(msg, url, linenumber) {
            alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
            return true;
        };
        // if (parseFloat(window.device.version) === 7.0) {
        //   document.body.style.marginTop = "20px";
        // }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentyearent = document.getyearentById(id);
        // var listeningyearent = parentyearent.querySelector('.listening');
        // var receivedyearent = parentyearent.querySelector('.received');

        // listeningyearent.setAttribute('style', 'display:none;');
        // receivedyearent.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

// Handle the back button
//
function onBackKeyDown() {
    alert('hi');
    step_back();
}


function toTitleCase(str)
{ if(str)
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    return this;
};

Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function hide_all() {
    $('#btnBack').hide();
    $('#navbar').hide();
    $('.spinner_index').hide();
    $('#index_content').hide();
    $('#vendor_categories').hide();
    $('#vendor_classification').hide();
    $('#view_title').hide();
    $('#searchbox').hide();
    $('.inset').hide();
    $('#vendor-invoices').hide();
    $('#contracted').hide();
    $('#approved').hide();
    $('#adhoc').hide();
    $('#searched-vendor').hide();
    $('#vendor-turnover-report').hide();
    $('#ajax_error').hide();
}

var step_back = function() {};

var current_step = function() {};

// Nijo Starts!
var sdcs = new Array('BSMBE', 'BSMCN', 'BSMCY', 'BSMDE', 'BSMGR', 'BSMHK', 'BSMIN', 'BSMIM', 'BSMPL', 'BSMJP', 'BSMSG', 'BSMUK', 'ALL');

function show_top_vendors_by_turnover(year) {
    hide_all();
    selected_from_date = $('#txtFromDate').val();
    selected_to_date = $('#txtToDate').val();
    //alert(selected_from_date);

    // if(selected_from_date=='')
    //     selected_from_date=undefined;
    // if(selected_to_date=='')
    //     selected_to_date=undefined;

    current_step = function(){
        show_top_vendors_by_turnover(year);
    };
    var owner = selected_owner_id;
    var vessel = selected_vessel_id;
    var sdc = $('#cmbSDC').val();
    
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend_prod/get_top_vendors.php?year=' + year + '&sdcCode=' + sdc + '&ownerid='+owner 
        + '&vesselobjectid=' + vessel + '&fromdate=' + selected_from_date + '&todate=' + selected_to_date + '&pal_user_id='+ $.jStorage.get("pal_user_id"),
        beforeSend: function() {
            $(".spinner_index").css('display','block');
            $(".spinner_index").center();
        },

        success : function(response) {
            // var results = JSON.parse(response);
            var results = response;

            var results_div_con = "<ul data-role='listview' data-divider-theme='b' data-inset='true' class='listview'>";
            var results_div_app = "<ul data-role='listview' data-divider-theme='b' data-inset='true' class='listview'>";
            var results_div = "<ul data-role='listview' data-divider-theme='b' data-inset='true' class='listview'>";
            var con_count = 0;
            var app_count = 0;
            var else_count = 0;
            var con_sum = 0;
            var app_sum = 0;
            var else_sum = 0;
            var vendor_array = new Array();
            for(var i=0; i<results.length; i++) {
                var temp = new Array;
                temp.id = results[i]['vendor_id'];
                temp.label = results[i]['NAME'];
                temp.amount = results[i]['INVOICE_AMOUNT_USD'];
                vendor_array.push(temp);
                if(results[i]['APPROVAL_STATUS'] == "CONTRACTED"){
                    con_sum+=parseFloat(results[i]['INVOICE_AMOUNT_USD']);
                    if(con_count >= 50) continue;
                    results_div_con += "<li data-theme='c'><a href='javascript:show_top_invoices_by_vendor_year("+results[i]['vendor_id']+", "+year+")' id='"+results[i]['vendor_id']+"'> <span class='list_text'>"+toTitleCase(results[i]['NAME'])+"</span>";
                    // results_div += "<span class='chevron my-chevron'></span>";
                    results_div_con += "<span class='my-count' style='float:right'> $"+parseFloat(results[i]['INVOICE_AMOUNT_USD']).formatMoney(0, '.', ',')+"</a></span></li>";
                    con_count++;
                }
                else if(results[i]['APPROVAL_STATUS'] == "APPROVED"){
                    app_sum+=parseFloat(results[i]['INVOICE_AMOUNT_USD']);
                    if(app_count >= 50) continue;
                    results_div_app += "<li data-theme='c'><a href='javascript:show_top_invoices_by_vendor_year("+results[i]['vendor_id']+", "+year+")' id='"+results[i]['vendor_id']+"'> <span class='list_text'>"+toTitleCase(results[i]['NAME'])+"</span>";
                    // results_div += "<span class='chevron my-chevron'></span>";
                    results_div_app += "<span class='my-count' style='float:right'> $"+parseFloat(results[i]['INVOICE_AMOUNT_USD']).formatMoney(0, '.', ',')+"</a></span></li>";
                    app_count++;
                }
                else {
                    else_sum+=parseFloat(results[i]['INVOICE_AMOUNT_USD']);
                    if(else_count >= 50) continue;
                    results_div += "<li data-theme='c'><a href='javascript:show_top_invoices_by_vendor_year("+results[i]['vendor_id']+", "+year+")' id='"+results[i]['vendor_id']+"'> <span class='list_text'>"+toTitleCase(results[i]['NAME'])+"</span>";
                    // results_div += "<span class='chevron my-chevron'></span>";
                    results_div += "<span class='my-count' style='float:right'> $"+parseFloat(results[i]['INVOICE_AMOUNT_USD']).formatMoney(0, '.', ',')+"</a></span></li>";
                    else_count++;
                }
            }
            results_div_con += "</ul>";
            results_div_app += "</ul>";
            results_div += "</ul>";
            $('.spinner_index').hide();
            $('#index_content').hide();
            $('#btnBack').show();
            $('#navbar').show();
            $('#contracted').html(results_div_con);
            $('#approved').html(results_div_app);
            $('#adhoc').html(results_div);
            $('#back_button').css('display','inline-block');
            $('#view_title').show();
            $('#searchbox').show();
            var title_text = 'Highest Turnover Vendors in ' + year;
            if (sdc) title_text += ' and ' + sdc + ' SDC';
            if (owner) title_text += ' for the owner ' + owner;
            if (vessel) title_text += ' for vessel ' + selected_vessel_name;
            $('#n_contracted_div').html('$' + parseFloat(con_sum).formatMoney(0, '.', ','));
            $('#n_approved_div').html('$' + parseFloat(app_sum).formatMoney(0, '.', ','));
            $('#n_adhoc_div').html('$' + parseFloat(else_sum).formatMoney(0, '.', ','));
            $('#view_title').html( title_text);
            // $('#index_content').show();
            // $('#index_content').html(results_div);
            step_back = show_years;

            // console.log(results_div_con);

            $('.listview').listview();
            $('#n_contracted').click();

            $(".txtVendor").autocomplete({
                source: vendor_array,
                minLength: 1,
                matchFromStart: false,
                messages: {
                    noResults: '',
                    results: function() {}
                },
                select: function( event, ui ) {
                    var searched_vendor = "<div><ul data-role='listview' data-divider-theme='b' data-inset='true' class='listview'>";
                    
                    searched_vendor += "<li data-theme='c'><a href='javascript:show_top_invoices_by_vendor_year(" + ui.item.id + ", " + year + ")' id='" + ui.item.id + "'> <span class='list_text'>" + toTitleCase(ui.item.label) + "</span>";
                    // results_div += "<span class='chevron my-chevron'></span>";
                    searched_vendor += "<span class='my-count'> $"+parseFloat(ui.item.amount).formatMoney(0, '.', ',')+"</a></span></li>";                   
                    
                    searched_vendor += "</ul></div>";
                    $('#contracted').hide();
                    $('#approved').hide();
                    $('#adhoc').hide();
                    $('#searched-vendor').show();
                    $('#searched-vendor').html(searched_vendor);
                    $('.listview').listview();
                }
            });
}
});
}

function show_top_invoices_by_vendor_year(vendor_id, year) {
    hide_all();

    var sdc = $('#cmbSDC').val();    

    current_step = function(){
        show_top_invoices_by_vendor_year(vendor_id, year);
    };
    var sdc = $('#cmbSDC').val();
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend_prod/get_top_invoices_by_vendor_year.php?VendorID='+vendor_id+'&year='+year
        + '&vesselobjectid=' + selected_vessel_id + '&sdcCode=' + sdc + '&fromdate=' + selected_from_date + '&todate=' + selected_to_date
        + '&pal_user_id='+ $.jStorage.get("pal_user_id"),
        beforeSend: function() {
            $(".spinner_index").css('display','inline');
            $(".spinner_index").center();
        },
        success : function(results) {
            // var results = JSON.parse(response);
            var results_div = "<ul data-role='listview' data-divider-theme='b' data-inset='true' class='listview'>";
            var vendor_name;
            for(var i=0; i<results.length; i++) {
                vendor_name = toTitleCase(results[i]['vendor_name']);
                results_div += "<li data-theme='c'><span class='list_text'>";
                if (results[i]['TITLE'])
                    results_div += "<div class='sub_text vessel_name'> <span class='details_title'><b>" + toTitleCase(results[i]['TITLE']) + "</b></span></div>"
                // results_div += "<div class='sub_text vessel_name'> <span class='details_title'>Vendor: </span><b>" + toTitleCase(results[i]['vendor_name']) + "</b></div>";
                // console.log(results[i]['Vessel_name']);
                if(results[i]['Vessel_name'])
                    results_div += "<div class='sub_text vessel_name'> <span class='details_title'>Vessel: </span><b>" + toTitleCase(results[i]['Vessel_name']) + "</b></div>";
                
                results_div += "<div class='sub_text invoice_no'> <span class='details_title'>Invoice No: </span><b>" + toTitleCase(results[i]['VENDOR_INVOICE_NO']) + "</b></div></span>";
                results_div += "<div class='sub_text invoice_register_date'> <span class='details_title'>Registration Date: </span><b>" + results[i]['REGISTRATION_DATE'].split('T',1)[0] + "</b></div></span>";
                results_div += "<div class='sub_text invoice_paid_date'> <span class='details_title'>Pay Due Date: </span><b>" + results[i]['PAY_DUE_DATE'].split('T',1)[0] + "</b></div></span>";
                // results_div += "<span class='chevron'></span>";
                results_div += "<span class='my-count'>$"+parseFloat(results[i]['TOTAL_GROUP_CURRENCY']).formatMoney(0, '.', ',')+"</span></a></li>";
            }
            results_div += "</ul>";

            // var results_div = "<ul class='list'>";
            // for(var i=0; i<results.length; i++) {
            //     results_div += "<li><a href='javascript:show_vendor_invoices(\""+vendor_id+"\", \"" + year + "\")'";
            //     results_div += "<span class='list_text'>Vendor: <b>"+results[i]['vendor_name'] +"</b></span>";
            //     results_div += "<span class='list_text'>Vessel: <b>"+results[i]['Vessel_name'] +"</b></span>";
            //     // results_div += "<span class='chevron'></span>";
            //     results_div += "<span class='count'>$"+parseFloat(results[i]['TOTAL_GROUP_CURRENCY']).formatMoney(0, '.', ',')+"</span></a></li>";
            // }
            // results_div += "</ul>";
            $('.spinner_index').hide();
            $('#index_content').hide();
            
            // $('#vendor_categories').show();
            $('#btnBack').show();
            // $('#contracted').html(results_div);

            $('#vendor-invoices').html(results_div);
            $('#vendor-invoices').show();

            // if($('#contracted').is(":visible")) $('#contracted').html(results_div);
            // if($('#approved').is(":visible")) $('#approved').html(results_div);
            // if($('#adhoc').is(":visible")) $('#adhoc').html(results_div);

            $('.listview').listview();

            // $('#approved').html(results_div);
            // $('#adhoc').html(results_div);
            var title_text = 'Highest Invoices of ' + vendor_name + ' In ' + year;
            if (sdc) title_text += ' and ' + sdc + ' SDC';
            if (selected_owner_id) title_text += ' for the owner ' + owner;
            if (selected_vessel_id) title_text += ' for vessel ' + selected_vessel_name;
            
            $('#view_title').html(title_text);            
            
            step_back = function(){
                show_top_vendors_by_turnover(year);
            };

            $('html, .app').animate({ scrollTop: 0 }, 600);

            $('#back_button').css('display','inline-block');
            $('#view_title').show();
            $('.txtVendor').show();
            $('.inset').show();
            $('.list').show();

        }
    });
}

function show_vendor_invoices(vendor_name, sdc) {
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend/get_vendor_invoices.php?sdc='+sdc+'&vendor_name='+encodeURIComponent(vendor_name),
        beforeSend: function() {
            $(".spinner").css('display','block');
            $(".spinner").css('margin','auto');
            // // $(".spinner").center();
        },

        success : function(results) {
            // alert(results);
            if (results == null) {
                // $("#ajax_error").css('display','inline');
                // $("#ajax_error").html('There was an error. Kindly try again in a few minutes.<br/>-vidya.sagar@bs-shipmanagment.com');
                // $("#ajax_error").center();
                alert('There was an error. Kindly try again in a few minutes.\n-vidya.sagar@bs-shipmanagment.com');
                $('.spinner').hide();
            } else {
                var results_div = "<ul class='list'>";
                for(var i=0; i<results.length; i++) {
                    results_div += "<li><span class='list_text'> <div class='sub_text vessel_name'> <span class='details_title'>Vessel Name: </span>" + results[i]['vessel_name'] + "</div>"
                    results_div += "<div class='sub_text invoice_no'> <span class='details_title'>Invoice No: </span>" + results[i]['invoice_no'] + "</div></span>";
                    results_div += "<div class='sub_text invoice_register_no'> <span class='details_title'>Invoice Register No: </span>" + results[i]['invoice_register_no'] + "</div></span>";
                    results_div += "<div class='sub_text invoice_register_date'> <span class='details_title'>Invoice Date: </span>" + results[i]['invoice_register_date'].split('t',1)[0] + "</div></span>";
                    results_div += "<div class='sub_text invoice_paid_date'> <span class='details_title'>Paid Date: </span>" + results[i]['paid_date'].split('t',1)[0] + "</div></span>";
                    // results_div += "<span class='chevron'></span>";
                    results_div += "<span class='count'>$"+parseFloat(results[i]['vessel_amount']).formatMoney(0, '.', ',')+"</span></a></li>";
                }
                results_div += "</ul>";
                $('.spinner').hide();
                $('#index_content').hide();
                $('#vendor_categories').hide();
                $('#vendor_classification').show();
                $('#contracted').html(results_div);
                $('#view_title').html(vendor_name + ' Highest Transaction Invoices' );
                // $('#approved').html(results_div);
                // $('#adhoc').html(results_div);
                $('#index_content').hide();
                
                $('#back_button').css('display','inline-block');
                step_back = function(){
                    // $(".spinner").css('display','block');
                    show_sdc_vendor_spend(sdc);
                };
            }
        }
    });
}

var owners_array;
var vessel_array;
var selected_owner_id;
var selected_vessel_id;
var selected_vessel_name;
var selected_from_date;
var selected_to_date;

function show_more_filter(year) {
    if($("#"+year).closest('li').next('#filterDiv').length>0){
        $("#filterDiv").slideToggle('fast');
        return false;
    }  
    else if ($("#filterDiv").length>0)  {
        $("#filterDiv").slideUp(function(){             
            $('#cmbSDC').val('ALL');
            $("#filterDiv").insertAfter($("#"+year).closest('li'));
            $("#filterDiv").slideDown("fast"); 
            $('#btnShow').attr('onClick','');
            $('#btnShow').attr('onClick','show_top_vendors_by_turnover('+year+')');
            $('#btnReport').attr('onClick','');
            $('#btnReport').attr('onClick','show_vendors_turnover_report('+year+')');
        });
        return false;
    }
    var filterDiv="<div id='filterDiv' data-role='content' style='display:none;-webkit-box-shadow: inset 0px -2px 10px 1px rgba(0, 0, 0, .3);box-shadow: inset 0px -2px 10px 1px rgba(0, 0, 0, .3);'>";
    filterDiv+="<div style='padding:10px 0px 10px 10px;'><table border='0' cellpadding='0' cellspacing='0'><tr><td style='padding-right:5px'>SDC</td>";
    filterDiv+="<td style='padding-right:10px'><select id='cmbSDC'></select>";
    filterDiv+="</td></tr><tr><td style='padding-right:5px'>Owner</td><td style='padding-right:10px'><div><input id='txtOwner' type='search' name='search' class='search-textbox' placeholder='Owner' /></div></td></tr>";
    filterDiv+="</td></tr><tr><td style='padding-right:5px'>Vessel</td><td style='padding-right:10px'><div><input id='txtVesselFilter' type='search' name='search' placeholder='Vessel' /></div></td></tr>";
    filterDiv+="</td></tr><tr><td style='padding-right:5px'>From Date</td><td style='padding-right:10px'><div><input id='txtFromDate' type='date' class='search-textbox' /></div></td></tr>";
    filterDiv+="</td></tr><tr><td style='padding-right:5px'>To Date</td><td style='padding-right:10px'><div><input id='txtToDate' type='date' class='search-textbox' /></div></td></tr>";
    filterDiv+="<tr><td colspan='2' style='text-align:right; padding-right:10px'><input id='btnShow' type='button' value='Show' onClick='show_top_vendors_by_turnover("+year+")' /></td></tr>";
    // filterDiv+="<tr><td colspan='2' style='text-align:right'><input id='btnReport' type='button' value='Report' onClick='show_vendors_turnover_report("+year+")' /></td></tr>";
    filterDiv+="</table></div></div>";


    $("#"+year).closest('li').after(filterDiv);
    // Fill SDC dropdown
    var SDCoption = '';
    for (i=0;i<sdcs.length;i++){
     SDCoption += '<option value="'+ sdcs[i] + '">' + sdcs[i] + '</option>';
    }
    $('#cmbSDC').append(SDCoption);
    $('#cmbSDC').val('ALL');
    
    $('#cmbSDC').selectmenu();
    $('#txtOwner').textinput();
    $('#txtVesselFilter').textinput();
    $('#txtFromDate').textinput();
    $('#txtToDate').textinput();
    $('#btnShow').button();
    // $('#btnReport').button();


    $("#txtOwner").autocomplete({
    source: owners_array,
    minLength: 1,
    matchFromStart: false,
    messages: {
        noResults: '',
        results: function() {}
    },
    select: function( event, ui ) {
        selected_owner_id = ui.item.ID;
    }
});
 $("#txtVesselFilter").autocomplete({
    source: vessel_array,
    minLength: 1,
    matchFromStart: false,
    messages: {
        noResults: '',
        results: function() {}
    },
    select: function( event, ui ) {
        selected_vessel_id = ui.item.ID;
        selected_vessel_name = ui.item.label;
    }
});
 $("#filterDiv").slideDown("fast");
}

function show_years() {

    hide_all();
    current_step = show_years;
    var currentTime = new Date();
    if(Date.parse($.jStorage.get('filter_save_time'))+86400000 < Date.parse(currentTime) || $.jStorage.get('filter_save_time') == null) {
        $.ajax({
          url: "https://www.getvesseltracker.com/sdc_vendor_spend_prod/get_vessel_list_filter.php?pal_user_id="+ $.jStorage.get("pal_user_id"),      
          datatype: 'json',
          beforeSend: function() {
            $(".spinner_index").css('display','block');
            $(".spinner_index").center();
        },
        success: function(data){
            // console.log(currentTime);
            $.jStorage.set("filter_save_time", currentTime);
            owners_array = data["owner"];
            vessel_array = data["vessel"];
            $.jStorage.set("filter_owners", owners_array);
            $.jStorage.set("filter_vessels", vessel_array);
            $('.spinner_index').hide();
            var results_div = "<ul data-role='listview' data-divider-theme='b' data-inset='true' id='listview'>";
            var cur_year = new Date().getFullYear();
            for(var i=0; i<3; i++) {
               // results_div += "<li><a href='javascript:show_top_vendors_by_turnover(\""+(2013 - i)+"\")' id='"+(2013 - i)+"'>"+(2013 - i);
               results_div += "<li data-theme='c'><a data-transition='slide' href='javascript:show_more_filter(\""+(cur_year - i)+"\")' id='"+(cur_year - i)+"'>"+(cur_year - i);
                // results_div += "<span class='chevron'></span>";
                results_div += "</a></li>";
            }
            results_div += "</ul>";  

            // console.log(results_div);
            $('.spinner_index').hide();
            // $('#vendor_classification').hide();
            // $('#back_button').css('display','none');
            // $('#view_title').show();
            // $('#view_title').html('Please select a year.');
            $('#index_content').html(results_div);
            $('#index_content').show();
            $('#listview').listview();

            },
        error: function() {        
                alert('Please try again in a minute.');
                $('.spinner_index').hide();
            }
        });
    }
    else{
        owners_array = $.jStorage.get('filter_owners');
        vessel_array = $.jStorage.get('filter_vessels');

        var results_div = "<ul data-role='listview' data-divider-theme='b' data-inset='true' id='listview'>";
        var cur_year = new Date().getFullYear();
        for(var i=0; i<3; i++) {
           // results_div += "<li><a href='javascript:show_top_vendors_by_turnover(\""+(2013 - i)+"\")' id='"+(2013 - i)+"'>"+(2013 - i);
           results_div += "<li data-theme='c'><a data-transition='slide' href='javascript:show_more_filter(\""+(cur_year - i)+"\")' id='"+(cur_year - i)+"'>"+(cur_year - i);
            // results_div += "<span class='chevron'></span>";
            results_div += "</a></li>";
        }
        results_div += "</ul>";
        $('#index_content').html(results_div);
        $('#index_content').show();
        $('#listview').listview();
    }
    if ($.jStorage.get("push_registered") == null)
        register_push_service();
}

// show_years();

// hide_all();

var pal_user_id,push_registered;

$(document).ready(function() {
    try{
        pal_user_id = $.jStorage.get("pal_user_id");
        // $.jStorage.set("pal_user_id", '');
        push_registered = $.jStorage.get("push_registered");
    }
    catch(err){
    }
    if (pal_user_id == null) {
      hide_all();
      $('.login').show();
    } else {
        $('.login').hide();
        show_years();
    }
    
});

// $('#login_submit').click(function(){
//     hide_all();
//     $('#login_form').submit();
//     alert('hai');
// });

function login_failure() {
  $(".spinner").css('display','none');
  $("#ajax_error").show();
  $("#ajax_error").html('Wrong Email or Password. Please try again.');
  $("#ajax_error").attr('style','display:block; text-align:center;');
}

$('#login_form').submit(function(){
    var username = $('#login_email').val();
    var password = $('#login_password').val();

    $.jStorage.set("pal_user_id", username);
    var form_data= {
        'username': username,
        'password': password
    };
    req = $.ajax({
        url: 'https://getVesselTracker.com/ldap_test_spend_tracker.php',
        type: "post",
        data: form_data,
        beforeSend: function() {
            $(".spinner").css('display','inline');
            $(".spinner").center();
        },

        success : function(response) {
            if (response == 'success') {
                $('.login').hide();
                $.jStorage.set("pal_user_id", username);
                show_years();
            // location.reload();
            } else {
                login_failure();
            }
        }
    });
  //}
  $('#login_password').blur();
  $('#login_email').blur();
  return false;
});

function write_reg_id_to_aws(push_reg_id) {

    var pal_user_id = $.jStorage.get("pal_user_id");
    var form_data= {
      'pal_user_id': pal_user_id,
      'gcm_registry_id': push_reg_id,
      'app': 'spend_tracker'
    };
    req = $.ajax({
      url: 'https://getVesselTracker.com/register_push_device.php',
      type: "post",
      data: form_data,

      success : function(response) {
        $.jStorage.set("push_registered", true);
        alert('success reg');
      }
      
      // error : function(xhr, textStatus, errorThrown ) {
      //   if (textStatus == 'timeout') {
      //       this.tryCount++;
      //       if (this.tryCount <= this.retryLimit) {
      //           //try again
      //           $.ajax(this);
      //           return;
      //       }            
      //       return;
      //   }
      //   if (xhr.status == 500) {
      //       //handle error
      //   } else {
      //       //handle error
      //   }
      // }
    });
}

function register_push_service() {
    alert('trying register: '+ window.plugins.pushNotification);
    // if (window.plugins.pushNotification != null) {
      if ( device.platform == 'android' || device.platform == 'Android' )
      {
        var push_notification = window.plugins.pushNotification;
        alert('init');
        push_notification.register(successHandler, errorHandler,{"senderID":"213694031514","ecb":"onNotificationGCM"});
        alert('reg done');
        // alert('reg');
        
          // pushNotification.register(
          //     app.successHandler,
          //     app.errorHandler, {
          //         "senderID":"213694031514",
          //         "ecb":"app.onNotificationGCM"
          //     });
        // }
        // else
        //   {alert('trying IOS');
        // var pushNotification = window.plugins.pushNotification;
        // pushNotification.register(
        //  app.tokenHandler,
        //  app.errorHandler, {
        //   "badge":"true",
        //   "sound":"true",
        //   "alert":"true",
        //   "ecb":"app.onNotificationAPN"
        // });
        }
    // }
}

// result contains any message sent from the plugin call
function successHandler (result) {
    alert('result = ' + result);
}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    alert('error = ' + error);
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    // alert('device token = ' + result);
}

// iOS
function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

// Android
function onNotificationGCM(e) {
    alert('notif');
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log("Regid " + e.regid);
                alert(e.regid);
                write_reg_id_to_aws(e.regid);
            }
        break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = '+e.message+' msgcnt = '+e.msgcnt);
        break;

        case 'error':
          alert('GCM error = '+e.msg);
        break;

        default:
          alert('An unknown GCM event has occurred');
          break;
    }
}

$('.my-navbarbtn').click(function(){
  $('.my-navbar-content').hide();
  var res= '#'+$(this).attr('id'); 
  var a = res.substring(3);
  $('#'+a).show();
})

// <ul class='list'>
//                 <li>
//                   <a href="#" data-transition="slide-in">
//                     Vendor A
//                     <span class="chevron"></span>
//                     <span class="count">$1470</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" data-transition="slide-in">
//                     Vendor B
//                     <span class="chevron"></span>
//                     <span class="count">$1490</span>
//                   </a>
//                 </li>
//               </ul>


function show_vendors_turnover_report(year) {
    hide_all();
    selected_from_date = $('#txtFromDate').val();
    selected_to_date = $('#txtToDate').val();
    //alert(selected_from_date);

    // if(selected_from_date=='')
    //     selected_from_date=undefined;
    // if(selected_to_date=='')
    //     selected_to_date=undefined;

    current_step = function(){
        show_vendors_turnover_report(year);
    };
    var owner = selected_owner_id;
    var vessel = selected_vessel_id;
    var sdc = $('#cmbSDC').val();
    
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend_prod/get_vendor_turnover_report.php?year=' + year + '&sdcCode=' + sdc + '&ownerid='+owner 
        + '&vesselobjectid=' + vessel + '&fromdate=' + selected_from_date + '&todate=' + selected_to_date,
        beforeSend: function() {
            $(".spinner_index").css('display','block');
            $(".spinner_index").center();
        },

        success : function(response) {
            // var results = JSON.parse(response);
            var results = response;
            var Total1 = new Array();
            var Total2 = new Array();

            var results_div = "<input id='btnExport' type='button' value='Export as PDF' onClick='export_pdf("+ year +")'></input><table border='1' cellpadding='0' cellspacing='0'>";
            results_div += "<tr><td colspan='9'><h1>Summary of BSM Deutschland Supplier Engagement </h1></td></tr>";

            results_div += "<tr><td></td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td colspan='2'><h3>" + results[i]['Year'] + "</h3></td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
                Total1.push(parseFloat(results[i]['ContractedSuppliers'])
                    + parseFloat(results[i]['ApprovedSuppliers']) + parseFloat(results[i]['VettingInspection']) 
                    + parseFloat(results[i]['ClassFlagSateInsurance']) 
                    );
                Total2.push(parseFloat(Total1[i]) + parseFloat(results[i]['AdhocSuppliers']));
            }
            results_div += "</tr>";

            results_div += "<tr><td><h3>Description</h3></td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td><h3>Amount in USD</h3></td><td><h3>Potential for Harmonization (%)</h3></td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td>Contracted Suppliers</td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td>" + parseFloat(results[i]['ContractedSuppliers']) +"</td><td>" + 
                (parseFloat(results[i]['ContractedSuppliers'])/ parseFloat(Total2[i]) * 100).toFixed() + "%</td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td>Approved Suppliers</td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td>" + parseFloat(results[i]['ApprovedSuppliers']) +"</td><td>" + 
                (parseFloat(results[i]['ApprovedSuppliers'])/ parseFloat(Total2[i]) * 100).toFixed() + "%</td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td>Vetting Inspection</td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td>" + parseFloat(results[i]['VettingInspection']) +"</td><td>" + 
                (parseFloat(results[i]['VettingInspection'])/ parseFloat(Total2[i]) * 100).toFixed() + "%</td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td>Class/Flag Sate and Insurance</td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td>" + parseFloat(results[i]['ClassFlagSateInsurance']) +"</td><td>" + 
                (parseFloat(results[i]['ClassFlagSateInsurance'])/ parseFloat(Total2[i]) * 100).toFixed() + "%</td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td><h3>Total Contracts/Approved/Class/Vetting Supplier Usage</h3></td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td><h3>" + parseFloat(Total1[i]) +"</h3></td><td><h3>" + 
                (parseFloat(Total1[i])/ parseFloat(Total2[i]) * 100).toFixed() + "%</h3></td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td>Adhoc Suppliers</td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td>" + parseFloat(results[i]['AdhocSuppliers']) +"</td><td>" + 
                (parseFloat(results[i]['AdhocSuppliers'])/ parseFloat(Total2[i]) * 100).toFixed() + "%</td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td><h3>TOTAL Spend UNDER SDC Deutschland</h3></td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td><h3>" + parseFloat(Total2[i]) +"</h3></td><td><h3>" + 
                (parseFloat(Total2[i])/ parseFloat(Total2[i]) * 100).toFixed() + "%</h3></td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";

            results_div += "<tr><td>Brokers, Bunkers ,Charterers</td>";
            for(var i=0; i<results.length; i++) {
                results_div += "<td>" + parseFloat(results[i]['BrokersBunkersCharterers']) +"</td><td></td>";
                if(i!= results.length-1)
                    results_div += "<td></td>";
            }
            results_div += "</tr>";
            results_div += "</table>";
            
            $('.spinner_index').hide();
            $('#index_content').hide();
            $('#btnBack').show();
            $('#vendor-turnover-report').html(results_div);
            $('#vendor-turnover-report').show();
            $('#back_button').css('display','inline-block');
            // $('#index_content').show();
            // $('#index_content').html(results_div);
            step_back = show_years;

            // console.log(results_div_con);

            $('.listview').listview();
        }
    });
}


function export_pdf(year) {
  //   var form_data= {
  //   'year': year,
  //   'sdcCode': $('#cmbSDC').val(),
  //   'ownerid': selected_owner_id,
  //   'vesselobjectid': selected_vessel_id,
  //   'fromdate': $('#txtFromDate').val(),
  //   'todate': $('#txtToDate').val(),
  // };

  // window.open('https://www.getvesseltracker.com/sdc_vendor_spend_prod/pdf_export/examples/vendor_turnover_report.php', '_blank');
  $('#new_window_parameter_year').val(year);
    // alert($('#new_window_parameter_year').val());
    $('#new_window_parameter_sdcCode').val($('#cmbSDC').val());
    // alert($('#new_window_parameter_sdcCode').val());
    $('#new_window_parameter_ownerid').val(selected_owner_id);
    $('#new_window_parameter_vesselobjectid').val(selected_vessel_id);
    $('#new_window_parameter_fromdate').val($('#txtFromDate').val());
    $('#new_window_parameter_todate').val($('#txtToDate').val());
    $('#invisible_form').submit();

  // $.ajax({
  //   url: 'https://www.getvesseltracker.com/sdc_vendor_spend_prod/pdf_export/examples/vendor_turnover_report.php',
  //   type: "post",
  //   data: form_data,
  //   success : function(response) {
  //       var w = window.open();
  //       $(w.document.body).html(response);
  //   }
  // });
}