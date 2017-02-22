np.module ('wysiwyg', (function () {
    function focusRangyHelper (wysiwyg) {
        var range, selection, helper, span;
              
        helper      = wysiwyg.data ('rangy-helper');

        if (helper) {
            range       = rangy.createRange ();
            selection   = rangy.getSelection ();

            if ($(helper).hasClass ('empty')) {
                range.setStart (helper.childNodes[0], 1);
                range.collapse (true);
            } else {
                range.selectNode (helper);
            }
            
            selection.setSingleRange (range);
        }
    }
    
    function removeRangyHelper (wysiwyg) {
        wysiwyg.data ('rangy-helper', false);

        wysiwyg.find ('.rangy-helper').each (function () {
            var html;
            
            html    = $(this).html ().replace (/[\u200B-\u200D\uFEFF]/g, '');
            
            $(this).replaceWith (html);
        });
    }
    
    function addRangyHelper (wysiwyg) {
        var selection, range, helper, content;
        
        selection   = rangy.getSelection ();
        helper      = document.createElement ('span');

        $(helper).addClass ('rangy-helper');

        range   = selection.getRangeAt (0);
        content = $(range.extractContents ());

        if (!selection.isCollapsed) {
            helper  = $('<span class="rangy-helper"></span>');
            helper.append (content);
        } else {
            helper  = $('<span class="rangy-helper empty">&#8203;</span>');
        }

        range.insertNode (helper[0]);

        helper  = wysiwyg.find ('.rangy-helper')[0];

        wysiwyg.data ('rangy-helper', helper);
    }
    
    function insertLineBreak () {
        var selection, range, br;
        
        selection   = rangy.getSelection ();
        
        if (selection.rangeCount) {
            br      = document.createElement ('br');
            range   = selection.getRangeAt (0);
            
            range.deleteContents ();
            range.insertNode (br);
            br.insertAdjacentHTML('afterend', '&#8203;');

            range.collapseAfter (br);
            selection.setSingleRange (range);
        }
    }
    
    function cleanHtml (html) {
        var div;
        
        div = $('<div></div>');
        
        div.append (html).find ('.custom-span').each (function () {
            var replace;
            
            replace = $(this).html ().empty () || typeof $(this).attr ('style') === 'undefined';
            
            if (replace) {
                $(this).replaceWith ($(this).html ());
            }
        });
        
        return div.html ();
    }
    
    function applyCSS (wysiwyg, options, onParent) {
        var _this, span, helper, parent, parentStyle, applyStyle, hasChilds,
            newHtml, innerHtml, leftHtml, centerHtml, rightHtml;
        
        
        onParent    = typeof onParent === 'boolean' ? onParent : false;

        helper      = $(wysiwyg.data ('rangy-helper'));
        parent      = helper.parent ('.custom-span');
        parentStyle = '';
        hasChilds   = helper.find ('.custom-span').length > 0;
        applyStyle  = np.jsonClone (options);
                 
        if (onParent) {
//            console.log ('onadwda');
        } else {
            if (parent.length > 0) {
                newHtml     = $('<span></span>');
                parentStyle = parent.attr ('style');
                innerHtml   = parent[0].innerHTML;

                leftHtml    = $('<span class="custom-span">'+innerHtml.slice (0, innerHtml.indexOf ('<s')) + '</span>');
                centerHtml  = $(innerHtml.slice (innerHtml.indexOf ('<s'), innerHtml.indexOf ('</span>')+7));
                rightHtml   = $('<span class="custom-span">'+innerHtml.slice (innerHtml.indexOf ('</span>')+7)+'</span>');

                if (typeof parentStyle !== 'undefined') {
                    leftHtml.attr ('style', parentStyle);
                    centerHtml.attr ('style', parentStyle);
                    rightHtml.attr ('style', parentStyle);
                }

                newHtml.append (leftHtml);
                newHtml.append (centerHtml);
                newHtml.append (rightHtml);

                parent.replaceWith (newHtml.html ());

                helper  = wysiwyg.find ('.rangy-helper');
            }

            if (helper.length > 0 ) {
                $.each (applyStyle, function (key, val) {
                    var newVal;
                    
                    newVal  = key === 'color' || helper.css (key) !== val ? val : '';

                    helper.css (key, newVal);
                    
                    applyStyle[key] = newVal;
                });

                helper.addClass ('custom-span');
                helper.removeClass ('rangy-helper');

                wysiwyg.data ('rangy-helper', helper[0]);
            }

            if (hasChilds) {
                helper.contents ().each (function () {
                    _this   = $(this);
                    
                    if (this.nodeType === 3) {
                        span    = $('<span class="custom-span">'+((typeof this.textContext !== 'undefined' ) ? this.textContext : '&#8203;')+'</span>');

                        $.each (applyStyle, function (key, val) {
                            span.css (key, val);
                        });

                        $(this).replaceWith (span);
                    } else if (this.nodeName.toLowerCase () !== 'br') {
                        $.each (applyStyle, function (key, val) {
                            _this.css (key, val);
                        });
                    }
                });

                helper.removeClass ('custom-span');
                helper.addClass ('rangy-helper');

                wysiwyg.data ('rangy-helper', helper[0]);
            }
        }
    }

    $(document).on ('mousedown', '*[contenteditable=true]', function (e) {
        var wysiwyg;
        
        wysiwyg     = $(document).data ('wysiwyg');

        if (wysiwyg) {
            removeRangyHelper (wysiwyg);
        }        
    });

    $(document).on ('keydown', '*[contenteditable=true]', function (e) {
        var wysiwyg, key, isSelecting, isRemoving, helper;

        key         = e.keyCode || e.which;
        isSelecting = e.shiftKey === true && key >= 35 && key <= 39;
        isRemoving  = e.keyCode === 8 || e.keyCode === 46;
        
        wysiwyg     = $(document).data ('wysiwyg');
        helper      = wysiwyg ? wysiwyg.find ('.rangy-helper') : '';
        
        // trap the return key being pressed
        if (wysiwyg && !isSelecting && !isRemoving) {
            removeRangyHelper (wysiwyg);
            
            if (e.keyCode === 13) {
                insertLineBreak (wysiwyg);
                addRangyHelper (wysiwyg);
                focusRangyHelper (wysiwyg);            

                return false;
            }
        }
    });
    
    $(document).on ('keyup', '*[contenteditable=true]', function (e) {
        var wysiwyg, key, isSelecting, isRemoving, helper;

        key         = e.keyCode || e.which;
        isSelecting = e.shiftKey === true;
        isRemoving  = e.keyCode === 8 || e.keyCode === 46;
        
        wysiwyg     = $(document).data ('wysiwyg');
        helper      = wysiwyg ? wysiwyg.find ('.rangy-helper') : '';
        
        if (wysiwyg) {
            removeRangyHelper (wysiwyg);

            if (!isSelecting && !isRemoving) {
                addRangyHelper (wysiwyg);
                focusRangyHelper (wysiwyg);
            } else if (isRemoving) {
                return false;
            }
        }
    });
    
    $(document).on ('mouseup', function () {
        var wysiwyg, hasRange;
        
        wysiwyg     = $(document).data ('wysiwyg');
        hasRange    = wysiwyg && wysiwyg.find ('.rangy-helper').length > 0;
        
        if (wysiwyg) {
            if (!hasRange) {
                addRangyHelper (wysiwyg);
            }
            
            focusRangyHelper (wysiwyg);
        }
    });
    
    $(document).on ('click', '.colorpicker, .colorpicker *', function () {
        var wysiwyg;
        
        wysiwyg     = $(document).data ('wysiwyg');
        
        if (wysiwyg) {
            focusRangyHelper (wysiwyg);
        }        
    });
    
    $(document).on ('click', '*[contenteditable=true]', function () {
        $(document).data ('wysiwyg', $(this));
    });
    
    $(document).on ('blur', '*[contenteditable=true]', function () {
        $(document).data ('wysiwyg', false);
    });
    
    function initColorpicker (colorpicker, wysiwyg) {
        var cPickerButton;

        cPickerButton   = colorpicker.find ('div');

        colorpicker.ColorPicker ({
            color:  '#ffffff',
            onShow: function (colpkr) {
                    $(colpkr).fadeIn(500);
                    return false;
            },
            onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
            },
            
            onChange: function (hsb, hex, rgb, colorpkr) {
                cPickerButton.css ('backgroundColor', '#' + hex);

                applyCSS (wysiwyg, {color: '#'+hex});
            },
            
            onSubmit: function (hsb, hex, rgb, colorpkr) {
                cPickerButton.css ('backgroundColor', '#' + hex);

                $(colorpkr).ColorPickerHide ();

                applyCSS (wysiwyg, {color: '#'+hex});

                focusRangyHelper (wysiwyg);
            }
        });
    }
    
    function initFontFamily (fontFamily, wysiwyg) {
        fontFamily.on ('click', function () {
            applyCSS (wysiwyg, {'font-family': $(this).data ('fontfamily')});
            focusRangyHelper (wysiwyg);
        });
    }
    
    function initFontSize (fontSize, wysiwyg) {
        fontSize.on ('click', function () {
            applyCSS (wysiwyg, {'font-size': $(this).data ('fontsize')});
            focusRangyHelper (wysiwyg);            
        });
    }
    
    function initTextBold (btnBold, wysiwyg) {
        btnBold.on ('click', function () {
            applyCSS (wysiwyg, {'font-weight': 'bold'});
            focusRangyHelper (wysiwyg);
        });
    }
    
    function initTextItalic (btnItalic, wysiwyg) {
        btnItalic.on ('click', function () {
            applyCSS (wysiwyg, {'font-style': 'italic'});
            focusRangyHelper (wysiwyg);
        });
    }
    
    function initTextStrike (btnStrike, wysiwyg) {
        btnStrike.on ('click', function () {
            applyCSS (wysiwyg, {'text-decoration': 'line-through'});
            focusRangyHelper (wysiwyg);
        });
    }

    function initTextUnder (btnUnder, wysiwyg) {
        btnUnder.on ('click', function () {
            applyCSS (wysiwyg, {'text-decoration': 'underline'});
            focusRangyHelper (wysiwyg);
        });
    }
    
    function initAlignLeft (btn, wysiwyg) {
        btn.on ('click', function () {
//            applyCSS (wysiwyg, {'text-align': 'left', width: '100%', display: 'block'}, true);
//            cssRangyHelper (wysiwyg, 'width', '100%', true);
//            cssRangyHelper (wysiwyg, 'display', 'block', true);
//
//            focusRangyHelper (wysiwyg);
        });
    }
    
    function initAlignRight (btn, wysiwyg) {
        btn.on ('click', function () {
//            applyCSS (wysiwyg, 'text-align', 'right', true);
//            cssRangyHelper (wysiwyg, 'width', '100%', true);
//            cssRangyHelper (wysiwyg, 'display', 'block', true);
//
//            focusRangyHelper (wysiwyg);
        });
    }
   
    function initGroupClick (btnGroup, wysiwyg) {
        btnGroup.on ('click', function () {
            focusRangyHelper (wysiwyg);
        });
    }
    
    return {
        init: function (selector) {
            selector.find ('.wysiwyg-editor').each (function () {
                var wysiwyg, toolbar, 
                    btnColorpicker, btnFontFamily, btnFontSize,
                    btnTextBold, btnTextItalic, btnTextStrike, btnTextUnder,
                    btnGroup,
                    btnAlignLeft, btnAlignCenter, btnAlignRight, btnJustify,
                    btnUL, btnOL;
                
                wysiwyg         = $(this);
                
                wysiwyg.wysiwyg ();
                
                wysiwyg.attr ('contenteditable', true);
                
                toolbar         = $(this).parents (':first').find ('[data-role="editor-toolbar"]');
                
                btnColorpicker  = toolbar.find ('.wysiwyg-colorpicker');
                btnFontFamily   = toolbar.find ('.fontFamilyGroup .fontFamily');
                btnFontSize     = toolbar.find ('.fontSizeGroup .fontSize');

                btnTextBold     = toolbar.find ('.textBold');
                btnTextItalic   = toolbar.find ('.textItalic');
                btnTextStrike   = toolbar.find ('.textStrikethrough');
                btnTextUnder    = toolbar.find ('.textUnderline');
                
                btnGroup        = toolbar.find ('.wysiwyg-colorpicker, .fontFamilyGroup, fontSizeGroup');

                btnUL           = toolbar.find ('.btnUL');
                btnOL           = toolbar.find ('.btnOL');
                
                btnAlignLeft    = toolbar.find ('.alignleft');
                btnAlignCenter  = toolbar.find ('.aligncenter');
                btnAlignRight   = toolbar.find ('.alignright');
                btnJustify      = toolbar.find ('.justify');
                
                initGroupClick  (btnGroup, wysiwyg);
                
                initColorpicker (btnColorpicker, wysiwyg);
                initFontFamily (btnFontFamily, wysiwyg);
                initFontSize (btnFontSize, wysiwyg);
                
                initTextBold (btnTextBold, wysiwyg);
                initTextItalic (btnTextItalic, wysiwyg);
                initTextStrike (btnTextStrike, wysiwyg);
                initTextUnder (btnTextUnder, wysiwyg);
                
                initAlignLeft (btnAlignLeft, wysiwyg);
//                initAlignCenter (btnAlignCenter, wysiwyg);
                initAlignRight (btnAlignRight, wysiwyg);
//                initJustify (btnJustify, wysiwyg);
            });        
        },
        
        cleanHtml: function (html) {
            return cleanHtml (html);
        }
    };
})());