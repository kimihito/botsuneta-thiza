/*--------------------------------------------------------------------
 FUNCTIONS

 Version:    1.0 - 2013
 author:     Load Interactive (André Fernandes)
 email:      andre.fernandes@load-interactive.com
 website:    http://www.load-interactive.com
 state:      development
 -----------------------------------------------------------------------*/

 /*-----------------------------------------------------------------------
  *
  *  Global Variables
  *
  -----------------------------------------------------------------------*/
var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

var date;
var notificationSuccess;
var notificationError;
var notificationInvalidEmail;
var color;

function countdown() 
{

    var end = Date.parse(date);
    var now = new Date();
    var distance = end - now;
    //alert(date);

    if(distance < 0) {
      clearInterval(timer);
      $('#wrapper #container ul.countdown li.days .value').html('000');
      $('#wrapper #container ul.countdown li.hours .value').html('00');
      $('#wrapper #container ul.countdown li.minutes .value').html('00');
      $('#wrapper #container ul.countdown li.seconds .value').html('00');
      return;
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    if(days <10)
    {
      days = '00'+days; 
    }
    else if(days > 9 && days < 100)
    {
      days = '0'+days;
    }
    else
    {
      days = days;
    }
    if(hours <10){ hours = '0'+hours; }
    if(minutes <10){ minutes = '0'+minutes; }
    if(seconds <10){ seconds = '0'+seconds; }

    $('#wrapper #container ul.countdown li.days .value').html(days);
    $('#wrapper #container ul.countdown li.hours .value').html(hours);
    $('#wrapper #container ul.countdown li.minutes .value').html(minutes);
    $('#wrapper #container ul.countdown li.seconds .value').html(seconds);
    
}

function validateEmail(email) 
{
    var errorMsg = "";
    
    //if (document.form.email.value=="" || document.form.email.value.indexOf('@')==-1 || document.form.email.value.indexOf('.')==-1 || document.form.email.value=="friend e-mail"){
    if (email=="" || email.indexOf('@')==-1 || email.indexOf('.')==-1 || email=="friend e-mail"){
        return false;
    }
    
    return true;
}

function writeNotification(type)
{
  $("#wrapper #container .subscribeAndSocial .newsletter #notifications").html(type).fadeIn().delay(2000).fadeOut();
}

function sendEmail() 
{
  var email = $("input[name=email]","#form").val();
  if (validateEmail(email) == true)
  {
    var data ="";
    data = $('#form').serialize();
    $.ajax(
    {
      type: 'post',
      url: 'send_mail.php',
      data: data,
      success: function(result)
      {
        if(parseInt(result))
        {
          writeNotification(notificationSuccess);
        }
        else
        {
          writeNotification(notificationError);
        }
        $("#form")[0].reset();
      }
    });
  }
  else
  {
    writeNotification(notificationInvalidEmail);
  }
}



function removeOrAddLinkSocialNetwork(type, container)
{
  if(container != '')
  {
    $('#wrapper #container .subscribeAndSocial .socialNetwork ul.social li.'+type+' a').attr("href", container);
  }
  else
  {
     $('#wrapper #container .subscribeAndSocial .socialNetwork ul.social li.'+type).remove();
  }
}


$(function()
{
    

 $.getJSON('container.json', function(data) 
 {
    date = data.container.date;
    notificationSuccess = data.container.notificationSuccess;
    notificationError = data.container.notificationError;
    notificationInvalidEmail = data.container.notificationInvalidEmail;
    color = data.container.color;
    
    $('#wrapper #container .title').html(data.container.title);
    $('#wrapper #container .subtitle').html(data.container.subTitle);
    $('#wrapper #container .spanSubtitle').html(data.container.subTitleSpan);
    $('#wrapper #container ul.countdown li.days .legendary').html(data.container.days);
    $('#wrapper #container ul.countdown li.hours .legendary').html(data.container.hours);
    $('#wrapper #container ul.countdown li.minutes .legendary').html(data.container.minutes);
    $('#wrapper #container ul.countdown li.seconds .legendary').html(data.container.seconds);

    $('#wrapper #container .subscribeAndSocial .newsletter .title').html(data.container.newsletterTitle +'<span>' + data.container.newsletterTitleSpan + '</span');
    $('#wrapper #container .subscribeAndSocial .socialNetwork .title').html(data.container.socialNetworksTitle +'<span>' + data.container.socialNetworksTitleSpan + '</span');

    $('#wrapper #container .subscribeAndSocial .newsletter form input[type="text"]').attr("placeholder", data.container.formPlaceholder);
    $('#wrapper #container .subscribeAndSocial .newsletter form input[type="submit"]').attr("value", data.container.formButton);
    $('#wrapper .copyright').html(data.container.footer + '<span>' + data.container.footerSpan + '</span>');
    
    $('#wrapper #container .containerDiamonds .first, #wrapper #container .containerDiamonds .second, #wrapper #container .containerDiamonds .third').css({'border-top-color': '#'+ data.container.color});
    $('#wrapper #container .subtitle, #wrapper #container .subscribeAndSocial .newsletter .title, #wrapper #container .subscribeAndSocial .socialNetwork .title, #wrapper footer').css({'color': '#'+ data.container.color});
    $('#wrapper #container .subscribeAndSocial .newsletter form input[type="submit"]').css('background-color','#'+data.container.color);
    $('#wrapper #container .subscribeAndSocial .socialNetwork ul.social li').css('border-color','#'+data.container.color);
    
    $('meta[name=keywords]').attr("content",data.container.keywords);
    $('meta[name=description]').attr("content",data.container.description);
    $('meta[name=author]').attr("content",data.container.author);
    $('link[rel=canonical]').attr("content",data.container.url);
    

    removeOrAddLinkSocialNetwork('facebook', data.container.linkFacebook);
    removeOrAddLinkSocialNetwork('twitter', data.container.linkTwitter);
    removeOrAddLinkSocialNetwork('gplus', data.container.linkGplus);
    removeOrAddLinkSocialNetwork('dribbble', data.container.linkDribbble);
    removeOrAddLinkSocialNetwork('flickr', data.container.linkFlickr);

  });

  timer = setInterval(countdown, 1000);

  $('#wrapper #container .subscribeAndSocial .newsletter form input[type="submit"]').click(function() 
  {
    sendEmail();
    
  return false;
  });

  $("#wrapper #container .subscribeAndSocial .socialNetwork ul.social li").click(function(){
      $(this).css('background-color','#3b3b3b');
  });
  
  $("#wrapper #container .subscribeAndSocial .newsletter form input[type='submit']").click(function(){
      $(this).css({'background-color':'#'+color, 'color':'#ffffff'});
  });
  //hover social network 
  $("#wrapper #container .subscribeAndSocial .socialNetwork ul.social li").hover(
    function () {
      $(this).css('background-color','#'+color);
    },
    function () {
      $(this).css('background-color','#3b3b3b');
    }
  );

  //hover button submit
  $("#wrapper #container .subscribeAndSocial .newsletter form input[type='submit']").hover(
    function () {
      $(this).css({'background-color':'#ffffff', 'color':'#'+color});
    },
    function () {
      $(this).css({'background-color':'#'+color, 'color':'#ffffff'});
    }
  );
  
  //placeholder ie
  if(navigator.userAgent.indexOf("MSIE") > 0 )
  {
    var input = document.createElement("input");
    if(('placeholder' in input) == false)
    {
        $('[placeholder]').focus(function()
        {
            var i = $(this);
            if(i.val() == i.attr('placeholder'))
            {
                i.val('').removeClass('placeholder');
                if(i.hasClass('password'))
                {
                    i.removeClass('password'); this.type='password';
                }
            }
        }).blur(function()
        {
            var i = $(this);
            if(i.val() == '' || i.val() == i.attr('placeholder'))
            {
                if(this.type=='password')
                {
                    i.addClass('password'); this.type='text';
                }
                i.addClass('placeholder').val(i.attr('placeholder'));
            }
        }).blur().parents('form').submit(function()
        {
            $(this).find('[placeholder]').each(function()
            {
                var i = $(this);
                if(i.val() == i.attr('placeholder')) i.val('');
            });
        });
    }
  }
});