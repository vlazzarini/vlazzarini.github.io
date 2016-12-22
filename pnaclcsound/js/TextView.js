var TextView = function(parentDiv, evaluateCallback, mode) {

    var aceRange = ace.require('ace/range').Range;
    var aceEditor = ace.edit(parentDiv);

    this.setValue = function(string, option) {

        aceEditor.setValue(string, option);
    };

    var initEditor = function() {

        aceEditor.setTheme("ace/theme/monokai");
        aceEditor.getSession().setMode("ace/mode/csound"); 
        aceEditor.$blockScrolling = Infinity;
        aceEditor.setOption("highlightActiveLine", false)
        aceEditor.setOption("cursorStyle", "smooth")
        aceEditor.setShowPrintMargin(false); 
        var marker;

        aceEditor.commands.addCommand({
            name: 'myCommand',
            bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
            exec: function(aceEditor) {

                function handleMarker(e) {

                    var markerDiv = e.target.childNodes[0];

                    if (markerDiv) {

                        markerDiv.style.transition = "all 0.05s ease-in";
                        markerDiv.style.backgroundColor = "#fff";
                        setTimeout(function() {

                            markerDiv.style.transition = "all .75s ease-in";
                            markerDiv.style.backgroundColor = "";


                            parentDiv.removeEventListener("DOMSubtreeModified", handleMarker, false);
                        }, 50);
                    }
                }

                parentDiv.addEventListener("DOMSubtreeModified", handleMarker, false);
                var currentInstrument = ParseInstrument(aceEditor.getValue(), aceEditor.getCursorPosition().row);
                aceEditor.session.removeMarker(marker);
                var range = new aceRange(currentInstrument.startline, 0, currentInstrument.endline, 0);
                marker = aceEditor.session.addMarker(range, "ace_active-line", "fullLine");
                var markerLayers = document.getElementsByClassName('ace_active-line');
                var activeLineDiv = markerLayers[0];


                evaluateCallback(currentInstrument.text);


            },
            readOnly: true});
    };

    var initConsole = function() {

        aceEditor.setTheme("ace/theme/monokai");
        aceEditor.getSession().setMode("ace/mode/text");
        aceEditor.setReadOnly(true);
        aceEditor.setShowPrintMargin(false); 
        aceEditor.renderer.setShowGutter(false);
        aceEditor.setHighlightActiveLine(false);
        aceEditor.$blockScrolling = Infinity;
        aceEditor.renderer.$cursorLayer.element.style.opacity = 0;
    };

    this.print = function(text, newLine) {

        if (newLine === false) {

            text = aceEditor.getValue() +  text;
        }
        else {

            text = aceEditor.getValue() + "\n" + text;
        }
        aceEditor.setValue(text, 1);
        var session = aceEditor.getSession();
        var count = session.getLength();
        //Go to end of the last line
        aceEditor.gotoLine(count, session.getLine(count-1).length);
    };

    this.clear = function() {
       aceEditor.gotoLine(0, 0);
    };
    
    if (mode.indexOf("editor") != -1) {

        initEditor();
    }
    else if (mode.indexOf("console") != -1) {

        initConsole();
    }
    else {

        console.log("Error: TextView uninitialised");
    }
};
