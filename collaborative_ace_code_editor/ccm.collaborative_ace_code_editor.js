/**
 * @overview <i>ccm</i> component for a collaborative ACE code editor
 * @author Jochen Kamuf <jochen.kamuf@smail.inf.h-brs.de> 2017, partially using source code from © 2016 Convergence Labs, Inc. under MIT licence
 * @license The MIT License (MIT)
 * @version 1.07
 */

ccm.component({

    /*-------------------------------------------- public component members --------------------------------------------*/

    name: 'collaborative_ace_code_editor',

    config: {

        json_template: [ccm.store, {local: '../collaborative_ace_code_editor/ccm.collaborative_ace_code_editor.json'}],
        style: [ccm.load, '../collaborative_ace_code_editor/ccm.collaborative_ace_code_editor.css'],
        ResizeSensor: [ccm.load, '../collaborative_ace_code_editor/libs/ResizeSensor.js'],
        ElementQueries: [ccm.load, '../collaborative_ace_code_editor/libs/ElementQueries.js'],
        aceStyle: [ccm.load, '../collaborative_ace_code_editor/libs/ace-collab-ext.css'],
        defaultEditorContent: [ccm.load, '../collaborative_ace_code_editor/libs/default_editor_contents.js'],
    },

    /*-------------------------------------------- public component classes --------------------------------------------*/

    Instance: function () {

        /*------------------------------------- private and public instance members --------------------------------------*/

        var self = this;
        var selfsWrappedEditorElement = null;
        var selfsEditorElement = null;
        var selfsRadarViewElement = null;

        var selfsDivElement = null;

        var AceRange = null;
        var colorAssigner = null;

        var editor = null;
        var session = null;
        var doc = null;
        var textModel = null;

        var selectionManager = null;
        var selectionReference = null;
        var selectionKey = "selection";

        var radarView = null;
        var viewReference = null;
        var viewKey = "view";

        var suppressEvents = false;

        var cursorKey = "cursor";
        var cursorReference = null;
        var cursorManager = null;

        /**
         * @summary initialize <i>ccm</i> instance
         * @description
         * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
         * This method will be removed by <i>ccm</i> after the one-time call.
         * @param {function} callback - callback when this instance is initialized
         */
        this.init = function (callback) {




            // solve the dependencies for the 'froalaEditor' and do not execute the render() method before they are resolved
            ccm.load(['../collaborative_ace_code_editor/libs/ace-builds/src/ace.js',
                ['../collaborative_ace_code_editor/libs/ace-collab-ext/umd/ace-collab-ext.js',
                    '../collaborative_ace_code_editor/libs/color-assigner/browser/color-assigner.js',]

            ], function () {
                callback();
            });
        };

        /**
         * @summary render content in own website area
         * @param {function} [callback] - callback when content is rendered
         */
        this.render = function (callback) {

            selfsDivElement = ccm.helper.element(self).html('');

            // set content of own website area
            selfsDivElement.append('<div class="ccm-collaborative_ace_code_editor-wrapped-editor" id="' + self.index + '-collaborative_ace_code_editor-wrapped-editor"></div> ');
            selfsWrappedEditorElement = selfsDivElement.find("#" + self.index + "-collaborative_ace_code_editor-wrapped-editor");

            selfsWrappedEditorElement.append('<div class="ccm-collaborative_ace_code_editor-editor" id="' + self.index + '-collaborative_ace_code_editor"></div> ');
            selfsEditorElement = selfsDivElement.find("#" + self.index + "-collaborative_ace_code_editor");
            selfsWrappedEditorElement.append('<div class="ccm-collaborative_ace_code_editor-radar-view" id="' + self.index + '-collaborative_ace_code_editor-radar-view"></div> ');
            selfsRadarViewElement = selfsDivElement.find("#" + self.index + "-collaborative_ace_code_editor-radar-view");

            AceRange = ace.require("ace/range").Range;

            colorAssigner = new ColorAssigner();

            editor = ace.edit(selfsEditorElement[0]);
            editor.setTheme('ace/theme/monokai');
            editor.$blockScrolling = Infinity; // to disable a warning from ace.js

            session = editor.getSession();
            session.setMode('ace/mode/javascript');

            doc = session.getDocument();

            new ResizeSensor(selfsDivElement, function () {
                editor.resize();
            });


            // perform callback
            if (callback) callback();

        };

        /*------------------------------------------------ start methods containing code from © 2016 Convergence Labs, Inc.  ------------------------------------------------*/

        this.resize = function () {
            editor.resize();
        };

        this.initModel = function (textModel) {
            var session = editor.getSession();
            session.setValue(textModel.value());

            textModel.on("insert", (e) => {
                var pos = doc.indexToPosition(e.index);
                suppressEvents = true;
                doc.insert(pos, e.value);
                suppressEvents = false;
            });

            textModel.on("remove", (e) => {
                var start = doc.indexToPosition(e.index);
                var end = doc.indexToPosition(e.index + e.value.length);
                suppressEvents = true;
                doc.remove(new AceRange(start.row, start.column, end.row, end.column));
                suppressEvents = false;
            });

            textModel.on("value", function (e) {
                suppressEvents = true;
                doc.setValue(e.value);
                suppressEvents = false;
            });

            editor.on('change', (delta) => {
                if (suppressEvents) {
                    return;
                }

                var pos = doc.positionToIndex(delta.start);
                switch (delta.action) {
                    case "insert":
                        textModel.insert(pos, delta.lines.join("\n"));
                        break;
                    case "remove":
                        textModel.remove(pos, delta.lines.join("\n").length);
                        break;
                    default:
                        throw new Error("unknown action: " + delta.action);
                }
            });
        };

        this.initSharedCursors = function (textElement) {
            cursorManager = new AceCollabExt.AceMultiCursorManager(editor.getSession());
            cursorReference = textElement.indexReference(cursorKey);

            var references = textElement.references({key: cursorKey});
            references.forEach((reference) => {
                if (!reference.isLocal()) {
                    self.addCursor(reference);
                }
            });

            self.setLocalCursor();
            if (!cursorReference.isShared())
                cursorReference.share();

            editor.getSession().selection.on('changeCursor', () => self.setLocalCursor());

            textElement.on("reference", (e) => {
                if (e.reference.key() === cursorKey) {
                    self.addCursor(e.reference);
                }
            });
        };

        this.setLocalCursor = function () {
            var position = editor.getCursorPosition();
            var index = doc.positionToIndex(position);
            cursorReference.set(index);
        };

        this.setLocalSelection = function () {
            if (!editor.selection.isEmpty()) {
                const aceRanges = editor.selection.getAllRanges();
                const indexRanges = aceRanges.map((aceRagne) => {
                    const start = doc.positionToIndex(aceRagne.start);
                    const end = doc.positionToIndex(aceRagne.end);
                    return {start: start, end: end};
                });

                selectionReference.set(indexRanges);
            } else if (selectionReference.isSet()) {
                selectionReference.clear();
            }
        };

        this.addCursor = function (reference) {
            const color = colorAssigner.getColorAsHex(reference.sessionId());
            var remoteCursorIndex = reference.value();
            cursorManager.addCursor(reference.sessionId(), reference.username(), color, remoteCursorIndex);

            reference.on("cleared", () => cursorManager.clearCursor(reference.sessionId()));
            reference.on("disposed", () => cursorManager.removeCursor(reference.sessionId()));
            reference.on("set", () => {
                var cursorIndex = reference.value();
                var cursorRow = doc.indexToPosition(cursorIndex).row;
                cursorManager.setCursor(reference.sessionId(), cursorIndex);

                if (radarView.hasView(reference.sessionId())) {
                    radarView.setCursorRow(reference.sessionId(), cursorRow);
                }
            });
        };

        this.addSelection = function (reference) {
            const color = colorAssigner.getColorAsHex(reference.sessionId());
            const remoteSelection = reference.values().map(range => self.toAceRange(range));
            selectionManager.addSelection(reference.sessionId(), reference.username(), color, remoteSelection);

            reference.on("cleared", () => selectionManager.clearSelection(reference.sessionId()));
            reference.on("disposed", () => selectionManager.removeSelection(reference.sessionId()));
            reference.on("set", () => {
                selectionManager.setSelection(
                    reference.sessionId(), reference.values().map(range => self.toAceRange(range)));
            });
        };

        this.initRadarView = function (textModel, radarViewElement) {
            radarView = new AceCollabExt.AceRadarView(radarViewElement, editor);
            viewReference = textModel.rangeReference(viewKey);

            const references = textModel.references({key: viewKey});
            references.forEach((reference) => {
                if (!reference.isLocal()) {
                    self.addView(reference);
                }
            });

            session.on('changeScrollTop', () => {
                setTimeout(() => self.setLocalView(), 0);
            });

            textModel.on("reference", (e) => {
                if (e.reference.key() === viewKey) {
                    self.addView(e.reference);
                }
            });

            setTimeout(() => {
                self.setLocalView();
                if (!viewReference.isShared())
                    viewReference.share();
            }, 0);
        };

        this.setLocalView = function () {
            const viewportIndices = AceCollabExt.AceViewportUtil.getVisibleIndexRange(editor);
            viewReference.set({start: viewportIndices.start, end: viewportIndices.end});
        };

        this.initSharedSelection = function (textModel) {
            selectionManager = new AceCollabExt.AceMultiSelectionManager(editor.getSession());

            selectionReference = textModel.rangeReference(selectionKey);
            self.setLocalSelection();
            if (!selectionReference.isShared())
                selectionReference.share();

            session.selection.on('changeSelection', () => self.setLocalSelection());

            const references = textModel.references({key: selectionKey});
            references.forEach((reference) => {
                if (!reference.isLocal()) {
                    self.addSelection(reference);
                }
            });

            textModel.on("reference", (e) => {
                if (e.reference.key() === selectionKey) {
                    self.addSelection(e.reference);
                }
            });
        };

        this.addView = function (reference) {
            const color = colorAssigner.getColorAsHex(reference.sessionId());

            // fixme need the cursor
            let cursorRow = null;
            let viewRows = null;

            if (reference.isSet()) {
                const remoteViewIndices = reference.value();
                viewRows = AceCollabExt.AceViewportUtil.indicesToRows(editor, remoteViewIndices.start, remoteViewIndices.end);
            }

            radarView.addView(reference.sessionId(), reference.username(), color, viewRows, cursorRow);

            // fixme need to implement this on the ace collab side
            reference.on("cleared", () => radarView.clearView(reference.sessionId()));
            reference.on("disposed", () => radarView.removeView(reference.sessionId()));
            reference.on("set", () => {
                const v = reference.value();
                const rows = AceCollabExt.AceViewportUtil.indicesToRows(editor, v.start, v.end);
                radarView.setViewRows(reference.sessionId(), rows);
            });
        };

        this.toAceRange = function (range) {
            if (typeof range !== 'object') {
                return null;
            }

            let start = range.start;
            let end = range.end;

            if (start > end) {
                const temp = start;
                start = end;
                end = temp;
            }

            const rangeAnchor = doc.indexToPosition(start);
            const rangeLead = doc.indexToPosition(end);
            return new AceRange(rangeAnchor.row, rangeAnchor.column, rangeLead.row, rangeLead.column);
        };

        /*------------------------------------------------ end methods containing code from © 2016 Convergence Labs, Inc.  ------------------------------------------------*/

        /*------------------------------------------------ interfaces  ------------------------------------------------*/

        /**
         * @summary used by ccm-skm wrapper components to set the save the code editor content in the parameter model
         * @param {RealTimeModel} pInstanceCollaborativeModel
         * @implements {createOrLoadLeafInstanceDataModelCalledByWrapper}
         */
        this.createOrLoadLeafInstanceDataModelCalledByWrapper = function (pInstanceCollaborativeModel) {

            var leafStateData = pInstanceCollaborativeModel.elementAt("leafStateData");

            if (jQuery.isEmptyObject(leafStateData.value())) {
                leafStateData.value({"text": defaultEditorContents});
            }

            textModel = leafStateData.elementAt("text");


            self.initModel(textModel);
            self.initSharedCursors(textModel);
            self.initSharedSelection(textModel);


            self.initRadarView(textModel, selfsRadarViewElement[0]);

        };

    }

});