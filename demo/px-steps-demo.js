/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/* Common imports */
/* Common demo imports */
/* Imports for this component */
/* Demo DOM module */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-demo/px-demo-header.js';
import 'px-demo/px-demo-api-viewer.js';
import 'px-demo/px-demo-footer.js';
import 'px-demo/px-demo-configs.js';
import 'px-demo/px-demo-props.js';
import 'px-demo/px-demo-code-editor.js';
import 'px-demo/px-demo-interactive.js';
import 'px-demo/px-demo-component-snippet.js';
import 'px-demo/css/px-demo-content-helper-styles.js';
import '../px-steps.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="px-demo-content-helper-styles"></style>
    <!-- Header -->
    <px-demo-header module-name="px-steps" description="A Polymer component for visually representing a sequence of steps and any progress made on such. Useful for creating wizards, multi-step forms, and other step-by-step interactions." tablet="" desktop="">
    </px-demo-header>

    <!-- Interactive -->
    <px-demo-interactive>
      <!-- Configs -->
      <px-demo-configs slot="px-demo-configs" configs="[[configs]]" props="{{props}}" chosen-config="{{chosenConfig}}"></px-demo-configs>

      <!-- Props -->
      <px-demo-props slot="px-demo-props" props="{{props}}" config="[[chosenConfig]]"></px-demo-props>

      <!-- Code Editor -->
      <px-demo-code-editor slot="px-demo-code-editor" props="{{props}}"></px-demo-code-editor>

      <!-- Component -->
      <px-demo-component slot="px-demo-component" style="width: 100%;">
        <px-steps id="stepper" items="{{props.items.value}}" completed="{{props.completed.value}}" current-step="2">
        </px-steps>
        <div style="margin-top: 4rem;">
          <p>For demo purposes only:</p><p>
          <button class="btn" on-click="previous">Previous</button>
          <button class="btn" on-click="complete">Complete Current Step</button>
          <button class="btn" on-click="next">Next</button>
          <button class="btn" on-click="error">Error Step: </button>
          <select id="errorIndex">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </p></div>
        <template is="dom-if" if="[[clicked]]">
          <div style="margin-top: 1rem;">
            You clicked on step with id [[lastIDClicked]]
          </div>
        </template>
      </px-demo-component>
      <!-- END Component -->

      <px-demo-component-snippet slot="px-demo-component-snippet" element-properties="{{props}}" element-name="px-steps">
      </px-demo-component-snippet>
    </px-demo-interactive>

    <!-- API Viewer -->
    <px-demo-api-viewer source="px-steps"></px-demo-api-viewer>

    <!-- Footer -->
    <px-demo-footer></px-demo-footer>
`,

  is: 'px-steps-demo',

  properties: {

    props: {
      type: Object,
      value: function () { return this.demoProps; }
    },
    configs: {
       type: Array,
       value: function(){
         return [
           { configName: "Default",
             configReset: true
           }
         ]
       }
     },
     clicked:{
       type: Boolean,
       value: false
     },
     lastClickedID:{
       type: String,
       value: ''
     }
  },

  /**
   * A reference for `this.props`. Read the documentation there.
   */
  demoProps: {
    items: {
      type: Array,
      defaultValue: [
        { id: "1", label: "Basic Information"},
        { id: "2", label: "Select Services"},
        { id: "3", label: "Billing" },
        { id: "4", label: "Review" },
        { id: "5", label: "Deploy" }
      ],
      inputType: 'code:JSON'
    },
    completed: {
      type: Array,
      defaultValue: ["1","2"],
      inputType: 'code:JSON'
    }
  },

  next: function() {
    this.$.stepper.next();
  },

  previous: function() {
    this.$.stepper.previous();
  },

  complete: function() {
    this.$.stepper.complete();
  },

  error: function() {
    this.$.stepper.error(parseInt(this.$.errorIndex.value) - 1);
  },

  ready: function() {
    window.addEventListener('px-steps-tapped', function(event) {
      this.clicked = true;
      this.lastIDClicked = event.detail.id;
    }.bind(this));
  }
});
