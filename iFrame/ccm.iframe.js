/**
 * @overview <i>ccm</i> component for to render a simple iFrame
 * @author Jochen Kamuf <jochen.kamuf@smail.inf.h-brs.de> 2017
 * @license The MIT License (MIT)
 * @version 1.02
 */

ccm.component({

    /*-------------------------------------------- public component members --------------------------------------------*/

    name: "iframe",

    config: {


        style: [ccm.load, '../iFrame/ccm.iframe.css'],
    },

    /*-------------------------------------------- public component classes --------------------------------------------*/

    Instance: function () {

        var self = this;
        var selfsIframe;

        /**
         * @summary initialize <i>ccm</i> instance
         * @description
         * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
         * This method will be removed by <i>ccm</i> after the one-time call.
         * @param {function} callback - callback when this instance is initialized
         */
        this.init = function (callback) {
            callback();
        };

        /**
         * @summary render content in own website area
         * @param {function} [callback] - callback when content is rendered
         */
        this.render = function (callback) {

            var urtTextField = $('<input size="30" id="' + self.index + '_urtTextField" type="text" value="https://www.w3schools.com">');
            urtTextField.appendTo(self.element);

            var urlButton = $('<input id="' + self.index + '_collaborativeObjectIDButton" class="ccm-iframe_urlButton" type="button" value="load URL" />');
            urlButton.appendTo(self.element);
            urlButton.click(function () {
                selfsIframe.attr('src', urtTextField.val());
            });


            selfsIframe = $('<iframe>', {
                src: urtTextField.val(),
                id: self.index + '_myFrame',
                class: 'ccm-iframe_frame',
                frameborder: 0,
                scrolling: 'no'
            }).appendTo(self.element);

            // perform callback
            if (callback) callback();

        }
    }
});