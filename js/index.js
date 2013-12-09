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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
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
 }

var step_back = function() {};

var current_step = function() {};

// Nijo Starts!
var sdcs = new Array('BSMBE', 'BSMCN', 'BSMCY', 'BSMDE', 'BSMGR', 'BSMHK', 'BSMIN', 'BSMIM', 'BSMPL', 'BSMJP', 'BSMSG', 'BSMUK', 'ALL');

function show_top_vendors_by_turnover(year) {
    hide_all();
    current_step = function(){
                show_top_vendors_by_turnover(year);
            };
    var owner = selected_owner_id;
    var vessel = selected_vessel_id;
    var sdc = $('#cmbSDC').val();
    
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend_dev/get_top_vendors.php?year=' + year + '&sdcCode=' + sdc + '&ownerid='+owner + '&vesselobjectid=' + vessel,
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
            var vendor_array = new Array();
            for(var i=0; i<results.length; i++) {
                var temp = new Array;
                temp.id = results[i]['vendor_id'];
                temp.label = results[i]['NAME'];
                temp.amount = results[i]['INVOICE_AMOUNT_USD'];
                vendor_array.push(temp);
                if(results[i]['APPROVAL_STATUS'] == "CONTRACTED"){
                    if(con_count >= 50) continue;
                    results_div_con += "<li data-theme='c'><a href='javascript:show_top_invoices_by_vendor_year("+results[i]['vendor_id']+", "+year+")' id='"+results[i]['vendor_id']+"'> <span class='list_text'>"+toTitleCase(results[i]['NAME'])+"</span>";
                    // results_div += "<span class='chevron my-chevron'></span>";
                    results_div_con += "<span class='my-count'>USD "+parseFloat(results[i]['INVOICE_AMOUNT_USD']).formatMoney(2, '.', ',')+"</a></span></li>";
                    con_count++;
                }
                else if(results[i]['APPROVAL_STATUS'] == "APPROVED"){
                    if(app_count >= 50) continue;
                    results_div_app += "<li data-theme='c'><a href='javascript:show_top_invoices_by_vendor_year("+results[i]['vendor_id']+", "+year+")' id='"+results[i]['vendor_id']+"'> <span class='list_text'>"+toTitleCase(results[i]['NAME'])+"</span>";
                    // results_div += "<span class='chevron my-chevron'></span>";
                    results_div_app += "<span class='my-count'>USD "+parseFloat(results[i]['INVOICE_AMOUNT_USD']).formatMoney(2, '.', ',')+"</a></span></li>";
                    app_count++;
                }
                else {
                    if(else_count >= 50) continue;
                    results_div += "<li data-theme='c'><a href='javascript:show_top_invoices_by_vendor_year("+results[i]['vendor_id']+", "+year+")' id='"+results[i]['vendor_id']+"'> <span class='list_text'>"+toTitleCase(results[i]['NAME'])+"</span>";
                    // results_div += "<span class='chevron my-chevron'></span>";
                    results_div += "<span class='my-count'>USD "+parseFloat(results[i]['INVOICE_AMOUNT_USD']).formatMoney(2, '.', ',')+"</a></span></li>";
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
                    searched_vendor += "<span class='my-count'>USD "+parseFloat(ui.item.amount).formatMoney(2, '.', ',')+"</a></span></li>";                   
                    
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

    current_step = function(){
                show_top_invoices_by_vendor_year(vendor_id, year);
            };
    var sdc = $('#cmbSDC').val();
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend_dev/get_top_invoices_by_vendor_year.php?VendorID='+vendor_id+'&year='+year,
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
                console.log(results[i]['Vessel_name']);
                if(results[i]['Vessel_name'])
                    results_div += "<div class='sub_text vessel_name'> <span class='details_title'>Vessel: </span><b>" + toTitleCase(results[i]['Vessel_name']) + "</b></div>";
                
                results_div += "<div class='sub_text invoice_no'> <span class='details_title'>Invoice No: </span><b>" + toTitleCase(results[i]['VENDOR_INVOICE_NO']) + "</b></div></span>";
                results_div += "<div class='sub_text invoice_register_date'> <span class='details_title'>Registration Date: </span><b>" + results[i]['REGISTRATION_DATE'].split('T',1)[0] + "</b></div></span>";
                results_div += "<div class='sub_text invoice_paid_date'> <span class='details_title'>Pay Due Date: </span><b>" + results[i]['PAY_DUE_DATE'].split('T',1)[0] + "</b></div></span>";
                // results_div += "<span class='chevron'></span>";
                results_div += "<span class='my-count'>USD "+parseFloat(results[i]['TOTAL_GROUP_CURRENCY']).formatMoney(2, '.', ',')+"</span></a></li>";
            }
            results_div += "</ul>";

            // var results_div = "<ul class='list'>";
            // for(var i=0; i<results.length; i++) {
            //     results_div += "<li><a href='javascript:show_vendor_invoices(\""+vendor_id+"\", \"" + year + "\")'";
            //     results_div += "<span class='list_text'>Vendor: <b>"+results[i]['vendor_name'] +"</b></span>";
            //     results_div += "<span class='list_text'>Vessel: <b>"+results[i]['Vessel_name'] +"</b></span>";
            //     // results_div += "<span class='chevron'></span>";
            //     results_div += "<span class='count'>USD "+parseFloat(results[i]['TOTAL_GROUP_CURRENCY']).formatMoney(2, '.', ',')+"</span></a></li>";
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
                    results_div += "<span class='count'>USD "+parseFloat(results[i]['vessel_amount']).formatMoney(2, '.', ',')+"</span></a></li>";
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

function show_more_filter(year) {
    if($("#"+year).closest('li').next('#filterDiv').length>0){
        $("#filterDiv").slideToggle('slow');
        return false;
    }  
    else if ($("#filterDiv").length>0)  {
        $("#filterDiv").slideUp(function(){             
            $('#cmbSDC').val('ALL');
            $("#filterDiv").insertAfter($("#"+year).closest('li'));
            $("#filterDiv").slideDown("slow"); 
        });
        return false;
    }
    var filterDiv="<div id='filterDiv' data-role='content' style='display:none;-webkit-box-shadow: inset 0px -2px 10px 1px rgba(0, 0, 0, .3);box-shadow: inset 0px -2px 10px 1px rgba(0, 0, 0, .3);'>";
    filterDiv+="<div style='padding:10px 0px 10px 30px;'><table border='0' cellpadding='0' cellspacing='0'><tr><td>SDC</td><td>";
    filterDiv+="<select id='cmbSDC'></select>";
    filterDiv+="</td></tr><tr><td style='padding-right:5px'>Owner</td><td><div><input id='txtOwner' name='search' type='text' data-type='search' class='search-textbox' placeholder='Search for an Owner' /></div></td></tr>";
    filterDiv+="</td></tr><tr><td style='padding-right:5px'>Vessel</td><td><div><input id='txtVesselFilter' type='search' class='search-textbox' placeholder='Search for a Vessel' /></div></td></tr>";
    filterDiv+="<tr><td colspan='2' style='text-align:right'><input id='btnShow' type='button' value='Show' onClick='show_top_vendors_by_turnover("+year+")' /></td></tr></table></div></div>";

    $("#"+year).closest('li').after(filterDiv);

    $('#search-textbox').textinput();

    // Fill SDC dropdown
    var SDCoption = '';
    for (i=0;i<sdcs.length;i++){
       SDCoption += '<option value="'+ sdcs[i] + '">' + sdcs[i] + '</option>';
    }
    $('#cmbSDC').append(SDCoption);
    $('#cmbSDC').val('ALL');

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
    $("#filterDiv").slideDown("slow");
}

function show_years() {
    hide_all();
    current_step = show_years;
    $.ajax({
      url: "https://www.getvesseltracker.com/sdc_vendor_spend_dev/get_vessel_list_filter.php",      
      datatype: 'json',
      beforeSend: function() {
        $(".spinner_index").css('display','block');
        $(".spinner_index").center();
      },
      success: function(data){
        owners_array = data["owner"];
        vessel_array = data["vessel"];
        $('.spinner_index').hide();
        var results_div = "<ul data-role='listview' data-divider-theme='b' data-inset='true' id='listview'>";
        for(var i=0; i<3; i++) {
           // results_div += "<li><a href='javascript:show_top_vendors_by_turnover(\""+(2013 - i)+"\")' id='"+(2013 - i)+"'>"+(2013 - i);
            results_div += "<li data-theme='c'><a data-transition='slide' href='javascript:show_more_filter(\""+(2013 - i)+"\")' id='"+(2013 - i)+"'>"+(2013 - i);
            // results_div += "<span class='chevron'></span>";
            results_div += "</a></li>";
        }
        results_div += "</ul>";  

        // console.log(results_div);
        $('.spinner_index').hide();
        // $('#vendor_classification').hide();
        // $('#back_button').css('display','none');
        $('#index_content').show();
        // $('#view_title').show();
        // $('#view_title').html('Please select a year.');
        $('#index_content').html(results_div);
        $('#listview').listview();

      },
     error: function() {        
        alert('Please try again in a minute.');
        $('.spinner_index').hide();
     } 
    });
}

show_years();


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


