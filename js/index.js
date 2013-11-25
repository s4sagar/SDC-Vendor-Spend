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
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

function toTitleCase(str)
{
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

var step_back = function() {};

function show_top_vendors_year(year) {
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend/get_top_vendors_by_year.php?year='+year,
        beforeSend: function() {
            $(".spinner_index").css('display','block');
            $(".spinner_index").center();
        },
      
        success : function(response) {
            // var results = JSON.parse(response);
            var results = response;
            var results_div = "<ul class='list'>";
            for(var i=0; i<results.length; i++) {
                results_div += "<li><a href='javascript:show_top_invoices_by_vendor_year("+results[i]['vendor_id']+", "+year+")' id='"+results[i]['vendor_id']+"'> <span class='list_text'>"+toTitleCase(results[i]['NAME'])+"</span>";
                // results_div += "<span class='chevron my-chevron'></span>";
                results_div += "<span class='my-count'>USD "+parseFloat(results[i]['INVOICE_AMOUNT_USD']).formatMoney(2, '.', ',')+"</a></span></li>";
            }
            results_div += "</ul>";
            $('.spinner_index').hide();
            $('#index_content').hide();
            $('#vendor_categories').show();
            $('#vendor_classification').show();
            $('#contracted').html(results_div);
            $('#approved').html(results_div);
            $('#adhoc').html(results_div);
            $('#back_button').css('display','inline-block');
            $('#view_title').show();
            $('#view_title').html('Highest Turnover Vendors in ' + year);
            // $('#index_content').show();
            // $('#index_content').html(results_div);
            step_back = show_years;
        }
    });
}

function show_top_invoices_by_vendor_year(vendor_id, year) {
    req = $.ajax({
        url: 'https://www.getvesseltracker.com/sdc_vendor_spend/get_top_invoices_by_vendor_year.php?VendorID='+vendor_id+'&year='+year,
        beforeSend: function() {
            $(".spinner_index").css('display','inline');
            $(".spinner_index").center();
        },
      
        success : function(results) {
            // var results = JSON.parse(response);
            var results_div = "<ul class='list'>";
            var vendor_name;
            for(var i=0; i<results.length; i++) {
                vendor_name = toTitleCase(results[i]['vendor_name']);
                results_div += "<li><span class='list_text'>";
                if (results[i]['TITLE'])
                    results_div += "<div class='sub_text vessel_name'> <span class='details_title'><b>" + toTitleCase(results[i]['TITLE']) + "</b></span></div>"
                // results_div += "<div class='sub_text vessel_name'> <span class='details_title'>Vendor: </span><b>" + toTitleCase(results[i]['vendor_name']) + "</b></div>";
                results_div += "<div class='sub_text vessel_name'> <span class='details_title'>Vessel: </span><b>" + toTitleCase(results[i]['Vessel_name']) + "</b></div>";
                results_div += "<div class='sub_text invoice_no'> <span class='details_title'>Invoice No: </span><b>" + toTitleCase(results[i]['VENDOR_INVOICE_NO']) + "</b></div></span>";
                results_div += "<div class='sub_text invoice_register_date'> <span class='details_title'>Registration Date: </span><b>" + toTitleCase(results[i]['REGISTRATION_DATE']) + "</b></div></span>";
                results_div += "<div class='sub_text invoice_paid_date'> <span class='details_title'>Pay Due Date: </span><b>" + toTitleCase(results[i]['PAY_DUE_DATE']) + "</b></div></span>";
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
            $('#vendor_classification').show();
            $('#contracted').html(results_div);
            // $('#approved').html(results_div);
            // $('#adhoc').html(results_div);
            $('#view_title').html('Highest Invoices of ' + vendor_name + ' In ' + year);
            
            
            
            $('#back_button').css('display','inline-block');
            step_back = function(){
                show_top_vendors_year(year);
            };

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

https://www.getvesseltracker.com/sdc_vendor_spend/get_vendor_invoices.php?sdc=BSMCN&vendor_name=AAGE%20HEMPEL%20AS

function show_sdc_screen(id) {
    $('#index_content').hide();
    $('#vendor_classification').show();
    $('#back_button').css('display','inline-block');
    step_back = function(){
        $('#vendor_classification').hide();
        $('#back_button').css('display','none');
        $('#index_content').show();
    };
}

function show_years() {
    var results_div = "<ul class='list'>";
    for(var i=0; i<3; i++) {
        results_div += "<li><a href='javascript:show_top_vendors_year(\""+(2013 - i)+"\")' id='"+(2013 - i)+"'>"+(2013 - i);
        results_div += "<span class='chevron'></span>";
        results_div += "</a></li>";
    }
    results_div += "</ul>";
    $('.spinner_index').hide();
    $('#vendor_classification').hide();
    $('#back_button').css('display','none');
    $('#index_content').show();
    $('#view_title').show();
    $('#view_title').html('Please select a year.');
    $('#index_content').html(results_div);
}

show_years();

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