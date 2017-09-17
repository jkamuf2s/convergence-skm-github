# convergence-skm

**This repository contains the folowing developed [ccm](https://github.com/akless/ccm) components and all its dependencies:**
==============
ccm.collaborative_ace_code_editor
ccm.convergence_chat
ccm.iFrame
ccm.persistent_wysiwyg_text_editor
ccm.super_knowledge_map ( with the collaboration feature using the [convergence](https://convergencelabs.com/) framework )
 
 Master Branch   
--------------    
  The default branch is the "master" branch that is using the newest ccm version and shadow DOM, 
  all JQuery plugins do not work with this branch. This means the functionallity of the ccm.super_knowledge_map
  is very limited ( because it depends on JQuery Right Click Context Menu, JQuery UI Daggable, Droppable, Resizable Plugins )  
  This branch should be checked out if you want to continiue the development of the compatibility.

ccm-v6 Branch
 -------------- 
  The functional  branch is the "ccm-v6" branch, it uses ccm version 6.6.1 (19.08.2016) and therefore no shadow DOM 
  and all JQuery plugins do work with this branch. This branch should be checked out if you want to successfully run the components
  
  
 Usage
 --------------
  If you want to run the super_knowledge_map:
  
  1. Create an user Account for [Convergence](https://admin.convergence.io/request-invite)  
  2. Follow the Instructions to create a Domain and a Convergence user
  
  3. Enter the Domain URL and a desired collection Name in 
  ccm.super_knowledge_map.js:
          convergenceCollection: "",
          convergenceDomainUrl: "",
          
  4. start super_knowledge_map/index.html and log in with username and password of the Convergence user you have created before