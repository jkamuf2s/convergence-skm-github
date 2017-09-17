/**
 * @overview <i>ccm</i> component for a chat using convergence Framework
 * @author Jochen Kamuf <jochen.kamuf@smail.inf.h-brs.de> 2017
 * @license The MIT License (MIT)
 * @version 1.1.7
 */

ccm.component({

    /*-------------------------------------------- public component members --------------------------------------------*/


    name: 'convergence_chat',


    config: {


        style: [ccm.load, '../convergence_chat/ccm.convergence_chat.css'],
        html: [ccm.store, {local: '../convergence_chat/ccm.convergence_chat.json'}], // include the local html template

    },

    /*-------------------------------------------- public component classes --------------------------------------------*/


    Instance: function () {

        /*------------------------------------- private and public instance members --------------------------------------*/


        var self = this;
        var element = null;
        var leafStateData = null;
        var messages_div = null;
        var messagesArrayModel = null;
        var inputElements_div = null;

        this.init = function (callback) {


            callback();


        };


        this.render = function (callback) {

            element = ccm.helper.element(self);

            // perform callback
            if (callback) callback();

        };


        /*------------------------------------------------ interfaces  ------------------------------------------------*/

        this.createOrLoadLeafInstanceDataModelCalledByWrapper = function (pInstanceCollaborativeModel, loggedInUser) {


            leafStateData = pInstanceCollaborativeModel.elementAt("leafStateData");

            if (jQuery.isEmptyObject(leafStateData.value())) {


                leafStateData.value({messagesArray: []});
            }

            messagesArrayModel = leafStateData.elementAt("messagesArray");
            messagesArrayModel.on('insert', self.onValueChanged);

            // render main html structure
            element.html(ccm.helper.html(self.html.get('main')));


            messages_div = ccm.helper.find(self, '.messages');

            var messagesArray = messagesArrayModel.value();
            for (var i = 0; i < messagesArray.length; i++) {


                var message = messagesArray[i];

                // render html structure for a given message
                messages_div.append(ccm.helper.html(self.html.get('message'), {

                    name: ccm.helper.val(message.user),
                    text: ccm.helper.val(message.text)

                }));

            }

            inputElements_div = ccm.helper.find(self, '.inputElements');

            if (pInstanceCollaborativeModel.permissions().write === false) {
                inputElements_div.hide();
            } else if (pInstanceCollaborativeModel.permissions().write === true) {
                inputElements_div.show();
            }

            inputElements_div.append(ccm.helper.html(self.html.get('input'), {
                onsubmit: function () {


                    var value = ccm.helper.val(ccm.helper.find(self, 'input').val()).trim();

                    // message is empty? => abort
                    if (value === '') return false;

                    messages_div.append(ccm.helper.html(self.html.get('message'), {

                        name: ccm.helper.val(loggedInUser),
                        text: ccm.helper.val(value)

                    }));
                    messagesArrayModel.push({user: loggedInUser, text: value});
                    inputElements_div.find(".input").val('');

                    // prevent page reload
                    return false;

                }
            }));


        };

        this.onValueChanged = function () {
            var messagesArray = messagesArrayModel.value();
            var lastEntry = messagesArray[messagesArray.length - 1];

            messages_div.append(ccm.helper.html(self.html.get('message'), {

                name: ccm.helper.val(lastEntry.user),
                text: ccm.helper.val(lastEntry.text)

            }));
        };

        this.setWriteEnabled = function () {
            inputElements_div.show();

        };

        this.setOnlyReadEnabled = function () {

            inputElements_div.hide();
        };

    }


});