/*
*   This software called - np - is a lightwight MVP Framework for building web applications and
*   was developed by Christian Peters
*
*   Copyright (C) 2016 Christian Peters
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*   Contact: Christian Peters <c.peters.eshop@gmail.com>
*/

np.module ('dom.setInputType', function ($input, type) {
    switch (type) {
        case 'number':
            setInputNumber ();
            break;
        case 'date':
            setInputDate ();
            break;
        case 'datetime':
            setInputDatetime ();
            break;
        case 'mail':
            setInputMail ();
            break;
        case 'text':
            setInputText ();
            break;
    }
    
    function setInputDate () {
        var time;
        
        time    = $input.val ().match (/\d{2}\.{1}\d{2}\.{1}\d{4}/) ? $input.val () : null;

        $input.datetimepicker ({
            mask: true,
            value:  time,
            format: 'd.m.Y',
            closeOnDateSelect: true,
            lang: 'de',
            onSelectDate: function (time) {
                $input.change ();
            }
        });
    }
    
    function setInputDatetime () {
        var time, allowTimes, step;
        
        time        = $input.val ().match (/\d{2}\.{1}\d{2}\.{1}\d{4}\s{1}\d{2}\:{1}\d{2}/) ? $input.val () : null;

        allowTimes  = $input.data ('allowed-times');
        allowTimes  = typeof allowTimes === 'string' && allowTimes.length > 0 ? allowTimes.split (',') : new Array ();
        $input.removeProp ('data-allowed-times');
        
        step        = $input.data ('step');
        step        = typeof step === 'string' ? parseInt (step, 10) : 60;
        $input.removeProp ('data-step');
        
        $input.datetimepicker ({
            mask: true,
            value:  time,
            format: 'd.m.Y H:i',
            closeOnDateSelect: true,
            lang: 'de',
            allowTimes: allowTimes,
            step: step,
            validateOnBlur: true,
            defaultTime: '18:00',
            minDate: 0,
            onGenerate:function( ct ){
                jQuery(this).find('.xdsoft_date.xdsoft_weekend')
                .addClass('xdsoft_disabled');
            },
            onSelectDate: function (time) {
                $input.change ();
            }
        });
    }
    
    function setInputMail () {
        $input.on ('keyup', function (e) {
            var key, match;

            key     = e.keyCode || e.which;

            if ($.inArray(key, [46, 8, 9, 27, 13, 110, 190]) !== -1 || 
                // Allow: Ctrl+A
                (key === 65 && e.ctrlKey === true) || 
                // Allow: Ctrl+V
                (key === 86 && e.ctrlKey === true) || 
                // Allow: home, end, left, right, #, $, % 
                (key >= 35 && key <= 39) ||
                // Allow: !, *, +, /, =, ?, ^, -, `, {, |, }, ~
                (key === 33 || key === 42 || key === 43 || key === 47
                 || key === 61 || key === 63 || key === 94 || key === 45
                 || key === 96 || (key >= 123 && key <= 126)) ||
                // Allow: A-Z & a-z
                ((key >= 65 && key <= 90) || (key >= 97 && key <= 122)) ||
                // Allow: @, ., _
                (key === 64 || key === 46 || key === 95) ||
                // Allow: backspace
                (key === 8)
            ) {
                match   = $(this).val().match(/[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

                if (match === null && !$(this).hasClass ('invalid-mail'))       { $(this).addClass ('invalid-mail');    }
                else if (match !== null && $(this).hasClass ('invalid-mail'))   { $(this).removeClass ('invalid-mail'); }

                 // let it happen, don't do anything
                 return;
            }

            // Ensure that it is a number and stop the keypress
            if (e.altKey || (e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105)) {
                e.preventDefault();
            }
        });

        $input.on ('paste', function (e) {
            var $this, oldVal, newVal, match;

            $this   = $(this);
            oldVal  = $this.val();

            window.setTimeout (function () {
                newVal  = $this.val ();
                match   = newVal.match(/[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

                if (match === null && !$this.hasClass ('invalid-mail'))     { $this.addClass ('invalid-mail');      }
                else if (match !== null && $this.hasClass ('invalid-mail')) { $this.removeClass ('invalid-mail');   }
            }, 0);
        });
    }
    
    function setInputNumber () {
        $input.on ('keydown', function (e) {
            var key;

            key     = e.keyCode || e.which;

            if ($.inArray(key, [46, 8, 9, 27, 13, 110, 190]) !== -1 || 
                // Allow: Ctrl+A
                (key === 65 && e.ctrlKey === true) || 
                // Allow: Ctrl+V
                (key === 86 && e.ctrlKey === true) || 
                // Allow: home, end, left, right
                (key >= 35 && key <= 39)
            ) {
                 // let it happen, don't do anything
                 return;
            }

            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105)) {
                e.preventDefault();
            }
        });

        $input.on ('paste', function (e) {
            var $this, oldVal, newVal, match;

            $this   = $(this);
            oldVal  = $this.val();

            window.setTimeout (function () {
                newVal  = $this.val();
                match   = newVal.match(/(?!^\d+$)^.+$/);

                if (match !== null) { 
                    $this.val (oldVal);   
                }
            }, 0);
        });
    }
    
    function setInputText () {
        var maxInput;
        
        maxInput  = $input.data ('max');
        
        if (maxInput) {
            $input.on ('keydown', function () {
                if ($(this).val ().length > maxInput) {
                    $(this).val ($(this).val ().slice (0, maxInput));
                }
            });
            
            $input.on ('keyup', function () {
                if ($(this).val ().length > maxInput) {
                    $(this).val ($(this).val ().slice (0, maxInput));
                }
            });

            $input.on ('paste', function () {
                if ($(this).val ().length > maxInput) {
                    $(this).val ($(this).val ().slice (0, maxInput));
                }
            });
        }
    }
});