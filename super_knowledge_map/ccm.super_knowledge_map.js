//noinspection JSCheckFunctionSignatures
/**
 * @overview <i>ccm</i> component for visualizing a super knowledge map
 * @author Jochen Kamuf <jochen.kamuf@smail.inf.h-brs.de> 2017
 * @license The MIT License (MIT)
 * @version 5.3.6
 */


( function () {

    var component = {

        /*-------------------------------------------- public component members --------------------------------------------*/

        /**
         * @summary component name
         * @type {ccm.types.name}
         */
        name: 'super_knowledge_map', // here value is a string

        ccm: 'https://akless.github.io/ccm/version/ccm-10.0.0.js',

        /**
         * @summary default instance configuration
         * @type {ccm.components.super_knowledge_map.types.config}
         */
        config: {

            "blank_component": ["ccm.component", 'ccm.super_knowledge_map.js'],
            "convergenceFramework": ["ccm.load", 'libs/convergence-all.js'],
            "jqueryNotifications": ["ccm.load", ['libs/notifications/js/notify.js', 'libs/notifications/js/prettify.js', 'libs/notifications/css/notify.css', 'libs/notifications/css/prettify.css']],
            "jquery_ui": ["ccm.load", ['libs/jquery-ui.js', '//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css']],
            "swisnl_jQuery_contextMenu": ["ccm.load", ['libs/jquery.contextMenu.js', 'libs/jquery.contextMenu.css']],
            "super_knowledge_map_html_json_template": ["ccm.store", {local: 'super_knowledge_map_html.json'}],
            "super_knowledge_map_style": ["ccm.load", 'super_knowledge_map.css'],
            "uuid_script": ["ccm.load", 'libs/uuid.js'],
            "graph_framework": ["ccm.load", 'libs/jsPlumb-2.1.7.js'],
            "parent": '',
            "mySavedID": 'super_knowledge_map-1',
            "color": "rgb(255, 253, 250)",
            "leafUrl": null,
            "leafStateData": null,
            "rootSelfReference": null,
            "selfsIndexInRootsNodeTree": -1,
            "relativeDimensionAndPositionToParent": {
                widthPercentage: 0.0,
                heightPercentage: 0.0,
                topPercentage: 0.0,
                leftPercentage: 0.0
            },
            "rootLoggedInUser": null,
            "selfsHeadDivElementHeadline": "",
            "notRendered2": false,
            "draggedResizedDeletedAndChangesNotSavedInTmpDatastore": false,
            "uuid": null,
            "loadedAdjacentNodesOfSelfArray": null,
            "realtimeDocId": null,
            "leafMustBeRendered": false,
            "convergenceCollection": "",
            "convergenceDomainUrl": "",
            "sharedRootNodeReference": false,
            "selfIsRootSharedNode": false,
            "topPercentageModelReference": null,
            "leftPercentageModelReference": null,
            "widthPercentageModelReference": null,
            "heightPercentageModelReference": null,
            "draggingOfSelfInProcess": false

        },

        /*-------------------------------------------- public component classes --------------------------------------------*/

        /**
         * @summary constructor for creating <i>ccm</i> instances out of this component
         * @class
         */
        Instance: function () {

            /*------------------------------------- private and public instance members --------------------------------------*/

            /**
             * @summary own context
             * @private
             */
            var self = this;

            /**
             * @summary jQuery &lt;div&gt; element in which this instance is rendered
             * @private
             * @type {jQuery}
             */
            var selfsDivElement = null;

            /**
             * @summary holds references of all the direct children of this instance
             * @private
             * @type {Array.<Instance>}
             */
            var nodeChildObjectReferenceArray = [];

            /**
             * @summary jQuery &lt;div&gt; parent element of the div in which the instance is rendered
             *  has class 'super_knowledge_map_child_div_area'
             * @private
             * @type {jQuery}
             */
            var selfsChildAreaDivElement = null;

            /**
             * @summary indicates if any direct children are added, dragged or resized
             * @private
             * @type {boolean}
             */
            var childrenAddedResizedDraggedDeleted = false;

            /**
             * @summary jQuery &lt;div&gt; element that contains the head information for self ( this instance )
             * @private
             * @type {jQuery}
             */
            var selfsHeadDivElement = null;

            /**
             * @summary jQuery &lt;div&gt; element in which a leaf will be rendered gets only initialized
             * if this instance ( self ) is a wrapper for a leaf
             * @private
             * @type {jQuery}
             */
            var selfsLeafAreaDivElement = null;

            /**
             * @summary if self is a leaf wrapper this member holds a reference to the leaf ccm instance
             * @private
             */
            var leafInstanceReference = null;

            /**
             * @summary holds an array of references of instances that are adjacent to self
             * example: (self) ----> (node that is adjacent to self)
             * @private
             * @type Array
             */
            var adjacentNodesOfSelfArray = [];

            /**
             * @summary jQuery &lt;div&gt; element in which all active collaborators and their role will be rendered
             * @private
             * @type {jQuery}
             */
            var collaboratorsDiv;

            /**
             * @summary a reference to the Convergence RealTimeModel
             * @private
             * @type {RealTimeModel}
             */
            var selfsCollaborativeModel = null;

            /**
             * @summary a reference to the Convergence RealTimeModel
             * @private
             * @type {ModelPermissionManager}
             */
            var selfsModelPermissionManager = null;

            /**
             * @summary a reference to the minimal height of selfs element
             * that it still fits all children
             * @private
             * @type {Number}
             */
            var minHeightOfSelfsElement = 0;

            /**
             * @summary a reference to the minimal width of selfs element
             * that it still fits all children
             * @private
             * @type {Number}
             */
            var minWidthOfSelfsElement = 0;

            /**
             * @summary a short version of the ccm.index and the parent index
             * @private
             * @type {String}
             */
            var realtimeIDPrefixForSelfsDivElement = "";

            /**
             * @summary a reference to the convergence activity for self
             * @private
             * @type {Activity}
             */
            var selfsJoinedActivity = null;

            /* Convergence mouse pointer fields */

            /**
             * @summary a reference to the convergence mouse pointer activity for self
             * @private
             * @type {Activity}
             */
            var mousePointerActivity;

            /**
             * @summary the current mouse pointer coordinates relative to the document
             * @private
             * @type {Object}
             */
            var currentLocalMousePos = {x: 0, y: 0};

            /**
             * @summary an object that contains timeout methods for the joined mouse pointer sessions
             * @private
             * @type {Object}
             */
            var mouseMovedClearTimerForConnectedRemoteSessionArray = {};

            /**
             * @summary A map of remote cursors by sessionId
             * @private
             * @type {Object}
             */
            const remoteSessions = {};

            /**
             * @summary the current mouse pointer coordinates relative to the parent
             * @private
             * @type {Object}
             */
            var selfsLocalRelativeToParentMouseCoordinatesPercentage = null;

            /**
             * @summary an object containing the mouse pointer coordinates where to open the context menu
             * @private
             * @type {Object}
             */
            var contextMenuOpenRelativeToParentMouseCoordinatesPercentage = null;

            /**
             * @summary an object containing the  model permissions for self
             * @private
             * @type {Object}
             */
            var selfsModelPermissionsForLoggedInUser = {};

            /**
             * @summary a div that will contain some information for the headDivElement
             * @private
             * @type {jQuery}
             */
            var selfsHeadDivElementTextInfoDiv = null;

            /**
             * @summary a div that will contain the active collaborators for the headDivElement
             * @private
             * @type {jQuery}
             */
            var selfsHeadDivElementCollaboratorsDiv = null;

            /**
             * @summary a div that will contain the close / delete button for the headDivElement
             * @private
             * @type {jQuery}
             */
            var selfsHeadDivElementDialogItemDiv = null;

            /**
             * @summary a div that will contain the headline for the headDivElement
             * @private
             * @type {jQuery}
             */
            var selfsHeadDivElementHeadlineDiv = null;

            /*------------------------------------------- private members only used by root instance ---------------------*/

            /**
             * @summary holds the whole node tree ( except root ) as a hash map  only
             * the root instance has content in this member
             * @private
             * @type {Array}
             */
            var rootsNodeTree = []; // TODO get rid of it -> so far only data saved but not used

            /**
             * @summary holds a reference to the currently selected node in the DOM / GUI
             * @private
             */
            var selectedNodeReference = null;

            /**
             * @summary holds a reference to the node that is currently selected by mouseover and therefore equipped with
             * the right click context-menu and draggable / resizable
             * @private
             */
            var nodeWithVisualEffects = null;

            /**
             * @summary holds a reference to the node that is currently expanded 'zoomed' to fit into the root node
             * if one level zoom out is triggered by "ESC" key the root node zooms out to this 'anchorNodes' parent node
             * @private
             */
            var anchorNode = null;

            /**
             * @summary holds a boolean if a mouse  key is currently down and not released
             * is needed that a mouseover events are deactivated during resize/drag of a node
             * @private
             * @type {boolean}
             */
            var mouseDown = false;

            /**
             * @summary holds a boolean if the control key is currently down and not released
             * @private
             * @type {boolean}
             */
            var controlIsPressed = false;

            /**
             * @summary holds the reference to an Instance that is the source of a new relation
             * @private
             */
            var createRelationStartNodeReference = null;

            /**
             * @summary will be used to store all content of all loaded nodes 'loadedAdjacentNodesOfSelfArray'
             * @private
             * @type {Array}
             */
            var rootsTmpAdjacentNodesOfLoadedNodesArray = [];

            /**
             * @summary a reference to the connected convergence model service
             * @private
             * @type {ModelService}
             */
            var rootsConvergenceModelService = null;

            /**
             * @summary a reference to the connected convergence domain
             * @private
             * @type {ConvergenceDomain}
             */
            var rootsConvergenceDomain = null;

            /**
             * @summary a reference to the ccm.instance that was dropped into another instance
             * @private
             */
            var rootsDroppedInstanceReference = null;

            /**
             * @summary a reference to the new parent of the ccm.instance that was dropped into another instance
             * @private
             */
            var rootsDroppedInstanceNewParentReference = null;

            /*------------------------------------------- public instance methods --------------------------------------------*/

            /**
             * @summary initialize <i>ccm</i> instance
             * @description
             * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
             * This method will be removed by <i>ccm</i> after the one-time call.
             * @param {function} callback - callback when this instance is initialized
             */
            this.init = function (callback) {

                self.element = $(self.element);

                // do init work for the root ccm-skm component
                if (self.parent === "") {

                    jsPlumb.ready(function () {
                        /** set the container div element in which the root skm node is embedded as jsPlumb container
                         prevents that if source element is children of element with .css "position: absolute" & offset e.g. "top: 100px"
                         that connect()adds this offset to target **/
                        jsPlumb.setContainer(self.element.attr("id"));
                    });

                }


                // reference to objects is call by reference -> clone the object that every ccm-skm instance has its own object instance
                self.relativeDimensionAndPositionToParent = self.ccm.helper.clone(self.relativeDimensionAndPositionToParent);


                // create uuid if the instance is first time rendered / created
                if (self.uuid === null) {
                    self.uuid = uuid.v1();
                    //console.log("uuid created for instance: " + self.index);
                }


                // perform callback
                callback();

            };

            /**
             * @summary creates a new HTML &lt;div&gt; element and renders an instance of the 'super_knowledge_map'
             * component in this &lt;div&gt; tag
             * @param {String} [collaborativeModelIDOfNewChildInstance
             * @param {function} [whenInstanceAndModelReadyCallback]
             * @param {boolean} [leafWrapper]
             */
            this.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel = function (collaborativeModelIDOfNewChildInstance, whenInstanceAndModelReadyCallback, leafWrapper) {


                // now this member 'childrenAddedResizedDraggedDeleted' is true because a child skm component will be rendered
                childrenAddedResizedDraggedDeleted = true;

                // check is selfsChildAreaDivElement is rendered

                var currentAnchorNode = self.rootSelfReference.getAnchorNode();

                var selfElementIsRendered = $("#" + self.element[0].id)[0] ? true : false;

                //if external participant tries to render in root but root is not current anchor node
                if (self.parent === "" && currentAnchorNode.parent !== "") {
                    selfElementIsRendered = false;

                }

                //console.log("selfElementIsRendered: " + selfElementIsRendered);

                // find out if root is not the current anchor and external participant wants to render a new node into root

                var childDivId = self.index + "temporary-childArea"; //TODOCONVERGENCE remove the tmp child area with uuid

                // prepare a div tag where render() can remove all content and place a child instance
                selfsDivElement.append('<div class="ccm-super_knowledge_map-child_div_area" id="' + childDivId + '"></div>');  // append inner website area
                // render a new child component -> all the content of the div in which the blank_component will be rendered will be deleted

                // get the new child div area in which the ccm-skm node will be rendered
                var createdChildDivArea = selfsDivElement.find('#' + childDivId);


                //if collaborativeModelIDOfNewChildInstance exists then a new instance with an existing model will be created
                if (collaborativeModelIDOfNewChildInstance && selfElementIsRendered) {


                    self.blank_component.render({
                        notRendered: false,
                        element: createdChildDivArea,
                        parent: self,
                        realtimeDocId: collaborativeModelIDOfNewChildInstance
                    }, afterInstanceOrRenderCallback);

                }
                else if (collaborativeModelIDOfNewChildInstance && !selfElementIsRendered) {
                    //noinspection JSCheckFunctionSignatures
                    ccm.instance('/convergence-skm/super_knowledge_map/ccm.super_knowledge_map.js', { // render a already existing ccm-skm component and therefore use already assigned index, dimension and position
                        notRendered: false,
                        element: createdChildDivArea,
                        parent: self,
                        realtimeDocId: collaborativeModelIDOfNewChildInstance
                    }, afterInstanceOrRenderCallback);
                }
                //if collaborativeModelIDOfNewChildInstance does not exist then a new instance with new model will be created
                else {

                    self.blank_component.render({
                        notRendered: false,
                        element: createdChildDivArea,
                        parent: self
                    }, afterInstanceOrRenderCallback);


                }


                function afterInstanceOrRenderCallback(instance) {

                    instance.rootSelfReference = self.rootSelfReference; // set selfs RootSelfReference to the root reference of the parent


                    // add my self data ( size, position ... ) to the node tree managed by the root node and give me(self) my index
                    nodeChildObjectReferenceArray.push(instance); // add a reference to the new created instance
                    instance.selfsIndexInRootsNodeTree = self.rootSelfReference.addSelfsDataToRootsNodeTree(instance); // add selfs initial node data to roots 'rootsNodeTree'


                    self.setRelativePositionToParentOfArgumentToSelfsContextMenuMousePosition(instance);
                    // if the component was loaded from the dataStore
                    if (collaborativeModelIDOfNewChildInstance) {

                        //createdChildDivArea.hide(); // hide a created ccm-super_knowledge_map-child_div_area until the model is loaded and the position and size is set but messes up resize when leaf content is loaded

                        instance.fillRootsTmpAdjacentNodesOfLoadedNodesArrayWithContentOfSelfStoredEdgeContent();
                        instance.openExistingCollaborativeModelInSKMCollectionForSelfsData(instance.realtimeDocId, whenInstanceAndModelReadyCallback);


                    }
                    // if the component is newly created
                    else {

                        // if first time render of a new blank ccm-skm component update its relative position to the parent
                        instance.updateRelativePositionAndSizeInParent(); // sets the value to the initial size without the uuid
                        self.setRelativePositionToParentOfArgumentToSelfsContextMenuMousePosition(instance);


                        createdChildDivArea.hide(); //TODOCONVERGENCE hide and show for all cases


                        instance.createNewCollaborativeModelInSKMCollectionForSelfsData(whenInstanceAndModelReadyCallback2);


                        // self is the parent in which the new instance was created
                        function whenInstanceAndModelReadyCallback2(createdInstanceReference) {

                            //This only works for regular skm nodes not for leaf nodes
                            createdInstanceReference.updateRelativePositionAndSizeInParent();
                            //TODOCONVERGENCE SQ8 Try To create 50 nested Modules crashes

                            // let other participant know that an skm instance was created but only if not a leaf instance was created if this is the case the will let known later
                            if (!leafWrapper)
                                selfsCollaborativeModel.elementAt("newChildInstanceCreated").value(createdInstanceReference.realtimeDocId);

                            if (whenInstanceAndModelReadyCallback)
                                whenInstanceAndModelReadyCallback(createdInstanceReference);

                        }

                    }

                }


            };

            /**
             * @summary render content in own website area
             * @param {function} [callback] - callback when content is rendered
             */
            this.start = function (callback) { // this function gets called by ccm.js if you call ccm.render(<componentURL>)



                selfsDivElement = self.element;

                self.element.attr('data-realtimeDocId', self.realtimeDocId);

                //the parent in which self is embedded is selfsChildArea, the root node has the div tag in  where he is embedded as his childArea
                selfsChildAreaDivElement = selfsDivElement.parent();

                // toggle the background color of the node
                self.setBackgroundColorToOppositeOfParent();

                // render the component Head with the shortcut strings
                var componentHeadDivTemplate = self.super_knowledge_map_html_json_template.get('componentHeadDiv');

                realtimeIDPrefixForSelfsDivElement = self.realtimeDocId ? self.realtimeDocId.substring(1, 4) + " " : "";
                //noinspection JSCheckFunctionSignatures
                selfsDivElement.append(self.ccm.helper.html(componentHeadDivTemplate, {
                    id: "ccm-" + self.index + "-head_div",
                    value: ""
                }));

                // set the reference to my Head Div Element
                selfsHeadDivElement = self.element.find("#ccm-" + self.index + "-head_div");

                selfsHeadDivElement.append('<div class="ccm-super_knowledge_map-head_div_content" style="font-weight:bold" id=' + self.index + '-HeadlineDiv></div>');
                selfsHeadDivElementHeadlineDiv = self.element.find('#' + self.index + '-HeadlineDiv');

                selfsHeadDivElement.append('<div class="ccm-super_knowledge_map-head_div_content" id=' + self.index + '-textInfoDiv></div>');
                selfsHeadDivElementTextInfoDiv = self.element.find('#' + self.index + '-textInfoDiv');

                selfsHeadDivElement.append('<div class="ccm-super_knowledge_map-head_div_content" id=' + self.index + '-collaboratorsDiv></div>');
                selfsHeadDivElementCollaboratorsDiv = self.element.find('#' + self.index + '-collaboratorsDiv');

                selfsHeadDivElement.append('<div class="ccm-super_knowledge_map-head_div_content" id=' + self.index + '-dialogItemDiv></div>');
                selfsHeadDivElementDialogItemDiv = self.element.find('#' + self.index + '-dialogItemDiv');

                self.setOrUpdateContentAndTooltipOfSelfsHeadDivElement();
                self.setHeadlineInSelfsHeadDivArea();

                // do render work for the root ccm-skm component
                if (self.parent === "") {


                    selfsHeadDivElement.append(" root");
                    selfsDivElement.addClass("ccm-super_knowledge_map-root");
                    self.rootSelfReference = self;
                    // the div in which root is embedded needs this attribute that the children are correctly rendered if loaded from database
                    selfsChildAreaDivElement.css("position", "relative");


                    self.rootSelfReference.create_AdjacentNodesOfSelfArray_ForAllLoadedNodesIn_TmpAdjacentNodesOfLoadedNodesArray_AndDrawEdges();

                    $(document).keyup(function (e) {
                        e.stopPropagation(); // Prevents  event from bubbling up  DOM tree, preventing parent handlers from being notified.

                        if (e.keyCode == 27) { // escape key maps to key code `27`
                            e.stopPropagation();
                            self.zoomOutToParent(); // will always be the root node
                        }
                    });


                    // event ctrl key down starts the connection the currently 'nodeWithVisualEffects' as the source and we wait for ctrl key up event
                    $(document).keydown(function (event) {
                        event.stopPropagation();
                        if (event.which == "17" && !controlIsPressed) {
                            event.stopPropagation();
                            controlIsPressed = true;
                            createRelationStartNodeReference = nodeWithVisualEffects;
                            //console.log(nodeWithVisualEffects.index + " key down")


                        }

                    });

                    // event ctrl key up establishes the started connection with the source from ctrl key up to the target which is the  'nodeWithVisualEffects' when ctrl key up
                    $(document).keyup(function () {
                        event.stopPropagation();
                        if (event.which == "17") {
                            event.stopPropagation();
                            controlIsPressed = false;


                            // only with left click selected nodes can act as a source (createRelationStartNodeReference)
                            // and the source cannot be also a target  (nodeWithVisualEffects)
                            if (selectedNodeReference === createRelationStartNodeReference &&
                                createRelationStartNodeReference !== nodeWithVisualEffects &&
                                nodeWithVisualEffects !== self) {

                                // draw connection: createRelationStartNodeReference -----> nodeWithVisualEffects
                                createRelationStartNodeReference.createAndDrawNewDirectedEdgeFromCallerNodeToArgumentNode(nodeWithVisualEffects);
                            }


                            // console.log(nodeWithVisualEffects.index + " key up")


                        }
                    });


                    // bind to the root instances div element mouseDown and MouseUp events to do nothing at any hover events of other nodes while mouse down
                    selfsDivElement.bind("mousedown", self.setMouseDownTrue);
                    selfsDivElement.bind("mouseup", self.setMouseDownFalse);

                    // check if cookie is set and if yes try to load the lastSavedMap
                    var lastSavedMap = self.getCookieValueForCookieKey("lastSavedMap");
                    if (lastSavedMap) {
                        //self.loadAndRenderRootMapFromDataStore(lastSavedMap); // load saved map with manually entered key part "root"
                    }
                    // that the root map ( or child of root )is already selected as "nodeWithVisualEffects" when mouse is already over div in which ccm-skm is embedded at page load
                    self.mouseoverMethod();
                    self.addMenuBarToRootInstanceHeadDivElement();


                    if (selfsHeadDivElement.find('#userTextInput')[0].value != "") // if the text box for the username is not empty
                        self.letRootInstanceDoConvergenceLogin(); //TODOCONVERGENCE Remove the auto login

                    // when the root is rendered the first time it is the current anchor node
                    anchorNode = self;


                } else { // this node is NOT the root node


                    // for all not root ccm-skm instances change the temporary id of selfsChildAreaDivElement to the permanent unique one
                    selfsChildAreaDivElement.attr("id", self.index + "-child_area_div_element");

                }

                // when the mouse is moved the root element calls its (self===root) mouseMoved()
                self.element[0].onmousemove = self.mouseCursorInSelfsDivElementMoved; //TODOCONVERGENCE try to fins a mouse move event that does not trigger all the time in google chrome ( this one does )
                // when clicked on the root nodes selfsDivElement ( get overridden later )
                selfsDivElement[0].onclick = self.mouseInSelfsDivElementClicked;

                // just re display a leaf component by using an existing leaf instance reference called when zoomed in or out
                if (self.leafUrl && leafInstanceReference)
                    self.displayAlreadyInitLeafInstanceAgain();


                // bind to every instance the jQuery 'mouseenter'->enter_function and 'mouseleave'->exit_function event
                selfsChildAreaDivElement.hover(self.enter_function, self.exit_function);


                //self.checkIfFontHeightIsBiggerThanNodeAndMakeFontSmaller();


                // TODO add droppable only once for the node where a node is currently dragged over
                if (!selfsChildAreaDivElement.is('.ui-droppable'))
                    self.element.find(selfsChildAreaDivElement).droppable({
                        greedy: true,
                        tolerance: "intersect", //TODOCONVERGENCE `fit` does not take child nodes in account
                        drop: function (event, ui) {

                            if (self.index !== self.rootSelfReference.getNodeWithVisualEffects().parent.index) {

                                self.addDraggedNodeToSelf(ui);
                            }

                        }
                    });


                // perform callback
                if (callback) callback();

            };

            /**
             * @summary connects self ( draws a directed line ) as source with the 'newAdjacentNodeReference' as target
             * @param newAdjacentNodeReference
             * @param [labelString] the visible label of the connection, if no parameter is given a default value will be used
             */
            this.connectSelfAsSourceWithArgumentNodeAsTarget = function (newAdjacentNodeReference, labelString) {

                var connectionProperties = {
                    anchor: "Continuous",
                    endpoint: "Blank",
                    paintStyle: {strokeStyle: "black", lineWidth: 2},
                    connector: "Straight"

                };

                labelString = labelString || self.id + " to " + newAdjacentNodeReference.id;

                jsPlumb.ready(function () {


                    var sourceDivElement = selfsChildAreaDivElement;
                    var targetDivElement = newAdjacentNodeReference.element;

                    jsPlumb.connect({
                        source: sourceDivElement,
                        target: targetDivElement,
                        overlays: [

                            ["Label", {
                                label: labelString,
                                location: 0.5,
                                id: "label-from-source-" + self.index + "-child_area_div_element"
                            }],
                            ["Arrow", {
                                location: 1,
                                id: "arrow-from-source-" + self.index + "-child_area_div_element",
                                length: 14,
                                foldback: 0.5,
                                width: 10
                            }]
                        ]
                    }, connectionProperties);

                    //console.log("connectSelfAsSourceWithArgumentNodeAsTarget called for :  " + self.index + " -> " + newAdjacentNodeReference.index)

                });


            };

            /**
             * @summary gets triggered when the mouse cursor enters self and the mouse cursor is NOT coming
             * from a child node of self. If no mouse button is  pressed it sets self as the currently mouseOver Node
             * @param event
             */
            this.enter_function = function (event) {

                if (self.rootSelfReference.getMouseDown())
                    return;

                //console.log("enter: " + self.index);
                event.stopPropagation();
                self.mouseoverMethod();
            };

            /**
             * @summary sets the parent node as the currently mouseOver Node
             * Gets triggered when the mouse cursor leaves self and the mouse cursor is
             * going to the parent node of self. Because the parent gets no 'mouseenter' event if the mouse
             * courser comes from a child of him, this method calls the same method as a 'mouseenter' event into the parent would
             * But only if no mouse button is  pressed
             * @param event
             */
            this.exit_function = function (event) {

                if (self.rootSelfReference.getMouseDown())
                    return;

                // console.log("exit: " + self.index);
                event.stopPropagation();

                // do nothing for the root node
                if (!selfsDivElement.hasClass("ccm-super_knowledge_map-root")) {


                    var contextMenuElement = document.getElementById("context-menu-layer");
                    // if 'mouseleave' event for self comes not from displaying the context menu one z-index above self
                    if (!contextMenuElement)
                        self.parent.mouseoverMethod(); // TODO find clear if context menu was the trigger -> remove if this version passed all the tests
                }


            };

            /**
             * @summary gets called when the mouse cursor enters self and checks if self is currently set as node
             * with 'VisualEffects' if yes do nothing if not delete 'VisualEffects' from old node and add to self
             */
            this.mouseoverMethod = function () {

                // var d = new Date();
                // var n = d.getTime();
                // console.log(n + " mouseoverMethod for: " + self.index);


                var oldNodeWithVisualEffects = self.rootSelfReference.getNodeWithVisualEffects();


                if (oldNodeWithVisualEffects && oldNodeWithVisualEffects != self) {

                    var oldDivElement = oldNodeWithVisualEffects.element;

                    //remove all the VisualizationModificationFunctionality if it exists
                    if ($(oldDivElement).is('.ui-resizable'))
                        $(oldDivElement).resizable("destroy");
                    if ($(oldDivElement).is('.ui-draggable'))
                        $(oldDivElement).draggable("destroy");
                    $.contextMenu('destroy');

                    self.rootSelfReference.setNodeWithVisualEffects(self);
                    self.addVisualizationModificationFunctionality();

                    /**
                     * if a context menu was still open, even if it got closed / destroyed  by "$.contextMenu('destroy')"
                     * the .css class remains and prevents to display the context menu again
                     */
                    oldNodeWithVisualEffects.getSelfsDivElement().removeClass("context-menu-active");


                } else if (!oldNodeWithVisualEffects) {
                    self.rootSelfReference.setNodeWithVisualEffects(self);
                    self.addVisualizationModificationFunctionality();
                }

            };

            /**
             * @summary adds visualization modification functionality
             * such as 'resize' 'move' 'contextMenu' 'onclick' 'onDoubleClick' to the given HTML Element
             */
            this.addVisualizationModificationFunctionality = function () {

                // $(function () {}); === $(document).ready(function(){}); This is to prevent any jQuery code from running before the document is finished loading (is ready)
                $(function () {


                    if (!selfsDivElement.hasClass("ccm-super_knowledge_map-root")
                        && !selfsChildAreaDivElement.hasClass("ccm-super_knowledge_map-zoomed_anchor_node")
                        && ( ( selfsModelPermissionsForLoggedInUser && selfsModelPermissionsForLoggedInUser.manage === true ) || self.selfIsRootSharedNode === true)) {
                        // if I have write permissions or it is the rootSharedNode

                        var containmentForDrop = self.rootSelfReference.element; // no node can be dragged outside the roots element

                        //if I am not the owner of self and the sharedRootNode is visible in the dom restrict movement to the root shared node  and it is not the root shared node
                        if (!self.selfIsRootSharedNode && selfsCollaborativeModel && // this node is not the root shared node
                            self.rootLoggedInUser != selfsCollaborativeModel.elementAt("owner").value() && // I am not the owner of this node -> it has a root sharedNode
                            self.sharedRootNodeReference && document.getElementById(self.sharedRootNodeReference.element.attr('id'))) { // the rootShared not is not visible
                            containmentForDrop = self.sharedRootNodeReference.element;
                        }

                        // add resize functionality, needs a binding to every instance
                        $(selfsChildAreaDivElement).resizable({
                            start: function () {
                                self.checkIfChildPositionSizeAmountChangedAndRecalculateBoundaries();
                                self.setSelfAsSelectedNode();

                                //while dragging disable all pointer events of the leafInstance ( they can obstruct dragging )
                                if (selfsLeafAreaDivElement) {
                                    selfsLeafAreaDivElement.css('pointer-events', 'none')
                                }

                            },
                            stop: function () {


                                //while dragging disable all pointer events of the leafInstance ( they can obstruct dragging )
                                if (selfsLeafAreaDivElement) {
                                    selfsLeafAreaDivElement.css('pointer-events', '')
                                }

                                self.rootSelfReference.updateSelfsDataInRootsNodeTree(self);
                                self.updateRelativePositionAndSizeInParent();
                                self.parent.setChildrenAddedResizedDraggedDeleted(true); // let the parent know that this child is resized
                                self.draggedResizedDeletedAndChangesNotSavedInTmpDatastore = true;

                                //when self gets smaller -> all children get relative size bigger

                                // it is the rootSharedNode and I am not the owner

                                if (selfsCollaborativeModel.elementAt("owner").value() !== self.rootSelfReference.rootLoggedInUser && self.parent !== "" &&
                                    selfsCollaborativeModel.elementAt("owner").value() !== self.parent.getSelfsCollaborativeModel().elementAt("owner").value()
                                ) {
                                    // gets called when a rootSharedNode is resized by not the owner and sets the total size of all children that the relative size stays the same
                                    self.adjustSizeOfChildrenThatTheyFitNewParentSize();
                                    childrenAddedResizedDraggedDeleted = true;
                                }
                                else {
                                    // gets called when a rootSharedNode is resized by  the owner and updates the relative size of the children that it matches the new parent size
                                    self.adjustSizeToParentPercentageInModelForAllChildren();
                                }


                            },
                            resize: function (event, ui) {
                                jsPlumb.revalidate(ui.helper); // todo both jsPlumb.revalidate only if this Instance / node has outgoing/incoming edges
                                self.updateRelativePositionAndSizeInParent();
                                self.updateSelfsCollaborativeModelSizeToParentPercentage();

                                if (selfsLeafAreaDivElement)
                                    self.setLeafDivDimensionToParentCcmSkm();
                            },
                            containment: "parent",
                            minHeight: selfsHeadDivElement.height()
                        });

                        // add draggable functionality , needs a binding to every instance
                        $(selfsChildAreaDivElement).draggable({
                            //containment: "parent", // cannot move a child outside its parent
                            revert: "invalid",
                            handle: selfsLeafAreaDivElement ? selfsHeadDivElement : false, // if the instance/self is a leaf wrapper then the draggable handle is just the headArea
                            containment: containmentForDrop,
                            start: function () {
                                self.setSelfAsSelectedNode();
                                selfsJoinedActivity.setState("draggable", true);

                            },
                            stop: function () {

                                // let the root instance update his 'rootsNodeTree' with the information of self->position
                                self.rootSelfReference.updateSelfsDataInRootsNodeTree(self);
                                self.updateRelativePositionAndSizeInParent();
                                self.parent.setChildrenAddedResizedDraggedDeleted(true); // let the parent know that this child is dragged
                                selfsJoinedActivity.setState("draggable", false);
                                self.draggedResizedDeletedAndChangesNotSavedInTmpDatastore = true;

                                /** if a user dropped into an invalid position and it triggered a "revert" after revert is finished "stop" gets triggered
                                 now use this stop to tell the other participants that the position of self was reverted **/
                                self.updateSelfsCollaborativeModelPositionToParentPercentage();

                            },
                            drag: function () {
                                jsPlumb.revalidate(selfsChildAreaDivElement);
                                // TODO when dragged child nodes relations are hidden until drag stop -> possible solution is to put all child relation in a container
                                // revalidate / repaint all connections / edges  of all children
                                self.repaintConnectionsOfAllChildNodes(); // TODO cpu intensive task try to do onl at stop and hide connection of children while dragging
                                self.updateRelativePositionAndSizeInParent();
                                self.updateSelfsCollaborativeModelPositionToParentPercentage();

                            }
                        });


                    }


                    function checkDisabledBecauseUserHasOnlyReadAccess() {
                        var disabled = false;

                        if (selfsModelPermissionsForLoggedInUser) {

                            if (!selfsModelPermissionsForLoggedInUser.manage) {
                                disabled = true;
                            }
                        }

                        return disabled;
                    }

                    function checkDisabledBecauseInstanceHasNoLoadedModelOrIsLeafWrapperOrUserHasOnlyReadAccess() {
                        var disabled = false;

                        if (!selfsCollaborativeModel)
                            disabled = true;


                        if (leafInstanceReference)
                            disabled = true;

                        if (disabled === false) {
                            disabled = checkDisabledBecauseUserHasOnlyReadAccess();
                        }


                        return disabled;
                    }


                    // add context menu functionality, needs a binding to every instance
                    $.contextMenu({
                        /**
                         * If self is a leaf wrapper and therefore contains a 'selfsLeafAreaDivElement'  div only bind the
                         * right click context menu to the 'selfsHeadDivElement' if not bind it to the whole 'selfsDivElement'
                         */
                        selector: selfsLeafAreaDivElement ? "#" + selfsHeadDivElement[0].id : "#" + selfsDivElement[0].id,
                        reposition: false,
                        events: {
                            show: function (opt, absolutePos) { // set the contextMenuOpenRelativeToParentMouseCoordinatesPercentage to the position where the context menu was opened

                                contextMenuOpenRelativeToParentMouseCoordinatesPercentage = self.getMouseEventCoordinates(absolutePos);

                            },
                        },
                        build: function () { // every time when a context menu ist shown its menu items get `build`

                            var activeCollaboratorsItemsForContextMenuObjectArray = self.getActiveCollaboratorsItemsForContextMenu();
                            self.getNodeIsSharedWithItemsForContextMenu(function (sharedCollaboratorsItems) {
                                self.element.find("#nodeSharedWith_txtField").append(sharedCollaboratorsItems); // async call will append the value to the text field
                            });


                            return {
                                callback: function (key, options) {
                                    var $this = this;
                                    // export states to data store
                                    $.contextMenu.getInputValues(options, $this.data());

                                    switch (key) {

                                        case "newSkmInstance":
                                            self.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel();
                                            break;

                                        case "deleteNodeAndAllChildren":

                                            self.deleteButtonPressed();
                                            break;

                                        case "loadLeafComponent":

                                            var url = $this.data().loadLeafComponent_txt.toString();

                                            if (self.checkIfValidURL(url)) {
                                                self.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel(null, callback, true);

                                                function callback(modelReadyInstance) {
                                                    modelReadyInstance.renderLeafComponent(url, false, true);
                                                }
                                            } else {

                                                $.notify("'" + url + "' is ot a valid URL that points to a javascript file", {
                                                    align: "center",
                                                    verticalAlign: "middle",
                                                    animationType: "fade",
                                                    delay: 0
                                                });
                                            }

                                            //self.rootSelfReference.updateSelfsDataInRootsNodeTree(childSKMCompSelf); // TODOCONVERGENCE remove rootNodes Tree

                                            break;
                                        case "test1kSequentialComponents":


                                            var k = 100;

                                        function createRecursiveSeq(k) {

                                            if (k >= 0) {

                                                self.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel(null, whenInstanceAndModelReadyCallback);
                                            }

                                            function whenInstanceAndModelReadyCallback() {
                                                k--;
                                                if (k >= 0)
                                                    createRecursiveSeq(k);

                                            }

                                        }

                                            createRecursiveSeq(k - 1);


                                            break;
                                        case "test1kNestedComponents":

                                        function createRecursiveNested(paramInstance, i) {
                                            var returnInstance = paramInstance.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel(null, whenInstanceAndModelReadyCallback);

                                            function whenInstanceAndModelReadyCallback(returnInstance) {
                                                i--;
                                                if (i > 0)
                                                    createRecursiveNested(returnInstance, i);

                                            }

                                            returnInstance.zoomIntoSelfsDivElementByOnlyRenderingItAndItsChildren();

                                        }

                                            createRecursiveNested(self, 50);

                                            break;
                                        case "saveNewHeadline":
                                            self.setHeadlineInSelfsHeadDivArea($this.data().saveNewHeadline_txtField);
                                            break;
                                        case "listAdjacentNodes":
                                            self.listAdjacentNodes();
                                            break;
                                        case "saveAllEdges":
                                            self.saveAllEdgesToLocalBrowserStorage();
                                            break;
                                        case "compareAllEdges":
                                            self.compareAllEdgesWithLocalBrowserStorage();
                                            break;
                                        case "shareSelfsModelWithOtherConvergenceUser":
                                            self.shareSelfsModelWithOtherConvergenceUser($this.data().shareSelfsModelWithOtherConvergenceUser_txtField, $this.data().radio);

                                            break;
                                        case "loadRealtimeDocId":
                                            self.loadSharedModelAndCreateAndRenderInstances($this.data().loadRealtimeDocId_txtField);
                                            break;
                                        case "nodeSharedWith":
                                            self.getNodeIsSharedWithItemsForContextMenu(function (sharedCollaboratorsItems) {
                                                alert(sharedCollaboratorsItems);
                                            });
                                            break;


                                    }
                                },
                                items: {
                                    "newSkmInstance": {
                                        name: "New blank skm-component",
                                        //accesskey: "N",
                                        disabled: checkDisabledBecauseInstanceHasNoLoadedModelOrIsLeafWrapperOrUserHasOnlyReadAccess
                                    },
                                    "deleteNodeAndAllChildren": {
                                        name: "Delete Node",
                                        disabled: (selfsDivElement.hasClass("ccm-super_knowledge_map-root") || checkDisabledBecauseUserHasOnlyReadAccess)
                                        //accesskey: "D" // TODO Access keys trigger in text areas

                                    },
                                    separator1: "-----",

                                    "loadLeafComponent": {
                                        disabled: checkDisabledBecauseInstanceHasNoLoadedModelOrIsLeafWrapperOrUserHasOnlyReadAccess,
                                        name: "Load URL "
                                    },
                                    "loadLeafComponent_txt": {
                                        disabled: checkDisabledBecauseInstanceHasNoLoadedModelOrIsLeafWrapperOrUserHasOnlyReadAccess,
                                        type: 'text',
                                        value: location.hostname + "/convergence-skm/persistent_wysiwyg_text_editor/ccm.persistent_wysiwyg_text_editor.js"

                                    },
                                    // "test1kSequentialComponents": {
                                    //     name: "test1kSequentialComponents"
                                    // },
                                    // "test1kNestedComponents": {
                                    //     name: "test1kNestedComponents"
                                    // },
                                    separator2: "-----",
                                    "saveNewHeadline": {
                                        name: "Save New Headline",
                                        disabled: selfsDivElement.hasClass("ccm-super_knowledge_map-root") || checkDisabledBecauseUserHasOnlyReadAccess
                                    },
                                    "saveNewHeadline_txtField": {

                                        type: 'text',
                                        value: "",
                                        disabled: selfsDivElement.hasClass("ccm-super_knowledge_map-root") || checkDisabledBecauseUserHasOnlyReadAccess
                                    },
                                    // "listAdjacentNodes": {
                                    //     name: "List adjacent Nodes",
                                    //     disabled: selfsDivElement.hasClass("ccm-super_knowledge_map-root")
                                    // },
                                    // "saveAllEdges": {
                                    //     name: "Save all Edges",
                                    //     disabled: !selfsDivElement.hasClass("ccm-super_knowledge_map-root")
                                    // },
                                    // "compareAllEdges": {
                                    //     name: "Compare all Edges",
                                    //     disabled: !selfsDivElement.hasClass("ccm-super_knowledge_map-root")
                                    // },
                                    separator3: "-----",
                                    "shareSelfsModelWithOtherConvergenceUserMenu": {
                                        name: "Share Node with user",
                                        disabled: selfsDivElement.hasClass("ccm-super_knowledge_map-root") || (selfsModelPermissionsForLoggedInUser && selfsModelPermissionsForLoggedInUser.manage != true),
                                        items: {

                                            shareSelfsModelWithOtherConvergenceUser: {
                                                name: "Share:",
                                            },
                                            "shareSelfsModelWithOtherConvergenceUser_txtField": {
                                                type: 'text',
                                                value: "",
                                                disabled: selfsDivElement.hasClass("ccm-super_knowledge_map-root")

                                                //disabled: checkDisabledBecauseInstanceHasNoLoadedModelOrIsLeafWrapperOrUserHasOnlyReadAccess
                                            },
                                            radio1: {
                                                name: "read",
                                                type: 'radio',
                                                radio: 'radio',
                                                value: 'read',
                                                selected: true
                                            },
                                            radio2: {
                                                name: "write",
                                                type: 'radio',
                                                radio: 'radio',
                                                value: 'write',

                                            },
                                        }
                                    },


                                    separator4: "-----",
                                    "loadRealtimeDocId": {
                                        disabled: checkDisabledBecauseInstanceHasNoLoadedModelOrIsLeafWrapperOrUserHasOnlyReadAccess,
                                        name: "Load shared Node "

                                    },
                                    "loadRealtimeDocId_txtField": {
                                        disabled: checkDisabledBecauseInstanceHasNoLoadedModelOrIsLeafWrapperOrUserHasOnlyReadAccess,
                                        type: 'text',
                                        value: "",

                                    },
                                    separator5: "-----",
                                    "currentRealtimeDocID": {
                                        type: 'text',
                                        value: self.realtimeDocId,
                                        disabled: true

                                    },
                                    "showActiveCollaboratorsAndSharedUsers": {
                                        "name": "Collaborators",
                                        "items": {
                                            "activeCollaborators": {

                                                "name": "Active Collaborators",
                                                "items": activeCollaboratorsItemsForContextMenuObjectArray
                                            },
                                            separator7: "-----",
                                            "ownerOfModel": {
                                                disabled: true,
                                                name: "Owner: " + (selfsCollaborativeModel ? selfsCollaborativeModel.elementAt("owner").value() : "")
                                            },

                                            "nodeSharedWith": {
                                                "name": "Node is shared With:",
                                                disabled: true,

                                            },
                                            "nodeSharedWith_txtField": {
                                                disabled: true,
                                                name: "nodeSharedWith_txtField",
                                                type: 'html',
                                                html: '<ul id="nodeSharedWith_txtField" style=" white-space: nowrap;padding:0"></ul>'


                                            },

                                        }
                                    }

                                }
                            };
                        }
                    });

                    //add double click event on selfsChildAreaDivElement event
                    selfsDivElement[0].ondblclick = function (event) {

                        // if clicked on a leaf area content do nothing
                        if (event.target !== this && event.target !== selfsHeadDivElement[0]
                            && event.target !== selfsHeadDivElementHeadlineDiv[0] && event.target !== selfsHeadDivElementTextInfoDiv[0])
                            return;

                        event.stopPropagation(); // Prevents  event from bubbling up  DOM tree, preventing parent handlers from being notified.
                        self.zoomIntoSelfsDivElementByOnlyRenderingItAndItsChildren(); // zoom into the current selected node
                    };

                    //add  click event on selfsChildAreaDivElement event
                    selfsDivElement[0].onclick = function (event) {

                        event.stopPropagation(); // Prevents  event from bubbling up  DOM tree, preventing parent handlers from being notified.
                        self.setSelfAsSelectedNode(); // zoom into the current selected node

                        self.rootSelfReference.mouseInSelfsDivElementClicked(event);


                    };

                });

            };

            /**
             * @summary when an node is resized then the relative size of all children
             * in the model has to be recalculated
             */
            this.adjustSizeToParentPercentageInModelForAllChildren = function () {


                function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {

                    var length = nodeChildObjectReferenceArray.length;

                    // do for all children
                    for (var i = 0; i < length; i++) {

                        if (nodeChildObjectReferenceArray[i].notRendered)
                            return;

                        // get the parent div 'child_div_area'
                        nodeChildObjectReferenceArray[i].updateSelfsCollaborativeModelSizeToParentPercentage();
                        nodeChildObjectReferenceArray[i].updateSelfsCollaborativeModelPositionToParentPercentage();


                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());
                    }


                }

                bfsTraverseChildrenRec(nodeChildObjectReferenceArray);

            };

            /**
             * @summary adjusts the leaf dimension to the new parent size
             */
            this.adjustSizeOfChildrenThatTheyFitNewParentSize = function () {

                function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {

                    var length = nodeChildObjectReferenceArray.length;

                    // do for all children
                    for (var i = 0; i < length; i++) {

                        if (nodeChildObjectReferenceArray[i].notRendered)
                            return;

                        // get the parent div 'child_div_area'
                        nodeChildObjectReferenceArray[i].onSelfsCollaborativeModelSizePositionHasChanged();
                        nodeChildObjectReferenceArray[i].setLeafDivDimensionToParentCcmSkm();

                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());
                    }

                }

                bfsTraverseChildrenRec(nodeChildObjectReferenceArray);

            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE -> adds the data from the callerNodeSelf to roots
             * 'rootsNodeTree' array and returns the array index in which the node data was stored
             * @param callerNodeSelf
             * @return {number} the index of the rootsNodeTree array in which callerNodeSelf was added
             */
            this.addSelfsDataToRootsNodeTree = function (callerNodeSelf) {

                if (!selfsDivElement.hasClass("ccm-super_knowledge_map-root")) {
                    alert("addSelfsDataToRootsNodeTree() MAY ONLY INVOKED BY THE ROOT NODE ");
                    return -1;
                }

                var index = rootsNodeTree.push({
                    id: callerNodeSelf.index,
                    parentId: callerNodeSelf.parent === "" ? null : callerNodeSelf.parent.index,
                    position: {
                        left: callerNodeSelf.element.css('left') === "auto" ? "0px" : callerNodeSelf.element.css('left'), // use the .css values because .posit
                        top: callerNodeSelf.element.css('top') === "auto" ? "0px" : callerNodeSelf.element.css('top')
                    },
                    size: {
                        width: callerNodeSelf.element.width(),
                        height: callerNodeSelf.element.height()
                    },
                    leafUrl: callerNodeSelf.leafUrl,
                    selfsIndexInRootsNodeTree: -1,
                    currentDisplayRootElement: false,
                    leafStateData: self.leafStateData


                });
                index--;

                rootsNodeTree[index].selfsIndexInRootsNodeTree = index;

                return index;

            };

            /**
             * @summary adds the ccm-skm instance 'newAdjacentNodeReference' as an adjacent node
             * to self and draws a directed edge with self as source and  'newAdjacentNodeReference' as target
             * @param newAdjacentNodeReference
             */
            this.createAndDrawNewDirectedEdgeFromCallerNodeToArgumentNode = function (newAdjacentNodeReference) {

                var edgeContent = self.id + " to " + newAdjacentNodeReference.id;
                var edgeUUID = uuid.v1();

                // this node ( argument node ) is the destination
                newAdjacentNodeReference.getAdjacentNodesOfSelfArray().push({

                    edgeUUID: edgeUUID,
                    edgeContent: edgeContent,
                    selfUUID: newAdjacentNodeReference.uuid,
                    adjacentNodeUUID: self.uuid,
                    edgeDirection: "incoming",
                    selfIndex: newAdjacentNodeReference.index,
                    adjacentNodeIndex: self.index,
                    adjacentNodeReference: self
                });

                // this node ( self ) is the source
                adjacentNodesOfSelfArray.push({
                    edgeUUID: edgeUUID,
                    edgeContent: edgeContent,
                    selfUUID: self.uuid,
                    adjacentNodeUUID: newAdjacentNodeReference.uuid,
                    edgeDirection: "outgoing",
                    selfIndex: self.index,
                    adjacentNodeIndex: newAdjacentNodeReference.index,
                    adjacentNodeReference: newAdjacentNodeReference
                });
                self.connectSelfAsSourceWithArgumentNodeAsTarget(newAdjacentNodeReference, edgeContent);

                console.log(adjacentNodesOfSelfArray[adjacentNodesOfSelfArray.length - 1].index + " was added to adjacentNodesOfSelfArray");
            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE -> updates the 'rootsNodeTree' has map that is saved in the root node
             * with either position, size or leafURl of the calling 'callerNodeSelf'
             * @param callerNodeSelf
             */
            this.updateSelfsDataInRootsNodeTree = function (callerNodeSelf) {

                if (!selfsDivElement.hasClass("ccm-super_knowledge_map-root")) {
                    alert("updateSelfsDataInRootsNodeTree() MAY ONLY INVOKED BY THE ROOT NODE ");
                    return;
                }

                var callerNodeSelfsChildAreaDivElement = callerNodeSelf.element;

                var position = {
                    left: callerNodeSelfsChildAreaDivElement.css('left'), // use the .css values because .posit
                    top: callerNodeSelfsChildAreaDivElement.css('top')
                };
                var size = {
                    width: callerNodeSelfsChildAreaDivElement.width(),
                    height: callerNodeSelfsChildAreaDivElement.height()
                };


                rootsNodeTree[callerNodeSelf.selfsIndexInRootsNodeTree].position = position;

                rootsNodeTree[callerNodeSelf.selfsIndexInRootsNodeTree].size = size;

                rootsNodeTree[callerNodeSelf.selfsIndexInRootsNodeTree].leafUrl = callerNodeSelf.leafUrl;

                rootsNodeTree[callerNodeSelf.selfsIndexInRootsNodeTree].leafStateData = callerNodeSelf.leafStateData;

                rootsNodeTree[callerNodeSelf.selfsIndexInRootsNodeTree].parent = callerNodeSelf.parent.index;

            };

            /**
             * @summary appends a &lt;div&gt; tag 'leaf' into the current instance and then renders into
             * this &lt;div&gt; tag the ccm component that was passed as a parameter
             * @param {string} leafComponentURL - the URL of the component that should be rendered
             * @param {boolean} loadedFromDatabase indicates if the component is added by the user or loaded from a datastore
             * @param {boolean} callFromLeafWrapperCreatedWithContextMenu indicates if the call comes from the context menu -> when leaf is created other participants will be notified that new leaf was created in self
             */
            this.renderLeafComponent = function (leafComponentURL, loadedFromDatabase, callFromLeafWrapperCreatedWithContextMenu) {

                // now this member is true because a leaf component will be rendered
                childrenAddedResizedDraggedDeleted = true;

                self.leafUrl = leafComponentURL;

                if (!loadedFromDatabase)
                    selfsCollaborativeModel.elementAt("leafInstanceUrl").value(self.leafUrl);

                //TODO BUG7 if a context menu is already open and we open another one then if the first context menu was visible the second one inherits the menu items of the first one

                // create the leaf area
                selfsDivElement.append('<div class="ccm-super_knowledge_map-leaf_div_area" id="' + self.index + '-leafArea"></div>');

                // set a reference to the leaf area
                selfsLeafAreaDivElement = self.element.find("#" + self.index + "-leafArea");

                // load the ccm component with that URL and receive a reference to the instance with the callback function
                //noinspection JSCheckFunctionSignatures
                ccm.instance(leafComponentURL, {
                    element: selfsLeafAreaDivElement,
                    parent: self
                }, callback);


                function callback(instance) {

                    /* set the reference to the leaf instance that self can access the
                     internal state of it by calling leafInstanceReference.getCurrentStateDataFromLeaf() */
                    leafInstanceReference = instance;
                    self.setOrUpdateContentAndTooltipOfSelfsHeadDivElement();
                    leafInstanceReference.render();

                    // set the maximum width/height of the self-> leaf area to the dimension of self->parent->SelfsDivElement
                    var parentsSelfsDivElement = self.parent.getSelfsDivElement();
                    selfsLeafAreaDivElement.css('max-width', (parentsSelfsDivElement.width()));
                    selfsLeafAreaDivElement.css('max-height', (parentsSelfsDivElement.height() - selfsHeadDivElement.height() - self.parent.getSelfsHeadDivElement().height() ));

                    // decrease the font size if the height of the text is bigger than selfsChildAreaDivElement.height()
                    //self.checkIfFontHeightIsBiggerThanNodeAndMakeFontSmaller(); // TODOCONVERGENCE removed do to bug  M_C_14_1_

                    // update the width and height of self = leafWrapper to leafInstance width and height
                    //self.updateSelfsCollaborativeModelSizeAndDimension(); // TODOCONVERGENCE  M_C_14_1_makeAddLeafRealtimeBUG when loaded because other participant created the size must be adjusted


                    if (loadedFromDatabase) { // in this case for self ( the leaf Wrapper ) selfsCollaborativeObject is available
                        selfsLeafAreaDivElement.css('max-width', (selfsDivElement.width()));
                        selfsLeafAreaDivElement.css('max-height', (selfsDivElement.height()) - selfsHeadDivElement.height());


                    } else { // in this case for self ( the leaf Wrapper ) selfsCollaborativeObject is maybe not finished to be  created

                        //console.log(position.left +" "+ position.top +" "+ dimension.width +" "+ dimension.height);
                        //console.log(position.left +" "+ position.top +" "+ dimension.width +" "+ dimension.height);
                        //console.log(self.relativeDimensionAndPositionToParent.leftPercentage + " " + self.relativeDimensionAndPositionToParent.topPercentage + " " + self.relativeDimensionAndPositionToParent.widthPercentage + " " + self.relativeDimensionAndPositionToParent.heightPercentage);
                        //console.log(self.relativeDimensionAndPositionToParent.leftPercentage + " " + self.relativeDimensionAndPositionToParent.topPercentage + " " + self.relativeDimensionAndPositionToParent.widthPercentage + " " + self.relativeDimensionAndPositionToParent.heightPercentage);

                        self.rootSelfReference.updateSelfsDataInRootsNodeTree(self);


                    }

                    if (typeof leafInstanceReference.createOrLoadLeafInstanceDataModelCalledByWrapper == "function") {
                        leafInstanceReference.createOrLoadLeafInstanceDataModelCalledByWrapper(selfsCollaborativeModel, self.rootSelfReference.rootLoggedInUser);  //TODOCONVERGENCE Race Condition with callback from open model

                    }

                    if (!loadedFromDatabase)
                        self.updateSelfsCollaborativeModelSizeToParentPercentage();

                    if (callFromLeafWrapperCreatedWithContextMenu) {
                        self.parent.getSelfsCollaborativeModel().elementAt("newChildInstanceCreated").value(self.realtimeDocId);
                    }


                }


            };

            /**
             * @summary repaints the JsPlumb connections of all children of self
             */
            this.repaintConnectionsOfAllChildNodes = function () {

                function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {

                    var length = nodeChildObjectReferenceArray.length;

                    // do for all children
                    for (var i = 0; i < length; i++) {

                        if (nodeChildObjectReferenceArray[i].notRendered)
                            return;

                        // get the parent div 'child_div_area'
                        var parentDivHTMLElement = nodeChildObjectReferenceArray[i].element;
                        jsPlumb.revalidate(parentDivHTMLElement);


                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());
                    }


                }

                bfsTraverseChildrenRec(nodeChildObjectReferenceArray);

            };

            /**
             * @summary updates the 'self.relativeDimensionAndPositionToParent' values with the current percentage
             * of the HTML 'selfsChildAreaDivElement' div element to the parents 'selfsChildAreaDivElement'
             * example: selfs  self.relativeDimensionAndPositionToParent.widthPercentage = self: 250px / self.parent: 500 px = 0.5
             */
            this.updateRelativePositionAndSizeInParent = function () {

                if (!selfsDivElement.hasClass("ccm-super_knowledge_map-root")) {

                    self.relativeDimensionAndPositionToParent.widthPercentage = selfsChildAreaDivElement.width() / self.parent.element.width();
                    self.relativeDimensionAndPositionToParent.heightPercentage = selfsChildAreaDivElement.height() / self.parent.element.height();
                    self.relativeDimensionAndPositionToParent.topPercentage = parseFloat(selfsChildAreaDivElement.css('top')) / self.parent.element.height();
                    self.relativeDimensionAndPositionToParent.leftPercentage = parseFloat(selfsChildAreaDivElement.css('left')) / self.parent.element.width();
                }
            };

            /**
             * @summary sets the position of the new created node to the mouse pointer value where the context
             * menu was opened
             * @param instance
             */
            this.setRelativePositionToParentOfArgumentToSelfsContextMenuMousePosition = function (instance) {

                if (!contextMenuOpenRelativeToParentMouseCoordinatesPercentage)
                    return;

                instance.relativeDimensionAndPositionToParent.topPercentage = parseFloat(contextMenuOpenRelativeToParentMouseCoordinatesPercentage.y);
                instance.relativeDimensionAndPositionToParent.leftPercentage = parseFloat(contextMenuOpenRelativeToParentMouseCoordinatesPercentage.x);
            };

            /**
             * @summary duplicates the adjacentNodesOfSelfArray in a new array without the references
             * @return {Array<Object>}
             */
            this.getAdjacentNodesOfSelfArrayWithoutReference = function () {

                var adjacentNodesOfSelfArrayWithoutReferences = [];

                for (var l = 0; l < adjacentNodesOfSelfArray.length; l++) {
                    adjacentNodesOfSelfArrayWithoutReferences.push(
                        {
                            // fromTo: adjacentNodesOfSelfArray[l].fromTo,
                            // index: adjacentNodesOfSelfArray[l].reference.id,
                            // UUID: adjacentNodesOfSelfArray[l].reference.uuid,
                            // labelContent: adjacentNodesOfSelfArray[l].labelString,
                            // edgeID: adjacentNodesOfSelfArray[l].edgeID

                            edgeUUID: adjacentNodesOfSelfArray[l].edgeUUID,
                            edgeContent: adjacentNodesOfSelfArray[l].edgeContent,
                            selfUUID: adjacentNodesOfSelfArray[l].selfUUID,
                            adjacentNodeUUID: adjacentNodesOfSelfArray[l].adjacentNodeUUID,
                            edgeDirection: adjacentNodesOfSelfArray[l].edgeDirection,
                            selfIndex: adjacentNodesOfSelfArray[l].selfIndex,
                            adjacentNodeIndex: adjacentNodesOfSelfArray[l].adjacentNodeIndex
                        }
                    );

                }

                return adjacentNodesOfSelfArrayWithoutReferences;

            };

            /**
             * @summary -removes the calling node 'selfsChildAreaDivElement' and therefore all its
             * child HTML elements from the DOM
             * -removes selfs reference from its parents 'childObjectReferenceArray'
             * -removes self and all its children from the 'rootsNodeTree'
             */
            this.deleteInstanceAndModelAndAllSubInstancesAndModels = function () {

                //TODOCONVERGENCE ignores the rootsNodeTree

                // removes the self.realtimeDocId from the parents
                //self.parent.deleteRealtimeDocIdFromSelfsCollaborativeModel(self.realtimeDocId);

                /**
                 * @summary runs the recursion for bfsTraverseChildrenToSaveTree()
                 * @param nodeChildObjectReferenceArray
                 */
                function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {


                    var length = nodeChildObjectReferenceArray.length;

                    // do for all children
                    for (var i = 0; i < length; i++) {


                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());
                        var modelService = nodeChildObjectReferenceArray[i].rootSelfReference.getRootsConvergenceModelService();
                        modelService.remove(nodeChildObjectReferenceArray[i].realtimeDocId);
                    }


                }


                // delete all child models  of self recursively by accessing them with the child skm instance references
                bfsTraverseChildrenRec(nodeChildObjectReferenceArray);


                // remove selfs model because it is not included in the `bfsTraverseChildrenRec()` above
                var modelService = self.rootSelfReference.getRootsConvergenceModelService();
                modelService.remove(self.realtimeDocId); //TODOCONVERGENCE make sure that the right collection is deleted

                // remove selfs reference to the parent and remove selfs ( and its children ) DOM Elements form the Web Browser
                self.deleteInstanceReferenceToParentAndRemoveDOMElements();

            };

            /**
             * @summary removes the reference of self to the parent and removes
             * selfs ( and all its children ) HTML DOM elements
             */
            this.deleteInstanceReferenceToParentAndRemoveDOMElements = function () {

                // remove self from parents nodeChildObjectReferenceArray
                var parentsNodeChildObjectReferenceArray = self.parent.getNodeChildObjectReferenceArray();
                for (var i = 0; i < parentsNodeChildObjectReferenceArray.length; i++) {
                    if (parentsNodeChildObjectReferenceArray[i].index === self.index) {
                        parentsNodeChildObjectReferenceArray.splice(i, 1);
                    }
                }//TODO 5 the Instance JavaScript Object does still exist and therefore the self.id ( set from ccm framework ) is still used and cannot be reused for the next new instance

                // let the parent node know that a child from its 'nodeChildObjectReferenceArray' is deleted
                self.parent.setChildrenAddedResizedDraggedDeleted(true);


                // remove self and all children HTML elements from the DOM
                selfsChildAreaDivElement.remove();

            };

            /**
             * @summary removes the parameter entry from selfs childCollaborativeModelIdArray
             * @param {String} realtimeDocId
             */
            this.deleteRealtimeDocIdFromSelfsCollaborativeModel = function (realtimeDocId) {

                var childCollaborativeModelIdArray = selfsCollaborativeModel.elementAt("childCollaborativeModelIdArray");

                var deleteIndex = selfsCollaborativeModel.elementAt("childCollaborativeModelIdArray").findIndex(function (arrayItem) { // TODOCONVERGENCE remove the warning
                    return arrayItem.value() === realtimeDocId;
                });

                //console.log("delete index: " + deleteIndex)
                if (deleteIndex !== -1 && deleteIndex !== null) {
                    //console.log("delete for instance: " + self.index + " the id:" + selfsCollaborativeModel.elementAt("childCollaborativeModelIdArray").value()[deleteIndex]);
                    selfsCollaborativeModel.elementAt("childCollaborativeModelIdArray").remove(deleteIndex);
                }

            };

            /**
             * @summary implements a recursive functions that builds up a subtree
             * with the size, position id and parent id of the all the child ccm-skm nodes
             *
             * @returns {Array} an array with the id, parentId and size/position of all children of the current instance
             */
            this.bfsTraverseChildrenToSaveTree = function (nodeDataArray) {

                /**
                 * @summary runs the recursion for bfsTraverseChildrenToSaveTree()
                 * @param nodeChildObjectReferenceArray
                 */
                function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {

                    var length = nodeChildObjectReferenceArray.length;

                    // do for all children
                    for (var i = 0; i < length; i++) {

                        // get the parent div 'child_div_area'
                        var parentDivHTMLElement = nodeChildObjectReferenceArray[i].element;


                        var data = {
                            id: nodeChildObjectReferenceArray[i].index,
                            uuid: nodeChildObjectReferenceArray[i].uuid,
                            parentId: nodeChildObjectReferenceArray[i].parent.index,
                            position: {
                                left: parentDivHTMLElement.css('left'), // use the .css values because .posit
                                top: parentDivHTMLElement.css('top')
                            },
                            size: {width: parentDivHTMLElement.width(), height: parentDivHTMLElement.height()},
                            leafUrl: nodeChildObjectReferenceArray[i].leafUrl,
                            leafStateData: nodeChildObjectReferenceArray[i].leafStateData,
                            selfsHeadDivElementHeadline: nodeChildObjectReferenceArray[i].selfsHeadDivElementHeadline,
                            relativeDimensionAndPositionToParent: nodeChildObjectReferenceArray[i].relativeDimensionAndPositionToParent,
                            adjacentNodesOfSelfArray: nodeChildObjectReferenceArray[i].getAdjacentNodesOfSelfArrayWithoutReference()

                        };
                        //console.log("saved width % for node : " + nodeChildObjectReferenceArray[i].index + " " + nodeChildObjectReferenceArray[i].relativeDimensionAndPositionToParent.widthPercentage);

                        nodeDataArray.push(data);
                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());
                    }


                }

                bfsTraverseChildrenRec(nodeChildObjectReferenceArray);

            };

            /**
             * @summary alerts the incoming and outgoing edges of self one line for every edge
             */
            this.listAdjacentNodes = function () {

                var lineBreakList = "node " + self.id + " has edges: \n";
                for (var i in adjacentNodesOfSelfArray) {
                    var adjacentNodeReference = adjacentNodesOfSelfArray[i].adjacentNodeReference;
                    lineBreakList += adjacentNodesOfSelfArray[i].edgeDirection + ": " + adjacentNodeReference.id + "\n";
                } //TODOJSPLUMB remove context menu before display alert() field

                alert(lineBreakList);
            };

            /**
             * @summary pushes the content of self.loadedAdjacentNodesOfSelfArray and a reference to self
             * into the rootsTmpAdjacentNodesOfLoadedNodesArray
             * if called for several nodes the edge information of the nodes will be stored in the single rootsTmpAdjacentNodesOfLoadedNodesArray
             *
             * rootsTmpAdjacentNodesOfLoadedNodesArray contains now references to instances for one node of the edge and UUIDs for the oder node of the edge
             * e.g. reference ------> UUID
             */
            this.fillRootsTmpAdjacentNodesOfLoadedNodesArrayWithContentOfSelfStoredEdgeContent = function () {


                // check if field is not null
                if (self.loadedAdjacentNodesOfSelfArray === null)
                    return;

                //iterate over all outgoingIncomingEdgesUUIDAndLabelContent objects and look if the opposite instance is already created
                //and add it to the 'adjacentNodesOfSelfArray'

                for (var i = 0; i < self.loadedAdjacentNodesOfSelfArray.length; i++) {

                    // check if the other node does already exist
                    var rootAdjacentNodesOfSelfArray = self.rootSelfReference.getRootsTmpAdjacentNodesOfLoadedNodesArray();
                    rootAdjacentNodesOfSelfArray.push({

                        edgeUUID: self.loadedAdjacentNodesOfSelfArray[i].edgeUUID,
                        edgeContent: self.loadedAdjacentNodesOfSelfArray[i].edgeContent,
                        selfUUID: self.uuid,
                        adjacentNodeUUID: self.loadedAdjacentNodesOfSelfArray[i].adjacentNodeUUID,
                        edgeDirection: self.loadedAdjacentNodesOfSelfArray[i].edgeDirection,
                        selfIndex: self.index,
                        adjacentNodeIndex: self.loadedAdjacentNodesOfSelfArray[i].adjacentNodeIndex,
                        adjacentNodeReference: self
                    })
                }

                self.loadedAdjacentNodesOfSelfArray = null;

            };

            /**
             * @summary uses the roots rootsTmpAdjacentNodesOfLoadedNodesArray to build up the 'adjacentNodesOfSelfArray' for all references
             * that are stored in the 'rootsTmpAdjacentNodesOfLoadedNodesArray'
             *
             * when executed if 'rootsTmpAdjacentNodesOfLoadedNodesArray' contained all nodes( instance references ) that were loaded,
             * all of the loaded instances have now a filled 'adjacentNodesOfSelfArray' and the edges will be drawn
             */
            this.create_AdjacentNodesOfSelfArray_ForAllLoadedNodesIn_TmpAdjacentNodesOfLoadedNodesArray_AndDrawEdges = function () { //TODO Check if legit copy


                for (var i = 0; i < rootsTmpAdjacentNodesOfLoadedNodesArray.length; i++) {

                    var connectionPoint1 = rootsTmpAdjacentNodesOfLoadedNodesArray[i];


                    for (var j = 0; j < rootsTmpAdjacentNodesOfLoadedNodesArray.length; j++) {

                        var connectionPoint2 = rootsTmpAdjacentNodesOfLoadedNodesArray[j];

                        // connectionPoint1 is connected with connectionPoint2
                        if (connectionPoint1.edgeUUID === connectionPoint2.edgeUUID &&
                            connectionPoint1.selfUUID === connectionPoint2.adjacentNodeUUID &&
                            connectionPoint2.adjacentNodeUUID === connectionPoint1.selfUUID) {


                            connectionPoint1.adjacentNodeReference.getAdjacentNodesOfSelfArray().push({
                                edgeUUID: connectionPoint1.edgeUUID,
                                edgeContent: connectionPoint1.edgeContent,
                                selfUUID: connectionPoint1.adjacentNodeReference.uuid,
                                adjacentNodeUUID: connectionPoint2.selfUUID,
                                edgeDirection: connectionPoint1.edgeDirection,
                                selfIndex: connectionPoint1.adjacentNodeReference.index,
                                adjacentNodeIndex: connectionPoint2.adjacentNodeReference.index,
                                adjacentNodeReference: connectionPoint2.adjacentNodeReference
                            });

                            connectionPoint2.adjacentNodeReference.getAdjacentNodesOfSelfArray().push({
                                edgeUUID: connectionPoint2.edgeUUID,
                                edgeContent: connectionPoint2.edgeContent,
                                selfUUID: connectionPoint2.adjacentNodeReference.uuid,
                                adjacentNodeUUID: connectionPoint1.selfUUID,
                                edgeDirection: connectionPoint2.edgeDirection,
                                selfIndex: connectionPoint2.adjacentNodeReference.index,
                                adjacentNodeIndex: connectionPoint1.adjacentNodeReference.index,
                                adjacentNodeReference: connectionPoint1.adjacentNodeReference
                            });

                            // find out the direction
                            var source = null;
                            var target = null;

                            if (connectionPoint1.edgeDirection === "outgoing") {
                                source = connectionPoint1;
                                target = connectionPoint2;
                            } else if (connectionPoint2.edgeDirection === "outgoing") {
                                source = connectionPoint2;
                                target = connectionPoint1;
                            }

                            source.adjacentNodeReference.connectSelfAsSourceWithArgumentNodeAsTarget(target.adjacentNodeReference);


                            rootsTmpAdjacentNodesOfLoadedNodesArray.splice(j, 1);
                            j = 0;


                        }
                    }

                }
            };

            /**
             * @summary checks if the children of self are moved/resized/added and if yes recalculates the boundaries
             * to which self can be negatively resized
             */
            this.checkIfChildPositionSizeAmountChangedAndRecalculateBoundaries = function () {


                if (childrenAddedResizedDraggedDeleted === true) {

                    minHeightOfSelfsElement = selfsHeadDivElement.height();
                    minWidthOfSelfsElement = 0;

                    // do for all children
                    for (var i = 0; i < nodeChildObjectReferenceArray.length; i++) {
                        var childDivAreaOfTheNode = nodeChildObjectReferenceArray[i].element;
                        var tmpWidth = childDivAreaOfTheNode.width() + childDivAreaOfTheNode.position().left;
                        if (tmpWidth > minWidthOfSelfsElement)
                            minWidthOfSelfsElement = tmpWidth;

                        var tmpHeight = childDivAreaOfTheNode.height() + childDivAreaOfTheNode.position().top;
                        if (tmpHeight > minHeightOfSelfsElement)
                            minHeightOfSelfsElement = tmpHeight;


                    }


                    // calculate the new min width and min height for the calling ccm-skm node

                    $(selfsChildAreaDivElement).resizable({
                        minWidth: minWidthOfSelfsElement,
                        minHeight: minHeightOfSelfsElement
                    });

                    childrenAddedResizedDraggedDeleted = false;
                }

                else {

                    $(selfsChildAreaDivElement).resizable({
                        minWidth: minWidthOfSelfsElement,
                        minHeight: minHeightOfSelfsElement
                    });
                }

            };

            /**
             * @summary removes all the HTML child elements of the root node from the DOM and renders the calling node / self
             * and all its children into the root node. The DOM element of the calling node / self gets scaled with keeping the
             * aspect ratio until the dominant dimension touches the borders of the root node
             */
            this.zoomIntoSelfsDivElementByOnlyRenderingItAndItsChildren = function () {

                var savedSelfsChildAreaDivElementID = selfsChildAreaDivElement.attr("id");

                var save = self.rootSelfReference.getSelfsHeadDivElement().detach();
                self.rootSelfReference.getSelfsDivElement().empty().append(save);

                // remove every jsPlumbConnection ( and the javaScript connection objects  )
                jsPlumb.reset();


                // if ondblclick selfsDivElement is not the root then render itself again with reusing self instance
                if (!selfsDivElement.hasClass("ccm-super_knowledge_map-root")) {

                    // create/append a child area with the id self used into root
                    self.rootSelfReference.getSelfsDivElement().append('<div class="ccm-super_knowledge_map-child_div_area" id="' + savedSelfsChildAreaDivElementID + '"></div>');
                    self.element = self.rootSelfReference.getSelfsDivElement().find('#' + savedSelfsChildAreaDivElementID);


                    self.element.addClass("ccm-super_knowledge_map-zoomed_anchor_node");

                    // set the anchor node to the dimension of the rootNode but leave the rootsHeadDivElement free
                    self.element.width(self.rootSelfReference.element.width());
                    self.element.height(self.rootSelfReference.element.height() - self.rootSelfReference.getSelfsHeadDivElement().height());
                    self.element.css({
                        top: self.rootSelfReference.getSelfsHeadDivElement().height(),
                        left: 0
                    });

                    self.render();
                    self.drawSelfsExistingOutgoingIncomingConnectionsForAlreadyRenderedAdjacentNodes();

                    // remove the size and dimension onListeners for the new anchor node
                    self.leftPercentageModelReference.removeAllListenersForAllEvents();
                    self.topPercentageModelReference.removeAllListenersForAllEvents();
                    self.widthPercentageModelReference.removeAllListenersForAllEvents();
                    self.heightPercentageModelReference.removeAllListenersForAllEvents();


                }

                self.setSelfAsSelectedNode();
                self.setSelfAsAnchorNode();

                //add the onListeners again to the old parent node


                // fixed->BUG16 if the mouse cursor is over the node which was 'NodeWithVisualEffects' before the zoom it will now be reselected as 'NodeWithVisualEffects'
                self.rootSelfReference.setNodeWithVisualEffects(self);

                // recursively render all children of self into root node
                self.renderAndScaleDirectChildrenOfZoomedNode(nodeChildObjectReferenceArray);


            };

            /**
             * @summary draws all directed edges of self if the adjacent node is already rendered
             *
             */
            this.drawSelfsExistingOutgoingIncomingConnectionsForAlreadyRenderedAdjacentNodes = function () {

                for (var i = 0; i < adjacentNodesOfSelfArray.length; i++) {



                    // TODOJSPLUMB does only work because one node is always not rendered if not the connections get drawn double because both O---->O have them in their adjacentNodesOfSelfArray on with different from/to

                    var adjacentInstance = adjacentNodesOfSelfArray[i].adjacentNodeReference;

                    // check if the node that is adjacent to self is already rendered in the DOM ( only then the connection can be drawn )
                    var adjacentDivIsRendered = self.element.find("#" + adjacentInstance.index + "-child_area_div_element").is("div");


                    if (adjacentNodesOfSelfArray[i].edgeDirection === "outgoing" && adjacentDivIsRendered) {
                        self.connectSelfAsSourceWithArgumentNodeAsTarget(adjacentInstance, adjacentNodesOfSelfArray[i].edgeContent);
                    }
                    else if (adjacentNodesOfSelfArray[i].edgeDirection === "incoming" && adjacentDivIsRendered) {
                        adjacentInstance.connectSelfAsSourceWithArgumentNodeAsTarget(self, adjacentNodesOfSelfArray[i].edgeContent);
                    }

                }


            };

            /**
             * @summary renders and scales all nodes containing in parameter 'nodeChildObjectReferenceArray' and calls
             * itself for all children of this nodes. No new Instances are created only existing instances get rendered again
             * @param {Array.<Instance>} nodeChildObjectReferenceArray an array with all the direct children of the zoomed/scaled node
             */
            this.renderAndScaleDirectChildrenOfZoomedNode = function (nodeChildObjectReferenceArray) {

                var length = nodeChildObjectReferenceArray.length;

                // do for all children
                for (var i = 0; i < length; i++) {

                    var savedSelfsChildAreaDivElementID = nodeChildObjectReferenceArray[i].element.attr("id");

                    nodeChildObjectReferenceArray[i].parent.getSelfsDivElement().append('<div class="ccm-super_knowledge_map-child_div_area" id="' + savedSelfsChildAreaDivElementID + '"></div>');

                    var childDivArea = nodeChildObjectReferenceArray[i].parent.getSelfsDivElement().find('#' + savedSelfsChildAreaDivElementID);
                    childDivArea.width(nodeChildObjectReferenceArray[i].parent.element.width() * nodeChildObjectReferenceArray[i].widthPercentageModelReference.value());
                    childDivArea.height(nodeChildObjectReferenceArray[i].parent.element.height() * nodeChildObjectReferenceArray[i].heightPercentageModelReference.value());
                    childDivArea.css({
                        top: nodeChildObjectReferenceArray[i].parent.element.height() * nodeChildObjectReferenceArray[i].topPercentageModelReference.value(),
                        left: nodeChildObjectReferenceArray[i].parent.element.width() * nodeChildObjectReferenceArray[i].leftPercentageModelReference.value()
                    });

                    nodeChildObjectReferenceArray[i].element = self.element.find("#" + savedSelfsChildAreaDivElementID);

                    if (nodeChildObjectReferenceArray[i].element.width() > 1 || nodeChildObjectReferenceArray[i].element.height() > 1) {
                        nodeChildObjectReferenceArray[i].render();
                        nodeChildObjectReferenceArray[i].checkIfOwnerAndSetAccordingOutline("1px");
                        nodeChildObjectReferenceArray[i].onSelfsCollaborativeModelSizePositionHasChanged();
                        nodeChildObjectReferenceArray[i].drawSelfsExistingOutgoingIncomingConnectionsForAlreadyRenderedAdjacentNodes();
                        this.renderAndScaleDirectChildrenOfZoomedNode(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());
                    }


                }

            };

            /**
             * @summary set self / this node as the currently selected node in the DOM / GUI
             */
            this.setSelfAsSelectedNode = function () {

                self.rootSelfReference.setSelectedNodeAndGiveHimThickOutline(self);

            };

            /**
             * @summary sets the background color of the `div` in which self {ccm-skm instance} is rendered
             * to the other toggle color that his parent
             */
            this.setBackgroundColorToOppositeOfParent = function () {

                var beige = "rgb(245, 242, 235)";
                var white = "rgb(255, 253, 250)";

                var parentColorRGB = selfsChildAreaDivElement.parent().css('background-color');

                if (parentColorRGB == white) {
                    selfsDivElement.css("background-color", beige);
                    self.color = beige;
                } else {
                    selfsDivElement.css("background-color", white);
                    self.color = white;
                }

            };

            /**
             * @summary sets the actual width/height of the leaf Area from self to the
             * width/height of the childArea in which self is embedded also removes the initial height/width restrictions
             * on the leaf area of self
             */
            this.setLeafDivDimensionToParentCcmSkm = function () {

                if (selfsLeafAreaDivElement) {
                    selfsLeafAreaDivElement.height(selfsChildAreaDivElement.height() - selfsHeadDivElement.height());
                    selfsLeafAreaDivElement.width(selfsChildAreaDivElement.width());

                    // undo the initial height/width restrictions on the leaf area
                    selfsLeafAreaDivElement.css('max-height', "");
                    selfsLeafAreaDivElement.css('max-width', "");
                }

            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE -> sets the instanceReference as the currently selected
             * node in the GUI / DOM Tree and gives him a thicker outline
             * @param instanceReference
             */
            this.setSelectedNodeAndGiveHimThickOutline = function (instanceReference) {

                // if no node registered as selected at all
                if (!selectedNodeReference) {
                    selectedNodeReference = instanceReference;
                    selectedNodeReference.getSelfsDivElement().css("outline", "2px solid black");
                    selectedNodeReference.checkIfOwnerAndSetAccordingOutline("2px");

                    selectedNodeReference.updateSelfsRealtimeDocumentTextArea();


                    // show all incoming and outgoing jsPlumb connections of the selectedNodeReference
                    //jsPlumb.show(instanceReference.index + "-child_area_div_element");
                }
                // if a node is already registered and the new one is different from the already selected one
                else {

                    selectedNodeReference.getSelfsDivElement().css("outline", "1px solid black");
                    selectedNodeReference.checkIfOwnerAndSetAccordingOutline("1px");

                    // hide all incoming and outgoing jsPlumb connections of the old selectedNodeReference
                    //jsPlumb.hide(selectedNodeReference.index + "-child_area_div_element", true);

                    //set the 'instanceReference' as new selected node
                    selectedNodeReference = instanceReference;

                    selectedNodeReference.updateSelfsRealtimeDocumentTextArea();


                    //jsPlumb.show(selectedNodeReference.index + "-child_area_div_element");
                    selectedNodeReference.getSelfsDivElement().css("outline", "2px solid black");
                    selectedNodeReference.checkIfOwnerAndSetAccordingOutline("2px");
                }


            };

            /**
             * @summary sets selfs as the currently zoomed node in the reference that is maintained by the root node
             */
            this.setSelfAsAnchorNode = function () {
                self.rootSelfReference.setAnchorNode(self);
            };

            /**
             * @summary checks if the height of the font is bigger than the current height of the node
             * and decreases the height of the font until it fits into the current height of the node
             */
            this.checkIfFontHeightIsBiggerThanNodeAndMakeFontSmaller = function () {


                while (selfsHeadDivElement.height() > selfsChildAreaDivElement.height()) {
                    selfsHeadDivElement.css('font-size', (parseInt(selfsHeadDivElement.css('font-size')) - 1) + "px");
                }


            };

            /**
             * @summary if the event 'droppable' is triggered by the ui node, try to add this node as a parent of self
             * does only reorder the node and all its child HTML elements in the DOM tree and sets the new parent for the
             * draggedInstance
             * @param ui
             */
            this.addDraggedNodeToSelf = function (ui) {

                //we can get the dragged node by checking which one is draggable right now
                var draggedInstanceSelf = self.rootSelfReference.getNodeWithVisualEffects();
                draggedInstanceSelf.draggingOfSelfInProcess = true;

                // if the user tries to drag a node into a leaf droppable node
                // or if he tries to drop a rootSharedNode into another shared node -> undo it
                // or if I am not allowed to write into the target model
                var loggedInUser = self.rootSelfReference.rootLoggedInUser;
                var draggedInstanceSelfOwner = draggedInstanceSelf.getSelfsCollaborativeModel().elementAt("owner").value();
                var selfsOwner = selfsCollaborativeModel.elementAt("owner").value();

                if (self.leafUrl || (draggedInstanceSelf.selfIsRootSharedNode && loggedInUser != selfsOwner)
                    || selfsModelPermissionsForLoggedInUser.write === false ||
                    (draggedInstanceSelfOwner != selfsOwner && draggedInstanceSelfOwner === loggedInUser)) {

                    if (self.leafUrl)
                        $.notify("Cannot Drop into Leaf", {
                            align: "center",
                            verticalAlign: "middle",
                            animationType: "fade",
                            delay: 0
                        });
                    if (draggedInstanceSelf.selfIsRootSharedNode && loggedInUser != selfsCollaborativeModel.elementAt("owner"))
                        $.notify("Cannot Drop root shared Node into another shared node", {
                            align: "center",
                            verticalAlign: "middle",
                            animationType: "fade",
                            delay: 0
                        });
                    if (selfsModelPermissionsForLoggedInUser.write === false)
                        $.notify("Cannot Drop into read only node", {
                            align: "center",
                            verticalAlign: "middle",
                            animationType: "fade",
                            delay: 0
                        });


                    //TODOCONVERGENCE TODO21 make it possible to drop into shared node as a user that is not the owner
                    if (draggedInstanceSelfOwner != selfsOwner && draggedInstanceSelfOwner === loggedInUser)
                        $.notify("Cannot Drop a node that belongs to you into a node that has another owner", {
                            align: "center",
                            verticalAlign: "middle",
                            animationType: "fade",
                            delay: 0
                        });

                    ui.draggable.draggable('option', 'revert', true);
                    return;
                }


                // check if dragged element fits into self
                var draggedInstanceSelfsChildAreaDivElement = draggedInstanceSelf.element;
                var left = draggedInstanceSelfsChildAreaDivElement.offset().left - selfsChildAreaDivElement.offset().left;
                var top = draggedInstanceSelfsChildAreaDivElement.offset().top - selfsChildAreaDivElement.offset().top;
                var fitX = selfsChildAreaDivElement.width() - (left + draggedInstanceSelfsChildAreaDivElement.width());
                var fitY = selfsChildAreaDivElement.height() - (top + draggedInstanceSelfsChildAreaDivElement.height());

                if (fitX > 0 && fitY > 0 && left > 0 && top > 0) {


                    draggedInstanceSelf.element.css("z-index", "999");
                    //console.log("z-index for instance: " + draggedInstanceSelf.index + " set to: " + draggedInstanceSelf.element.css("z-index"));

                    // change the permissions of draggedInstanceSelf to the permissions of the self node ( which is the new parent )
                    draggedInstanceSelf.mergePermissionsOfSelfInstanceWithParameterInstancePermissions(self, function () {

                        draggedInstanceSelf.setDragResizeModelReferenceToSelfsModelOrParentsModelDependingIfRootSharedNode(self);


                        draggedInstanceSelf.leftPercentageModelReference.model().startBatch();
                        draggedInstanceSelf.leftPercentageModelReference.value(left / self.element.width());
                        draggedInstanceSelf.topPercentageModelReference.value(top / self.element.height());
                        draggedInstanceSelf.widthPercentageModelReference.value(draggedInstanceSelf.element.width() / self.element.width());
                        draggedInstanceSelf.heightPercentageModelReference.value(draggedInstanceSelf.element.height() / self.element.height());
                        if (!draggedInstanceSelf.selfIsRootSharedNode) {
                            draggedInstanceSelf.getSelfsCollaborativeModel().elementAt("parentId").value(self.realtimeDocId); // TODOFEATUREREQUEST FR1 maybe race condition because it has to be arrived to the other participant before the set state
                        }

                        draggedInstanceSelf.leftPercentageModelReference.model().completeBatch();

                        //TODOCONVERGENCE the two realtime actions on the model above and the one down have to come at the same time to all other clients
                        // move self.realtimeDocId from the old parent instance  childCollaborativeModelIdArray to the new parent
                        draggedInstanceSelf.parent.deleteRealtimeDocIdFromSelfsCollaborativeModel(draggedInstanceSelf.realtimeDocId);

                        selfsCollaborativeModel.elementAt("childCollaborativeModelIdArray").push(draggedInstanceSelf.realtimeDocId);
                        if (!draggedInstanceSelf.selfIsRootSharedNode) {
                            selfsJoinedActivity.setState("droppedNodeIntoMe", {
                                draggedInstanceSelfRealtimeDocId: draggedInstanceSelf.realtimeDocId,
                                sessionID: self.rootSelfReference.getRootsConvergenceModelService().session().sessionId(),
                                nodeDroppedFromOutsideRootSharedNode: false
                            });
                        }

                        // set the new parentId in the selfsCollaborativeModel


                        //TODOCONVERGENCE BUG2 reorder realtimeDocId in two different childCollaborativeModelIdArray


                        if (draggedInstanceSelf.parent === self)
                            return; // only do nothing if dragged to a valid position in the same node as before the dragging started


                        // let the parent node know that a child from its 'nodeChildObjectReferenceArray' is deleted
                        draggedInstanceSelf.parent.setChildrenAddedResizedDraggedDeleted(true);

                        // remove draggedInstanceSelf from parents nodeChildObjectReferenceArray
                        var draggedInstanceSelfParentsNodeChildObjectReferenceArray = draggedInstanceSelf.parent.getNodeChildObjectReferenceArray();
                        for (var i = 0; i < draggedInstanceSelfParentsNodeChildObjectReferenceArray.length; i++) {
                            if (draggedInstanceSelfParentsNodeChildObjectReferenceArray[i].index === draggedInstanceSelf.index) {
                                draggedInstanceSelfParentsNodeChildObjectReferenceArray.splice(i, 1);
                            }
                        }


                        // set the new parent for draggedInstanceSelf and add draggedInstanceSelf to the new parents nodeChildObjectReferenceArray
                        draggedInstanceSelf.parent = self;
                        nodeChildObjectReferenceArray.push(draggedInstanceSelf);


                        // chang the order in the DOM tree
                        selfsDivElement.append(draggedInstanceSelf.element);

                        // set the new position of the dragged node in its new parent
                        draggedInstanceSelf.element.css({
                            top: top,
                            left: left
                        });

                        //change parent label in draggedInstanceSelf head div
                        draggedInstanceSelf.setOrUpdateContentAndTooltipOfSelfsHeadDivElement();

                        if (draggedInstanceSelf.getLeafInstanceReference())


                            if (draggedInstanceSelf.selfsHeadDivElementHeadline != "") {
                                draggedInstanceSelf.setHeadlineInSelfsHeadDivArea();
                            }

                        self.rootSelfReference.updateSelfsDataInRootsNodeTree(draggedInstanceSelf);
                        draggedInstanceSelf.setBackgroundColorToOppositeOfParent();


                        draggedInstanceSelf.draggingOfSelfInProcess = false;
                        draggedInstanceSelf.element.css("z-index", "auto");
                        //console.log("z-index for instance: " + draggedInstanceSelf.index + " set to: " + draggedInstanceSelf.element.css("z-index"));

                    });

                } else {
                    ui.draggable.draggable('option', 'revert', true);
                    draggedInstanceSelf.draggingOfSelfInProcess = false;
                }


            };

            /**
             * @summary merges the permissions of self with the parameter instance
             * write always wins against read
             * @param newParentSelf
             * @param callback
             * @return {*}
             */
            this.mergePermissionsOfSelfInstanceWithParameterInstancePermissions = function (newParentSelf, callback) {

                if (self.selfIsRootSharedNode)
                    return callback();

                newParentSelf.getAllUserPermissionForSelfCollaborativeModel(function (allUserPermissionForParentsCollaborativeModel) {

                    self.getAllUserPermissionForSelfCollaborativeModel(function (allUserPermissionForSelfsCollaborativeModel) {


                        // user the permissions from allUserPermissionForParentsCollaborativeModel and merge them with the permissions


                        for (var attributeName in allUserPermissionForParentsCollaborativeModel) {
                            if (allUserPermissionForSelfsCollaborativeModel.hasOwnProperty(attributeName) &&
                                (typeof allUserPermissionForSelfsCollaborativeModel[attributeName] == 'object')) {

                                if (allUserPermissionForSelfsCollaborativeModel[attributeName].write === false) {
                                    if (allUserPermissionForParentsCollaborativeModel[attributeName].write === true) {
                                        allUserPermissionForSelfsCollaborativeModel[attributeName].write = true;
                                        allUserPermissionForSelfsCollaborativeModel[attributeName].manage = true;
                                        allUserPermissionForSelfsCollaborativeModel[attributeName].delete = true;
                                    }
                                }


                            } else {
                                allUserPermissionForSelfsCollaborativeModel[attributeName] = allUserPermissionForParentsCollaborativeModel[attributeName];
                            }

                        }

                        function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {

                            var length = nodeChildObjectReferenceArray.length;

                            // do for all children
                            for (var i = 0; i < length; i++) {

                                bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());

                                nodeChildObjectReferenceArray[i].getSelfsModelPermissionManager().setAllUserPermissions(allUserPermissionForSelfsCollaborativeModel);


                            }


                        }

                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray);


                        selfsModelPermissionManager.setAllUserPermissions(allUserPermissionForSelfsCollaborativeModel).then(function () {

                            selfsJoinedActivity.setState("permissionsForModelChanged", allUserPermissionForSelfsCollaborativeModel);

                            callback();

                        })


                    });


                });


            };

            /**
             * @summary only renders / displays the HTML content of the  'selfsLeafAreaDivElement' again
             * no method call render() but just jQuery append(selfsLeafAreaDivElement)
             * selfsLeafAreaDivElement has all the DOM content from the leaf saved
             */
            this.displayAlreadyInitLeafInstanceAgain = function () {


                selfsDivElement.append('<div class="ccm-super_knowledge_map-leaf_div_area" id="' + self.index + '-leafArea"></div>');
                selfsLeafAreaDivElement = self.element.find("#" + self.index + "-leafArea");


                // undo the initial height/width restrictions on the leaf area that may exist due to initial load into wrapper
                // when leaf wrapper size is restricted due to his parents size
                selfsLeafAreaDivElement.css('max-height', "");
                selfsLeafAreaDivElement.css('max-width', "");
                selfsLeafAreaDivElement.height(selfsChildAreaDivElement.height() - selfsHeadDivElement.height());
                selfsLeafAreaDivElement.width(selfsChildAreaDivElement.width());


                leafInstanceReference.element = selfsLeafAreaDivElement;
                leafInstanceReference.render();

                // re init the leaf instance state with the selfsCollaborativeModel
                if (typeof leafInstanceReference.createOrLoadLeafInstanceDataModelCalledByWrapper == "function")
                    leafInstanceReference.createOrLoadLeafInstanceDataModelCalledByWrapper(selfsCollaborativeModel, self.rootSelfReference.rootLoggedInUser);

            };

            /**
             * @summary sets the content of selfsHeadDivElement inner HTML
             * @param {object} [externalNewHeadline]
             */
            this.setHeadlineInSelfsHeadDivArea = function (externalNewHeadline) {
                if (typeof externalNewHeadline == "string" && selfsCollaborativeModel) {
                    self.selfsHeadDivElementHeadline = externalNewHeadline;
                    selfsCollaborativeModel.elementAt("headline").value(externalNewHeadline);
                    selfsHeadDivElementHeadlineDiv.html(self.selfsHeadDivElementHeadline + " ");
                }
                else if (selfsCollaborativeModel) {
                    selfsHeadDivElementHeadlineDiv.html(selfsCollaborativeModel.elementAt("headline").value() + " ");
                }


            };

            /**
             * @summary gets the value of a document.cookie for the given key
             * @param key the key of the cookie whose value will get returned
             * example: key=value
             * @returns {String} the returned value
             */
            this.getCookieValueForCookieKey = function (key) {
                var nameEQ = key + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }
                return "";
            };

            /**
             * @summary updates the content of selfsHeadDivElement
             */
            this.setOrUpdateContentAndTooltipOfSelfsHeadDivElement = function () {

                self.getNodeIsSharedWithItemsForContextMenu(function (liString, sharedCollaboratorsObject) {
                    var realTimeIDPrefix = self.realtimeDocId ? self.realtimeDocId.substring(0, 3) + " " : "";
                    var parentID = self.parent.id ? self.parent.id : "";
                    var owner = selfsCollaborativeModel ? selfsCollaborativeModel.elementAt("owner").value() : "";

                    liString = liString.replace(/<li sytle="display: inline;white-space: nowrap;">/g, "");
                    liString = liString.replace(/<\/li>/g, "\n");

                    var titleString = 'owner: ' + owner + '\nnot shared';

                    if (liString != "") {
                        var regex = new RegExp('<li style="display: inline;white-space: nowrap;">', 'g');
                        liString = liString.replace(regex, '');
                        titleString = 'owner: ' + owner + '\nroot shared Node: ' + self.sharedRootNodeReference.index + '\nshared with:\n' + liString;
                    }


                    if (selfsHeadDivElement)
                        selfsHeadDivElement.prop('title', titleString);


                    //prepare the content of selfsHeadDivElement
                    var participantsWithPermissionsHtmlString = "";
                    if (sharedCollaboratorsObject) {


                        // that the entries of `sharedCollaboratorsObject` are iterated in alphabetically order
                        // ( normally entries in objects are not sorted )
                        var keys = [];
                        var userKeyOfObject;
                        for (userKeyOfObject in sharedCollaboratorsObject) {
                            if (sharedCollaboratorsObject.hasOwnProperty(userKeyOfObject)) {
                                keys.push(userKeyOfObject);
                            }
                        }
                        keys.sort(); // sort the array with the user names alphabetically

                        // move the loggedInUser to the top of the array
                        keys.splice(0, 0, keys.splice(keys.indexOf(self.rootSelfReference.rootLoggedInUser), 1)[0]);

                        var first = true;
                        for (var i = 0; i < keys.length; i++) {

                            userKeyOfObject = keys[i];  // select the next username in the alphabetically order


                            var obj = sharedCollaboratorsObject[userKeyOfObject];
                            var line;

                            if (!obj.manage) {
                                line = "yellow";
                            } else if (obj.manage && (selfsCollaborativeModel.elementAt("owner").value() === userKeyOfObject)) {
                                line = "blue";
                            } else if (obj.manage) {
                                line = "green";
                            }

                            participantsWithPermissionsHtmlString += '<td><div class="ccm-super_knowledge_map-' + line + '_line"></div><img class="ccm-super_knowledge_map-head_div_user_icon" src="libs/user_icons/' + userKeyOfObject + '.png" /></td>';

                            if (first) {
                                participantsWithPermissionsHtmlString += '<td><div class="ccm-super_knowledge_map-invisible_line"></div><td>';
                                first = false;
                            }

                        }


                    }


                    selfsHeadDivElementTextInfoDiv.html(realTimeIDPrefix + " s: " + self.id + ",p: " + parentID);

                    if (self.parent !== "") { // the root selfsHeadDivElement will not be touched because it contains the input fields
                        selfsHeadDivElementCollaboratorsDiv.html('<table style="float:left" cellspacing="0" cellpadding="0">' + participantsWithPermissionsHtmlString + '</table>');
                    }


                    if (leafInstanceReference) {
                        selfsHeadDivElement.prop('title', leafInstanceReference.component.name + "\n" + selfsHeadDivElement.prop('title'));
                        self.setLeafDivDimensionToParentCcmSkm();
                    }


                    //if it is a root shared node show close button if not and user has write permissions show remove button


                    var img = $('<img class="ccm-super_knowledge_map-closeDeleteImage">');
                    if (self.selfIsRootSharedNode) {

                        img.attr('src', "libs/icons/closeIcon.png");
                        img.attr('title', "remove node from GUI");
                        img[0].onclick = self.closeButtonPressed;
                        selfsHeadDivElementDialogItemDiv.html(img);


                    }
                    else if (!self.selfIsRootSharedNode && selfsModelPermissionsForLoggedInUser.write === true && self.parent != "") {

                        img.attr('src', "libs/icons/deleteIcon.png");
                        img.attr('title', "Delete Node !");
                        img[0].onclick = self.deleteButtonPressed;
                        selfsHeadDivElementDialogItemDiv.html(img);

                    }
                    else if (self.parent === "" && self.realtimeDocId === null) {
                        var logoutButton = $('<input id="logoutButton"  style="float:right" disabled type="button" value="Logout" />');
                        logoutButton[0].onclick = self.logoutButtonPressed;
                        selfsHeadDivElementDialogItemDiv.html(logoutButton);
                    }


                });


            };

            /**
             * @summary closes the model of self and all its children and removes it from the DOM
             */
            this.closeButtonPressed = function () {

                var closeDialog = $('<div id="dialog" title="Close Node ?">' +
                    '<p>The Node and all children will be closed in the GUI, but they will still exist in the Cloud</p></div>');

                $(function () {
                    $(closeDialog).dialog({
                        resizable: false,
                        draggable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "Close": function () {

                                $(this).dialog("close");
                                self.deleteInstanceReferenceToParentAndRemoveDOMElementsAndCloseModel();


                            },
                            Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                });

            };

            /**
             * @summary deletes the model of self and all its children and removes it from the DOM
             */
            this.deleteButtonPressed = function () {

                var deleteDialog = $('<div id="dialog" title="Delete Node ?"><p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;">' +
                    '</span>Are you sure that you want to delete the Node and all children</p></div>');

                $(function () {
                    $(deleteDialog).dialog({
                        resizable: false,
                        draggable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "Delete": function () {

                                $(this).dialog("close");
                                self.deleteInstanceAndModelAndAllSubInstancesAndModels();
                                selfsJoinedActivity.setState("NodeDeleted", true); // notify other participants that the node is deleted


                            },
                            Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                });

            };

            /**
             * @summary removes the logged user info in roots headDivElement and enables the authorizeButton again
             * convergence has no logout method we just log in again as another user
             * this only works if no model is loaded in the current session -> only allow logout before first model is loaded
             */
            this.logoutButtonPressed = function () {

                //remove the logged in user information
                self.element.find("#loggedInUserDiv").remove();

                //now a new user can login again
                self.element.find("#authorizeButton")[0].disabled = false;


                self.element.find("#logoutButton")[0].disabled = true;

            };


            /**
             * @summary checks if the url has a valid format
             * @param {string} url
             * @return {boolean}
             */
            this.checkIfValidURL = function (url) {

                var endsWithJs = url.endsWith(".js");
                if (!endsWithJs)
                    return false;

                var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
                    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
                    + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
                    + "|"
                    + "([0-9a-z_!~*'()-]+\.)*"
                    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
                    + "[a-z]{2,6})"
                    + "(:[0-9]{1,5})?"
                    + "((/?)|"
                    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
                var re = new RegExp(strRegex);
                return re.test(url);
            };

            /*------------------------------------------------ convergence methods ------------------------------------------------*/

            /**
             * @summary the root instance does the login into the convergence framework
             */
            this.letRootInstanceDoConvergenceLogin = function () {

                Convergence.connect(self.convergenceDomainUrl, self.element.find("#userTextInput").val(), self.element.find("#passwordTextInput").val())
                    .then(self.letRootInstanceInitConvergenceApp)
                    .catch(function (error) {
                        console.log("Could not connect: " + error);
                    });


            };

            /**
             * @summary sets the cookie for automatic login and all references to the convergence framework
             * @param {ConvergenceDomain}domain
             */
            this.letRootInstanceInitConvergenceApp = function (domain) {

                // make logout possible
                self.element.find("#logoutButton")[0].disabled = false;


                rootsConvergenceDomain = domain;
                rootsConvergenceModelService = domain.models();

                self.element.find("#createNewRealtimeDocButton")[0].disabled = false;
                self.element.find("#authorizeButton")[0].disabled = true;
                self.element.find("#collaborativeObjectIDButton")[0].disabled = false;


                self.rootLoggedInUser = rootsConvergenceModelService.session().username();
                document.cookie = "lastLoggedInUser=" + self.rootLoggedInUser + "; max-age=31536000";

                if (self.parent === "") {
                    var loggedInUserDiv = $('<div id="loggedInUserDiv" style="display: inline; margin-right:1em">logged in: ' + self.rootLoggedInUser + '</div>');
                    selfsHeadDivElement.prepend(loggedInUserDiv);
                }


                console.log("authorization sucessfull")

            };

            /**
             * @summary creates a new collaborative document and also calls the open method
             * @param {function} [callback]
             */
            this.createNewCollaborativeModelInSKMCollectionForSelfsData = function (callback) {

                function permissionsOfModelReadyCallback(allUsersPermissionsOfParent) {
                    // returns the app global instance of the modelService into the scope of self/ local Instance
                    var modelService = self.rootSelfReference.getRootsConvergenceModelService();
                    var userSpecificSizeAndPosition = {};
                    userSpecificSizeAndPosition[ownerOfCreatedModel] = {
                        positionToParentPercentage: {
                            leftPercentage: self.relativeDimensionAndPositionToParent.leftPercentage,
                            topPercentage: self.relativeDimensionAndPositionToParent.topPercentage
                        },
                        sizeToParentPercentage: {
                            widthPercentage: self.parent === "" ? 1 : self.relativeDimensionAndPositionToParent.widthPercentage,
                            heightPercentage: self.parent === "" ? 1 : self.relativeDimensionAndPositionToParent.heightPercentage
                        },
                    };

                    // always use the collection self.convergenceCollection
                    modelService.create({
                        collection: self.convergenceCollection,
                        data: {
                            owner: ownerOfCreatedModel, //TODOCONVERGENCE replace by an unmodifiable model.creator()
                            parentId: self.parent === "" ? null : self.parent.realtimeDocId,
                            // position: {left: selfsChildAreaDivElement.css('left'), top: selfsChildAreaDivElement.css('top')},
                            // size: {width: selfsChildAreaDivElement.width(), height: selfsChildAreaDivElement.height()},
                            positionToParentPercentage: {
                                leftPercentage: self.relativeDimensionAndPositionToParent.leftPercentage,
                                topPercentage: self.relativeDimensionAndPositionToParent.topPercentage
                            },
                            sizeToParentPercentage: {
                                widthPercentage: self.parent === "" ? 1 : self.relativeDimensionAndPositionToParent.widthPercentage,
                                heightPercentage: self.parent === "" ? 1 : self.relativeDimensionAndPositionToParent.heightPercentage
                            },
                            childCollaborativeModelIdArray: [],
                            leafStateData: {}, // will be filled if self is a leaf wrapper
                            leafInstanceUrl: "",
                            headline: "",
                            newChildInstanceCreated: "",
                            // userSpecificSizeAndPosition: {
                            //     ownerOfCreatedModel: {
                            //         positionToParentPercentage: {
                            //             leftPercentage: self.relativeDimensionAndPositionToParent.leftPercentage,
                            //             topPercentage: self.relativeDimensionAndPositionToParent.topPercentage
                            //         },
                            //         sizeToParentPercentage: {
                            //             widthPercentage: self.parent === "" ? 1 : self.relativeDimensionAndPositionToParent.widthPercentage,
                            //             heightPercentage: self.parent === "" ? 1 : self.relativeDimensionAndPositionToParent.heightPercentage
                            //         },
                            //     }
                            // }
                            // userSpecificSizeAndPositionArray : []
                            userSpecificSizeAndPosition: {}
                        },
                        overrideWorld: true, // works -> model permission overrides world permission
                        worldPermissions: {"read": false, "write": false, "remove": false, "manage": false},
                        userPermissions: allUsersPermissionsOfParent
                    }).then(function (realtimeDocId) {
                        // console.log("model  for: " + self.index + " with uuid: " + self.uuid + " created!");

                        self.realtimeDocId = realtimeDocId;


                        if (self.parent !== "") {
                            self.parent.childNodeCreatedItsCollaborativeDoc(self.realtimeDocId);
                        }


                        self.openExistingCollaborativeModelInSKMCollectionForSelfsData(self.realtimeDocId, callback, true);


                    }).catch(function (err) {
                        console.error("Error in create Model:", err);
                    });
                }


                /* set the owner of the new created model to the parent except for the root instance
                 then set to the rootLoggedInUser*/
                var ownerOfCreatedModel;
                if (self.parent != "") {
                    ownerOfCreatedModel = self.parent.getSelfsCollaborativeModel().elementAt("owner").value();
                    self.parent.getAllUserPermissionForSelfCollaborativeModel(permissionsOfModelReadyCallback);


                }
                else {
                    ownerOfCreatedModel = self.rootSelfReference.rootLoggedInUser;
                    permissionsOfModelReadyCallback(null);
                }


            };

            /**
             * @summary opens the model and also opens all child models
             * subscribes to the activities and calls all init methods for the model
             * @param {String} selfsModelID
             * @param {function} [callback]
             * @param {boolean} [openNewCreatedModel]
             */
            this.openExistingCollaborativeModelInSKMCollectionForSelfsData = function (selfsModelID, callback, openNewCreatedModel) {

                // returns the app global instance of the modelService into the scope of self/ local Instance
                var modelService = self.rootSelfReference.getRootsConvergenceModelService();

                if (modelService.isOpen(selfsModelID)) {
                    self.element.remove();
                    self.parent.deleteRealtimeDocIdFromSelfsCollaborativeModel(selfsModelID);
                    $.notify("Cannot open a model more than once in one session", {
                        align: "center",
                        verticalAlign: "middle",
                        animationType: "fade",
                        delay: 0
                    });

                }

                modelService.open(selfsModelID).then(function (model) {
                    //console.log("model", model.modelId(), "opened");

                    selfsCollaborativeModel = model;
                    selfsModelPermissionsForLoggedInUser = model.permissions();
                    selfsModelPermissionManager = model.permissionsManager();

                    self.uuid = model.modelId(); // TODOCONVERGENCE Use A server side created model id and not the client uuid which is then obsolete
                    self.realtimeDocId = model.modelId();


                    if (self.parent == "") {
                        // the field where the id for load will be displayed

                        //noinspection JSUnresolvedFunction
                        document.cookie = 'rootRealtimeDocId=' + self.realtimeDocId + ';  max-age=31536000';
                        $('#realtimeDocumentIdTextField').val(self.realtimeDocId);

                        self.letRootJoinTheMouseActivity();

                    }


                    if (selfsCollaborativeModel.elementAt("owner").value() !== self.rootSelfReference.rootLoggedInUser && self.parent !== "" && !openNewCreatedModel &&
                        selfsCollaborativeModel.elementAt("owner").value() !== self.parent.getSelfsCollaborativeModel().elementAt("owner").value()
                    ) {  // if I am not the owner and its not the root model and it is not a new created model and it is the rootShared model


                        self.sharedRootNodeReference = self;
                        self.selfIsRootSharedNode = true;


                        var user = self.rootSelfReference.rootLoggedInUser;

                        if (self.parent.getSelfsCollaborativeModel().elementAt("userSpecificSizeAndPosition").hasKey(user + ":" + self.realtimeDocId)) {

                            selfsChildAreaDivElement.css('left', self.parent.element.width() * self.relativeDimensionAndPositionToParent.leftPercentage);
                            selfsChildAreaDivElement.css('top', self.parent.element.height() * self.relativeDimensionAndPositionToParent.topPercentage);
                            selfsChildAreaDivElement.width(self.parent.element.width() * self.parent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "sizeToParentPercentage", "widthPercentage"]));
                            selfsChildAreaDivElement.height(self.parent.element.height() * self.parent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "sizeToParentPercentage", "heightPercentage"]));

                        } else { // if there is no userSpecificSizeAndPosition for rootLoggedInUser
                            var obj = {
                                positionToParentPercentage: {
                                    leftPercentage: self.relativeDimensionAndPositionToParent.leftPercentage,
                                    topPercentage: self.relativeDimensionAndPositionToParent.topPercentage
                                },
                                sizeToParentPercentage: {
                                    widthPercentage: selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "widthPercentage"]).value(),
                                    heightPercentage: selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "heightPercentage"]).value()
                                },
                            };

                            self.parent.getSelfsCollaborativeModel().elementAt("userSpecificSizeAndPosition").set(user + ":" + self.realtimeDocId, obj);

                            selfsChildAreaDivElement.width(self.parent.element.width() * selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "widthPercentage"]).value());
                            selfsChildAreaDivElement.height(self.parent.element.height() * selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "heightPercentage"]).value());

                        }

                        self.topPercentageModelReference = self.parent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "positionToParentPercentage", "topPercentage"]);
                        self.leftPercentageModelReference = self.parent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "positionToParentPercentage", "leftPercentage"]);
                        self.widthPercentageModelReference = self.parent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "sizeToParentPercentage", "widthPercentage"]);
                        self.heightPercentageModelReference = self.parent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "sizeToParentPercentage", "heightPercentage"]);


                    } else {
                        self.topPercentageModelReference = selfsCollaborativeModel.elementAt(["positionToParentPercentage", "topPercentage"]);
                        self.leftPercentageModelReference = selfsCollaborativeModel.elementAt(["positionToParentPercentage", "leftPercentage"]);
                        self.widthPercentageModelReference = selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "widthPercentage"]);
                        self.heightPercentageModelReference = selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "heightPercentage"]);
                    }

                    self.setOrUpdateContentAndTooltipOfSelfsHeadDivElement();

                    if (!openNewCreatedModel && selfsChildAreaDivElement) {
                        self.onSelfsCollaborativeModelSizePositionHasChanged();
                    } else if (selfsChildAreaDivElement && self.parent != "") {
                        selfsChildAreaDivElement.css('left', self.parent.element.width() * self.relativeDimensionAndPositionToParent.leftPercentage);
                        selfsChildAreaDivElement.css('top', self.parent.element.height() * self.relativeDimensionAndPositionToParent.topPercentage);
                    }


                    if (self.parent.sharedRootNodeReference) {
                        self.sharedRootNodeReference = self.parent.sharedRootNodeReference;
                        //console.log("root node shared for: " + self.index + " is node: " + self.sharedRootNodeReference.index)
                    }

                    if (selfsHeadDivElement) {
                        self.addAllEvenListenersToSelfsCollaborativeModel();
                        self.setHeadlineInSelfsHeadDivArea();
                    }


                    // load all the child nodes
                    var childCollaborativeModelIdArray = selfsCollaborativeModel.elementAt("childCollaborativeModelIdArray").value();


                    // add the uuid of the instance as a HTML5 data attribute into the instance DIV element
                    if (selfsDivElement)
                        selfsDivElement.attr('data-realtimeDocId', self.realtimeDocId);


                    // if self is an already existing leaf wrapper loaded from the database
                    if (selfsCollaborativeModel.elementAt("leafInstanceUrl").value() != "") {

                        self.leafUrl = selfsCollaborativeModel.elementAt("leafInstanceUrl").value();

                        if (selfsChildAreaDivElement) {
                            self.renderLeafComponent(self.leafUrl, true, false);
                        }
                        // do not render the leaf component if the parent is not visible in the DOM then just create an instance
                        else {
                            //noinspection JSCheckFunctionSignatures
                            ccm.instance(self.leafUrl, {

                                parent: self
                            }, instanceCallback);
                        }
                        function instanceCallback(createdInstance) {
                            leafInstanceReference = createdInstance;
                        }


                    }

                    if (selfsChildAreaDivElement)
                        selfsChildAreaDivElement.show(); // show node only when model is ready that you cannot drag a node which model is not ready


                    //open or create an activity bound to the realtimeDocId
                    var activityService = self.rootSelfReference.getRootsConvergenceDomain().activities();
                    activityService.join(self.realtimeDocId).then(function (activity) {
                        selfsJoinedActivity = activity;
                        selfsJoinedActivity.events().subscribe(self.onActivityEvent);
                        //console.log("activity");


                        // callback when self model and div element is ready
                        if (typeof callback == "function")
                            callback(self);
                    });


                    for (var i = 0; i < childCollaborativeModelIdArray.length; i++) {

                        var childInstanceCollaborativeDocId = childCollaborativeModelIdArray[i];
                        self.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel(childInstanceCollaborativeDocId, callback);


                    }

                    self.checkIfOwnerAndSetAccordingOutline("1px");

                    $('#createNewRealtimeDocButton').prop("disabled", true);
                    $('#collaborativeObjectIDButton').prop("disabled", true);

                }).catch(function (error) {

                    self.element.remove();
                    console.log("Could not open model for uuid: " + self.realtimeDocId + " " + error);

                    $.notify("Could not open model for uuid: " + self.realtimeDocId + " " + error, {
                        align: "center",
                        verticalAlign: "middle",
                        animationType: "fade",
                        delay: 0
                    });
                    self.parent.deleteRealtimeDocIdFromSelfsCollaborativeModel(selfsModelID);

                });

            };

            /**
             * @summary switches the different activity events and calls the appropriate method
             * @param event
             */
            this.onActivityEvent = function (event) {

                switch (event.name) {
                    case "state_set":
                        switch (event.key) {
                            case 'draggable':
                                if (event.value === true) {
                                    if (selfsChildAreaDivElement) {
                                        selfsChildAreaDivElement.css("z-index", "999");
                                        //console.log("z-index for instance: " + self.index + " set to: " + selfsChildAreaDivElement.css("z-index"));
                                    }

                                } else if (event.value === false && !self.draggingOfSelfInProcess) {
                                    if (selfsChildAreaDivElement) {
                                        selfsChildAreaDivElement.css("z-index", "auto");
                                        //console.log("z-index for instance: " + self.index + " set to: " + selfsChildAreaDivElement.css("z-index"));
                                    }

                                }
                                break;
                            case 'droppedNodeIntoMe':

                                // I was not the participant the dropped the node
                                if (event.value.sessionID != self.rootSelfReference.getRootsConvergenceModelService().session().sessionId()) {

                                    // we know directly that an existing node was dropped within the sharedRootNode
                                    if (self.rootSelfReference.getRootsDroppedInstanceReference()) {
                                        self.rootSelfReference.setRootsDroppedInstanceNewParentReference(self);
                                        self.rootSelfReference.addRemoteDroppedNodeToNewParentAndRemoveItFromOldParent();
                                    }
                                    // maybe rootsDroppedInstanceReference did not get set from the remote participant right now so check all children of the rootSharedNode if it exists
                                    else {  // TODOFEATUREREQUEST FR1

                                        //check if it exist in my children
                                        var foundInstanceReference;

                                        function bfsTraverseChildrenRecUntilNodeFound(childInstanceArray, realtimeDocId) {

                                            var length = childInstanceArray.length;

                                            // do for all children
                                            for (var i = 0; i < length; i++) {


                                                if (childInstanceArray[i].realtimeDocId === realtimeDocId) {
                                                    foundInstanceReference = childInstanceArray[i];
                                                    return;
                                                }

                                                bfsTraverseChildrenRecUntilNodeFound(childInstanceArray[i].getNodeChildObjectReferenceArray());
                                            }

                                        }

                                        // find the base node that already exists in selfs map and was changed from an other user
                                        bfsTraverseChildrenRecUntilNodeFound(self.rootSelfReference.getNodeChildObjectReferenceArray(),
                                            event.value.draggedInstanceSelfRealtimeDocId);


                                        if (foundInstanceReference) {
                                            self.rootSelfReference.setRootsDroppedInstanceNewParentReference(self);
                                            self.rootSelfReference.addRemoteDroppedNodeToNewParentAndRemoveItFromOldParent();
                                            console.log("we needed to search all childs of RootSharedNode")
                                        }


                                        // another remote participant dropped a node into selfsSharedRootNode or a child of it
                                        else {

                                            setTimeout(function () { // TODOCONVERGENCE Bug1_DropIntoRootSharedNodeInvalidContextVersion
                                                self.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel(event.value.draggedInstanceSelfRealtimeDocId);
                                            }, 1000);


                                        }


                                    }

                                }
                                break;
                            case 'NodeDeleted':
                                if (event.value) {

                                    if (self.rootSelfReference.rootLoggedInUser === self.parent.getSelfsCollaborativeModel().elementAt("owner").value())
                                        self.parent.deleteRealtimeDocIdFromSelfsCollaborativeModel(self.realtimeDocId);
                                    self.deleteInstanceReferenceToParentAndRemoveDOMElements();
                                }
                                break;
                            case 'permissionsForModelChanged':
                                if (event.value) {

                                    if (self.rootSelfReference.rootLoggedInUser in event.value) { // a permissions for me has changed
                                        selfsModelPermissionsForLoggedInUser = event.value[self.rootSelfReference.rootLoggedInUser];


                                    }

                                    if (selfsModelPermissionsForLoggedInUser.write && leafInstanceReference && typeof leafInstanceReference.setWriteEnabled === "function") {
                                        leafInstanceReference.setWriteEnabled();
                                    }
                                    else if (selfsModelPermissionsForLoggedInUser.read && leafInstanceReference && typeof leafInstanceReference.setWriteEnabled === "function") {
                                        leafInstanceReference.setOnlyReadEnabled();
                                    }


                                    // update The headDivElement content for self and all children
                                    self.setOrUpdateContentAndTooltipOfSelfsHeadDivElement();

                                    function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {

                                        var length = nodeChildObjectReferenceArray.length;

                                        // do for all children
                                        for (var i = 0; i < length; i++) {

                                            bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());

                                            if (self.rootSelfReference.rootLoggedInUser in event.value) { // a permissions for me has changed
                                                nodeChildObjectReferenceArray[i].setSelfsModelPermissionsForLoggedInUser(event.value[self.rootSelfReference.rootLoggedInUser]);

                                                if (selfsModelPermissionsForLoggedInUser.write && nodeChildObjectReferenceArray[i].getLeafInstanceReference() && typeof nodeChildObjectReferenceArray[i].getLeafInstanceReference().setWriteEnabled === "function") {
                                                    nodeChildObjectReferenceArray[i].getLeafInstanceReference().setWriteEnabled();
                                                }
                                                else if (selfsModelPermissionsForLoggedInUser.read && nodeChildObjectReferenceArray[i].getLeafInstanceReference() && typeof nodeChildObjectReferenceArray[i].getLeafInstanceReference().setWriteEnabled === "function") {
                                                    nodeChildObjectReferenceArray[i].getLeafInstanceReference().setOnlyReadEnabled();
                                                }

                                            }

                                            nodeChildObjectReferenceArray[i].setOrUpdateContentAndTooltipOfSelfsHeadDivElement();
                                        }


                                    }

                                    bfsTraverseChildrenRec(nodeChildObjectReferenceArray);

                                }
                                break;
                        }

                        break;
                }
            };

            /**
             * @summary adds all the event listeners to selfs model
             */
            this.addAllEvenListenersToSelfsCollaborativeModel = function () {

                selfsCollaborativeModel.elementAt("newChildInstanceCreated").on('value', self.onOtherCollaboratorsCreatedNewChildInstance);
                selfsCollaborativeModel.elementAt("parentId").on('value', self.onSelfsParentModelHasChanged);
                selfsCollaborativeModel.elementAt("headline").on('value', self.setHeadlineInSelfsHeadDivArea);

                //if I am not the owner and this is the rootSharedNode
                if (self.parent != "" && selfsCollaborativeModel.elementAt("owner").value() != self.parent.getSelfsCollaborativeModel().elementAt("owner").value()) {

                }
                else {

                    self.addEventListenerForSizeAndDimensionListenersToSelfsCollaborativeModel();
                }


            };

            /**
             * @summary adds  the event listener for the size and the dimension to selfs model
             */
            this.addEventListenerForSizeAndDimensionListenersToSelfsCollaborativeModel = function () {
                self.leftPercentageModelReference.on('value', function () {
                    selfsChildAreaDivElement.css('left', self.parent.element.width() * self.leftPercentageModelReference.value());
                    self.checkIfSelfIsOutsideSharedRootNodeOrAnchorNode();

                });
                self.topPercentageModelReference.on('value', function () {
                    selfsChildAreaDivElement.css('top', self.parent.element.height() * self.topPercentageModelReference.value());
                    self.checkIfSelfIsOutsideSharedRootNodeOrAnchorNode();

                });
                self.widthPercentageModelReference.on('value', function () {
                    selfsChildAreaDivElement.width(self.parent.element.width() * self.widthPercentageModelReference.value());
                    if (selfsLeafAreaDivElement) {
                        selfsLeafAreaDivElement.css('max-width', "");
                        selfsLeafAreaDivElement.width(selfsChildAreaDivElement.width());
                    }
                });
                self.heightPercentageModelReference.on('value', function () {
                    selfsChildAreaDivElement.height(self.parent.element.height() * self.heightPercentageModelReference.value());

                    if (selfsLeafAreaDivElement) {
                        selfsLeafAreaDivElement.css('max-height', "");
                        selfsLeafAreaDivElement.height(selfsChildAreaDivElement.height() - selfsHeadDivElement.height());
                    }

                });
            };

            /**
             * @summary hides self if the owner dragged it outside the rootSharedNode
             */
            this.checkIfSelfIsOutsideSharedRootNodeOrAnchorNode = function () {
                if (self.sharedRootNodeReference) {

                    var rootElementAbsolutePos;
                    var rootElementDimension;


                    // check if the outer boundary is the anchor node or the sharedRootNode
                    if (self.rootSelfReference.getAnchorNode() && document.getElementById(self.sharedRootNodeReference.element.attr('id')) === null) {

                        rootElementAbsolutePos = self.rootSelfReference.getAnchorNode().element.offset();
                        rootElementDimension = self.rootSelfReference.getAnchorNode().element;

                    } else {
                        rootElementAbsolutePos = self.sharedRootNodeReference.element.offset();
                        rootElementDimension = self.sharedRootNodeReference.element;
                    }

                    var selfElementAbsolutePos = self.element.offset();


                    if (selfElementAbsolutePos.left < rootElementAbsolutePos.left ||
                        selfElementAbsolutePos.top < rootElementAbsolutePos.top ||
                        (selfElementAbsolutePos.top + self.element.height()) > (rootElementAbsolutePos.top + rootElementDimension.height()) ||
                        (selfElementAbsolutePos.left + self.element.width()) > (rootElementAbsolutePos.left + rootElementDimension.width())) {
                        self.element[0].style.visibility = 'hidden';
                    }
                    else {
                        self.element[0].style.visibility = 'visible';
                    }
                }
            };

            /**
             * @summary event listener when size or position has changed
             */
            this.onSelfsCollaborativeModelSizePositionHasChanged = function () {


                var parent = self.parent;

                if (parent === "") {
                    parent = self;
                }

                selfsChildAreaDivElement.css('left', parent.element.width() * self.leftPercentageModelReference.value());
                selfsChildAreaDivElement.css('top', parent.element.height() * self.topPercentageModelReference.value());
                selfsChildAreaDivElement.width(parent.element.width() * self.widthPercentageModelReference.value());
                selfsChildAreaDivElement.height(parent.element.height() * self.heightPercentageModelReference.value());
            };

            /**
             *  event listener when another participant created a new child instance
             *  also opens the model
             */
            this.onOtherCollaboratorsCreatedNewChildInstance = function () {

                // self is the instance that must create the new child
                var newChildInstanceCreated = selfsCollaborativeModel.elementAt("newChildInstanceCreated").value();
                //console.log("onOtherCollaboratorsCreatedNewChildInstance");

                // now create a new child skm instance and a div and connect to the given newChildInstanceCreated
                self.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel(newChildInstanceCreated);


            };

            /**
             * @summary updates the position to the parent percentage
             */
            this.updateSelfsCollaborativeModelPositionToParentPercentage = function () {
                var modelToStartAndStopBatch = self.getModelToStartAndStopBatch();

                if (modelToStartAndStopBatch.isBatchStarted())
                    return;
                modelToStartAndStopBatch.startBatch();
                self.leftPercentageModelReference.value(parseFloat(selfsChildAreaDivElement.css('left')) / self.parent.element.width());
                self.topPercentageModelReference.value(parseFloat(selfsChildAreaDivElement.css('top')) / self.parent.element.height());
                modelToStartAndStopBatch.completeBatch();


            };

            /**
             * @summary updates the size to the parent percentage
             */
            this.updateSelfsCollaborativeModelSizeToParentPercentage = function () {
                var modelToStartAndStopBatch = self.getModelToStartAndStopBatch();

                if (modelToStartAndStopBatch.isBatchStarted())
                    return;


                modelToStartAndStopBatch.startBatch();
                self.widthPercentageModelReference.value(selfsChildAreaDivElement.width() / self.parent.element.width());
                self.heightPercentageModelReference.value(selfsChildAreaDivElement.height() / self.parent.element.height());
                modelToStartAndStopBatch.completeBatch();


            };

            /**
             * @summary returns the RealTimeModel that saves the size and dimension to the parent
             * @return {RealTimeModel}
             */
            this.getModelToStartAndStopBatch = function () {

                var modelToStartAndStopBatch;
                if (!self.selfIsRootSharedNode) {
                    modelToStartAndStopBatch = selfsCollaborativeModel;
                } else {
                    modelToStartAndStopBatch = self.parent.getSelfsCollaborativeModel();
                }

                return modelToStartAndStopBatch;
            };

            /**
             * @summary sets the size/dimension references to the correct model depending
             * is self is a rootSharedNode
             * @param newParent
             */
            this.setDragResizeModelReferenceToSelfsModelOrParentsModelDependingIfRootSharedNode = function (newParent) {

                var user = self.rootSelfReference.rootLoggedInUser;
                var newParentsCollaborativeModel = newParent.getSelfsCollaborativeModel();

                if (!self.selfIsRootSharedNode) {
                    self.topPercentageModelReference = selfsCollaborativeModel.elementAt(["positionToParentPercentage", "topPercentage"]);
                    self.leftPercentageModelReference = selfsCollaborativeModel.elementAt(["positionToParentPercentage", "leftPercentage"]);
                    self.widthPercentageModelReference = selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "widthPercentage"]);
                    self.heightPercentageModelReference = selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "heightPercentage"]);
                } else {

                    if (!newParentsCollaborativeModel.elementAt("userSpecificSizeAndPosition").hasKey(user + ":" + self.realtimeDocId)) {

                        var obj = {
                            positionToParentPercentage: {
                                leftPercentage: self.relativeDimensionAndPositionToParent.leftPercentage,
                                topPercentage: self.relativeDimensionAndPositionToParent.topPercentage
                            },
                            sizeToParentPercentage: {
                                widthPercentage: selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "widthPercentage"]).value(),
                                heightPercentage: selfsCollaborativeModel.elementAt(["sizeToParentPercentage", "heightPercentage"]).value()
                            },
                        };

                        newParentsCollaborativeModel.elementAt("userSpecificSizeAndPosition").set(user + ":" + self.realtimeDocId, obj);

                    }

                    self.topPercentageModelReference = newParent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "positionToParentPercentage", "topPercentage"]);
                    self.leftPercentageModelReference = newParent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "positionToParentPercentage", "leftPercentage"]);
                    self.widthPercentageModelReference = newParent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "sizeToParentPercentage", "widthPercentage"]);
                    self.heightPercentageModelReference = newParent.getSelfsCollaborativeModel().elementAt(["userSpecificSizeAndPosition", user + ":" + self.realtimeDocId, "sizeToParentPercentage", "heightPercentage"]);
                }

            };

            /**
             * @summary inserts the self reference to the parent node
             * @param {string} childsRealtimeDocId
             */
            this.childNodeCreatedItsCollaborativeDoc = function (childsRealtimeDocId) {

                var childCollaborativeModelIdArray = selfsCollaborativeModel.elementAt("childCollaborativeModelIdArray");
                childCollaborativeModelIdArray.insert(0, childsRealtimeDocId);

            };

            /**
             * @summary updates the text box that shows the content of the model
             */
            this.updateSelfsRealtimeDocumentTextArea = function () {

                if (!selfsCollaborativeModel)
                    return;

                var selfsCollaborativeModelJSON = selfsCollaborativeModel.root().value(); //TODOCONVERGENCE access the JSON of the whole model

                var formattedJsonObject = JSON.stringify(selfsCollaborativeModelJSON, null, "\t");
                $('#selfsRealtimeDocumentTextArea').val(formattedJsonObject);

            };

            /**
             * @summary when another participant changes the parent of a shared node
             * this method checks if the node has to be dropped to the new also shared parent or
             * removed because the new parent is not shared
             */
            this.onSelfsParentModelHasChanged = function () { // self is the dropped node


                if (!jQuery.isEmptyObject({selfsModelPermissionsForLoggedInUser})) {

                    var parentNodeFound = $('*[data-realtimeDocId=' + selfsCollaborativeModel.elementAt("parentId").value() + ']');

                    if (parentNodeFound.length === 0 && !self.selfIsRootSharedNode) {
                        self.deleteInstanceReferenceToParentAndRemoveDOMElementsAndCloseModel();

                    } else { // parent node of self was not found or it is a roo

                        // only needed if the owner / creator dropped a node that is a rootSharedNode to self into another rootSharedNode of self with the same owner/creator
                        if (self.selfIsRootSharedNode && parentNodeFound.length !== 0) {

                            // the read or write user self found a parent for this rootSharedNode in its map -> it is not a rootSharedNode anymore
                            self.selfIsRootSharedNode = false;
                            self.setDragResizeModelReferenceToSelfsModelOrParentsModelDependingIfRootSharedNode(self.parent);// now I am not the rootSharedNode anymore
                        }


                        self.rootSelfReference.setRootsDroppedInstanceReference(self);
                        self.rootSelfReference.addRemoteDroppedNodeToNewParentAndRemoveItFromOldParent();
                    }

                }

            };

            /**
             * @summary removes the instance reference and the DOM elements also closes the model
             * for self and all children
             */
            this.deleteInstanceReferenceToParentAndRemoveDOMElementsAndCloseModel = function () {
                self.deleteInstanceReferenceToParentAndRemoveDOMElements();


                function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {


                    var length = nodeChildObjectReferenceArray.length;

                    // do for all children
                    for (var i = 0; i < length; i++) {


                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());

                        if (self.rootSelfReference.getRootsConvergenceModelService().isOpen(nodeChildObjectReferenceArray[i].realtimeDocId)) {
                            nodeChildObjectReferenceArray[i].getSelfsCollaborativeModel().close();

                        }
                    }


                }


                // delete all child models  of self recursively by accessing them with the child skm instance references
                bfsTraverseChildrenRec(nodeChildObjectReferenceArray);
                if (self.rootSelfReference.getRootsConvergenceModelService().isOpen(self.realtimeDocId)) {
                    selfsCollaborativeModel.close();

                }


            };

            /**
             * @summary loads the modelID and creates a new ccm.instance
             * @param modelId
             */
            this.loadSharedModelAndCreateAndRenderInstances = function (modelId) {


                self.childNodeCreatedItsCollaborativeDoc(modelId);
                self.createNewChildSKMInstanceAndCreateOrLoadCollaborativeModel(modelId);
            };

            /**
             * @summary shared self and all children with the parameter user and gives him
             * the parameter permissions
             * @param  remoteUserName
             * @param {string} ReadOrWriteString
             */
            this.shareSelfsModelWithOtherConvergenceUser = function (remoteUserName, ReadOrWriteString) {

                if (remoteUserName === self.rootSelfReference.rootLoggedInUser) {
                    $.notify("The user you want to share with is yourself", {
                        align: "center",
                        verticalAlign: "middle",
                        animationType: "fade",
                        delay: 0
                    });

                    return;
                }


                var identityService = self.rootSelfReference.getRootsConvergenceDomain().identity();
                identityService.user(remoteUserName).then((user) => {
                    if (!user) {
                        $.notify("User: " + remoteUserName + " does not exist", {
                            align: "center",
                            verticalAlign: "middle",
                            animationType: "fade",
                            delay: 0
                        });

                    } else {
                        //selfsModelPermissionManager.setOverridesCollection(true); // This only applies to anonymous users Or for users that don’t have any particular permission

                        //write user is allowed to do everything

                        var userPermissionsObject = null;

                        if (ReadOrWriteString === "read") {
                            userPermissionsObject = {
                                "read": true,
                                "write": false,
                                "remove": false,
                                "manage": false
                            };
                        } else if (ReadOrWriteString === "write") {
                            userPermissionsObject = {
                                "read": true,
                                "write": true,
                                "remove": true,
                                "manage": true
                            };

                        }


                        selfsModelPermissionManager.setUserPermissions(remoteUserName, userPermissionsObject);


                        self.setOrUpdateContentAndTooltipOfSelfsHeadDivElement();

                        self.setPermissionsForUserForAllChildNodes(remoteUserName, userPermissionsObject);

                        var obj = {};
                        obj[remoteUserName] = userPermissionsObject;

                        selfsJoinedActivity.setState("permissionsForModelChanged", obj);

                    }
                });


            };

            /**
             * @summary sets the permissions for self and all the children
             * @param userName
             * @param PermissionsObject
             */
            this.setPermissionsForUserForAllChildNodes = function (userName, PermissionsObject) {

                function bfsTraverseChildrenRec(nodeChildObjectReferenceArray) {

                    var length = nodeChildObjectReferenceArray.length;

                    // do for all children
                    for (var i = 0; i < length; i++) {


                        bfsTraverseChildrenRec(nodeChildObjectReferenceArray[i].getNodeChildObjectReferenceArray());
                        var modelPermissionManager = nodeChildObjectReferenceArray[i].getSelfsModelPermissionManager();
                        modelPermissionManager.setUserPermissions(userName, PermissionsObject);
                        nodeChildObjectReferenceArray[i].setOrUpdateContentAndTooltipOfSelfsHeadDivElement();
                    }


                }

                bfsTraverseChildrenRec(nodeChildObjectReferenceArray);
            };

            /**
             * @summary depending if self is the owner or not set the outline dashed/dotted/line
             * @param px
             */
            this.checkIfOwnerAndSetAccordingOutline = function (px) {
                if (!selfsCollaborativeModel)
                    return;

                var owner = selfsCollaborativeModel.elementAt("owner").value();


                if (owner && owner != self.rootSelfReference.rootLoggedInUser && selfsDivElement) {

                    // if it is a shared node and I am not the owner but it is NOT the root shared node
                    if (self.parent !== "" && owner === self.parent.getSelfsCollaborativeModel().elementAt("owner").value()) {
                        selfsDivElement.css("outline", px + " dotted black");
                    }
                    else { // it is the root shared node
                        selfsDivElement.css("outline", px + " dashed black");
                    }


                }

            };

            /**
             * @summary adds the drooped node to the current map
             */
            this.addRemoteDroppedNodeToNewParentAndRemoveItFromOldParent = function () {

                if (rootsDroppedInstanceReference && rootsDroppedInstanceNewParentReference) {


                    // remove rootsDroppedInstanceReference from the old NodeChildObjectReferenceArray
                    var draggedInstanceSelfParentsNodeChildObjectReferenceArray = rootsDroppedInstanceReference.parent.getNodeChildObjectReferenceArray();
                    for (var i = 0; i < draggedInstanceSelfParentsNodeChildObjectReferenceArray.length; i++) {
                        if (draggedInstanceSelfParentsNodeChildObjectReferenceArray[i].index === rootsDroppedInstanceReference.index) {
                            draggedInstanceSelfParentsNodeChildObjectReferenceArray.splice(i, 1);
                        }
                    }


                    // change the parent
                    rootsDroppedInstanceReference.parent = rootsDroppedInstanceNewParentReference;

                    // add to new parents 'nodeChildObjectReferenceArray'
                    rootsDroppedInstanceNewParentReference.getNodeChildObjectReferenceArray().push(rootsDroppedInstanceReference);

                    //change the order in the DOM
                    rootsDroppedInstanceNewParentReference.getSelfsDivElement().append(rootsDroppedInstanceReference.element);

                    // change the relative position to the new one
                    rootsDroppedInstanceReference.onSelfsCollaborativeModelSizePositionHasChanged();


                    //change parent label in draggedInstanceSelf head div
                    rootsDroppedInstanceReference.setOrUpdateContentAndTooltipOfSelfsHeadDivElement();


                    // set the background color
                    rootsDroppedInstanceReference.setBackgroundColorToOppositeOfParent();

                    rootsDroppedInstanceReference.setLeafDivDimensionToParentCcmSkm();

                    rootsDroppedInstanceReference.element[0].style.visibility = 'visible';

                    // if dropped into another rootSharedNode from the same owner the sharedRootNodeReference must be adopted
                    if (rootsDroppedInstanceReference.parent.sharedRootNodeReference) {
                        rootsDroppedInstanceReference.sharedRootNodeReference = rootsDroppedInstanceReference.parent.sharedRootNodeReference;
                        //console.log("root node shared for: " + self.index + " is node: " + self.sharedRootNodeReference.index)
                    }
                    rootsDroppedInstanceReference = null;
                    rootsDroppedInstanceNewParentReference = null;


                }


            };

            /**
             * @summary returns all active collaborators
             * @return {*}
             */
            this.getAllActiveCollaborators = function () {

                if (selfsCollaborativeModel) {
                    return selfsCollaborativeModel.collaborators();
                }
                else {
                    return null;
                }

            };

            /**
             * @summary returns the users with whom the model is shared
             * @param {function} callback
             */
            this.getNodeIsSharedWithItemsForContextMenu = function (callback) {

                if (selfsCollaborativeModel) {

                    selfsModelPermissionManager.getAllUserPermissions() // TODOCONVERGENCE replace getAllUserPermissions with local copy that gets kept  	up-to-date
                        .then(function (allUsersPermissions) {

                                var sharedCollaboratorsListItems = "";
                                var sharedCollaboratorsObject = {};
                                var i = 0;
                                for (var [key, value] of allUsersPermissions) {
                                    sharedCollaboratorsObject[key] = JSON.parse(JSON.stringify(value));
                                    var readWrite = "";
                                    if (value.write === true) {
                                        readWrite = "w";
                                    } else {
                                        readWrite = "r";
                                    }

                                    //console.log(key);
                                    sharedCollaboratorsListItems += '<li style="display: inline;white-space: nowrap;">' + key + "->" + readWrite + '</li>';
                                    i++;
                                }
                                callback(sharedCollaboratorsListItems, sharedCollaboratorsObject);
                            }
                        );
                } else {
                    callback("");
                }

            };

            /**
             * @summary returns all users and all permissions for self
             * @param {function}  callback
             */
            this.getAllUserPermissionForSelfCollaborativeModel = function (callback) {
                if (selfsCollaborativeModel) {

                    selfsModelPermissionManager.getAllUserPermissions()
                        .then(function (allUsersPermissions) {

                                if (!callback) {
                                    console.log("This should never happen");
                                    return;
                                }


                                var allUserPermissionForSelfCollaborativeModel = {};
                                var i = 0;
                                for (var [key, value] of allUsersPermissions.entries()) {

                                    allUserPermissionForSelfCollaborativeModel[key] = JSON.parse(JSON.stringify(value));
                                    i++;
                                }

                                callback(allUserPermissionForSelfCollaborativeModel);
                            }
                        );
                }
            };

            /**
             * @summary returns all active collaborators in a format the can be added to the context menu
             * @return {{}}
             */
            this.getActiveCollaboratorsItemsForContextMenu = function () {
                var activeCollaborators = self.getAllActiveCollaborators();
                if (!activeCollaborators)
                    return {};

                var activeCollaboratorsItems = {};


                for (var i = 0; i < activeCollaborators.length; i++) {
                    activeCollaboratorsItems["entry#" + i] = {disabled: true, "name": activeCollaborators[i].username}

                }

                return activeCollaboratorsItems;

            };

            /**
             * @summary returns selfs ModelPermissionManager
             * @return {ModelPermissionManager}
             */
            this.getSelfsModelPermissionManager = function () {
                return selfsModelPermissionManager;
            };

            /* convergence shared mouse cursors code */

            /**
             * @summary Handles clicking the open button
             *
             */
            this.letRootJoinTheMouseActivity = function () {
                self.rootSelfReference.getRootsConvergenceDomain().activities().join(self.realtimeDocId + "-cursorActivity").then(function (act) {
                    mousePointerActivity = act;
                    const participants = mousePointerActivity.participants();


                    participants.forEach(function (participant) {
                        const local = participant.sessionId === mousePointerActivity.session().sessionId();
                        self.handleSessionJoined(participant.sessionId, local);
                        const state = participant.state.get("mousePointerMoved");
                        if (state) {
                            self.updateRemoteCursorLocationForDisplayInSelf(participant.sessionId, state.x, state.y, local);
                        }
                    });

                    mousePointerActivity.events().subscribe(function (event) {
                        switch (event.name) {
                            case "session_joined":
                                self.handleSessionJoined(event.sessionId, event.local);
                                break;
                            case "session_left":
                                self.handleSessionLeft(event.sessionId);
                                break;
                            case "state_set":
                                switch (event.key) {
                                    case 'mousePointerMoved':
                                        if (!event.local) { // a remote participant has moved the mouse pointer


                                            remoteSessions[event.sessionId].cursorDiv.style.visibility = 'visible';


                                            clearTimeout(mouseMovedClearTimerForConnectedRemoteSessionArray[event.sessionId]);

                                            mouseMovedClearTimerForConnectedRemoteSessionArray[event.sessionId] = setTimeout(function () {
                                                self.removeInactiveCursorOfParticipant(event.sessionId)
                                            }, 2000, event);


                                            self.updateRemoteCursorLocationForDisplayInSelf(event.sessionId, event.value.x, event.value.y, event.local);
                                        }


                                        break;
                                    case 'click':
                                        if (!event.local) {
                                            self.remoteClicked(event.sessionId, event.value.x, event.value.y);
                                        }
                                        break;
                                }
                                break;
                        }
                    });
                });
            };

            /**
             * @summary Handles a session joining (both remote and local)
             * @param sessionId
             * @param local
             */
            this.handleSessionJoined = function (sessionId, local) {


                let cursorDiv;

                if (!local) {
                    cursorDiv = document.createElement("img");
                    cursorDiv.src = "/convergence-skm/super_knowledge_map/libs/assets/cursor.png";
                    cursorDiv.className = "remoteCursor";
                    cursorDiv.style.zIndex = 99999;
                    self.rootSelfReference.element[0].appendChild(cursorDiv);
                }

                remoteSessions[sessionId] = {

                    cursorDiv: cursorDiv
                };

                mouseMovedClearTimerForConnectedRemoteSessionArray[sessionId] = {};
            };

            /**
             * @summary Handles a session leaving (both remote and local)
             */
            this.handleSessionLeft = function (sessionId) {
                const sessionRec = remoteSessions[sessionId];

                if (sessionRec.cursorDiv) {
                    self.rootSelfReference.element[0].removeChild(sessionRec.cursorDiv);
                }
                delete remoteSessions[sessionId];
            };

            /**
             * @summary updates the cursor position
             * @param sessionId
             * @param x
             * @param y
             * @param local
             */
            this.updateRemoteCursorLocationForDisplayInSelf = function (sessionId, x, y, local) {
                const sessionRec = remoteSessions[sessionId];

                if (!local) {
                    sessionRec.cursorDiv.style.top = y * self.rootSelfReference.element.height() + "px";
                    sessionRec.cursorDiv.style.left = x * self.rootSelfReference.element.width() + "px";
                }
            };

            /**
             * @summary event when a remote user makes a mouse click
             * @param sessionId
             * @param x
             * @param y
             */
            this.remoteClicked = function (sessionId, x, y) {
                const elem = self.createClickSpot(x, y);
                setTimeout(function () {
                    elem.parentElement.removeChild(elem);
                }, 300);
            };

            /**
             * @summary returns the mouse event coordinates
             * @param evt
             * @return {{x: number, y: number}}
             */
            this.getMouseEventCoordinates = function (evt) {
                const cursorBoxOffset = $(self.element[0]).offset();
                return {
                    x: (evt.pageX - cursorBoxOffset.left) / self.element.width(),
                    y: (evt.pageY - cursorBoxOffset.top) / self.element.height()
                };
            };

            /**
             * @summary handles the local mouse movement and set events.
             * @param evt
             */
            this.mouseCursorInSelfsDivElementMoved = function (evt) {
                selfsLocalRelativeToParentMouseCoordinatesPercentage = self.getMouseEventCoordinates(evt);

                /* only set the mousePointerMoved state when the pointer was really moved because in
                 firefox mouseMoved gets called all the time even without movement*/
                if (mousePointerActivity && mousePointerActivity.isJoined()
                    && currentLocalMousePos.x != selfsLocalRelativeToParentMouseCoordinatesPercentage.x && currentLocalMousePos.y != selfsLocalRelativeToParentMouseCoordinatesPercentage.y) {

                    currentLocalMousePos = {
                        x: selfsLocalRelativeToParentMouseCoordinatesPercentage.x,
                        y: selfsLocalRelativeToParentMouseCoordinatesPercentage.y
                    };


                    mousePointerActivity.setState("mousePointerMoved", selfsLocalRelativeToParentMouseCoordinatesPercentage);
                }
            };

            /**
             * @summary remove the cursor if a participant is inactive
             * @param sessionId
             */
            this.removeInactiveCursorOfParticipant = function (sessionId) {

                if (!sessionId)
                    return;

                const sessionRec = remoteSessions[sessionId];

                if (sessionRec && sessionRec.cursorDiv) {

                    //console.log("removeInactiveCursorOfParticipant");


                    // Hide the cursor until the remote participant moves it again, the cursor gets fully removed if the remote participant leaves the session
                    sessionRec.cursorDiv.style.visibility = 'hidden';
                }

            };

            /**
             * @summary sets the state to "clicked"
             * @param event
             */
            this.mouseInSelfsDivElementClicked = function (event) {
                if (mousePointerActivity && mousePointerActivity.isJoined()) {
                    const coordinates = self.getMouseEventCoordinates(event);
                    mousePointerActivity.setState("click", coordinates);
                }
            };

            /**
             * @summary creates a click spot in the DOM
             * @param posX
             * @param posY
             * @return {*|Element}
             */
            this.createClickSpot = function (posX, posY) {
                const spot = document.createElement("div");
                spot.className = "clickSpot";
                spot.style.left = posX + "px";
                spot.style.top = posY + "px";
                self.rootSelfReference.getSelfsDivElement()[0].appendChild(spot);
                return spot;
            };

            /*------------------------------------------------ methods only allowed to be invoked by root node ------------------------------------------------*/

            /**
             * @summary adds a menu bar into 'selfsHeadDivElement' containing a text input field
             * and a 'save 'load' 'delete' button
             */
            this.addMenuBarToRootInstanceHeadDivElement = function () {

                var userTextInput = $('<input id="userTextInput" style="margin-left:1em" type="text" size="10" value="' + self.getCookieValueForCookieKey("lastLoggedInUser") + '">');
                userTextInput.appendTo(selfsHeadDivElement);

                var passwordTextInput = $('<input type="password" id="passwordTextInput" type="text" size="15" value="">');
                passwordTextInput.appendTo(selfsHeadDivElement);

                // render the authorize button into roots headDivElement
                var authorizeButton = $('<button id="authorizeButton" type="button"   >Authorize</button>');
                authorizeButton.appendTo(selfsHeadDivElement);
                authorizeButton.click(function () {

                    self.letRootInstanceDoConvergenceLogin();
                });


                // set the last root realtimeDocId into the realtimeDocumentIdTextField by using the saved cookie
                var loadRealtimeDocButtonDefaultText = self.getCookieValueForCookieKey("rootRealtimeDocId");
                var realtimeDocumentIdTextField = $('<input size="30" id="realtimeDocumentIdTextField" type="text" value="' + loadRealtimeDocButtonDefaultText + '">');
                realtimeDocumentIdTextField.appendTo(selfsHeadDivElement);

                var loadRealtimeDocButton = $('<input id="collaborativeObjectIDButton"  disabled type="button" value="load id" />');
                loadRealtimeDocButton.appendTo(selfsHeadDivElement);
                loadRealtimeDocButton.click(function () {

                    if (loadRealtimeDocButton.val() === "") {
                        alert("Please enter load key");
                        return;
                    }

                    self.element.find("#logoutButton")[0].disabled = true;
                    self.openExistingCollaborativeModelInSKMCollectionForSelfsData(realtimeDocumentIdTextField.val());


                });

                var createNewRealtimeDocButton = $('<input id="createNewRealtimeDocButton" disabled type="button" value="new rt doc" />');
                createNewRealtimeDocButton.appendTo(selfsHeadDivElement);
                createNewRealtimeDocButton.click(function () {

                    self.element.find("#logoutButton")[0].disabled = true;
                    self.createNewCollaborativeModelInSKMCollectionForSelfsData();
                });


            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE renders only the parent of self and all his child nodes
             */
            this.zoomOutToParent = function () {
                if (anchorNode && anchorNode.parent != "") {
                    anchorNode.addEventListenerForSizeAndDimensionListenersToSelfsCollaborativeModel();
                    anchorNode.parent.zoomIntoSelfsDivElementByOnlyRenderingItAndItsChildren();
                }
            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE
             */
            this.saveAllEdgesToLocalBrowserStorage = function () {


                var allNodeData = [];
                var adjacentNodesOfSelfArrayWithoutReference = [];
                self.bfsTraverseChildrenToSaveTree(allNodeData);

                for (var i = 0; i < allNodeData.length; i++) {

                    for (var j = 0; j < allNodeData[i].adjacentNodesOfSelfArray.length; j++) {
                        allNodeData[i].adjacentNodesOfSelfArray[j].selfIndex = "";
                        allNodeData[i].adjacentNodesOfSelfArray[j].adjacentNodeIndex = "";
                    }

                    adjacentNodesOfSelfArrayWithoutReference.push(allNodeData[i].adjacentNodesOfSelfArray)
                }

                function compare(a, b) {
                    if (a.edgeUUID < b.edgeUUID)
                        return -1;
                    if (a.edgeUUID > b.edgeUUID)
                        return 1;
                    return 0;
                }

                adjacentNodesOfSelfArrayWithoutReference.sort(compare);


                localStorage.setItem('AllAdjacentNodesOfSelfArray', JSON.stringify(adjacentNodesOfSelfArrayWithoutReference));

            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE
             */
            this.compareAllEdgesWithLocalBrowserStorage = function () {

                var allNodeData = [];
                var adjacentNodesOfSelfArrayWithoutReference = [];
                self.bfsTraverseChildrenToSaveTree(allNodeData);

                for (var i = 0; i < allNodeData.length; i++) {
                    for (var j = 0; j < allNodeData[i].adjacentNodesOfSelfArray.length; j++) {
                        allNodeData[i].adjacentNodesOfSelfArray[j].selfIndex = "";
                        allNodeData[i].adjacentNodesOfSelfArray[j].adjacentNodeIndex = "";
                    }
                    adjacentNodesOfSelfArrayWithoutReference.push(allNodeData[i].adjacentNodesOfSelfArray)
                }

                function compare(a, b) {
                    if (a.edgeUUID < b.edgeUUID)
                        return -1;
                    if (a.edgeUUID > b.edgeUUID)
                        return 1;
                    return 0;
                }

                adjacentNodesOfSelfArrayWithoutReference.sort(compare);

                adjacentNodesOfSelfArrayWithoutReference = JSON.stringify(adjacentNodesOfSelfArrayWithoutReference);


                var localStorageAdjacentNodes = localStorage.getItem('AllAdjacentNodesOfSelfArray');

                if (adjacentNodesOfSelfArrayWithoutReference === localStorageAdjacentNodes) {
                    alert("Edges have not changed");
                } else {
                    alert("Edges HAVE changed");
                }


            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE sets the root.mouseDown member to false
             */
            this.setMouseDownFalse = function () {
                mouseDown = false;
                //console.log("mouse down false");
            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE sets the root.mouseDown member to true
             */
            this.setMouseDownTrue = function () {
                mouseDown = true;
                //console.log("mouse down true");
            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE returns if a mouse button is currently pressed
             * @return {boolean}
             */
            this.getMouseDown = function () {
                return mouseDown;
            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE returns the Instance / node that has currently the 'VisualEffects'
             * @return {*}
             */
            this.getNodeWithVisualEffects = function () {
                return nodeWithVisualEffects;
            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE returns the Instance / node that is the anchorNode
             * @return {*}
             */
            this.getAnchorNode = function () {
                return anchorNode;
            };

            /**
             * @summary MAY ONLY INVOKED BY THE ROOT NODE sets the Instance that is currently the zoomed anchor
             * @param node
             */
            this.setAnchorNode = function (node) {
                anchorNode = node;
            };

            /**
             * @summary sets the Instance / node that has currently the 'VisualEffects'
             * @return {*}
             */
            this.setNodeWithVisualEffects = function (node) {
                //console.log("nodeWithVisualEffects: " + node.index);
                nodeWithVisualEffects = node;
            };

            /**
             * @summary returns 'rootsTmpAdjacentNodesOfLoadedNodesArray'
             * @return {Array}
             */
            this.getRootsTmpAdjacentNodesOfLoadedNodesArray = function () {
                return rootsTmpAdjacentNodesOfLoadedNodesArray;
            };

            /**
             * @summary returns the ModelService
             * @returns {ModelService}
             */
            this.getRootsConvergenceModelService = function () {
                return rootsConvergenceModelService;
            };

            /**
             * @summary returns the ConvergenceDomain
             * @returns {ConvergenceDomain}
             */
            this.getRootsConvergenceDomain = function () {
                return rootsConvergenceDomain;
            };

            /**
             * @summary sets the newRootsDroppedInstanceNewParentReference
             * @param newRootsDroppedInstanceNewParentReference
             */
            this.setRootsDroppedInstanceNewParentReference = function (newRootsDroppedInstanceNewParentReference) {
                rootsDroppedInstanceNewParentReference = newRootsDroppedInstanceNewParentReference;
            };

            /**
             * @summary sets the RootsDroppedInstanceReference
             * @param instance
             */
            this.setRootsDroppedInstanceReference = function (instance) {
                rootsDroppedInstanceReference = instance;
            };

            /**
             * @summary gets the rootsDroppedInstanceReference
             * @return {*}
             */
            this.getRootsDroppedInstanceReference = function () {
                return rootsDroppedInstanceReference;
            };

            /*------------------------------------------------ getter and setter ------------------------------------------------*/

            /**
             * @summary returns 'selfsHeadDivElement'
             * @return {jQuery}
             */
            this.getSelfsHeadDivElement = function () {
                return selfsHeadDivElement;
            };

            /**
             * @summary returns 'selfsDivElement'
             * @return {jQuery}
             */
            this.getSelfsDivElement = function () {
                return selfsDivElement;
            };

            /**
             * @summary returns the array of 'Instance' references of all the direct children
             * @returns {Array.<Instance>}
             */
            this.getNodeChildObjectReferenceArray = function () {
                return nodeChildObjectReferenceArray;
            };

            /**
             * @summary returns the leaf instance reference
             * @return {*}
             */
            this.getLeafInstanceReference = function () {
                return leafInstanceReference;
            };

            /**
             * @summary returns the adjacentNodesOfSelfArray reference
             * @return {*}
             */
            this.getAdjacentNodesOfSelfArray = function () {
                return adjacentNodesOfSelfArray;
            };

            /**
             * @summary gets the selfsCollaborativeModel
             * @returns {RealTimeModel}
             */
            this.getSelfsCollaborativeModel = function () {
                return selfsCollaborativeModel;
            };

            /**
             * @summary sets the ModelPermissionsForLoggedInUser
             * @param perm
             */
            this.setSelfsModelPermissionsForLoggedInUser = function (perm) {
                selfsModelPermissionsForLoggedInUser = perm;
            };

            /**
             * @summary set that a child node is added/removed/dragged/resized for this instance/node to 'tmpChildrenAddedResizedDraggedDeleted'
             * @param {boolean} tmpChildrenAddedResizedDraggedDeleted
             */
            this.setChildrenAddedResizedDraggedDeleted = function (tmpChildrenAddedResizedDraggedDeleted) {
                childrenAddedResizedDraggedDeleted = tmpChildrenAddedResizedDraggedDeleted;
            };

            /*------------------------------------------------ interfaces that leaf classes can implement ------------------------------------------------*/

            /**
             * @summary  must be implemented by the leaf Component if the state of the leaf component should be conserved
             * returns the current state of the leaf component
             * @interface
             */
            function createOrLoadLeafInstanceDataModelCalledByWrapper() {
            }

            /**
             * @summary  must be implemented by the leaf Component if the leaf component wants to allow to set write access
             * @interface
             */
            function setWriteEnabled() {
            }

            /**
             * @summary must be implemented by the leaf Component if the leaf component wants to allow to set read access
             * @interface
             */
            function setOnlyReadEnabled() {
            }


        }

        /*------------------------------------------------ type definitions ------------------------------------------------*/

        /**
         * @namespace ccm.components.super_knowledge_map
         */
        /**
         * @namespace ccm.components.super_knowledge_map.types
         */

        /**
         *
         * @typedef {ccm.types.config} ccm.components.super_knowledge_map.types.config
         * @typedef {jQuery} ccm.types.element
         * @typedef {string} ccm.types.name
         * @typedef {Instance} ccm.types.instance
         * @typedef {object} ccm.components.super_knowledge_map.types.config
         */

        /**
         * @summary <i>ccm</i> instance configuration
         * @property {ccm.types.element} jQueryInstanceDivElement - <i>ccm</i> instance website area

         */

        /**
         * @external ccm.types
         * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
         */

    };

    function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );