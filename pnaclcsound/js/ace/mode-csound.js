define("ace/mode/csound_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";


	var oop = require("../lib/oop");
	var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
	var CsoundHighlightRules = function() {

		var keywords = "instr|endin|opcode|endop|if|endif|then|else";

		var builtinConstants = (
			"true|false|null"
		);
		
		var opcodes = (
			"vco2|oscili|chnget|outs|schedule|event|table|phasor|mxadsr|ftgen|lowpass2|cpsmidinn"
		);

		var keywordMapper = this.createKeywordMapper({
			"support.function": opcodes,
			"keyword": keywords,
			"constant.language": builtinConstants
		}, "identifier");

		this.$rules = {
			"start" : [ {
			    
				token : "meta.tag",
				regex : "</?([A-Za-z])\\w+>"
			}, {			    
				token : "constant.language",
				regex : "\\b0dbfs|nchnls|kr|ksmps|sr|rtmidi|rtaudio|-o|dac|msg_color|-d\\b"
			}, {
				token : "comment",
				regex : ";.*$"
			}, {
				token : ['keyword', 'text', 'string'],           // " string
				regex : "(instr)(\\s)([^]+)"
			}, {
			    token : "string",           // " string
				regex : '".*?"'
			}, {
				token : "string",           // ' string
				regex : "'.*?'"
			}, {
				token : "constant.numeric", // float
				regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
			}, {
				token : keywordMapper,
				regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
			}, {
				token : "keyword.operator",
				regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
			}, {
				token : "paren.lparen",
				regex : "[\\(]"
			}, {
				token : "paren.rparen",
				regex : "[\\)]"
			}]
		};
	};


	oop.inherits(CsoundHighlightRules, TextHighlightRules);

	exports.CsoundHighlightRules = CsoundHighlightRules;

});


define("ace/mode/csound",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/csound_highlight_rules"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;


var Range = require("../range").Range;
  var csoundHighlightRules = require("ace/mode/csound_highlight_rules").CsoundHighlightRules;
  //var FoldMode = require("./folding/cstyle").FoldMode;

  var Mode = function() {
    this.HighlightRules = csoundHighlightRules;
    //this.foldingRules = new FoldMode();
  };
  oop.inherits(Mode, TextMode);

  (function() {
    this.$id = "ace/mode/csound"


    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var i, line;
        var outdent = true;
        var re = /^\s*\;(.*)/;

        for (i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        var range = new Range(0, 0, 0, 0);
        for (i=startRow; i<= endRow; i++) {
            line = doc.getLine(i);
            range.start.row  = i;
            range.end.row    = i;
            range.end.column = line.length;

            doc.replace(range, outdent ? line.match(re)[1] : ";" + line);
        }
    };

  }).call(Mode.prototype);

  exports.Mode = Mode;
});
