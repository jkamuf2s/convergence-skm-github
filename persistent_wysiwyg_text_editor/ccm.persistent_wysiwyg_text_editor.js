/**
 * @overview <i>ccm</i> component for a persistent WYSIWYG text editor
 * @author Jochen Kamuf <jochen.kamuf@smail.inf.h-brs.de> 2017
 * @license The MIT License (MIT)
 * @version 1.11.froala
 */

ccm.component({

    /*-------------------------------------------- public component members --------------------------------------------*/

    name: 'persistent_wysiwyg_text_editor',

    config: {

        json_template: [ccm.store, {local: '../persistent_wysiwyg_text_editor/ccm.persistent_wysiwyg_text_editor.json'}],
        style: [ccm.load, '../persistent_wysiwyg_text_editor/ccm.persistent_wysiwyg_text_editor.css'],
        store: [ccm.store, {store: 'persistent_wysiwyg_text_editor'}],
        convergenceDomUtils: [ccm.load, '../persistent_wysiwyg_text_editor/convergence-dom-utils.js'],

    },

    /*-------------------------------------------- public component classes --------------------------------------------*/

    Instance: function () {

        /*------------------------------------- private and public instance members --------------------------------------*/


        var self = this;
        var selfsTextAreaElement = null;
        var selfsDivElement = null;
        var selfsTextAreaContent = "";
        var dataUrl = "";
        var editable = null;
        var domBinder = null;

        /**
         * @summary initialize <i>ccm</i> instance
         * @description
         * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
         * This method will be removed by <i>ccm</i> after the one-time call.
         * @param {function} callback - callback when this instance is initialized
         */
        this.init = function (callback) {


            // solve the dependencies for the 'froalaEditor' and do not execute the render() method before they are resolved
            ccm.load(['../persistent_wysiwyg_text_editor/wysiwyg_plugins/froala_editor/froala_editor.min.js',
                ['https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/froala_style.min.css',
                    'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/froala_editor.min.css',
                    '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/font_size.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/font_family.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/colors.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/plugins/colors.min.css',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/paragraph_format.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/align.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/lists.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/link.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/image.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/plugins/image.min.css',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/lists.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/table.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/plugins/table.min.css',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/plugins/emoticons.min.js',
                    '//cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/plugins/emoticons.min.css']

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
            selfsDivElement.append('<div class="ccm-persistent_wysiwyg_text_editor-text_area" id="' + self.index + '-text_area"></div> ');
            selfsTextAreaElement = selfsDivElement.find("#" + self.index + "-text_area");


            selfsTextAreaElement.froalaEditor({
                toolbarInline: true,
                enter: $.FroalaEditor.ENTER_BR,
                charCounterCount: false,
                toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'fontFamily', 'color', '-',
                    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'emoticons',
                    '-', 'insertImage', 'insertLink', 'insertTable', 'undo', 'redo'],
                toolbarVisibleWithoutSelection: false,
                tabSpaces: 4


            })
            ;

            selfsTextAreaElement.froalaEditor('placeholder.hide');

            $(selfsTextAreaElement).on('froalaEditor.contentChanged', function () {

                selfsTextAreaContent = selfsTextAreaElement.froalaEditor('html.get');
            });


            // when an image is ready to be uploaded by pressing  the 'insertImage' button then only enter it as base64 encoded and do not upload it to a server
            $(selfsTextAreaElement).on('froalaEditor.image.beforeUpload', function (e, editor, images) {

                var reader = new FileReader();
                reader.onload = function (readerEvt) {
                    var binaryString = readerEvt.target.result;
                    dataUrl = btoa(binaryString);
                    selfsTextAreaElement.froalaEditor('html.insert', '<img src="data:image/png;base64, ' + dataUrl + '" alt="Red dot" />', true);

                };
                reader.readAsBinaryString(images[0]);

                return false;
            });


            // when an image is ready to be uploaded by paste image then only enter it as base64 encoded and do not upload it to a server
            $(selfsTextAreaElement).on('froalaEditor.image.beforePasteUpload', function () {

                return false;
            });


            if (selfsTextAreaContent !== "") {
                selfsTextAreaElement.froalaEditor('html.set', selfsTextAreaContent);
            }


            // perform callback
            if (callback) callback();

        };

        /*------------------------------------------------ interfaces  ------------------------------------------------*/

        /**
         * @summary used by ccm-skm wrapper components to set the save the rich text content in the parameter model
         * @param {RealTimeModel} pInstanceCollaborativeModel
         * @implements {createOrLoadLeafInstanceDataModelCalledByWrapper}
         */
        this.createOrLoadLeafInstanceDataModelCalledByWrapper = function (pInstanceCollaborativeModel) {

            selfsTextAreaElement.children().first().children().first().attr("id", "editable" + self.parent.uuid);

            var leafStateData = pInstanceCollaborativeModel.elementAt("leafStateData");

            if (jQuery.isEmptyObject(leafStateData.value())) {
                leafStateData.value(ConvergenceDomUtils.DomConverter.htmlToJson(""));
            }

            editable = document.getElementById("editable" + self.parent.uuid);


            if (pInstanceCollaborativeModel.permissions().write === false) {
                editable.contentEditable = false;
            } else if (pInstanceCollaborativeModel.permissions().write === true) {
                editable.contentEditable = true;
            }


            if(domBinder != null){
                domBinder.unbind();
            }

            domBinder = new ConvergenceDomUtils.DomBinder(editable, pInstanceCollaborativeModel.elementAt("leafStateData"));


        };

        /**
         * @summary used by ccm-skm wrapper components to set the instance of this component to write
         * @implements {setWriteEnabled}
         */
        this.setWriteEnabled = function () {

            editable.contentEditable = true;

        };

        /**
         * @summary used by ccm-skm wrapper components to set the instance of this component to readOnly
         * @implements {setOnlyReadEnabled}
         */
        this.setOnlyReadEnabled = function () {

            editable.contentEditable = false;

        };

    }

});