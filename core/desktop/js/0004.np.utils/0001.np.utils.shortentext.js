np.module ('utils.shortentext', function (html, length, more) {
    var rxTags, rxTemp, rxTest,
        text, splitted, result,
        curLen, spLen, closeTags, tmpSpl, toolong,
        i, l;
    
    rxTags      = /<([^>]+)>/gim;
    rxTemp      = /(\:[^\:]+\:)/gim;
    rxTest      = /\:([^\:]+)\:/gim;
    
    text        = html.replace (rxTags, ':$1:');
    
    splitted    = text.split (rxTemp);
    l           = splitted.length;
    
    result      = '';
    curLen      = 0;
    closeTags   = {};
    more        = more ? more : '...';
    toolong     = false;
    
    for (i=0; i<l; i++) {
        if ($.isArray (splitted[i].match (rxTest))) {
            result += splitted[i];
        } else {
            curLen += spLen = splitted[i].length;
            
            if (curLen <= length)   { result += splitted[i];                                                    }
            else                    { result += splitted[i].slice (0, length-spLen+1); toolong = true; break;   }
        }
    }
    
    splitted    = result.split (rxTemp);
    l           = splitted.length;
    
    for (i=0; i<l; i++) {
        if ($.isArray (splitted[i].match (rxTest))) {
            if (splitted[i].indexOf ('br') === -1) {
                if (splitted[i].indexOf ('/') === -1) {
                    if (typeof closeTags[splitted[i]] === 'undefined') {
                        closeTags[splitted[i]] = 0;
                    }

                    closeTags[splitted[i]]++;
                } else {
                    tmpSpl  = splitted[i].replace ('/', '');

                    if (typeof closeTags[tmpSpl] !== 'undefined') {
                        closeTags[tmpSpl]--;
                    }
                }
            }
        }
    }
    
    for (i in closeTags) {
        result += i.slice (0, 1)+'/'+i.slice (1, i.length-1)+i.slice (i.length-1);
    }

    result        = result.replace (rxTest, '<$1>')+(toolong ? more : '');
    
    return result;
});